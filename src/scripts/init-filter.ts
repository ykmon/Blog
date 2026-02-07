/**
 * init-filter.ts — 页面级初始化脚本
 *
 * 职责：
 * - 初始化 FilterController 单例
 * - 绑定页面上所有 SearchBox / TagFilter 实例（支持多实例）
 * - 同步多个搜索框输入值 & 标签按钮 active 状态
 * - 幂等：重复调用安全（astro:page-load）
 */

import FilterController from './filter-controller';

let initialized = false;
let debounceTimer: number | null = null;

function initFilter() {
  // 幂等保护
  if (initialized) return;
  initialized = true;

  const fc = FilterController.getInstance();

  // 从 URL 恢复状态
  fc.restoreFromUrl();

  // 重建索引
  fc.rebuild();

  // ─── 搜索框绑定（支持多实例） ───
  const searchInputs = document.querySelectorAll<HTMLInputElement>('[data-role="search-input"]');
  const searchClears = document.querySelectorAll<HTMLElement>('[data-role="search-clear"]');
  const searchStatuses = document.querySelectorAll<HTMLElement>('[data-role="search-status"]');

  // 恢复搜索框值
  if (fc.query) {
    searchInputs.forEach(input => { input.value = fc.query; });
    searchClears.forEach(btn => btn.classList.remove('hidden'));
  }

  // 输入事件 → 防抖 → 更新控制器 → 同步其他实例
  searchInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      const value = (e.target as HTMLInputElement).value;

      // 同步所有搜索框
      searchInputs.forEach(other => {
        if (other !== e.target) other.value = value;
      });

      // 更新清除按钮
      searchClears.forEach(btn => btn.classList.toggle('hidden', !value.trim()));

      // 防抖搜索
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(() => {
        fc.setQuery(value);
      }, 300);
    });

    // Escape 清除
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') clearSearch();
    });
  });

  // 清除按钮
  searchClears.forEach(btn => {
    btn.addEventListener('click', clearSearch);
  });

  function clearSearch() {
    searchInputs.forEach(input => { input.value = ''; });
    searchClears.forEach(btn => btn.classList.add('hidden'));
    searchStatuses.forEach(el => el.classList.add('hidden'));
    fc.clearQuery();
    // 聚焦第一个可见的搜索框
    searchInputs.forEach(input => {
      if (input.offsetParent !== null) input.focus();
    });
  }

  // ─── 标签按钮绑定（支持多实例） ───
  const allTagBtns = document.querySelectorAll<HTMLElement>('.tag-btn[data-tag]');
  const filterStatuses = document.querySelectorAll<HTMLElement>('[data-role="filter-status"]');
  const filterCounts = document.querySelectorAll<HTMLElement>('[data-role="filter-count"]');
  const clearFilterBtns = document.querySelectorAll<HTMLElement>('[data-role="clear-filters"]');

  // 恢复标签按钮 active 状态
  if (fc.selectedTags.size > 0) {
    allTagBtns.forEach(btn => {
      const tag = btn.getAttribute('data-tag');
      if (tag && fc.selectedTags.has(tag)) {
        btn.classList.add('active');
      }
    });
  }

  // 标签点击
  allTagBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tag = btn.getAttribute('data-tag');
      if (!tag) return;

      fc.toggleTag(tag);

      // 同步所有同 tag 按钮的 active 状态
      const isActive = fc.selectedTags.has(tag);
      document.querySelectorAll<HTMLElement>(`.tag-btn[data-tag="${CSS.escape(tag)}"]`).forEach(b => {
        b.classList.toggle('active', isActive);
      });
    });
  });

  // 清除所有标签
  clearFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      fc.clearTags();
      allTagBtns.forEach(b => b.classList.remove('active'));
    });
  });

  // ─── 状态变更回调 → 更新 UI ───
  fc.onChange((visibleCount, totalCount) => {
    const hasSearch = !!fc.query;
    const hasTags = fc.selectedTags.size > 0;

    // 搜索状态
    searchStatuses.forEach(el => {
      if (hasSearch) {
        el.textContent = `找到 ${visibleCount} 个结果`;
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    });

    // 标签过滤状态
    filterStatuses.forEach(el => {
      if (hasTags) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    });

    filterCounts.forEach(el => {
      if (hasTags) {
        const tagList = Array.from(fc.selectedTags).join(', ');
        el.textContent = `Showing ${visibleCount} of ${totalCount} items \u2022 ${tagList}`;
      }
    });
  });
}

/** 销毁并重置（页面切换前） */
function destroyFilter() {
  initialized = false;
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = null;
  const fc = FilterController.getInstance();
  fc.clearListeners();
  fc.destroy();
}

// ─── 入口 ───
function safeInit() {
  destroyFilter();
  initFilter();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', safeInit);
} else {
  safeInit();
}

// Astro View Transitions 支持
document.addEventListener('astro:page-load', safeInit);
