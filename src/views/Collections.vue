<template>
  <div class="collections-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>盲盒系列</h1>
      <p>探索各种主题的盲盒，开启藏属于你的惊喜</p>
    </div>

    <!-- 分类筛选 -->
    <div class="filter-container">
      <div class="filter-buttons">
        <button 
          @click="activeCategory = 'all'"
          :class="activeCategory === 'all' ? 'active' : ''"
          class="filter-btn"
        >
          全部
        </button>
        <button 
          @click="activeCategory = 'new'"
          :class="activeCategory === 'new' ? 'active' : ''"
          class="filter-btn"
        >
          新品
        </button>
        <button 
          @click="activeCategory = 'limited'"
          :class="activeCategory === 'limited' ? 'active' : ''"
          class="filter-btn"
        >
          限定款
        </button>
        <button 
          @click="activeCategory = 'popular'"
          :class="activeCategory === 'popular' ? 'active' : ''"
          class="filter-btn"
        >
          热门
        </button>
      </div>
    </div>

    <!-- 盲盒列表 -->
    <div class="boxes-grid">
      <div 
        v-for="box in filteredBoxes" 
        :key="box.id" 
        class="box-card"
        @click="$router.push(`/box/${box.id}`)"
      >
        <div class="box-image-container">
          <img :src="box.image" :alt="box.name" class="box-image">
          <span v-if="box.tag" class="box-tag">{{ box.tag }}</span>
        </div>
        <div class="box-info">
          <h3 class="box-name">{{ box.name }}</h3>
          <p class="box-desc">{{ box.description }}</p>
          <div class="box-meta">
            <p class="box-price">¥{{ box.price }}</p>
            <div class="box-popularity">
              <i class="fa fa-fire"></i>
              <span>{{ box.popularity }}% 人气</span>
            </div>
          </div>
          <div class="box-actions">
            <button 
              @click.stop="handleOpenBox(box.id)" 
              class="open-box-btn"
            >
              立即开启
            </button>
            <button 
              @click.stop="handleAddToCart(box.id)" 
              class="add-to-cart-btn"
            >
              <i class="fa fa-shopping-cart"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredBoxes.length === 0" class="empty-state">
      <p>没有找到符合条件的盲盒</p>
      <button @click="activeCategory = 'all'" class="reset-btn">
        查看全部
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'Collections',
  props: {
    blindBoxes: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { emit }) {
    const activeCategory = ref('all');

    // 根据分类筛选盲盒
    const filteredBoxes = computed(() => {
      if (activeCategory.value === 'all') {
        return props.blindBoxes;
      }
      
      if (activeCategory.value === 'new') {
        return props.blindBoxes.filter(box => box.tag === '新品');
      }
      
      if (activeCategory.value === 'limited') {
        return props.blindBoxes.filter(box => box.tag === '限定');
      }
      
      if (activeCategory.value === 'popular') {
        return [...props.blindBoxes]
          .sort((a, b) => b.popularity - a.popularity)
          .filter((_, index) => index < 4);
      }
      
      return props.blindBoxes;
    });

    // 开启盲盒
    const handleOpenBox = (boxId) => {
      emit('open-blind-box', boxId);
    };

    // 加入购物车
    const handleAddToCart = (boxId) => {
      emit('add-to-cart', boxId);
    };

    return {
      activeCategory,
      filteredBoxes,
      handleOpenBox,
      handleAddToCart
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

/* 页面容器 */
.collections-container {
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

/* 筛选按钮容器 */
.filter-container {
  margin-bottom: 2.5rem;
}

.filter-buttons {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

/* 筛选按钮样式 */
.filter-btn {
  background-color: var(--light-gray);
  color: var(--dark-gray);
  border: none;
  border-radius: 999px;
  padding: 0.5rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  background-color: var(--primary-color-light);
  color: var(--white);
}

.filter-btn.active {
  background-color: var(--primary-color);
  color: var(--white);
}

/* 盲盒网格布局 */
.boxes-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 640px) {
  .boxes-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .boxes-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* 盲盒卡片样式 */
.box-card {
  background-color: var(--white);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: var(--shadow);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.box-card:hover {
  transform: translateY(-5px);
}

/* 盲盒图片容器 */
.box-image-container {
  position: relative;
  height: 250px;
}

.box-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.box-tag {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background-color: var(--secondary-color);
  color: var(--white);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
}

/* 盲盒信息区域 */
.box-info {
  padding: 1.25rem;
}

.box-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--dark-color);
  margin-bottom: 0.5rem;
}

.box-desc {
  font-size: 0.875rem;
  color: var(--dark-gray);
  margin-bottom: 1rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 盲盒元数据 */
.box-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.box-price {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--primary-color);
}

.box-popularity {
  display: flex;
  align-items: center;
  color: var(--medium-gray);
  font-size: 0.875rem;
}

.box-popularity i {
  color: #f59e0b;
  margin-right: 0.25rem;
}

/* 盲盒操作按钮 */
.box-actions {
  display: flex;
  gap: 0.75rem;
}

.open-box-btn {
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

.open-box-btn:hover {
  background-color: var(--primary-color-light);
}

.add-to-cart-btn {
  width: 2.5rem;
  height: 2.5rem;
  background-color: var(--light-gray);
  color: var(--primary-color);
  border: none;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-to-cart-btn:hover {
  background-color: var(--primary-color);
  color: var(--white);
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: 4rem 1rem;
}

.empty-state p {
  font-size: 1.125rem;
  color: var(--dark-gray);
  margin-bottom: 1.5rem;
}

.reset-btn {
  background-color: var(--primary-color);
  color: var(--white);
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.reset-btn:hover {
  background-color: var(--primary-color-light);
}
</style>
