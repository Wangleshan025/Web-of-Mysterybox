<template>
  <div class="orders-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>我的订单</h1>
      <p>查看和管理您的所有订单</p>
    </div>

    <!-- 订单状态筛选 -->
    <div class="order-filters">
      <button 
        @click="activeStatus = 'all'"
        :class="activeStatus === 'all' ? 'active' : ''"
        class="filter-btn"
      >
        全部订单
      </button>
      <button 
        @click="activeStatus = 'pending'"
        :class="activeStatus === 'pending' ? 'active' : ''"
        class="filter-btn"
      >
        待付款
      </button>
      <button 
        @click="activeStatus = 'processing'"
        :class="activeStatus === 'processing' ? 'active' : ''"
        class="filter-btn"
      >
        处理中
      </button>
      <button 
        @click="activeStatus = 'shipped'"
        :class="activeStatus === 'shipped' ? 'active' : ''"
        class="filter-btn"
      >
        已发货
      </button>
      <button 
        @click="activeStatus = 'completed'"
        :class="activeStatus === 'completed' ? 'active' : ''"
        class="filter-btn"
      >
        已完成
      </button>
      <button 
        @click="activeStatus = 'cancelled'"
        :class="activeStatus === 'cancelled' ? 'active' : ''"
        class="filter-btn"
      >
        已取消
      </button>
    </div>

    <!-- 订单列表 -->
    <div class="orders-list">
      <div 
        v-for="order in filteredOrders" 
        :key="order.id" 
        class="order-card"
      >
        <div class="order-header">
          <div class="order-info">
            <span class="order-number">订单编号: {{ order.orderNumber }}</span>
            <span class="order-date">下单时间: {{ formatDate(order.date) }}</span>
          </div>
          <div class="order-status">
            <span :class="getStatusClass(order.status)">{{ getStatusText(order.status) }}</span>
          </div>
        </div>
        
        <div class="order-items">
          <div 
            v-for="item in order.items" 
            :key="item.id" 
            class="order-item"
          >
            <img :src="item.image" :alt="item.name" class="item-image">
            <div class="item-details">
              <p class="item-name">{{ item.name }}</p>
              <p class="item-quantity">数量: {{ item.quantity }}</p>
              <p class="item-price">¥{{ item.price }}</p>
            </div>
          </div>
        </div>
        
        <div class="order-summary">
          <div class="summary-item">
            <span class="summary-label">商品总数：</span>
            <span class="summary-value">{{ order.totalItems }} 个</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">订单总额：</span>
            <span class="summary-value">¥{{ order.totalAmount.toFixed(2) }}</span>
          </div>
        </div>
        
        <div class="order-actions">
          <button 
            @click="viewOrderDetails(order.id)" 
            class="details-btn"
          >
            查看详情
          </button>
          
          <template v-if="order.status === 'pending'">
            <button 
              @click="cancelOrder(order.id)" 
              class="cancel-btn"
            >
              取消订单
            </button>
            <button 
              @click="payOrder(order.id)" 
              class="pay-btn"
            >
              立即支付
            </button>
          </template>
          
          <template v-if="order.status === 'shipped'">
            <button 
              @click="confirmDelivery(order.id)" 
              class="confirm-btn"
            >
              确认收货
            </button>
          </template>
          
          <template v-if="order.status === 'completed'">
            <button 
              @click="viewOrderDetails(order.id)" 
              class="review-btn"
            >
              评价
            </button>
          </template>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredOrders.length === 0" class="empty-orders">
      <div class="empty-icon">
        <i class="fa fa-file-text-o"></i>
      </div>
      <h3>没有找到订单</h3>
      <p v-if="activeStatus === 'all'">您还没有任何订单</p>
      <p v-else>没有符合当前状态的订单</p>
      <button 
        @click="activeStatus = 'all'" 
        class="browse-btn"
        v-if="activeStatus !== 'all'"
      >
        查看全部订单
      </button>
      <button 
        @click="$router.push('/collections')" 
        class="shop-btn"
        v-if="activeStatus === 'all'"
      >
        去购物
      </button>
    </div>

    <!-- 分页 -->
    <div v-if="filteredOrders.length > 0" class="pagination">
      <button 
        @click="currentPage = Math.max(1, currentPage - 1)"
        :disabled="currentPage === 1"
        class="page-btn prev-btn"
      >
        <i class="fa fa-chevron-left"></i>
      </button>
      
      <span class="page-info">
        第 {{ currentPage }} 页，共 {{ totalPages }} 页
      </span>
      
      <button 
        @click="currentPage = Math.min(totalPages, currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="page-btn next-btn"
      >
        <i class="fa fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'Orders',
  props: {
    orders: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { emit }) {
    // 状态管理
    const activeStatus = ref('all');
    const currentPage = ref(1);
    const itemsPerPage = 5;

    // 模拟订单数据（实际项目中会从API获取）
    const orders = ref([
      {
        id: 1,
        orderNumber: 'ORD20230618001',
        date: '2023-06-18T14:30:00',
        status: 'completed',
        items: [
          {
            id: 101,
            name: '星际漫游系列盲盒',
            image: 'https://picsum.photos/id/29/100/100',
            price: 69,
            quantity: 2
          }
        ],
        totalItems: 2,
        totalAmount: 138
      },
      {
        id: 2,
        orderNumber: 'ORD20230615002',
        date: '2023-06-15T09:15:00',
        status: 'shipped',
        items: [
          {
            id: 203,
            name: '森林精灵限定款',
            image: 'https://picsum.photos/id/30/100/100',
            price: 89,
            quantity: 1
          }
        ],
        totalItems: 1,
        totalAmount: 89
      },
      {
        id: 3,
        orderNumber: 'ORD20230610005',
        date: '2023-06-10T16:45:00',
        status: 'pending',
        items: [
          {
            id: 302,
            name: '城市英雄系列',
            image: 'https://picsum.photos/id/31/100/100',
            price: 59,
            quantity: 3
          },
          {
            id: 101,
            name: '星际漫游系列盲盒',
            image: 'https://picsum.photos/id/29/100/100',
            price: 69,
            quantity: 1
          }
        ],
        totalItems: 4,
        totalAmount: 246
      }
    ]);

    // 筛选订单
    const filteredOrders = computed(() => {
      let result = [...orders.value];
      
      // 根据状态筛选
      if (activeStatus.value !== 'all') {
        result = result.filter(order => order.status === activeStatus.value);
      }
      
      // 按日期排序（最新的在前）
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // 分页处理
      const startIndex = (currentPage.value - 1) * itemsPerPage;
      return result.slice(startIndex, startIndex + itemsPerPage);
    });

    // 总页数
    const totalPages = computed(() => {
      let count = orders.value.length;
      
      if (activeStatus.value !== 'all') {
        count = orders.value.filter(order => order.status === activeStatus.value).length;
      }
      
      return Math.ceil(count / itemsPerPage);
    });

    // 格式化日期
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    // 获取状态文本
    const getStatusText = (status) => {
      const statusMap = {
        'pending': '待付款',
        'processing': '处理中',
        'shipped': '已发货',
        'completed': '已完成',
        'cancelled': '已取消'
      };
      return statusMap[status] || status;
    };

    // 获取状态样式类
    const getStatusClass = (status) => {
      const classMap = {
        'pending': 'status-pending',
        'processing': 'status-processing',
        'shipped': 'status-shipped',
        'completed': 'status-completed',
        'cancelled': 'status-cancelled'
      };
      return `order-status-text ${classMap[status]}`;
    };

    // 查看订单详情
    const viewOrderDetails = (orderId) => {
      emit('view-details', orderId);
      $router.push(`/orders/${orderId}`);
    };

    // 取消订单
    const cancelOrder = (orderId) => {
      if (confirm('确定要取消订单吗？')) {
        const order = orders.value.find(o => o.id === orderId);
        if (order) {
          order.status = 'cancelled';
          emit('update-order', order);
        }
      }
    };

    // 支付订单
    const payOrder = (orderId) => {
      const order = orders.value.find(o => o.id === orderId);
      if (order) {
        // 模拟支付流程
        order.status = 'processing';
        emit('update-order', order);
        alert('跳转到支付页面...');
      }
    };

    // 确认收货
    const confirmDelivery = (orderId) => {
      if (confirm('确认已收到商品吗？')) {
        const order = orders.value.find(o => o.id === orderId);
        if (order) {
          order.status = 'completed';
          emit('update-order', order);
        }
      }
    };

    return {
      activeStatus,
      currentPage,
      orders,
      filteredOrders,
      totalPages,
      formatDate,
      getStatusText,
      getStatusClass,
      viewOrderDetails,
      cancelOrder,
      payOrder,
      confirmDelivery
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
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --danger-color: #ef4444;
  --processing-color: #6366f1;
  --dark-color: #1f2937;
  --light-gray: #f3f4f6;
  --medium-gray: #9ca3af;
  --dark-gray: #4b5563;
  --white: #ffffff;
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* 页面容器 */
.orders-container {
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

/* 订单筛选 */
.order-filters {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2.5rem;
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

/* 订单列表 */
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 3rem;
}

/* 订单卡片 */
.order-card {
  background-color: var(--white);
  border-radius: 1rem;
  box-shadow: var(--shadow);
  overflow: hidden;
}

/* 订单头部 */
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  background-color: var(--light-gray);
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.order-number {
  font-size: 0.875rem;
  color: var(--dark-color);
  font-weight: 500;
}

.order-date {
  font-size: 0.75rem;
  color: var(--dark-gray);
}

.order-status {
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
}

.order-status-text {
  font-size: 0.875rem;
  font-weight: 600;
}

.status-pending {
  background-color: rgba(245, 158, 11, 0.1);
  color: var(--warning-color);
}

.status-processing {
  background-color: rgba(99, 102, 241, 0.1);
  color: var(--processing-color);
}

.status-shipped {
  background-color: rgba(59, 130, 246, 0.1);
  color: var(--primary-color);
}

.status-completed {
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--success-color);
}

.status-cancelled {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--danger-color);
}

/* 订单商品 */
.order-items {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--light-gray);
}

.order-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.order-item:last-child {
  margin-bottom: 0;
}

.item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 0.5rem;
  margin-right: 1rem;
}

.item-details {
  flex: 1;
}

.item-name {
  font-size: 0.875rem;
  color: var(--dark-color);
  margin-bottom: 0.25rem;
}

.item-quantity, .item-price {
  font-size: 0.75rem;
  color: var(--dark-gray);
}

.item-price {
  font-weight: 500;
}

/* 订单摘要 */
.order-summary {
  padding: 1rem 1.25rem;
  display: flex;
  justify-content: flex-end;
  gap: 2rem;
  background-color: var(--light-gray);
}

.summary-item {
  text-align: right;
}

.summary-label {
  font-size: 0.875rem;
  color: var(--dark-gray);
}

.summary-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--dark-color);
}

/* 订单操作按钮 */
.order-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  flex-wrap: wrap;
}

.details-btn {
  background-color: transparent;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.details-btn:hover {
  background-color: var(--primary-color);
  color: var(--white);
}

.cancel-btn {
  background-color: transparent;
  color: var(--danger-color);
  border: 1px solid var(--danger-color);
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background-color: var(--danger-color);
  color: var(--white);
}

.pay-btn, .confirm-btn {
  background-color: var(--primary-color);
  color: var(--white);
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.pay-btn:hover, .confirm-btn:hover {
  background-color: var(--primary-color-light);
}

.review-btn {
  background-color: var(--secondary-color);
  color: var(--white);
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.review-btn:hover {
  background-color: #7c3aed;
}

/* 空订单状态 */
.empty-orders {
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

.empty-orders h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--dark-color);
  margin-bottom: 0.5rem;
}

.empty-orders p {
  color: var(--dark-gray);
  margin-bottom: 2rem;
}

.browse-btn, .shop-btn {
  background-color: var(--primary-color);
  color: var(--white);
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.browse-btn:hover, .shop-btn:hover {
  background-color: var(--primary-color-light);
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.page-btn {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  border: 1px solid var(--medium-gray);
  background-color: var(--white);
  color: var(--dark-color);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled) {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: var(--white);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.875rem;
  color: var(--dark-gray);
}
</style>