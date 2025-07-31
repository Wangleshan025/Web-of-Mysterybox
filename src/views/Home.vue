<template>
  <div class="home-container">
    <!-- 英雄区域 -->
    <section class="hero-section">
      <div class="hero-content">
        <h1>开启神秘神秘盲盒，收藏专属惊喜</h1>
        <p>每一款盲盒都藏着独一无二的惊喜，快来开启属于你的神秘世界</p>
        <div class="hero-buttons">
          <button @click="$router.push('/collections')" class="primary-btn">
            立即探索
          </button>
          <button @click="$router.push('/about')" class="secondary-btn">
            了解更多
          </button>
        </div>
      </div>
      <div class="hero-image">
        <img src="https://picsum.photos/id/26/800/600" alt="盲盒展示" class="main-image">
        <img src="https://picsum.photos/id/27/300/300" alt="盲盒装饰1" class="decor-image decor1">
        <img src="https://picsum.photos/id/28/200/200" alt="盲盒装饰2" class="decor-image decor2">
      </div>
    </section>

    <!-- 热门盲盒区域 -->
    <section class="popular-section">
      <div class="section-header">
        <h2>热门盲盒系列</h2>
        <p>最受欢迎的盲盒系列，快来看看大家都在收藏什么</p>
        <button @click="$router.push('/collections')" class="view-all-btn">
          查看全部 <i class="fa fa-arrow-right ml-1"></i>
        </button>
      </div>
      
      <div class="boxes-grid">
        <div 
          v-for="box in popularBoxes" 
          :key="box.id" 
          class="box-card"
          @click="$router.push(`/box/${box.id}`)"
        >
          <div class="box-image-container">
            <img :src="box.image" :alt="box.name" class="box-image">
            <span v-if="box.tag" class="box-tag">{{ box.tag }}</span>
          </div>
          <div class="box-info">
            <h3>{{ box.name }}</h3>
            <p class="box-price">¥{{ box.price }}</p>
            <div>
              <i class="fa fa-fire"></i>
              <span>{{ box.popularity }}% 人气</span>
            </div>
            <button 
              @click.stop="handleAddToCart(box.id)" 
              class="add-to-cart-btn"
            >
              加入购物车
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'Home',
  props: {
    blindBoxes: {
      type: Array,
      default: () => []
    },
    showcaseItems: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { emit }) {
    // 精选热门盲盒（取前4个）
    const popularBoxes = computed(() => {
      // 按人气排序
      return [...props.blindBoxes]
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 4);
    });
    
    // 加入购物车
    const handleAddToCart = (boxId) => {
      emit('add-to-cart', boxId);
    };
    
    return {
      popularBoxes,
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
}

/* 首页容器 */
.home-container {
  width: 100%;
  overflow-x: hidden;
}

/* 按钮样式 */
.primary-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.primary-btn:hover {
  background-color: var(--primary-color-light);
}

.secondary-btn {
  background-color: transparent;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.secondary-btn:hover {
  background-color: var(--primary-color);
  color: white;
}

.view-all-btn {
  background: none;
  border: none;
  color: var(--primary-color);
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: color 0.2s ease;
}

.view-all-btn:hover {
  color: var(--primary-color-light);
}

/* 英雄区域 */
.hero-section {
  display: flex;
  flex-direction: column;
  padding: 4rem 1rem;
  background-color: var(--light-gray);
  overflow: hidden;
  position: relative;
}

@media (min-width: 768px) {
  .hero-section {
    flex-direction: row;
    align-items: center;
    padding: 6rem 2rem;
  }
}

.hero-content {
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
  z-index: 2;
}

@media (min-width: 768px) {
  .hero-content {
    flex: 1;
    text-align: left;
    margin-bottom: 0;
    padding-right: 2rem;
  }
}

.hero-content h1 {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--dark-color);
  margin-bottom: 1rem;
  line-height: 1.2;
}

.hero-content p {
  font-size: 1.125rem;
  color: var(--dark-gray);
  margin-bottom: 2rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

@media (min-width: 768px) {
  .hero-content p {
    margin-left: 0;
  }
}

.hero-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;
}

@media (min-width: 768px) {
  .hero-buttons {
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
}

.hero-image {
  flex: 1;
  position: relative;
  height: 100px;
}

@media (min-width: 768px) {
  .hero-image {
    height: 400px;
  }
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 1rem;
}

.decor-image {
  position: absolute;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.decor1 {
  width: 150px;
  height: 150px;
  top: -20px;
  right: 20px;
}

@media (min-width: 768px) {
  .decor1 {
    width: 200px;
    height: 200px;
    top: -30px;
    right: 40px;
  }
}

.decor2 {
  width: 100px;
  height: 200px;
  bottom: -10px;
  left: 30px;
}

@media (min-width: 768px) {
  .decor2 {
    width: 150px;
    height: 150px;
    bottom: -20px;
    left: 60px;
  }
}

/* 通用区域标题 */
.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

@media (min-width: 768px) {
  .section-header {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

.section-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--dark-color);
  margin-bottom: 0.5rem;
}

.section-header p {
  font-size: 1rem;
  color: var(--dark-gray);
  max-width: 600px;
  margin-bottom: 1rem;
}

/* 热门盲盒区域 */
.popular-section {
  padding: 4rem 1rem;
  background-color: var(--light-gray);
}

.boxes-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

@media (min-width: 640px) {
  .boxes-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .boxes-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.box-card {
  background-color: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.box-card:hover {
  transform: translateY(-5px);
}

.box-image-container {
  position: relative;
  height: 200px;
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
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
}

.box-info {
  padding: 1rem;
}

.box-price {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.box-popularity i {
  color: #f59e0b;
  margin-right: 0.25rem;
}

.add-to-cart-btn {
  width: 100%;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.add-to-cart-btn:hover {
  background-color: var(--primary-color-light);
}

</style>