import { createStore } from 'vuex';
import state from './state';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';

// 创建并导出store实例
export default createStore({
  state,
  mutations,
  actions,
  getters
});