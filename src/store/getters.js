export default {
  cartItems: state => state.cartItems,
  
  cartTotalCount: state => {
    return state.cartItems.reduce((total, item) => total + item.quantity, 0);
  },
  cartTotalAmount: state => {
    return state.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  },
  orders: state => state.orders,
  getOrderById: state => id => {
    return state.orders.find(order => order.id === id);
  },
  isLoggedIn: state => !!state.user,
  currentUser: state => state.user
};