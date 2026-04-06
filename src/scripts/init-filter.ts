/**
 * init-filter.ts - legacy 页面级过滤初始化脚本
 *
 * - 当页面存在旧版 data-tags 卡片时，启用本地搜索与标签过滤
 * - 当页面没有可过滤卡片时，搜索框回车将跳转到 /articles/?q=...
 * - 当页面启用增强版文章过滤器时（data-articles-filter="enhanced"），跳过本脚本
 */

import FilterController from './filter-controller';

let initialized = false;
let debounceTimer: number | null = null;

function hasEnhancedArticlesFilter(): boolean {
  return !!document.querySelector('[data-articles-filter="enhanced"]');
}

function hasFilterTargets(): boolean {
  return !!document.querySelector('[data-tags]');
}

function toArticleSearchUrl(query: string): string {
  const url = new URL('/articles/', window.location.origin);
  url.searchParams.set('q', query.trim());
  return `${url.pathname}${url.search}`;
}

function initRedirectSearchOnly() {
  const searchInputs = document.querySelectorAll<HTMLInputElement>('[data-role="search-input"]');
  const searchClears = document.querySelectorAll<HTMLElement>('[data-role="search-clear"]');
  const searchStatuses = document.querySelectorAll<HTMLElement>('[data-role="search-status"]');

  if (searchInputs.length === 0) return;

  const syncQuery = (value: string) => {
    searchInputs.forEach((input) => {
      if (input.value !== value) input.value = value;
    });
    searchClears.forEach((btn) => btn.classList.toggle('hidden', !value.trim()));
  };

  const clearSearch = () => {
    syncQuery('');
    searchStatuses.forEach((el) => el.classList.add('hidden'));
    const firstVisible = Array.from(searchInputs).find((input) => input.offsetParent !== null);
    if (firstVisible) firstVisible.focus();
  };

  searchInputs.forEach((input) => {
    input.addEventListener('input', (event) => {
      const value = (event.target as HTMLInputElement).value;
      syncQuery(value);
    });

    input.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        clearSearch();
        return;
      }
      if (event.key === 'Enter') {
        const q = input.value.trim();
        if (!q) return;
        event.preventDefault();
        window.location.href = toArticleSearchUrl(q);
      }
    });
  });

  searchClears.forEach((btn) => {
    btn.addEventListener('click', clearSearch);
  });
}

function initFilter() {
  if (hasEnhancedArticlesFilter()) return;
  if (initialized) return;
  initialized = true;

  if (!hasFilterTargets()) {
    initRedirectSearchOnly();
    return;
  }

  const fc = FilterController.getInstance();
  fc.restoreFromUrl();
  fc.rebuild();

  const searchInputs = document.querySelectorAll<HTMLInputElement>('[data-role="search-input"]');
  const searchClears = document.querySelectorAll<HTMLElement>('[data-role="search-clear"]');
  const searchStatuses = document.querySelectorAll<HTMLElement>('[data-role="search-status"]');

  if (fc.query) {
    searchInputs.forEach((input) => {
      input.value = fc.query;
    });
    searchClears.forEach((btn) => btn.classList.remove('hidden'));
  }

  const clearSearch = () => {
    searchInputs.forEach((input) => {
      input.value = '';
    });
    searchClears.forEach((btn) => btn.classList.add('hidden'));
    searchStatuses.forEach((el) => el.classList.add('hidden'));
    fc.clearQuery();

    const firstVisible = Array.from(searchInputs).find((input) => input.offsetParent !== null);
    if (firstVisible) firstVisible.focus();
  };

  searchInputs.forEach((input) => {
    input.addEventListener('input', (event) => {
      const value = (event.target as HTMLInputElement).value;
      searchInputs.forEach((other) => {
        if (other !== event.target) other.value = value;
      });

      searchClears.forEach((btn) => btn.classList.toggle('hidden', !value.trim()));

      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(() => {
        fc.setQuery(value);
      }, 300);
    });

    input.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') clearSearch();
    });
  });

  searchClears.forEach((btn) => {
    btn.addEventListener('click', clearSearch);
  });

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
        el.textContent = `Showing ${visibleCount} of ${totalCount} items - ${tagList}`;
      }
    });
  });
}

function destroyFilter() {
  initialized = false;
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = null;

  const fc = FilterController.getInstance();
  fc.clearListeners();
  fc.destroy();
}

function safeInit() {
  destroyFilter();
  initFilter();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', safeInit);
} else {
  safeInit();
}

document.addEventListener('astro:page-load', safeInit);
