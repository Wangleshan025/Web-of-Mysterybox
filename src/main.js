import { createApp } from 'vue'
import './style.css'
import router from './router';
import App from './App.vue'
import 'font-awesome/css/font-awesome.min.css';


createApp(App)
.use(router)
.mount('#app');