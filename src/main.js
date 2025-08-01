import { createApp } from 'vue'
import './style.css'
import router from './router';
import App from './App.vue'
import 'font-awesome/css/font-awesome.min.css';
import store from './store';

const app = createApp(App);

app.use(store);
app.use(router);

store.dispatch('initFromStorage');
app.mount('#app');

createApp(App)
.use(router)
.mount('#app');