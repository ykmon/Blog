/**
 * init-code-fold.ts - 长代码块折叠增强
 *
 * - 仅处理正文容器中的块级代码（pre）
 * - 高度超过阈值时默认收起，并提供展开/收起切换
 * - 兼容 Astro View Transitions，重复初始化时保持幂等
 */

const COLLAPSED_HEIGHT_REM = 16;
const LONG_CODE_THRESHOLD_REM = 24;
const RESIZE_DEBOUNCE_MS = 150;

let resizeTimer: number | null = null;
let codeBlockId = 0;

declare global {
  interface Window {
    __codeFoldInitBound?: boolean;
  }
}

function remToPx(rem: number): number {
  const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
  return rem * (Number.isFinite(rootFontSize) ? rootFontSize : 16);
}

function ensureCodeId(pre: HTMLPreElement): string {
  if (pre.id) return pre.id;

  codeBlockId += 1;
  pre.id = `code-block-${codeBlockId}`;
  return pre.id;
}

function setExpandedState(wrapper: HTMLDivElement, expanded: boolean) {
  wrapper.dataset.codeExpanded = String(expanded);

  const toggle = wrapper.querySelector<HTMLButtonElement>('.code-fold__toggle');
  if (!toggle) return;

  toggle.textContent = expanded ? '收起代码' : '展开代码';
  toggle.setAttribute('aria-expanded', String(expanded));
}

function createCodeFold(pre: HTMLPreElement): HTMLDivElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'code-fold';
  wrapper.dataset.codeCollapsible = 'false';
  wrapper.dataset.codeExpanded = 'true';
  wrapper.style.setProperty('--code-fold-collapsed-height', `${COLLAPSED_HEIGHT_REM}rem`);

  const parent = pre.parentNode;
  if (!parent) {
    throw new Error('Unable to enhance code block without a parent node.');
  }

  parent.insertBefore(wrapper, pre);
  wrapper.appendChild(pre);

  const fade = document.createElement('div');
  fade.className = 'code-fold__fade';
  fade.setAttribute('aria-hidden', 'true');

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'code-fold__toggle';
  toggle.setAttribute('aria-controls', ensureCodeId(pre));
  toggle.addEventListener('click', () => {
    wrapper.dataset.codeUserToggled = 'true';
    setExpandedState(wrapper, wrapper.dataset.codeExpanded !== 'true');
  });

  wrapper.append(fade, toggle);
  setExpandedState(wrapper, false);
  return wrapper;
}

function getCodeFold(pre: HTMLPreElement): HTMLDivElement | null {
  const parent = pre.parentElement;
  return parent instanceof HTMLDivElement && parent.classList.contains('code-fold') ? parent : null;
}

function syncCodeFold(pre: HTMLPreElement) {
  const thresholdPx = remToPx(LONG_CODE_THRESHOLD_REM);
  const isCollapsible = pre.scrollHeight > thresholdPx;

  pre.dataset.codeEnhanced = 'true';

  let wrapper = getCodeFold(pre);
  if (!wrapper && !isCollapsible) return;
  if (!wrapper) wrapper = createCodeFold(pre);

  wrapper.dataset.codeCollapsible = String(isCollapsible);

  const toggle = wrapper.querySelector<HTMLButtonElement>('.code-fold__toggle');
  if (toggle) {
    toggle.setAttribute('aria-controls', ensureCodeId(pre));
  }

  if (!isCollapsible) {
    setExpandedState(wrapper, true);
    return;
  }

  if (wrapper.dataset.codeUserToggled === 'true') return;

  setExpandedState(wrapper, false);
}

function initCodeFold() {
  document.querySelectorAll<HTMLElement>('[data-content-body]').forEach((container) => {
    container.querySelectorAll('pre').forEach((node) => {
      if (!(node instanceof HTMLPreElement)) return;
      syncCodeFold(node);
    });
  });
}

function scheduleInitCodeFold() {
  window.requestAnimationFrame(() => {
    initCodeFold();
  });
}

function handleResize() {
  if (resizeTimer) {
    window.clearTimeout(resizeTimer);
  }

  resizeTimer = window.setTimeout(() => {
    scheduleInitCodeFold();
  }, RESIZE_DEBOUNCE_MS);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scheduleInitCodeFold);
} else {
  scheduleInitCodeFold();
}

if (!window.__codeFoldInitBound) {
  document.addEventListener('astro:page-load', scheduleInitCodeFold);
  window.addEventListener('resize', handleResize);
  window.__codeFoldInitBound = true;
}
