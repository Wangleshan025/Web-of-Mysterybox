export default {
  ADD_TO_CART(state, product) {
    const existingItem = state.cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += product.quantity;
    } else {
      state.cartItems.push({...product});
    }
    
    // 持久化到本地存储
    localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
  },
  
  REMOVE_FROM_CART(state, productId) {
    state.cartItems = state.cartItems.filter(item => item.id !== productId);
    localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
  },
  
  UPDATE_QUANTITY(state, {productId, quantity}) {
    const item = state.cartItems.find(item => item.id === productId);
    if (item) {
      item.quantity = quantity;
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    }
  },
  
  CLEAR_CART(state) {
    state.cartItems = [];
    localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
  },
  
  // 创建订单
  CREATE_ORDER(state, orderData) {
    state.orderCounter++;
    const newOrder = {
      id: Date.now(),
      orderNumber: `ORD${state.orderCounter}`,
      date: new Date().toISOString(),
      status: 'pending',
      ...orderData
    };
    
    state.orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(state.orders));
    localStorage.setItem('orderCounter', state.orderCounter);
  },
  
  // 更新订单状态
  UPDATE_ORDER_STATUS(state, {orderId, status}) {
    const order = state.orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      localStorage.setItem('orders', JSON.stringify(state.orders));
    }
  },
  
  LOGIN(state, userData) {
    state.user = userData;
    localStorage.setItem('user', JSON.stringify(userData));
  },
  
  LOGOUT(state) {
    state.user = null;
    localStorage.removeItem('user');
  },
  
  INIT_FROM_STORAGE(state) {
    const savedCart = localStorage.getItem('cartItems');
    const savedOrders = localStorage.getItem('orders');
    const savedUser = localStorage.getItem('user');
    const savedCounter = localStorage.getItem('orderCounter');
    
    if (savedCart) state.cartItems = JSON.parse(savedCart);
    if (savedOrders) state.orders = JSON.parse(savedOrders);
    if (savedUser) state.user = JSON.parse(savedUser);
    if (savedCounter) state.orderCounter = parseInt(savedCounter);
  }
};