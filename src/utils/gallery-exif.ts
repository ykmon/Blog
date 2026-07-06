// Build-time JPEG EXIF reader for gallery photos.
import { existsSync, readFileSync } from 'node:fs';
import { extname, resolve, sep } from 'node:path';

export interface GalleryExif {
  camera?: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: string;
  takenAt?: string;
}

interface Rational {
  numerator: number;
  denominator: number;
}

interface RawExif {
  make?: string;
  model?: string;
  lensModel?: string;
  focalLength?: Rational;
  fNumber?: Rational;
  exposureTime?: Rational;
  iso?: number;
  dateTime?: string;
  dateTimeOriginal?: string;
}

interface TiffContext {
  buffer: Buffer;
  tiffStart: number;
  tiffEnd: number;
  littleEndian: boolean;
}

const EXIF_HEADER = 'Exif\0\0';
const JPEG_SOI = 0xffd8;
const TYPE_SIZE: Record<number, number> = {
  1: 1,
  2: 1,
  3: 2,
  4: 4,
  5: 8,
  7: 1,
  9: 4,
  10: 8,
};

const TAG = {
  make: 0x010f,
  model: 0x0110,
  dateTime: 0x0132,
  exifIfd: 0x8769,
  exposureTime: 0x829a,
  fNumber: 0x829d,
  iso: 0x8827,
  dateTimeOriginal: 0x9003,
  focalLength: 0x920a,
  lensModel: 0xa434,
} as const;

const exifCache = new Map<string, GalleryExif | undefined>();

export function readGalleryExif(imagePath: string): GalleryExif | undefined {
  try {
    const filePath = resolvePublicJpegPath(imagePath);
    if (!filePath) return undefined;

    if (exifCache.has(filePath)) {
      return exifCache.get(filePath);
    }

    const rawExif = parseJpegExif(readFileSync(filePath));
    const exif = rawExif ? formatGalleryExif(rawExif) : undefined;
    exifCache.set(filePath, exif);
    return exif;
  } catch {
    return undefined;
  }
}

function resolvePublicJpegPath(imagePath: string): string | undefined {
  if (!imagePath || /^(https?:)?\/\//i.test(imagePath)) return undefined;

  const publicDir = resolve(process.cwd(), 'public');
  const cleanPath = decodeURIComponent(imagePath.split(/[?#]/)[0] ?? '').replace(/^\/+/, '');
  const filePath = resolve(publicDir, cleanPath);
  const extension = extname(filePath).toLowerCase();

  if (filePath !== publicDir && !filePath.startsWith(publicDir + sep)) return undefined;
  if (extension !== '.jpg' && extension !== '.jpeg') return undefined;
  if (!existsSync(filePath)) return undefined;

  return filePath;
}

function parseJpegExif(buffer: Buffer): RawExif | undefined {
  if (buffer.length < 4 || buffer.readUInt16BE(0) !== JPEG_SOI) return undefined;

  let offset = 2;
  while (offset + 4 <= buffer.length) {
    if (buffer[offset] !== 0xff) return undefined;

    while (buffer[offset] === 0xff) {
      offset += 1;
    }

    const marker = buffer[offset];
    offset += 1;

    if (marker === 0xda || marker === 0xd9) return undefined;
    if (offset + 2 > buffer.length) return undefined;

    const segmentLength = buffer.readUInt16BE(offset);
    const segmentStart = offset + 2;
    const segmentEnd = offset + segmentLength;
    if (segmentLength < 2 || segmentEnd > buffer.length) return undefined;

    const hasExifHeader =
      marker === 0xe1 &&
      segmentStart + EXIF_HEADER.length <= segmentEnd &&
      buffer.toString('ascii', segmentStart, segmentStart + EXIF_HEADER.length) === EXIF_HEADER;

    if (hasExifHeader) {
      return parseTiffExif(buffer, segmentStart + EXIF_HEADER.length, segmentEnd);
    }

    offset = segmentEnd;
  }

  return undefined;
}

function parseTiffExif(buffer: Buffer, tiffStart: number, tiffEnd: number): RawExif | undefined {
  if (tiffStart + 8 > tiffEnd) return undefined;

  const byteOrder = buffer.toString('ascii', tiffStart, tiffStart + 2);
  const littleEndian = byteOrder === 'II';
  if (!littleEndian && byteOrder !== 'MM') return undefined;

  const context: TiffContext = { buffer, tiffStart, tiffEnd, littleEndian };
  if (readUInt16(context, tiffStart + 2) !== 42) return undefined;

  const firstIfdOffset = tiffStart + readUInt32(context, tiffStart + 4);
  const rawExif: RawExif = {};
  readIfd(context, firstIfdOffset, rawExif, 0);

  return rawExif;
}

function readIfd(context: TiffContext, ifdOffset: number, rawExif: RawExif, depth: number): void {
  if (depth > 2 || ifdOffset + 2 > context.tiffEnd) return;

  const entryCount = readUInt16(context, ifdOffset);
  const entriesStart = ifdOffset + 2;
  const entriesEnd = entriesStart + entryCount * 12;
  if (entriesEnd > context.tiffEnd) return;

  for (let index = 0; index < entryCount; index += 1) {
    const entryOffset = entriesStart + index * 12;
    const tag = readUInt16(context, entryOffset);
    const type = readUInt16(context, entryOffset + 2);
    const count = readUInt32(context, entryOffset + 4);
    const valueOffset = entryOffset + 8;

    if (tag === TAG.exifIfd) {
      const exifOffset = readLongValue(context, type, count, valueOffset);
      if (exifOffset !== undefined) {
        readIfd(context, context.tiffStart + exifOffset, rawExif, depth + 1);
      }
      continue;
    }

    if (tag === TAG.make) rawExif.make = readAsciiValue(context, type, count, valueOffset);
    if (tag === TAG.model) rawExif.model = readAsciiValue(context, type, count, valueOffset);
    if (tag === TAG.dateTime) rawExif.dateTime = readAsciiValue(context, type, count, valueOffset);
    if (tag === TAG.lensModel) rawExif.lensModel = readAsciiValue(context, type, count, valueOffset);
    if (tag === TAG.dateTimeOriginal) rawExif.dateTimeOriginal = readAsciiValue(context, type, count, valueOffset);
    if (tag === TAG.focalLength) rawExif.focalLength = readRationalValue(context, type, count, valueOffset);
    if (tag === TAG.fNumber) rawExif.fNumber = readRationalValue(context, type, count, valueOffset);
    if (tag === TAG.exposureTime) rawExif.exposureTime = readRationalValue(context, type, count, valueOffset);
    if (tag === TAG.iso) rawExif.iso = readShortOrLongValue(context, type, count, valueOffset);
  }
}

function readAsciiValue(context: TiffContext, type: number, count: number, valueOffset: number): string | undefined {
  if (type !== 2 || count === 0) return undefined;

  const offset = resolveValueOffset(context, type, count, valueOffset);
  if (offset === undefined) return undefined;

  return context.buffer
    .toString('utf8', offset, offset + count)
    .replace(/\0.*$/u, '')
    .trim();
}

function readRationalValue(context: TiffContext, type: number, count: number, valueOffset: number): Rational | undefined {
  if (type !== 5 || count === 0) return undefined;

  const offset = resolveValueOffset(context, type, count, valueOffset);
  if (offset === undefined || offset + 8 > context.tiffEnd) return undefined;

  const numerator = readUInt32(context, offset);
  const denominator = readUInt32(context, offset + 4);
  if (denominator === 0) return undefined;

  return { numerator, denominator };
}

function readShortOrLongValue(context: TiffContext, type: number, count: number, valueOffset: number): number | undefined {
  if (count === 0) return undefined;
  if (type === 3) return readShortValue(context, type, count, valueOffset);
  if (type === 4) return readLongValue(context, type, count, valueOffset);
  return undefined;
}

function readShortValue(context: TiffContext, type: number, count: number, valueOffset: number): number | undefined {
  if (type !== 3 || count === 0) return undefined;

  const offset = resolveValueOffset(context, type, count, valueOffset);
  if (offset === undefined || offset + 2 > context.tiffEnd) return undefined;

  return readUInt16(context, offset);
}

function readLongValue(context: TiffContext, type: number, count: number, valueOffset: number): number | undefined {
  if (type !== 4 || count === 0) return undefined;

  const offset = resolveValueOffset(context, type, count, valueOffset);
  if (offset === undefined || offset + 4 > context.tiffEnd) return undefined;

  return readUInt32(context, offset);
}

function resolveValueOffset(context: TiffContext, type: number, count: number, valueOffset: number): number | undefined {
  const typeSize = TYPE_SIZE[type];
  if (!typeSize) return undefined;

  const byteLength = typeSize * count;
  if (byteLength <= 4) return valueOffset;

  const relativeOffset = readUInt32(context, valueOffset);
  const absoluteOffset = context.tiffStart + relativeOffset;
  if (absoluteOffset < context.tiffStart || absoluteOffset + byteLength > context.tiffEnd) return undefined;

  return absoluteOffset;
}

function readUInt16(context: TiffContext, offset: number): number {
  return context.littleEndian ? context.buffer.readUInt16LE(offset) : context.buffer.readUInt16BE(offset);
}

function readUInt32(context: TiffContext, offset: number): number {
  return context.littleEndian ? context.buffer.readUInt32LE(offset) : context.buffer.readUInt32BE(offset);
}

function formatGalleryExif(rawExif: RawExif): GalleryExif | undefined {
  const exif: GalleryExif = {
    camera: formatCamera(rawExif.make, rawExif.model),
    lens: cleanText(rawExif.lensModel),
    focalLength: rawExif.focalLength ? `${formatDecimal(rationalToNumber(rawExif.focalLength), 1)}mm` : undefined,
    aperture: rawExif.fNumber ? `f/${formatDecimal(rationalToNumber(rawExif.fNumber), 1)}` : undefined,
    shutterSpeed: rawExif.exposureTime ? formatShutterSpeed(rawExif.exposureTime) : undefined,
    iso: rawExif.iso ? `ISO ${Math.round(rawExif.iso)}` : undefined,
    takenAt: formatExifDate(rawExif.dateTimeOriginal ?? rawExif.dateTime),
  };

  return Object.values(exif).some(Boolean) ? exif : undefined;
}

function formatCamera(make?: string, model?: string): string | undefined {
  const cleanMake = cleanText(make);
  const cleanModel = cleanText(model);

  if (cleanMake && cleanModel) {
    return cleanModel.toLowerCase().startsWith(cleanMake.toLowerCase()) ? cleanModel : `${cleanMake} ${cleanModel}`;
  }

  return cleanModel ?? cleanMake;
}

function cleanText(value?: string): string | undefined {
  const cleanValue = value?.replace(/\s+/gu, ' ').trim();
  return cleanValue || undefined;
}

function rationalToNumber(rational: Rational): number {
  return rational.numerator / rational.denominator;
}

function formatDecimal(value: number, maximumFractionDigits: number): string {
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(maximumFractionDigits).replace(/\.0+$/u, '');
}

function formatShutterSpeed(rational: Rational): string {
  const numerator = rational.numerator;
  const denominator = rational.denominator;
  const value = rationalToNumber(rational);

  if (value >= 1) return `${formatDecimal(value, 1)}s`;

  const divisor = greatestCommonDivisor(numerator, denominator);
  const simplifiedNumerator = numerator / divisor;
  const simplifiedDenominator = denominator / divisor;
  if (simplifiedNumerator === 1) return `1/${simplifiedDenominator}s`;

  const reciprocal = denominator / numerator;
  if (Number.isInteger(reciprocal)) return `1/${reciprocal}s`;

  return `${formatDecimal(value, 2)}s`;
}

function greatestCommonDivisor(a: number, b: number): number {
  let left = Math.abs(a);
  let right = Math.abs(b);

  while (right > 0) {
    const next = left % right;
    left = right;
    right = next;
  }

  return left || 1;
}

function formatExifDate(value?: string): string | undefined {
  const match = value?.match(/^(\d{4}):(\d{2}):(\d{2})[ T](\d{2}):(\d{2})/u);
  if (!match) return undefined;

  return `${match[1]}-${match[2]}-${match[3]} ${match[4]}:${match[5]}`;
}
