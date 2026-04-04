/**
 * init-filter.ts - legacy 页面级过滤初始化脚本
 *
 * 仅用于旧版 data-tags 过滤链路。
 * 当检测到新版 articles 过滤器时会自动跳过，避免双系统冲突。
 */

import FilterController from './filter-controller';

let initialized = false;
let debounceTimer: number | null = null;

function hasEnhancedArticlesFilter(): boolean {
  return !!document.querySelector('[data-articles-filter="enhanced"]');
}

function initFilter() {
  // 新版 /articles 页面有独立过滤逻辑，直接跳过 legacy 初始化
  if (hasEnhancedArticlesFilter()) return;

  // 幂等保护
  if (initialized) return;
  initialized = true;

  const fc = FilterController.getInstance();

  // 从 URL 恢复状态
  fc.restoreFromUrl();

  // 重建索引
  fc.rebuild();

  // 搜索框绑定（支持多实例）
  const searchInputs = document.querySelectorAll<HTMLInputElement>('[data-role="search-input"]');
  const searchClears = document.querySelectorAll<HTMLElement>('[data-role="search-clear"]');
  const searchStatuses = document.querySelectorAll<HTMLElement>('[data-role="search-status"]');

  // 恢复搜索框值
  if (fc.query) {
    searchInputs.forEach((input) => {
      input.value = fc.query;
    });
    searchClears.forEach((btn) => btn.classList.remove('hidden'));
  }

  // 输入事件 -> 防抖 -> 更新控制器 -> 同步其他实例
  searchInputs.forEach((input) => {
    input.addEventListener('input', (e) => {
      const value = (e.target as HTMLInputElement).value;

      searchInputs.forEach((other) => {
        if (other !== e.target) other.value = value;
      });

      searchClears.forEach((btn) => btn.classList.toggle('hidden', !value.trim()));

      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(() => {
        fc.setQuery(value);
      }, 300);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') clearSearch();
    });
  });

  // 清除按钮
  searchClears.forEach((btn) => {
    btn.addEventListener('click', clearSearch);
  });

  function clearSearch() {
    searchInputs.forEach((input) => {
      input.value = '';
    });
    searchClears.forEach((btn) => btn.classList.add('hidden'));
    searchStatuses.forEach((el) => el.classList.add('hidden'));
    fc.clearQuery();

    const firstVisible = Array.from(searchInputs).find((input) => input.offsetParent !== null);
    if (firstVisible) firstVisible.focus();
  }

  // 标签按钮绑定（支持多实例）
  const allTagBtns = document.querySelectorAll<HTMLElement>('.tag-btn[data-tag]');
  const filterStatuses = document.querySelectorAll<HTMLElement>('[data-role="filter-status"]');
  const filterCounts = document.querySelectorAll<HTMLElement>('[data-role="filter-count"]');
  const clearFilterBtns = document.querySelectorAll<HTMLElement>('[data-role="clear-filters"]');

  if (fc.selectedTags.size > 0) {
    allTagBtns.forEach((btn) => {
      const tag = btn.getAttribute('data-tag');
      if (tag && fc.selectedTags.has(tag)) {
        btn.classList.add('active');
      }
    });
  }

  allTagBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tag = btn.getAttribute('data-tag');
      if (!tag) return;

      fc.toggleTag(tag);

      const isActive = fc.selectedTags.has(tag);
      document
        .querySelectorAll<HTMLElement>(`.tag-btn[data-tag="${CSS.escape(tag)}"]`)
        .forEach((button) => {
          button.classList.toggle('active', isActive);
        });
    });
  });

  clearFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      fc.clearTags();
      allTagBtns.forEach((button) => button.classList.remove('active'));
    });
  });

  // 状态变化回调 -> 更新 UI
  fc.onChange((visibleCount, totalCount) => {
    const hasSearch = !!fc.query;
    const hasTags = fc.selectedTags.size > 0;

    searchStatuses.forEach((el) => {
      if (hasSearch) {
        el.textContent = `找到 ${visibleCount} 个结果`;
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    });

    filterStatuses.forEach((el) => {
      el.classList.toggle('hidden', !hasTags);
    });

    filterCounts.forEach((el) => {
      if (hasTags) {
        const tagList = Array.from(fc.selectedTags).join(', ');
        el.textContent = `Showing ${visibleCount} of ${totalCount} items • ${tagList}`;
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

function safeInit() {
  // 每次进入页面先清理旧实例，确保 View Transitions 下无残留
  destroyFilter();

  // 新版 /articles 页面跳过 legacy 过滤
  if (hasEnhancedArticlesFilter()) return;

  initFilter();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', safeInit);
} else {
  safeInit();
}

document.addEventListener('astro:page-load', safeInit);
