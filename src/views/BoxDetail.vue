<template>
  <div class="box-detail-container">
    <!-- 面包屑导航 -->
    <div class="breadcrumb">
      <a @click="$router.push('/collections')">盲盒系列</a>
      <span class="separator">/</span>
      <span>{{ boxInfo.series }}</span>
      <span class="separator">/</span>
      <span>{{ boxInfo.name }}</span>
    </div>

    <!-- 主要内容区 -->
    <div class="main-content">
      <!-- 左侧图片区域 -->
      <div class="image-section">
        <div class="main-image-container">
          <img 
            :src="mainImage" 
            :alt="boxInfo.name" 
            class="main-image"
          >
          <!-- 图片上的标签 -->
          <div class="image-tags">
            <span v-if="boxInfo.tag" class="tag">{{ boxInfo.tag }}</span>
            <span v-if="boxInfo.isLimited" class="limited-tag">限量</span>
            <span v-if="boxInfo.isNew" class="new-tag">新品</span>
          </div>
        </div>
        
        <!-- 缩略图导航 -->
        <div class="thumbnail-nav">
          <div 
            v-for="(item, index) in boxInfo.images" 
            :key="index"
            @click="mainImage = item"
            class="thumbnail-item"
            :class="{ 'active': mainImage === item }"
          >
            <img :src="item" :alt="`${boxInfo.name}图片${index+1}`" class="thumbnail">
          </div>
        </div>
      </div>

      <!-- 右侧信息区域 -->
      <div class="info-section">
        <h1 class="box-name">{{ boxInfo.name }}</h1>
        <p class="box-series">{{ boxInfo.series }}</p>
        
        <div class="price-section">
          <span class="price">¥{{ boxInfo.price }}</span>
          <span class="original-price" v-if="boxInfo.originalPrice">¥{{ boxInfo.originalPrice }}</span>
          <span class="discount" v-if="boxInfo.discount">优惠 {{ boxInfo.discount }}</span>
        </div>
        
        <div class="stock-info">
          <i class="fa fa-box"></i>
          <span>库存: {{ boxInfo.stock }} 个</span>
        </div>
        
        <div class="action-buttons">
          <div class="quantity-selector">
            <button 
              @click="decreaseQuantity" 
              class="quantity-btn"
              :disabled="quantity <= 1"
            >
              -
            </button>
            <span class="quantity">{{ quantity }}</span>
            <button 
              @click="increaseQuantity" 
              class="quantity-btn"
              :disabled="quantity >= boxInfo.stock"
            >
              +
            </button>
          </div>
          
          <button 
            @click="addToCart" 
            class="add-to-cart-btn"
            :disabled="boxInfo.stock <= 0"
          >
            <i class="fa fa-shopping-cart mr-1"></i>
          </button>
          
          <button 
            @click="buyNow" 
            class="buy-now-btn"
            :disabled="boxInfo.stock <= 0"
          >
            立即购买
          </button>
        </div>
        
        <div class="wishlist-btn-container">
          <button 
            @click="toggleWishlist" 
            class="wishlist-btn"
            :class="{ 'active': isInWishlist }"
          >
            <i class="fa" :class="isInWishlist ? 'fa-heart' : 'fa-heart-o'"></i>
            <span>{{ isInWishlist ? '已收藏' : '收藏' }}</span>
          </button>
        </div>
        
        <div class="description-section">
          <h3 class="section-title">盲盒介绍</h3>
          <p class="description">{{ boxInfo.description }}</p>
        </div>
      </div>
    </div>

    <!-- 包含物品预览 -->
    <div class="items-preview-section">
      <h2 class="section-title">包含物品</h2>
      <div class="items-grid">
        <div 
          v-for="item in boxInfo.items" 
          :key="item.id" 
          class="item-card"
        >
          <img :src="item.image" :alt="item.name" class="item-image">
          <p class="item-name">{{ item.name }}</p>
          <p class="item-odds">概率: {{ item.odds }}</p>
          <span v-if="item.isRare" class="rare-badge">稀有</span>
          <span v-if="item.isHidden" class="hidden-badge">隐藏款</span>
        </div>
      </div>
    </div>

    <!-- 已售罄状态遮罩 -->
    <div v-if="boxInfo.stock <= 0" class="sold-out-overlay">
      <div class="sold-out-content">
        <i class="fa fa-ban"></i>
        <h3>已售罄</h3>
        <p>该盲盒暂时无库存</p>
        <button @click="$router.push('/collections')" class="browse-other-btn">
          浏览其他盲盒
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'BoxDetail',
  setup(props, { emit }) {
    const route = useRoute();
    const boxId = route.params.id;
    const store = useStore();
    const router = useRouter();
    // 状态管理
    const quantity = ref(1);
    const mainImage = ref('');
    const isInWishlist = ref(false);
    const boxInfo = ref({
      id: '',
      name: '',
      series: '',
      price: 0,
      originalPrice: 0,
      discount: '',
      description: '',
      stock: 0,
      tag: '',
      isLimited: false,
      isNew: false,
      images: [],
      items: []
    });

    // 模拟获取盲盒详情数据
    const fetchBoxDetails = () => {
      // 实际项目中这里会通过API获取数据
      const mockData = {
        id: boxId,
        name: '星际漫游者盲盒',
        series: '太空探索系列',
        price: 69,
        originalPrice: 89,
        discount: '22%',
        description: '探索宇宙的奥秘，每个盲盒包含一个独特的太空主题玩偶。可能获得宇航员、火星车、外星人等造型，还有机会抽到隐藏款宇宙飞船！',
        stock: 42,
        tag: '热门',
        isLimited: true,
        isNew: true,
        images: [
          'https://picsum.photos/id/1/600/600',
          'https://picsum.photos/id/2/600/600',
          'https://picsum.photos/id/3/600/600'
        ],
        items: [
          {
            id: 1,
            name: '宇航员',
            image: 'https://picsum.photos/id/10/200/200',
            odds: '30%',
            isRare: false,
            isHidden: false
          },
          {
            id: 2,
            name: '火星车',
            image: 'https://picsum.photos/id/11/200/200',
            odds: '25%',
            isRare: false,
            isHidden: false
          },
          {
            id: 3,
            name: '外星人',
            image: 'https://picsum.photos/id/12/200/200',
            odds: '20%',
            isRare: true,
            isHidden: false
          },
          {
            id: 4,
            name: '宇宙飞船',
            image: 'https://picsum.photos/id/13/200/200',
            odds: '5%',
            isRare: true,
            isHidden: true
          }
        ]
      };
      
      boxInfo.value = mockData;
      mainImage.value = mockData.images[0];
      
      // 模拟检查是否在愿望清单中
      isInWishlist.value = Math.random() > 0.5;
    };

    // 调整数量
    const decreaseQuantity = () => {
      if (quantity.value > 1) {
        quantity.value--;
      }
    };

    const increaseQuantity = () => {
      if (quantity.value < boxInfo.value.stock) {
        quantity.value++;
      }
    };

    // 加入购物车
    const addToCart = () => {
      emit('add-to-cart', {
        id: boxInfo.value.id,
        name: boxInfo.value.name,
        image: boxInfo.value.images[0],
        price: boxInfo.value.price,
        quantity: quantity.value
      });
      const product = {
        id: boxInfo.value.id,
        name: boxInfo.value.name,
        price: boxInfo.value.price,
        image: boxInfo.value.images[0],
        quantity: quantity.value
      };
      store.dispatch('addToCart', product);
      alert('已加入购物车！');
    };

    // 立即购买
    const buyNow = () => {
      emit('buy-now', {
        id: boxInfo.value.id,
        name: boxInfo.value.name,
        image: boxInfo.value.images[0],
        price: boxInfo.value.price,
        quantity: quantity.value
      });
      const product = {
        id: boxInfo.value.id,
        name: boxInfo.value.name,
        price: boxInfo.value.price,
        image: boxInfo.value.images[0],
        quantity: quantity.value
      };
      
      const orderData = {
        items: [product],
        totalItems: quantity.value,
        totalAmount: product.price * quantity.value
      };
      
      store.dispatch('createOrder', orderData);
      store.dispatch('clearCart');
      router.push('/orders');
    };

    // 收藏/取消收藏
    const toggleWishlist = () => {
      isInWishlist.value = !isInWishlist.value;
      const action = isInWishlist.value ? '添加到' : '从';
      alert(`${action}愿望清单成功`);
    };

    // 初始化
    onMounted(() => {
      fetchBoxDetails();
    });

    watch(
      () => route.params.id,
      (newId) => {
        boxId = newId;
        fetchBoxDetails();
        quantity.value = 1;
      }
    );

    return {
      boxInfo,
      mainImage,
      quantity,
      isInWishlist,
      decreaseQuantity,
      increaseQuantity,
      addToCart,
      buyNow,
      toggleWishlist
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
  --warning-color: #f59e0b;
  --danger-color: #ef4444;
  --dark-color: #1f2937;
  --light-gray: #f3f4f6;
  --medium-gray: #9ca3af;
  --dark-gray: #4b5563;
  --white: #ffffff;
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --border-color: #e5e7eb;
}

/* 页面容器 */
.box-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  position: relative;
}

/* 面包屑导航 */
.breadcrumb {
  font-size: 0.875rem;
  color: var(--dark-gray);
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.breadcrumb a {
  color: var(--primary-color);
  text-decoration: none;
  cursor: pointer;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.separator {
  margin: 0 0.5rem;
  color: var(--medium-gray);
}

/* 主要内容区 */
.main-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 3rem;
}

@media (min-width: 1024px) {
  .main-content {
    flex-direction: row;
  }
}

/* 图片区域 */
.image-section {
  flex: 1;
}

.main-image-container {
  position: relative;
  background-color: var(--light-gray);
  border-radius: 1rem;
  overflow: hidden;
  margin-bottom: 1rem;
}

.main-image {
  width: 100%;
  height: auto;
  display: block;
}

/* 图片上的标签 */
.image-tags {
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: flex;
  gap: 0.5rem;
}

.tag {
  background-color: var(--primary-color);
  color: var(--white);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
}

.limited-tag {
  background-color: var(--accent-color);
  color: var(--white);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
}

.new-tag {
  background-color: var(--warning-color);
  color: var(--white);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
}

/* 缩略图导航 */
.thumbnail-nav {
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.thumbnail-item {
  width: 80px;
  height: 80px;
  border-radius: 0.5rem;
  overflow: hidden;
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.thumbnail-item.active {
  opacity: 1;
  border: 2px solid var(--primary-color);
}

.thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 信息区域 */
.info-section {
  flex: 1;
}

.box-name {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--dark-color);
  margin-bottom: 0.5rem;
}

.box-series {
  color: var(--dark-gray);
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

/* 价格区域 */
.price-section {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.price {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--primary-color);
}

.original-price {
  font-size: 1rem;
  color: var(--medium-gray);
  text-decoration: line-through;
}

.discount {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--danger-color);
  font-size: 0.875rem;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
}

/* 库存信息 */
.stock-info {
  display: flex;
  align-items: center;
  color: var(--dark-gray);
  margin-bottom: 2rem;
  font-size: 0.875rem;
}

.stock-info i {
  margin-right: 0.5rem;
  color: var(--primary-color);
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.quantity-selector {
  display: flex;
  align-items: center;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  width: 100px;
}

.quantity-btn {
  width: 32px;
  height: 32px;
  background-color: var(--white);
  border: none;
  color: var(--dark-color);
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.quantity-btn:hover:not(:disabled) {
  background-color: var(--light-gray);
}

.quantity-btn:disabled {
  color: var(--medium-gray);
  cursor: not-allowed;
}

.quantity {
  flex: 1;
  text-align: center;
  font-size: 1rem;
}

.add-to-cart-btn {
  flex: 1;
  min-height: 48px;
  background-color: var(--white);
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.add-to-cart-btn:hover:not(:disabled) {
  background-color: var(--primary-color);
  color: var(--white);
}

.add-to-cart-btn:disabled {
  color: var(--medium-gray);
  border-color: var(--medium-gray);
  cursor: not-allowed;
}

.buy-now-btn {
  flex: 1;
  min-height: 48px;
  background-color: var(--primary-color);
  color: var(--white);
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.buy-now-btn:hover:not(:disabled) {
  background-color: var(--primary-color-light);
}

.buy-now-btn:disabled {
  background-color: var(--medium-gray);
  cursor: not-allowed;
}

/* 收藏按钮 */
.wishlist-btn-container {
  margin-bottom: 2rem;
}

.wishlist-btn {
  background-color: var(--light-gray);
  color: var(--dark-gray);
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.wishlist-btn:hover {
  background-color: #e5e7eb;
}

.wishlist-btn.active {
  background-color: rgba(236, 72, 153, 0.1);
  color: var(--accent-color);
}

/* 描述区域 */
.description-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--dark-color);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.description {
  color: var(--dark-gray);
  line-height: 1.6;
  font-size: 0.9375rem;
}

/* 包含物品预览 */
.items-preview-section {
  margin-bottom: 3rem;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1.5rem;
}

.item-card {
  background-color: var(--white);
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: var(--shadow);
  text-align: center;
  position: relative;
}

.item-image {
  width: 100%;
  height: 140px;
  object-fit: cover;
}

.item-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--dark-color);
  padding: 0.5rem 0.5rem 0;
  margin-bottom: 0.25rem;
}

.item-odds {
  font-size: 0.75rem;
  color: var(--dark-gray);
  padding: 0 0.5rem 0.75rem;
}

.rare-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: var(--warning-color);
  color: var(--white);
  font-size: 0.7rem;
  padding: 0.1rem 0.35rem;
  border-radius: 3px;
}

.hidden-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: var(--accent-color);
  color: var(--white);
  font-size: 0.7rem;
  padding: 0.1rem 0.35rem;
  border-radius: 3px;
}

/* 已售罄遮罩 */
.sold-out-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.sold-out-content {
  background-color: var(--white);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  max-width: 300px;
}

.sold-out-content i {
  font-size: 3rem;
  color: var(--danger-color);
  margin-bottom: 1rem;
}

.sold-out-content h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--dark-color);
  margin-bottom: 0.5rem;
}

.sold-out-content p {
  color: var(--dark-gray);
  margin-bottom: 1.5rem;
}

.browse-other-btn {
  background-color: var(--primary-color);
  color: var(--white);
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.browse-other-btn:hover {
  background-color: var(--primary-color-light);
}
</style>