<template>
  <div class="my-collections-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>我的收藏</h1>
      <p>查看和管理你的盲盒收藏</p>
    </div>

    <!-- 收藏统计 -->
    <div class="collection-stats">
      <div class="stat-item">
        <div class="stat-value">{{ totalBoxes }}</div>
        <div class="stat-label">已拥有盲盒</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ totalItems }}</div>
        <div class="stat-label">收集物品</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ rareItems }}</div>
        <div class="stat-label">稀有物品</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ completionRate }}%</div>
        <div class="stat-label">收藏完成率</div>
      </div>
    </div>

    <!-- 筛选和排序 -->
    <div class="collection-controls">
      <div class="filter-options">
        <label class="filter-label">筛选：</label>
        <select v-model="filterType" class="filter-select" @change="applyFilters">
          <option value="all">全部收藏</option>
          <option value="complete">已集齐系列</option>
          <option value="incomplete">未集齐系列</option>
          <option value="rare">含稀有物品</option>
        </select>
      </div>
      <div class="sort-options">
        <label class="sort-label">排序：</label>
        <select v-model="sortType" class="sort-select" @change="applyFilters">
          <option value="recent">最近收藏</option>
          <option value="name">名称（A-Z）</option>
          <option value="completion">完成率</option>
        </select>
      </div>
    </div>

    <!-- 我的收藏列表 -->
    <div class="collections-grid">
      <div 
        v-for="collection in filteredCollections" 
        :key="collection.seriesId" 
        class="collection-card"
      >
        <div class="collection-header">
          <h3 class="collection-name">{{ collection.seriesName }}</h3>
          <div class="collection-progress">
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :style="{ width: `${collection.completionRate}%` }"
              ></div>
            </div>
            <span class="progress-text">{{ collection.collected }}/{{ collection.total }} 物品</span>
          </div>
        </div>
        
        <div class="collection-items">
          <div 
            v-for="item in collection.items" 
            :key="item.id" 
            class="collection-item"
            :class="{ 'uncollected': !item.collected }"
          >
            <img :src="item.image" :alt="item.name" class="item-image">
            <div class="item-name">{{ item.name }}</div>
            <div v-if="item.isRare" class="rare-badge">稀有</div>
            <div v-if="!item.collected" class="uncollected-overlay">
              <i class="fa fa-lock"></i>
            </div>
          </div>
        </div>
        
        <div class="collection-actions">
          <button 
            @click="handleOpenMore(collection.seriesId)" 
            class="open-more-btn"
          >
            再开一个
          </button>
          <button 
            @click="handleViewDetails(collection.seriesId)" 
            class="details-btn"
          >
            查看详情
          </button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredCollections.length === 0 && userCollections.length > 0" class="filtered-empty-state">
      <p>没有符合条件的收藏</p>
      <button @click="resetFilters" class="reset-btn">
        重置筛选条件
      </button>
    </div>

    <div v-if="userCollections.length === 0" class="empty-collection-state">
      <div class="empty-icon">
        <i class="fa fa-box"></i>
      </div>
      <h3>你还没有收藏任何盲盒</h3>
      <p>快去开启盲盒，开始你的收藏之旅吧！</p>
      <button @click="$router.push('/collections')" class="start-btn">
        浏览盲盒
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';

export default {
  name: 'MyCollections',
  props: {
    userCollections: {
      type: Array,
      default: () => []
    },
    allSeries: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    // 筛选和排序状态
    const filterType = ref('all');
    const sortType = ref('recent');
    const filteredCollections = ref([]);

    // 计算收藏统计数据
    const totalBoxes = computed(() => {
      return userCollections.value.length;
    });

    const totalItems = computed(() => {
      let count = 0;
      userCollections.value.forEach(collection => {
        count += collection.items.filter(item => item.collected).length;
      });
      return count;
    });

    const rareItems = computed(() => {
      let count = 0;
      userCollections.value.forEach(collection => {
        count += collection.items.filter(item => item.collected && item.isRare).length;
      });
      return count;
    });

    const completionRate = computed(() => {
      let total = 0;
      let collected = 0;
      
      userCollections.value.forEach(collection => {
        total += collection.total;
        collected += collection.collected;
      });
      
      return total > 0 ? Math.round((collected / total) * 100) : 0;
    });

    // 应用筛选和排序
    const applyFilters = () => {
      let result = [...userCollections.value];
      
      // 应用筛选
      if (filterType.value === 'complete') {
        result = result.filter(collection => collection.completionRate === 100);
      } else if (filterType.value === 'incomplete') {
        result = result.filter(collection => collection.completionRate < 100);
      } else if (filterType.value === 'rare') {
        result = result.filter(collection => 
          collection.items.some(item => item.collected && item.isRare)
        );
      }
      
      // 应用排序
      if (sortType.value === 'name') {
        result.sort((a, b) => a.seriesName.localeCompare(b.seriesName));
      } else if (sortType.value === 'completion') {
        result.sort((a, b) => b.completionRate - a.completionRate);
      }
      // 默认按最近收藏排序（假设数据中有timestamp字段）
      
      filteredCollections.value = result;
    };

    // 重置筛选条件
    const resetFilters = () => {
      filterType.value = 'all';
      sortType.value = 'recent';
      applyFilters();
    };

    // 再开一个相同系列的盲盒
    const handleOpenMore = (seriesId) => {
      // 找到该系列对应的盲盒ID
      const series = allSeries.value.find(s => s.id === seriesId);
      if (series && series.boxId) {
        this.$emit('open-blind-box', series.boxId);
      }
    };

    // 查看收藏详情
    const handleViewDetails = (seriesId) => {
      this.$router.push(`/collection/${seriesId}`);
    };

    // 初始化
    onMounted(() => {
      applyFilters();
    });

    return {
      filterType,
      sortType,
      filteredCollections,
      userCollections,
      allSeries,
      totalBoxes,
      totalItems,
      rareItems,
      completionRate,
      applyFilters,
      resetFilters,
      handleOpenMore,
      handleViewDetails
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
  --accent-color: #ec4899;
  --dark-color: #1f2937;
  --light-gray: #f3f4f6;
  --medium-gray: #9ca3af;
  --dark-gray: #4b5563;
  --white: #ffffff;
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --uncollected: rgba(209, 213, 219, 0.7);
}

/* 页面容器 */
.my-collections-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

/* 页面标题 */
.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-header h1 {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--dark-color);
  margin-bottom: 0.5rem;
}

.page-header p {
  font-size: 1.125rem;
  color: var(--dark-gray);
  max-width: 600px;
  margin: 0 auto;
}

/* 收藏统计 */
.collection-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

@media (min-width: 640px) {
  .collection-stats {
    grid-template-columns: repeat(4, 1fr);
  }
}

.stat-item {
  background-color: var(--white);
  border-radius: 0.75rem;
  padding: 1.25rem;
  text-align: center;
  box-shadow: var(--shadow);
}

.stat-value {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--dark-gray);
}

/* 筛选和排序控制 */
.collection-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

@media (min-width: 640px) {
  .collection-controls {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.filter-options, .sort-options {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.filter-label, .sort-label {
  color: var(--dark-gray);
  font-size: 0.875rem;
}

.filter-select, .sort-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--medium-gray);
  border-radius: 0.5rem;
  background-color: var(--white);
  color: var(--dark-color);
  font-size: 0.875rem;
  cursor: pointer;
}

/* 收藏列表 */
.collections-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

@media (min-width: 1024px) {
  .collections-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 收藏卡片 */
.collection-card {
  background-color: var(--white);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: var(--shadow);
}

.collection-header {
  padding: 1.25rem;
  border-bottom: 1px solid var(--light-gray);
}

.collection-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--dark-color);
  margin-bottom: 0.75rem;
}

.collection-progress {
  width: 100%;
}

.progress-bar {
  height: 0.5rem;
  background-color: var(--light-gray);
  border-radius: 0.25rem;
  overflow: hidden;
  margin-bottom: 0.25rem;
}

.progress-fill {
  height: 100%;
  background-color: var(--primary-color);
  border-radius: 0.25rem;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.75rem;
  color: var(--dark-gray);
  text-align: right;
}

/* 收藏物品列表 */
.collection-items {
  padding: 1.25rem;
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scrollbar-width: thin;
}

.collection-item {
  min-width: 100px;
  text-align: center;
  position: relative;
}

.item-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.item-name {
  font-size: 0.75rem;
  color: var(--dark-gray);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rare-badge {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  background-color: var(--accent-color);
  color: var(--white);
  font-size: 0.625rem;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-weight: 600;
}

/* 未收集物品样式 */
.uncollected .item-image {
  filter: grayscale(100%);
  opacity: 0.7;
}

.uncollected-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100px;
  height: 100px;
  background-color: var(--uncollected);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--medium-gray);
}

/* 收藏操作按钮 */
.collection-actions {
  display: flex;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--light-gray);
}

.open-more-btn {
  flex: 1;
  background-color: var(--primary-color);
  color: var(--white);
  border: none;
  border-radius: 0.5rem;
  padding: 0.625rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.open-more-btn:hover {
  background-color: var(--primary-color-light);
}

.details-btn {
  flex: 1;
  background-color: var(--light-gray);
  color: var(--dark-color);
  border: none;
  border-radius: 0.5rem;
  padding: 0.625rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.details-btn:hover {
  background-color: var(--medium-gray);
  color: var(--white);
}

/* 空状态 */
.filtered-empty-state {
  text-align: center;
  padding: 3rem 1rem;
  background-color: var(--white);
  border-radius: 1rem;
  box-shadow: var(--shadow);
}

.filtered-empty-state p {
  font-size: 1.125rem;
  color: var(--dark-gray);
  margin-bottom: 1.5rem;
}

.empty-collection-state {
  text-align: center;
  padding: 4rem 1rem;
}

.empty-icon {
  width: 8rem;
  height: 8rem;
  background-color: var(--light-gray);
  color: var(--medium-gray);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 3rem;
}

.empty-collection-state h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--dark-color);
  margin-bottom: 0.5rem;
}

.empty-collection-state p {
  font-size: 1.125rem;
  color: var(--dark-gray);
  margin-bottom: 2rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.reset-btn, .start-btn {
  background-color: var(--primary-color);
  color: var(--white);
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.reset-btn:hover, .start-btn:hover {
  background-color: var(--primary-color-light);
}
</style>