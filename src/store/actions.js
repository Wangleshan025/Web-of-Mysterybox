export default {
  addToCart({commit}, product) {
    commit('ADD_TO_CART', product);
  },
  
  removeFromCart({commit}, productId) {
    commit('REMOVE_FROM_CART', productId);
  },
  
  updateQuantity({commit}, payload) {
    commit('UPDATE_QUANTITY', payload);
  },
  
  clearCart({commit}) {
    commit('CLEAR_CART');
  },
  
  createOrder({commit}, orderData) {
    commit('CREATE_ORDER', orderData);
  },
  
  updateOrderStatus({commit}, payload) {
    commit('UPDATE_ORDER_STATUS', payload);
  },
  
  login({commit}, userData) {
    commit('LOGIN', userData);
  },
  
  logout({commit}) {
    commit('LOGOUT');
  },
  
  initFromStorage({commit}) {
    commit('INIT_FROM_STORAGE');
  }
};