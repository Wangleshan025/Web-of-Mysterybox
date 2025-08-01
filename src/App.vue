<template>
  <div id="app">
    <!-- 顶部导航栏 -->
    <header 
      id="navbar" 
      class="fixed w-full z-50 transition-all duration-350"
      :class="{ 'py-2 shadow': scrolled, 'py-3': !scrolled }"
    >
      <div class="todo-app">
        <!-- Logo -->
        <router-link to="/" class="navbar-logo">
          <span class="title">MysteryBox</span>
        </router-link>
        <hr color="blue" width="296px" size="4px" style="margin-left: auto; margin-right: auto;margin-top: 5px;">
        <!-- 导航链接 - 桌面版 -->
        <nav>
          <router-link to="/" class="navbar-logo1">首页</router-link>
          <router-link to="/collections" class="navbar-logo1">盲盒系列</router-link>
          <router-link to="/showcase" class="navbar-logo1">玩家秀</router-link>
          <router-link to="/about" class="navbar-logo1">关于我们</router-link>
        </nav>
        
        <!-- 搜索框 -->
        <div class="todo-form">
          <input 
            type="text" 
            placeholder="搜索盲盒..." 
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            class="todo-input"
          >
          <button @click="handleSearch" class="todo-button">搜索</button>
        </div>
        
        <!-- 用户功能区 -->
        <div>
          <router-link to="/cart" class="navbar-logo2">
            <span>🛒购物车</span>
            <span v-if="cartCount > 0" class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-secondary text-white text-xs flex items-center justify-center">
              {{ cartCount }}
            </span>
          </router-link>
          
          <span class="relative group" v-if="isLoggedIn">
            <!-- 用户下拉菜单 -->
            <span>
              <router-link to="/profile" class="navbar-logo2">个人中心</router-link>
              <router-link to="/collections/my" class="navbar-logo2">我的收藏</router-link>
              <router-link to="/orders" class="navbar-logo2">我的订单</router-link>
              <button @click="logout" class="navbar-logo1">退出登录</button>
            </span>
          </span>
          
          <button @click="openLoginModal" v-else class="todo-button2">
            登录/注册
          </button>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="pt-16">
      <router-view 
        :blindBoxes="filteredBlindBoxes" 
        :userCollections="userCollections"
        :userOrders="userOrders"
        :showcaseItems="showcaseItems"
        @add-to-cart="addToCart"
        @remove-from-cart="removeFromCart"
        @open-blind-box="openBlindBox"
        @add-to-collection="addToCollection"
        @remove-from-collection="removeFromCollection"
        @share-showcase="shareShowcase"
      />
    </main>
    

    
    <!-- 登录模态框 -->
    <div v-if="loginModalOpen" class="result-modal">
      <div class="modal-content">
        <div class="result-container">
          <!-- 修改关闭按钮位置到左上角 -->
          <button @click="loginModalOpen = false" class="text-gray-400 hover:text-gray-600 close-icon login-close-btn">
            <i class="fa fa-times text-xl"></i>
          </button>
          
          <div class="login-title-container">
            <h3 class="text-2xl font-bold">{{ loginMode === 'login' ? '用户登录' : '用户注册' }}</h3>
          </div>
          
          <form @submit.prevent="handleAuth">
            <!-- 表单表单内容保持不变 -->
            <div v-if="loginMode === 'register'" class="mb-4">
              <label class="block text-gray-700 mb-2" for="username">用户名</label>
              <input 
                type="text" 
                id="username" 
                v-model="authForm.username"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
                placeholder="请输入用户名"
                required
              >
            </div>
            
            <div class="mb-4">
              <label class="block text-gray-700 mb-2" for="email">邮箱</label>
              <input 
                type="email" 
                id="email" 
                v-model="authForm.email"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
                placeholder="请输入邮箱"
                required
              >
            </div>
            
            <div class="mb-6">
              <label class="block text-gray-700 mb-2" for="password">密码</label>
              <input 
                type="password" 
                id="password" 
                v-model="authForm.password"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
                placeholder="请输入密码"
                required
              >
              <div v-if="loginMode === 'login'" class="flex justify-end mt-2">
                <a href="#" class="text-primary text-sm hover:underline">忘记密码？</a>
              </div>
            </div>
            
            <button 
              type="submit" 
              class="w-full action-btn primary-btn mb-4"
            >
              {{ loginMode === 'login' ? '登录' : '注册' }}
            </button>
            
            <div class="text-center mb-4">
              <p class="text-gray-600">
                {{ loginMode === 'login' ? '还没有账号？' : '已有账号？' }}
                <button 
                  type="button" 
                  @click="toggleAuthMode"
                  class="text-primary font-medium hover:underline"
                >
                  {{ loginMode === 'login' ? '立即注册' : '立即登录' }}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <!-- 盲盒开启结果模态框 -->
    <div 
      v-if="boxResultOpen" 
      class="result-modal"
    >
      <div class="modal-content">
        <div class="result-container">
          <!-- 稀有度徽章 -->
          <div 
            class="rarity-badge" 
            :class="currentBoxResult.isHidden ? 'rarity-legendary' : 'rarity-rare'"
          >
            {{ currentBoxResult.isHidden ? '隐藏款' : '普通款' }}
          </div>
          
          <div class="item-display">
            <div style="
              width: 10rem;
              height: 10rem;
              margin: 0 auto 1.5rem;
              background-color: #f3f4f6;
              border-radius: 0.75rem;
              overflow: hidden;
            ">
              <img 
                :src="currentBoxResult.image" 
                alt="盲盒结果" 
                style="width: 100%; height: 100%; object-fit: cover;"
                class="animate-unbox"
              >
            </div>
            
            <h3 id="item-name" style="font-size: 1.25rem; font-weight: bold;">
              {{ currentBoxResult.name }}
            </h3>
            
            <p v-if="currentBoxResult.isHidden" class="legendary-label">
              <i class="fa fa-star"></i> 太幸运了！抽到隐藏款！
            </p>
          </div>
          
          <!-- 功能按钮 -->
          <div style="display: flex; gap: 1rem; margin: 1.5rem 0;">
            <button 
              @click="addToCollection(currentBoxResult)"
              class="action-btn primary-btn"
            >
              <i class="fa fa-plus mr-2"></i> 加入收藏
            </button>
            <button 
              @click="shareShowcase(currentBoxResult)"
              class="action-btn secondary-btn"
            >
              <i class="fa fa-share-alt mr-2"></i> 分享
            </button>
          </div>
          
          <button 
            @click="boxResultOpen = false"
            id="close-result" 
            class="close-btn"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
    <!-- 页脚 -->
    <hr color="indigo" size="4px" style="margin-top: 15px;">
    <footer>
      <div>
        <div>
          <div>
            <div>
              <div>
                <span style="font-size: x-large;">🎁</span>
              </div>
              <span style="font-weight: 800; font-size: larger;">MysteryBox</span>
            </div>
            <h4>开启惊喜，收藏快乐，尽在MysteryBox盲盒世界</h4>
          </div>
          
          <div class="qlink">
            <h3 style="font-weight: 700;">快速链接</h3>
              <span><router-link to="/" class="navbar-logo3">首页</router-link></span>
              <span><router-link to="/collections" class="navbar-logo3">盲盒系列</router-link></span>
              <span><router-link to="/showcase" class="navbar-logo3">玩家秀</router-link></span>
              <span><router-link to="/news" class="navbar-logo3">新品预告</router-link></span>
              <span><router-link to="/limited" class="navbar-logo3">限量发售</router-link></span>
          </div>
          
          <div class="qlink">
            <h3 style="font-weight: 700;">帮助中心</h3>
              <span><a href="#" class="navbar-logo3">常见问题</a></span>
              <span><a href="#" class="navbar-logo3">购买流程</a></span>
              <span><a href="#" class="navbar-logo3">配送信息</a></span>
              <span><a href="#" class="navbar-logo3">退换政策</a></span>
              <span><a href="#" class="navbar-logo3">联系我们</a></span>
          </div>
          
          <div class="qlink">
            <h3 style="font-weight: 700;">联系我们</h3>
            <span class="navbar-logo4">📍南京市鼓楼区汉口路9号</span>
            <span class="navbar-logo4">📞400-888-8888</span>
            <span class="navbar-logo4">📬homework@wlssterybox.com</span>
          </div>
        </div>
        
        <div>
          <p>© 2025 MysteryBox. 保留所有权利</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'App',
  setup() {
    // 状态管理
    const scrolled = ref(false);
    const mobileMenuOpen = ref(false);
    const searchQuery = ref('');
    const loginModalOpen = ref(false);
    const loginMode = ref('login'); // 'login' 或 'register'
    const isLoggedIn = ref(false);
    const userAvatar = ref('https://picsum.photos/id/64/200/200');
    const boxResultOpen = ref(false);
    const currentBoxResult = ref(null);
    
    // 表单数据
    const authForm = ref({
      username: '',
      email: '',
      password: ''
    });
    
    // 应用数据
    const blindBoxes = ref([
      {
        id: 1,
        name: '星际漫游系列',
        description: '探索宇宙的神秘与未知',
        price: 69,
        image: 'https://n.sinaimg.cn/sinakd20122/30/w1080h1350/20210310/b0d4-kmeeius5609280.jpg',
        tag: '新品',
        popularity: 92,
        items: [
          { id: 101, name: '月球宇航员', image: 'https://picsum.photos/id/96/100/100', isHidden: false },
          { id: 102, name: '火星探索者', image: 'https://picsum.photos/id/97/100/100', isHidden: false },
          { id: 103, name: '空间站', image: 'https://picsum.photos/id/98/100/100', isHidden: false },
          { id: 104, name: '黑洞旅行者', image: 'https://picsum.photos/id/99/100/100', isHidden: false },
          { id: 105, name: '星际漫游者', image: 'https://picsum.photos/id/100/100/100', isHidden: true }
        ]
      },
      {
        id: 2,
        name: '森林精灵系列',
        description: '来自大自然的奇幻生物',
        price: 59,
        image: 'https://picsum.photos/id/65/400/500',
        tag: '热门',
        popularity: 85,
        items: [
          { id: 201, name: '树灵', image: 'https://picsum.photos/id/65/100/100', isHidden: false },
          { id: 202, name: '花仙子', image: 'https://picsum.photos/id/66/100/100', isHidden: false },
          { id: 203, name: '森林守护者', image: 'https://picsum.photos/id/67/100/100', isHidden: false },
          { id: 204, name: '月光精灵', image: 'https://picsum.photos/id/68/100/100', isHidden: true }
        ]
      },
      {
        id: 3,
        name: '城市英雄系列',
        description: '守护城市的神秘英雄们',
        price: 79,
        image: 'https://ts4.tc.mm.bing.net/th/id/OIP-C.zQhlxBxpUkncO37WhxcUzwHaJ3?rs=1&pid=ImgDetMain&o=7&rm=3',
        tag: '',
        popularity: 78,
        items: [
          { id: 301, name: '钢铁侠', image: 'https://picsum.photos/id/24/100/100', isHidden: false },
          { id: 302, name: '闪电侠', image: 'https://picsum.photos/id/25/100/100', isHidden: false },
          { id: 303, name: '蝙蝠侠', image: 'https://picsum.photos/id/26/100/100', isHidden: false },
          { id: 304, name: '隐形侠', image: 'https://picsum.photos/id/27/100/100', isHidden: true }
        ]
      },
      {
        id: 4,
        name: '复古时光系列',
        description: '穿越时空的经典回忆',
        price: 89,
        image: 'https://imgs.design006.com/202401/Design006_eiynGjkD6G.jpg?x-oss-process=style/prev_w_460_mh_1600',
        tag: '限定',
        popularity: 65,
        items: [
          { id: 401, name: '80年代', image: 'https://picsum.photos/id/28/100/100', isHidden: false },
          { id: 402, name: '90年代', image: 'https://picsum.photos/id/29/100/100', isHidden: false },
          { id: 403, name: '00年代', image: 'https://picsum.photos/id/30/100/100', isHidden: false },
          { id: 404, name: '时光旅行者', image: 'https://picsum.photos/id/31/100/100', isHidden: true }
        ]
      }
    ]);
    
    const cart = ref([]);
    const userCollections = ref([]);
    const userOrders = ref([]);
    const showcaseItems = ref([
      { id: 1, image: 'https://picsum.photos/id/111/300/300', likes: 128, caption: '终于抽到隐藏款了！' },
      { id: 2, image: 'https://picsum.photos/id/112/300/300', likes: 95, caption: '这个系列太可爱了' },
      { id: 3, image: 'https://picsum.photos/id/113/300/300', likes: 210, caption: '全套收集完成！' },
      { id: 4, image: 'https://picsum.photos/id/114/300/300', likes: 76, caption: '第一次就中了隐藏款' },
      { id: 5, image: 'https://picsum.photos/id/115/300/300', likes: 156, caption: '摆起来真好看' },
      { id: 6, image: 'https://picsum.photos/id/116/300/300', likes: 103, caption: '最喜欢这个角色了' }
    ]);
    
    // 计算属性
    const filteredBlindBoxes = computed(() => {
      if (!searchQuery.value) return blindBoxes.value;
      const query = searchQuery.value.toLowerCase();
      return blindBoxes.value.filter(box => 
        box.name.toLowerCase().includes(query) || 
        box.description.toLowerCase().includes(query)
      );
    });
    
    const cartCount = computed(() => {
      return cart.value.reduce((total, item) => total + item.quantity, 0);
    });
    
    const router = useRouter();
    
    const handleSearch = () => {
      if (searchQuery.value) {
        router.push({ path: '/search', query: { q: searchQuery.value } });
      }
    };
    
    const openLoginModal = () => {
      loginModalOpen.value = true;
      loginMode.value = 'login';
      authForm.value = { username: '', email: '', password: '' };
    };
    
    const toggleAuthMode = () => {
      loginMode.value = loginMode.value === 'login' ? 'register' : 'login';
    };
    
    const handleAuth = () => {
      if (loginMode.value === 'login') {
        isLoggedIn.value = true;
        loginModalOpen.value = false;
        alert('登录成功！');
      } else {
        isLoggedIn.value = true;
        loginModalOpen.value = false;
        alert('注册成功！');
      }
    };
    
    const logout = () => {
      isLoggedIn.value = false;
      router.push('/');
      alert('已退出登录');
    };
    
    const addToCart = (boxId, quantity = 1) => {
      if (!isLoggedIn.value) {
        openLoginModal();
        return;
      }
      
      const box = blindBoxes.value.find(b => b.id === boxId);
      if (!box) return;
      
      const existingItem = cart.value.find(item => item.id === boxId);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.value.push({ ...box, quantity });
      }
      
      alert(`已将 ${box.name} 加入购物车`);
    };
    
    const removeFromCart = (boxId) => {
      cart.value = cart.value.filter(item => item.id !== boxId);
    };
    
    const openBlindBox = (boxId) => {
      if (!isLoggedIn.value) {
        openLoginModal();
        return;
      }
      
      const box = blindBoxes.value.find(b => b.id === boxId);
      if (!box) return;
      
      // 随机选择
      const random = Math.random();
      let selectedItem;
      
      if (random < 0.1) {
        selectedItem = box.items.find(item => item.isHidden) || box.items[0];
      } else {
        const normalItems = box.items.filter(item => !item.isHidden);
        selectedItem = normalItems[Math.floor(Math.random() * normalItems.length)];
      }
      
      currentBoxResult.value = { ...selectedItem, boxId: box.id, boxName: box.name };
      boxResultOpen.value = true;
      
      userOrders.value.push({
        id: Date.now(),
        boxId: box.id,
        boxName: box.name,
        item: selectedItem,
        date: new Date().toLocaleString(),
        price: box.price
      });
    };
    
    const addToCollection = (item) => {
      if (!isLoggedIn.value) {
        openLoginModal();
        return;
      }
      
      const exists = userCollections.value.some(
        col => col.id === item.id && col.boxId === item.boxId
      );
      
      if (!exists) {
        userCollections.value.push(item);
        alert('已添加到收藏！');
      } else {
        alert('该物品已在收藏中');
      }
    };
    
    const removeFromCollection = (itemId, boxId) => {
      userCollections.value = userCollections.value.filter(
        item => !(item.id === itemId && item.boxId === boxId)
      );
    };
    
    const shareShowcase = (item) => {
      if (!isLoggedIn.value) {
        openLoginModal();
        return;
      }
      
      showcaseItems.value.unshift({
        id: Date.now(),
        image: item.image,
        likes: 0,
        caption: `我抽到了${item.name}！#${item.boxName}#`
      });
      
      alert('分享成功！');
      boxResultOpen.value = false;
    };
    
    // 生命周期钩子
    onMounted(() => {
      // 监听滚动事件
      window.addEventListener('scroll', () => {
        scrolled.value = window.scrollY > 50;
      });
    });
    
    watch(
      () => router.currentRoute.value,
      () => {
        mobileMenuOpen.value = false;
      }
    );
    
    return {
      scrolled,
      mobileMenuOpen,
      searchQuery,
      loginModalOpen,
      loginMode,
      isLoggedIn,
      userAvatar,
      boxResultOpen,
      currentBoxResult,
      authForm,
      blindBoxes,
      filteredBlindBoxes,
      cart,
      cartCount,
      userCollections,
      userOrders,
      showcaseItems,
      handleSearch,
      openLoginModal,
      toggleAuthMode,
      handleAuth,
      logout,
      addToCart,
      removeFromCart,
      openBlindBox,
      addToCollection,
      removeFromCollection,
      shareShowcase
    };
  }
};
</script>




<style>
/* 导入外部资源 */
@import url('https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css');

/* 基础样式 */

.button-container {
  flex-direction: row !important;
}
.navbar-logo {
  text-decoration: none;
  color: #2c3e50; 
  font-size: 1.8rem;
  font-weight: bold;
}
.navbar-logo:hover {
  color: #3498db; 
  text-decoration: underline;
  transition: color 0.3s ease;
}

.navbar-logo1 {
  text-decoration: none;
  color: #356494; 
  font-size: 1rem;
  font-weight: bold;
  margin-right: 5px;
  margin-left: 5px;
}

.navbar-logo2 {
  text-decoration: none;
  color: #6991b9; 
  font-size: 1rem;
  font-weight: bold;
  margin-right: 5px;
  margin-left: 5px;
}
.navbar-logo2:hover {
  color: #3498db; 
  text-decoration: underline;
  transition: color 0.3s ease;
}

.navbar-logo3 {
  text-decoration: none;
  color: #e1ccffd5; 
  font-size: 0.9rem;
  margin-right: 5px;
  margin-left: 5px;
}
.navbar-logo3:hover {
  color: #3498db; 
  transition: color 0.2s ease;
}

.navbar-logo4 {
  text-decoration: none;
  color: #e1ccffd5; 
  font-size: 0.9rem;
  margin-right: 5px;
  margin-left: 5px;
}

#app {
  font-family: 'Inter', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2D3748;
  overflow-x: hidden;
}

.title {
  text-align: center;
  font-size: 30px;
  font-weight: 700;
}

.todo-app {
  box-sizing: border-box;
  margin-top: 30px;
  margin-left: 3%;
  padding-top: 20px;
  width: 94%;
  height: 250px;
  background: #f8f7f9;
  border-radius: 5px;
}

.todo-form {
  display: flex;
  margin: 20px 0 30px 15%;
}

.todo-input {
  padding: 0px 15px 0px 15px;
  border-radius: 20px 0 0 20px;
  border: 1px solid #d9dbdf;
  outline: none;
  width: 60%;
  height: 50px;
}

.todo-button {
  width: 100px;
  height: 52px;
  border-radius: 0 20px 20px 0;

  text-align: center;
  background: linear-gradient(
    to right,
    rgb(113, 65, 168),
    rgba(44, 114, 251, 1)
  );
  color: #fd9c47;
  line-height: 52px;
  cursor: pointer;
  font-size: 19px;
  font-weight: 458;
  user-select: none;
}

.todo-button2 {
  width: 100px;
  height: 32px;
  border-radius: 20px 20px 20px 20px;

  text-align: center;
  background: linear-gradient(
    to right,
    rgba(191, 87, 229, 0.927),
    rgb(250, 195, 76)
  );
  color: #ffffff;
  line-height: 28px;
  cursor: pointer;
  font-size: 19px;
  font-weight: 458;
  user-select: none;
}

.outitem1 {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 350px;
  height: auto;
  margin: 8px auto;
  padding: 16px;
  border-radius: 20px;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 20px;
  color: #000a1e;
  background-color: #d5e2fd6a;
  gap: 50px;
}
.outitem1 .item-text {
  flex: 1;
  min-width: 0;
  text-align: center;
}
.outitem1 .item-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; 
}

.qlink {
  padding: 1px 0;
}
.qlink h3 {
  margin-bottom: 0.2rem;
  color: #e1ccffa8;
  font-weight: 400;
  font-size: medium;
  margin-top: 4px;
  margin-bottom: 2px;
}

.result-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: 1;
  transition: opacity 0.3s ease;
}

.modal-content {
  background: white;
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  transform: scale(1);
  transition: transform 0.3s ease;
}

.rarity-badge {
  display: inline-block;
  padding: 10px 20px;
  border-radius: 25px;
  font-weight: bold;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.rarity-common {
  background: linear-gradient(45deg, #95a5a6, #7f8c8d);
  color: white;
}

.rarity-rare {
  background: linear-gradient(45deg, #3498db, #2980b9);
  color: white;
}

.rarity-legendary {
  background: linear-gradient(45deg, #f39c12, #e67e22);
  color: white;
  box-shadow: 0 0 15px rgba(243, 156, 18, 0.5);
}

.legendary-label {
  color: #e67e22;
  font-weight: 500;
  margin-top: 0.25rem;
  text-shadow: 0 0 5px rgba(243, 156, 18, 0.3);
}

.action-btn {
  flex: 1;
  padding: 0.75rem;
  font-weight: 600;
  border-radius: 0.5rem;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.primary-btn {
  background-color: #3498db;
  color: white;
}

.primary-btn:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
}

.secondary-btn {
  background-color: #9b59b6;
  color: white;
}

.secondary-btn:hover {
  background-color: #8e44ad;
  transform: translateY(-2px);
}

.close-btn {
  margin-top: 1rem;
  padding: 10px 30px;
  background: #ecf0f1;
  border: none;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #dcdde1;
  transform: translateY(-2px);
}

.result-container {
  animation: itemReveal 0.8s ease-out forwards;
}

.login-close-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.login-title-container {
  margin-bottom: 24px;
  text-align: center;
}

.modal-content {
  position: relative;
  padding: 40px;
}

.content-auto {
  content-visibility: auto;
}

.text-shadow {
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.box-glow {
  box-shadow: 0 0 15px rgba(108, 99, 255, 0.5);
}

/* 动画 */
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

@keyframes unbox {
  0% { transform: scale(0.8) rotate(-5deg); opacity: 0.7; }
  50% { transform: scale(1.1) rotate(3deg); opacity: 1; }
  100% { transform: scale(1) rotate(0); opacity: 1; }
}

.animate-unbox {
  animation: unbox 1.5s ease-out forwards;
}
</style>