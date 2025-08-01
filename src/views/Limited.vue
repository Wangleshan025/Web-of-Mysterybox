<template>
  <div class="limited-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>限定款盲盒</h1>
      <p>稀有限量版盲盒，错过不再有</p>
    </div>

    <!-- 限定类型筛选 -->
    <div class="limited-filters">
      <button 
        @click="activeType = 'all'"
        :class="activeType === 'all' ? 'active' : ''"
        class="filter-btn"
      >
        全部限定
      </button>
      <button 
        @click="activeType = 'festival'"
        :class="activeType === 'festival' ? 'active' : ''"
        class="filter-btn"
      >
        节日限定
      </button>
      <button 
        @click="activeType = 'collaboration'"
        :class="activeType === 'collaboration' ? 'active' : ''"
        class="filter-btn"
      >
        联名款
      </button>
      <button 
        @click="activeType = 'anniversary'"
        :class="activeType === 'anniversary' ? 'active' : ''"
        class="filter-btn"
      >
        纪念款
      </button>
    </div>

    <!-- 限定盲盒列表 -->
    <div class="limited-grid">
      <div 
        v-for="box in filteredLimitedBoxes" 
        :key="box.id" 
        class="limited-card"
      >
        <!-- 限量标签 -->
        <div class="limited-badge">
          限量 {{ box.limitedQuantity }} 个
        </div>
        
        <!-- 倒计时（如果快结束） -->
        <div v-if="isAlmostEnd(box.endDate)" class="countdown-badge">
          <i class="fa fa-clock-o mr-1"></i>
          剩余: {{ getCountdown(box.endDate) }}
        </div>
        
        <div class="limited-image-container">
          <img :src="box.image" :alt="box.name" class="limited-image">
          <div v-if="box.remaining <= 0" class="sold-out-overlay">
            已售罄
          </div>
        </div>
        
        <div class="limited-info">
          <h3 class="limited-name">{{ box.name }}</h3>
          <p class="limited-desc">{{ box.description }}</p>
          
          <div class="limited-meta">
            <p class="limited-price">¥{{ box.price }}</p>
            <div class="limited-stock">
              <i class="fa fa-box mr-1"></i>
              <span>剩余: {{ box.remaining }} 个</span>
            </div>
          </div>
          
          <div class="limited-actions">
            <button 
              @click="handleOpenBox(box.id)" 
              class="open-btn"
              :disabled="box.remaining <= 0"
            >
              立即开启
            </button>
            <button 
              @click="handleAddToCart(box.id)" 
              class="cart-btn"
              :disabled="box.remaining <= 0"
            >
              <i class="fa fa-shopping-cart"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredLimitedBoxes.length === 0" class="empty-state">
      <p>当前没有符合条件的限定款盲盒</p>
      <button @click="activeType = 'all'" class="reset-btn">
        查看全部限定款
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';

export default {
  name: 'Limited',
  props: {
    blindBoxes: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { emit }) {
    const activeType = ref('all');
    const countdownInterval = ref(null);

    // 筛选限定款盲盒
    const filteredLimitedBoxes = computed(() => {
      // 先筛选出所有限定款
      let limitedBoxes = props.blindBoxes.filter(box => 
        box.isLimited && box.limitedType
      );
      
      // 根据类型进一步筛选
      if (activeType.value !== 'all') {
        limitedBoxes = limitedBoxes.filter(box => box.limitedType === activeType.value);
      }
      
      return limitedBoxes;
    });

    // 检查是否即将结束（3天内）
    const isAlmostEnd = (endDateString) => {
      const endDate = new Date(endDateString);
      const now = new Date();
      const diffTime = endDate - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays > 0 && diffDays <= 3;
    };

    // 获取倒计时
    const getCountdown = (endDateString) => {
      const endDate = new Date(endDateString);
      const now = new Date();
      const diffTime = endDate - now;
      
      if (diffTime <= 0) {
        return '已结束';
      }
      
      const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      if (days > 0) {
        return `${days}天${hours}时`;
      } else {
        return `${hours}时`;
      }
    };

    // 开启盲盒
    const handleOpenBox = (boxId) => {
      const box = props.blindBoxes.find(b => b.id === boxId);
      if (box && box.remaining > 0) {
        emit('open-blind-box', boxId);
      }
    };

    // 加入购物车
    const handleAddToCart = (boxId) => {
      const box = props.blindBoxes.find(b => b.id === boxId);
      if (box && box.remaining > 0) {
        emit('add-to-cart', boxId);
      }
    };

    // 启动倒计时更新
    onMounted(() => {
      // 每小时更新一次倒计时
      countdownInterval.value = setInterval(() => {
        // 触发重新渲染
        activeType.value = activeType.value;
      }, 3600000);
      
      return () => {
        if (countdownInterval.value) {
          clearInterval(countdownInterval.value);
        }
      };
    });

    return {
      activeType,
      filteredLimitedBoxes,
      isAlmostEnd,
      getCountdown,
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
  --accent-color: #ec4899;
  --dark-color: #1f2937;
  --light-gray: #f3f4f6;
  --medium-gray: #9ca3af;
  --dark-gray: #4b5563;
  --white: #ffffff;
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --sold-out: rgba(0, 0, 0, 0.7);
}

/* 页面容器 */
.limited-container {
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

/* 筛选按钮 */
.limited-filters {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
}

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

/* 限定盲盒网格 */
.limited-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

@media (min-width: 640px) {
  .limited-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .limited-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* 限定盲盒卡片 */
.limited-card {
  background-color: var(--white);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: var(--shadow);
  position: relative;
  transition: transform 0.2s ease;
}

.limited-card:hover {
  transform: translateY(-5px);
}

/* 限量标签 */
.limited-badge {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background-color: var(--accent-color);
  color: var(--white);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  z-index: 2;
}

/* 倒计时标签 */
.countdown-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background-color: #dc2626;
  color: var(--white);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  display: flex;
  align-items: center;
  z-index: 2;
}

/* 图片容器 */
.limited-image-container {
  position: relative;
  height: 250px;
}

.limited-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 已售罄覆盖层 */
.sold-out-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--sold-out);
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  z-index: 1;
}

/* 盲盒信息 */
.limited-info {
  padding: 1.25rem;
}

.limited-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--dark-color);
  margin-bottom: 0.5rem;
}

.limited-desc {
  font-size: 0.875rem;
  color: var(--dark-gray);
  margin-bottom: 1rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 元数据 */
.limited-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.limited-price {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--primary-color);
}

.limited-stock {
  display: flex;
  align-items: center;
  color: var(--medium-gray);
  font-size: 0.875rem;
}

/* 操作按钮 */
.limited-actions {
  display: flex;
  gap: 0.75rem;
}

.open-btn {
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

.open-btn:hover:not(:disabled) {
  background-color: var(--primary-color-light);
}

.open-btn:disabled {
  background-color: var(--medium-gray);
  cursor: not-allowed;
  opacity: 0.7;
}

.cart-btn {
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

.cart-btn:hover:not(:disabled) {
  background-color: var(--primary-color);
  color: var(--white);
}

.cart-btn:disabled {
  background-color: var(--light-gray);
  color: var(--medium-gray);
  cursor: not-allowed;
}

/* 空状态 */
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
    