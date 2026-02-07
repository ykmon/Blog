/**
 * FilterController — 统一管理搜索 + 标签过滤状态
 *
 * 设计原则：
 * - 单例模式，全局唯一状态源
 * - SearchBox 和 TagFilter 只更新状态，不直接操作 DOM 显示
 * - 每次状态变更后统一计算可见项并渲染
 */

import Fuse from 'fuse.js';

export interface FilterableItem {
  element: HTMLElement;
  title: string;
  description: string;
  tags: string[];
  category: string;
}

class FilterController {
  private static instance: FilterController | null = null;

  // 状态
  query = '';
  selectedTags = new Set<string>();

  // 数据
  private items: FilterableItem[] = [];
  private fuse: Fuse<FilterableItem> | null = null;

  // 回调
  private listeners: Array<(visibleCount: number, totalCount: number) => void> = [];

  private constructor() {}

  static getInstance(): FilterController {
    if (!FilterController.instance) {
      FilterController.instance = new FilterController();
    }
    return FilterController.instance;
  }

  /** 重新扫描 DOM，构建索引（页面切换后调用） */
  rebuild() {
    this.items = [];
    const elements = document.querySelectorAll<HTMLElement>('[data-tags]');
    elements.forEach((el) => {
      const titleEl = el.querySelector('h2, h3');
      const descEl = el.querySelector('.drop-cap, p');
      const categoryEl = el.querySelector('.text-ochre');
      this.items.push({
        element: el,
        title: titleEl?.textContent?.trim() || '',
        description: descEl?.textContent?.trim() || '',
        tags: (el.getAttribute('data-tags') || '').split(',').map(t => t.trim()).filter(Boolean),
        category: categoryEl?.textContent?.trim() || '',
      });
    });

    // 构建 Fuse 索引
    this.fuse = new Fuse(this.items, {
      keys: [
        { name: 'title', weight: 2 },
        { name: 'description', weight: 1 },
        { name: 'tags', weight: 1.5 },
        { name: 'category', weight: 1 },
      ],
      threshold: 0.4,
      includeScore: true,
      ignoreLocation: true,
    });

    // 应用当前状态
    this.apply();
  }

  /** 更新搜索词 */
  setQuery(q: string) {
    this.query = q.trim();
    this.apply();
    this.syncUrl();
  }

  /** 切换标签 */
  toggleTag(tag: string) {
    if (this.selectedTags.has(tag)) {
      this.selectedTags.delete(tag);
    } else {
      this.selectedTags.add(tag);
    }
    this.apply();
    this.syncUrl();
  }

  /** 清除所有标签 */
  clearTags() {
    this.selectedTags.clear();
    this.apply();
    this.syncUrl();
  }

  /** 清除搜索 */
  clearQuery() {
    this.query = '';
    this.apply();
    this.syncUrl();
  }

  /** 注册状态变更监听 */
  onChange(fn: (visibleCount: number, totalCount: number) => void) {
    this.listeners.push(fn);
  }

  /** 移除所有监听 */
  clearListeners() {
    this.listeners = [];
  }

  /** 从 URL 恢复状态（不触发 syncUrl） */
  restoreFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) this.query = q;
    const tags = params.get('tags');
    if (tags) {
      tags.split(',').forEach(t => this.selectedTags.add(decodeURIComponent(t)));
    }
  }

  /** 核心：根据 query + tags 计算可见性并更新 DOM */
  private apply() {
    // Step 1: 搜索过滤
    let searchMatchSet: Set<FilterableItem> | null = null;
    if (this.query && this.fuse) {
      const results = this.fuse.search(this.query);
      searchMatchSet = new Set(results.map(r => r.item));
    }

    // Step 2: 标签过滤 + 搜索过滤 → 交集
    let visibleCount = 0;
    this.items.forEach((item) => {
      let visible = true;

      // 搜索过滤
      if (searchMatchSet !== null) {
        visible = searchMatchSet.has(item);
      }

      // 标签过滤（OR 模式：任一标签匹配即可）
      if (visible && this.selectedTags.size > 0) {
        visible = item.tags.some(t => this.selectedTags.has(t));
      }

      // 更新 DOM
      item.element.style.display = visible ? '' : 'none';
      if (visible) visibleCount++;

      // 处理相邻分隔符
      const next = item.element.nextElementSibling as HTMLElement | null;
      if (next?.tagName === 'HR') {
        next.style.display = visible ? '' : 'none';
      }
    });

    // 通知监听者
    this.listeners.forEach(fn => fn(visibleCount, this.items.length));
  }

  /** 同步状态到 URL */
  private syncUrl() {
    const url = new URL(window.location.href);
    if (this.query) {
      url.searchParams.set('q', this.query);
    } else {
      url.searchParams.delete('q');
    }
    if (this.selectedTags.size > 0) {
      url.searchParams.set('tags', Array.from(this.selectedTags).map(t => encodeURIComponent(t)).join(','));
    } else {
      url.searchParams.delete('tags');
    }
    window.history.replaceState({}, '', url.toString());
  }

  /** 销毁（页面切换前调用） */
  destroy() {
    this.items = [];
    this.fuse = null;
    this.listeners = [];
    FilterController.instance = null;
  }
}

export default FilterController;
