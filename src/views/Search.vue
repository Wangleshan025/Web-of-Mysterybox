<template>
  <div class="search-container">
    <!-- 搜索框区域 -->
    <div class="search-box-container">
      <div class="search-input-group">
        <input
          type="text"
          v-model="searchQuery"
          @input="handleSearch"
          @keyup.enter="handleSearch"
          placeholder="搜索盲盒或物品名称..."
          class="search-input"
        >
        <button @click="handleSearch" class="search-btn">
          <i class="fa fa-search"></i>
        </button>
        <button 
          @click="clearSearch" 
          class="clear-btn"
          v-if="searchQuery.trim()"
        >
          <i class="fa fa-times"></i>
        </button>
      </div>
      
      <!-- 热门搜索标签 -->
      <div class="popular-tags" v-if="!searchPerformed">
        <span class="tags-label">热门搜索：</span>
        <button 
          @click="searchByTag(tag)" 
          class="tag-btn"
          v-for="tag in popularTags" 
          :key="tag"
        >
          {{ tag }}
        </button>
      </div>
    </div>

    <!-- 搜索结果区域 -->
    <div class="search-results" v-if="searchPerformed">
      <!-- 搜索结果统计 -->
      <div class="results-stats">
        <p>找到 {{ filteredResults.length }} 个相关结果</p>
      </div>
      
      <!-- 搜索结果列表 -->
      <div class="results-grid" v-if="filteredResults.length > 0">
        <div 
          v-for="box in filteredResults" 
          :key="box.id" 
          class="result-card"
          @click="$router.push(`/box/${box.id}`)"
        >
          <div class="result-image-container">
            <img :src="box.image" :alt="box.name" class="result-image">
            <span v-if="box.tag" class="result-tag">{{ box.tag }}</span>
          </div>
          <div class="result-info">
            <h3 class="result-name">{{ box.name }}</h3>
            <p class="result-desc">{{ box.description }}</p>
            <div class="result-meta">
              <p class="result-price">¥{{ box.price }}</p>
              <div class="result-popularity">
                <i class="fa fa-fire"></i>
                <span>{{ box.popularity }}% 人气</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 无结果状态 -->
      <div class="no-results" v-if="filteredResults.length === 0">
        <div class="no-results-icon">
          <i class="fa fa-search"></i>
        </div>
        <p class="no-results-text">没有找到相关的盲盒</p>
        <p class="no-results-hint">尝试使用其他关键词搜索</p>
        <button @click="clearSearch" class="reset-search-btn">
          清除搜索
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';

export default {
  name: 'Search',
  props: {
    blindBoxes: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    // 搜索相关状态
    const searchQuery = ref('');
    const searchPerformed = ref(false);
    const filteredResults = ref([]);
    const blindBoxes = ref([
      {
        id: 1,
        name: "星际漫游盲盒",
        description: "探索宇宙的奥秘，包含5款常规宇航员和1款隐藏款外星人",
        image: "https://picsum.photos/id/23/300/300",
        price: 69,
        tag: "新品",
        popularity: 92,
        items: [
          { id: 101, name: "宇航员甲", isRare: false },
          { id: 102, name: "宇航员乙", isRare: false },
          { id: 103, name: "外星人", isRare: true }
        ]
      },
      {
        id: 2,
        name: "森林精灵盲盒",
        description: "来自森林的神秘精灵，每一款都有独特的魔法能力",
        image: "https://picsum.photos/id/24/300/300",
        price: 59,
        tag: "热门",
        popularity: 88,
        items: [
          { id: 201, name: "树精灵", isRare: false },
          { id: 202, name: "花精灵", isRare: false },
          { id: 203, name: "月精灵", isRare: true }
        ]
      }
    ]);
    
    // 热门搜索标签
    const popularTags = [
      '隐藏款', '新品', '限量', '联名', '动漫', '手办', '节日限定'
    ];

    // 搜索处理函数
    const handleSearch = () => {
      // 处理空搜索
      if (!searchQuery.value.trim()) {
        filteredResults.value = [];
        searchPerformed.value = false;
        return;
      }
      
      // 标记已执行搜索
      searchPerformed.value = true;
      
      // 统一转为小写处理，实现不区分大小写搜索
      const query = searchQuery.value.toLowerCase().trim();
      
      // 多维度匹配搜索
      filteredResults.value = blindBoxes.value.filter(box => {
        const matchesName = box.name.toLowerCase().includes(query);
        const matchesDesc = box.description.toLowerCase().includes(query);
        const matchesTag = box.tag ? box.tag.toLowerCase().includes(query) : false;
        const matchesItem = box.items.some(item => 
          item.name.toLowerCase().includes(query)
        );
        
        return matchesName || matchesDesc || matchesTag || matchesItem;
      });
    };

    // 清除搜索
    const clearSearch = () => {
      searchQuery.value = '';
      filteredResults.value = [];
      searchPerformed.value = false;
    };

    // 通过热门标签搜索
    const searchByTag = (tag) => {
      searchQuery.value = tag;
      handleSearch();
    };

    // 监听盲盒数据变化，重新执行搜索
    watch(
      () => blindBoxes.value,
      () => {
        if (searchPerformed.value) {
          handleSearch();
        }
      }
    );

    return {
      searchQuery,
      searchPerformed,
      filteredResults,
      popularTags,
      handleSearch,
      clearSearch,
      searchByTag
    };
  }
};
</script>

<style>
/* 基础样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

:root {
  --primary-color: #3b82f6;
  --primary-color-light: #60a5fa;
  --secondary-color: #8b5cf6;
  --dark-color: #1f2937;
  --light-gray: #f3f4f6;
  --medium-gray: #9ca3af;
  --dark-gray: #4b5563;
  --white: #ffffff;
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* 搜索容器 */
.search-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

/* 搜索框区域 */
.search-box-container {
  max-width: 800px;
  margin: 0 auto 3rem;
}

.search-input-group {
  position: relative;
  display: flex;
  margin-bottom: 1.5rem;
}

.search-input {
  flex: 1;
  padding: 1rem 1rem 1rem 1.25rem;
  border: 2px solid var(--light-gray);
  border-radius: 0.75rem 0 0 0.75rem;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  border-color: var(--primary-color);
}

.search-btn {
  background-color: var(--primary-color);
  color: var(--white);
  border: none;
  padding: 0 1.25rem;
  border-radius: 0 0.75rem 0.75rem 0;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.search-btn:hover {
  background-color: var(--primary-color-light);
}

.clear-btn {
  position: absolute;
  right: 3.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--medium-gray);
  cursor: pointer;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.clear-btn:hover {
  background-color: var(--light-gray);
}

/* 热门搜索标签 */
.popular-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}

.tags-label {
  color: var(--dark-gray);
  font-size: 0.875rem;
}

.tag-btn {
  background-color: var(--light-gray);
  color: var(--dark-gray);
  border: none;
  border-radius: 999px;
  padding: 0.375rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tag-btn:hover {
  background-color: var(--primary-color);
  color: var(--white);
}

/* 搜索结果区域 */
.search-results {
  margin-top: 2rem;
}

.results-stats {
  margin-bottom: 1.5rem;
  color: var(--dark-gray);
  font-size: 0.875rem;
}

/* 结果列表 */
.results-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .results-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .results-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* 结果卡片 */
.result-card {
  display: flex;
  background-color: var(--white);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: var(--shadow);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.result-card:hover {
  transform: translateY(-3px);
}

.result-image-container {
  width: 120px;
  flex-shrink: 0;
  position: relative;
}

.result-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.result-tag {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  background-color: var(--secondary-color);
  color: var(--white);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.result-info {
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.result-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--dark-color);
  margin-bottom: 0.5rem;
}

.result-desc {
  font-size: 0.875rem;
  color: var(--dark-gray);
  margin-bottom: 1rem;
  line-height: 1.5;
  flex: 1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.result-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.result-price {
  font-size: 1rem;
  font-weight: 600;
  color: var(--primary-color);
}

.result-popularity {
  display: flex;
  align-items: center;
  color: var(--medium-gray);
  font-size: 0.75rem;
}

.result-popularity i {
  color: #f59e0b;
  margin-right: 0.25rem;
}

/* 无结果状态 */
.no-results {
  text-align: center;
  padding: 4rem 1rem;
}

.no-results-icon {
  width: 6rem;
  height: 6rem;
  background-color: var(--light-gray);
  color: var(--medium-gray);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 2rem;
}

.no-results-text {
  font-size: 1.25rem;
  color: var(--dark-color);
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.no-results-hint {
  color: var(--dark-gray);
  margin-bottom: 2rem;
}

.reset-search-btn {
  background-color: var(--primary-color);
  color: var(--white);
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.reset-search-btn:hover {
  background-color: var(--primary-color-light);
}
</style>