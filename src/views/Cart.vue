<template>
  <div class="cart-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>我的购物车</h1>
      <p>确认您要购买的盲盒，准备开启惊喜</p>
    </div>

    <!-- 购物车为空状态 -->
    <div v-if="cartItems.length === 0" class="empty-cart">
      <div class="empty-icon">
        <i class="fa fa-shopping-cart"></i>
      </div>
      <h3>购物车是空的</h3>
      <p>快去挑选喜欢的盲盒吧</p>
      <button @click="$router.push('/collections')" class="start-shopping-btn">
        开始购物
      </button>
    </div>

    <!-- 购物车列表 -->
    <div v-else class="cart-content">
      <div class="cart-items">
        <div 
          v-for="item in cartItems" 
          :key="item.id" 
          class="cart-item"
        >
          <div class="item-image-container">
            <img :src="item.image" :alt="item.name" class="item-image">
          </div>
          
          <div class="item-info">
            <h3 class="item-name">{{ item.name }}</h3>
            <p class="item-price">¥{{ item.price }}</p>
            <span v-if="item.tag" class="item-tag">{{ item.tag }}</span>
          </div>
          
          <div class="item-quantity">
            <button 
              @click="updateQuantity(item.id, -1)" 
              class="quantity-btn minus-btn"
              :disabled="item.quantity <= 1"
            >
              -
            </button>
            <span class="quantity-value">{{ item.quantity }}</span>
            <button 
              @click="updateQuantity(item.id, 1)" 
              class="quantity-btn plus-btn"
              :disabled="item.quantity >= 10"
            >
              +
            </button>
          </div>
          
          <div class="item-subtotal">
            ¥{{ (item.price * item.quantity).toFixed(2) }}
          </div>
          
          <button 
            @click="removeFromCart(item.id)" 
            class="remove-btn"
          >
            <i class="fa fa-trash"></i>
          </button>
        </div>
      </div>

      <!-- 购物车摘要 -->
      <div class="cart-summary">
        <h3 class="summary-title">订单摘要</h3>
        
        <div class="summary-item">
          <span class="summary-label">商品总数：</span>
          <span class="summary-value">{{ totalItems }} 个</span>
        </div>
        
        <div class="summary-item">
          <span class="summary-label">小计：</span>
          <span class="summary-value">¥{{ subtotal.toFixed(2) }}</span>
        </div>
        
        <div class="summary-item shipping-fee">
          <span class="summary-label">运费：</span>
          <span class="summary-value">{{ shippingFee > 0 ? '¥' + shippingFee.toFixed(2) : '免费' }}</span>
        </div>
        
        <div class="summary-total">
          <span class="summary-label">总计：</span>
          <span class="summary-value">¥{{ total.toFixed(2) }}</span>
        </div>
        
        <button 
          @click="handleCheckout" 
          class="checkout-btn"
        >
          结算
        </button>
        
        <button 
          @click="clearCart" 
          class="clear-cart-btn"
        >
          清空购物车
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';

export default {
  name: 'Cart',
  props: {
    // 从父组件接收购物车数据
    cart: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { emit }) {
    // 购物车项目
    const cartItems = ref([...props.cart]);
    
    // 监听props变化，更新购物车
    watch(
      () => props.cart,
      (newVal) => {
        cartItems.value = [...newVal];
      }
    );

    // 更新数量
    const updateQuantity = (itemId, change) => {
      const item = cartItems.value.find(item => item.id === itemId);
      if (item) {
        item.quantity = Math.max(1, Math.min(10, item.quantity + change));
        emit('update-cart', cartItems.value);
      }
    };

    // 从购物车移除
    const removeFromCart = (itemId) => {
      cartItems.value = cartItems.value.filter(item => item.id !== itemId);
      emit('update-cart', cartItems.value);
    };

    // 清空购物车
    const clearCart = () => {
      if (confirm('确定要清空购物车吗？')) {
        cartItems.value = [];
        emit('update-cart', []);
      }
    };

    // 结算
    const handleCheckout = () => {
      emit('checkout', cartItems.value);
      $router.push('/checkout');
    };

    // 计算总价相关
    const totalItems = computed(() => {
      return cartItems.value.reduce((total, item) => total + item.quantity, 0);
    });

    const subtotal = computed(() => {
      return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    });

    // 运费计算（满99元免运费）
    const shippingFee = computed(() => {
      return subtotal.value >= 99 ? 0 : 10;
    });

    const total = computed(() => {
      return subtotal.value + shippingFee.value;
    });

    return {
      cartItems,
      updateQuantity,
      removeFromCart,
      clearCart,
      handleCheckout,
      totalItems,
      subtotal,
      shippingFee,
      total
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
  --danger-color: #ef4444;
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* 页面容器 */
.cart-container {
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

/* 空购物车状态 */
.empty-cart {
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

.empty-cart h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--dark-color);
  margin-bottom: 0.5rem;
}

.empty-cart p {
  color: var(--dark-gray);
  margin-bottom: 2rem;
}

.start-shopping-btn {
  background-color: var(--primary-color);
  color: var(--white);
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.start-shopping-btn:hover {
  background-color: var(--primary-color-light);
}

/* 购物车内容 */
.cart-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

@media (min-width: 1024px) {
  .cart-content {
    flex-direction: row;
  }
  
  .cart-items {
    flex: 2;
  }
  
  .cart-summary {
    flex: 1;
  }
}

/* 购物车项目列表 */
.cart-items {
  background-color: var(--white);
  border-radius: 1rem;
  box-shadow: var(--shadow);
  overflow: hidden;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--light-gray);
}

.cart-item:last-child {
  border-bottom: none;
}

.item-image-container {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  margin-right: 1rem;
}

.item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.5rem;
}

.item-info {
  flex: 1;
}

.item-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--dark-color);
  margin-bottom: 0.25rem;
}

.item-price {
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 0.25rem;
}

.item-tag {
  display: inline-block;
  background-color: var(--light-gray);
  color: var(--dark-gray);
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
}

.item-quantity {
  display: flex;
  align-items: center;
  margin: 0 1rem;
}

.quantity-btn {
  width: 2rem;
  height: 2rem;
  background-color: var(--light-gray);
  border: none;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s ease;
}

.quantity-btn:hover:not(:disabled) {
  background-color: var(--primary-color-light);
  color: var(--white);
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-value {
  width: 2rem;
  text-align: center;
  margin: 0 0.5rem;
}

.item-subtotal {
  font-weight: 600;
  color: var(--dark-color);
  min-width: 60px;
  text-align: right;
  margin-right: 1rem;
}

.remove-btn {
  color: var(--medium-gray);
  background: none;
  border: none;
  cursor: pointer;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.remove-btn:hover {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--danger-color);
}

/* 购物车摘要 */
.cart-summary {
  background-color: var(--white);
  border-radius: 1rem;
  box-shadow: var(--shadow);
  padding: 1.5rem;
}

.summary-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--dark-color);
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--light-gray);
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  color: var(--dark-gray);
}

.shipping-fee {
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px dashed var(--light-gray);
}

.summary-total {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  font-size: 1.125rem;
  margin: 1rem 0 1.5rem;
  color: var(--dark-color);
}

.summary-total .summary-value {
  color: var(--primary-color);
}

.checkout-btn {
  width: 100%;
  background-color: var(--primary-color);
  color: var(--white);
  border: none;
  border-radius: 0.5rem;
  padding: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-bottom: 1rem;
}

.checkout-btn:hover {
  background-color: var(--primary-color-light);
}

.clear-cart-btn {
  width: 100%;
  background-color: transparent;
  color: var(--danger-color);
  border: 1px solid var(--danger-color);
  border-radius: 0.5rem;
  padding: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-cart-btn:hover {
  background-color: var(--danger-color);
  color: var(--white);
}
</style>