<template>
  <div class="showcase-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>玩家展示</h1>
      <p>分享你的盲盒收藏和惊喜瞬间</p>
    </div>

    <!-- 分享按钮 -->
    <div class="share-button-container">
      <button @click="showShareModal = true" class="share-btn">
        <i class="fa fa-upload mr-1"></i> 分享我的收藏
      </button>
    </div>

    <!-- 分享弹窗 -->
    <div v-if="showShareModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>分享你的收藏</h3>
          <button @click="showShareModal = false" class="close-btn">
            <i class="fa fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="handleShare">
            <div class="form-group">
              <label for="image">上传图片</label>
              <input 
                type="file" 
                id="image" 
                accept="image/*"
                @change="handleImageUpload"
                class="file-input"
              >
            </div>
            
            <div class="form-group">
              <label for="caption">添加描述</label>
              <textarea 
                id="caption" 
                v-model="newShowcase.caption"
                placeholder="分享你的开盒心情或收藏故事..."
                rows="3"
                class="text-input"
              ></textarea>
            </div>
            
            <div class="form-actions">
              <button type="button" @click="showShareModal = false" class="cancel-btn">
                取消
              </button>
              <button type="submit" class="submit-btn">
                发布
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 筛选标签 -->
    <div class="filter-tags">
      <button 
        @click="activeTag = 'all'"
        :class="activeTag === 'all' ? 'active' : ''"
        class="tag-btn"
      >
        全部
      </button>
      <button 
        @click="activeTag = 'newest'"
        :class="activeTag === 'newest' ? 'active' : ''"
        class="tag-btn"
      >
        最新
      </button>
      <button 
        @click="activeTag = 'popular'"
        :class="activeTag === 'popular' ? 'active' : ''"
        class="tag-btn"
      >
        热门
      </button>
      <button 
        @click="activeTag = 'hidden'"
        :class="activeTag === 'hidden' ? 'active' : ''"
        class="tag-btn"
      >
        隐藏款
      </button>
    </div>

    <!-- 展示网格 -->
    <div class="showcase-grid">
      <div 
        v-for="item in filteredShowcase" 
        :key="item.id" 
        class="showcase-card"
      >
        <div class="showcase-image-container">
          <img :src="item.image" :alt="item.caption" class="showcase-image">
          <button 
            @click.stop="handleLike(item.id)"
            class="like-btn"
            :class="item.liked ? 'liked' : ''"
          >
            <i class="fa fa-heart"></i>
            <span class="like-count">{{ item.likes }}</span>
          </button>
        </div>
        
        <div class="showcase-details">
          <p class="showcase-caption">{{ item.caption }}</p>
          <div class="showcase-meta">
            <span class="showcase-author">
              <i class="fa fa-user mr-1"></i> {{ item.author }}
            </span>
            <span class="showcase-date">
              {{ formatDate(item.date) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredShowcase.length === 0" class="empty-state">
      <p>还没有玩家分享收藏，成为第一个分享的人吧！</p>
      <button @click="showShareModal = true" class="share-empty-btn">
        分享我的收藏
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'Showcase',
  props: {
    showcaseItems: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { emit }) {
    const activeTag = ref('all');
    const showShareModal = ref(false);
    const newShowcase = ref({
      caption: '',
      image: null
    });
    
    // 筛选展示内容
    const filteredShowcase = computed(() => {
      let result = [...props.showcaseItems];
      
      if (activeTag.value === 'newest') {
        return result.sort((a, b) => new Date(b.date) - new Date(a.date));
      }
      
      if (activeTag.value === 'popular') {
        return result.sort((a, b) => b.likes - a.likes);
      }
      
      if (activeTag.value === 'hidden') {
        return result.filter(item => item.caption.includes('隐藏') || item.caption.includes('隐藏款'));
      }
      
      return result;
    });
    
    // 处理图片上传
    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        // 在实际应用中，这里会上传图片到服务器
        // 这里使用临时URL模拟
        newShowcase.value.image = URL.createObjectURL(file);
      }
    };
    
    // 处理分享
    const handleShare = () => {
      if (!newShowcase.value.image || !newShowcase.value.caption.trim()) {
        alert('请上传图片并添加描述');
        return;
      }
      
      // 创建新的展示项
      const newItem = {
        id: Date.now(),
        image: newShowcase.value.image,
        caption: newShowcase.value.caption,
        author: '我',
        date: new Date().toISOString(),
        likes: 0,
        liked: false
      };
      
      // 触发父组件事件添加到列表
      emit('share-showcase', newItem);
      
      // 重置表单并关闭弹窗
      newShowcase.value = {
        caption: '',
        image: null
      };
      showShareModal.value = false;
      
      // 清空文件输入
      const fileInput = document.querySelector('.file-input');
      if (fileInput) fileInput.value = '';
    };
    
    // 处理点赞
    const handleLike = (itemId) => {
      emit('like-showcase', itemId);
    };
    
    // 格式化日期
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN');
    };
    
    return {
      activeTag,
      showShareModal,
      newShowcase,
      filteredShowcase,
      handleImageUpload,
      handleShare,
      handleLike,
      formatDate
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
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --like-color: #ef4444;
}

/* 页面容器 */
.showcase-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

/* 页面标题 */
.page-header {
  text-align: center;
  margin-bottom: 2rem;
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

/* 分享按钮 */
.share-button-container {
  text-align: center;
  margin-bottom: 2.5rem;
}

.share-btn {
  background-color: var(--primary-color);
  color: var(--white);
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: inline-flex;
  align-items: center;
}

.share-btn:hover {
  background-color: var(--primary-color-light);
}

/* 弹窗遮罩 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

/* 弹窗内容 */
.modal-content {
  background-color: var(--white);
  border-radius: 1rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--light-gray);
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--dark-color);
}

.close-btn {
  background: none;
  border: none;
  color: var(--medium-gray);
  font-size: 1.25rem;
  cursor: pointer;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: var(--dark-color);
}

.modal-body {
  padding: 1.5rem;
}

/* 表单样式 */
.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--dark-color);
}

.file-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--medium-gray);
  border-radius: 0.5rem;
  background-color: var(--white);
}

.text-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--medium-gray);
  border-radius: 0.5rem;
  font-family: inherit;
  resize: vertical;
}

.text-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.cancel-btn {
  background-color: var(--light-gray);
  color: var(--dark-gray);
  border: none;
  border-radius: 0.5rem;
  padding: 0.625rem 1.25rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.cancel-btn:hover {
  background-color: var(--medium-gray);
  color: var(--white);
}

.submit-btn {
  background-color: var(--primary-color);
  color: var(--white);
  border: none;
  border-radius: 0.5rem;
  padding: 0.625rem 1.25rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.submit-btn:hover {
  background-color: var(--primary-color-light);
}

/* 筛选标签 */
.filter-tags {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
}

.tag-btn {
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

.tag-btn:hover {
  background-color: var(--primary-color-light);
  color: var(--white);
}

.tag-btn.active {
  background-color: var(--primary-color);
  color: var(--white);
}

/* 展示网格 */
.showcase-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

@media (min-width: 640px) {
  .showcase-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .showcase-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* 展示卡片 */
.showcase-card {
  background-color: var(--white);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: transform 0.2s ease;
}

.showcase-card:hover {
  transform: translateY(-5px);
}

.showcase-image-container {
  position: relative;
  height: 250px;
}

.showcase-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.like-btn {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 999px;
  padding: 0.5rem 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.like-btn:hover {
  background-color: var(--white);
}

.like-btn.liked i {
  color: var(--like-color);
}

.like-btn i {
  color: var(--medium-gray);
  transition: color 0.2s ease;
}

.like-count {
  font-size: 0.875rem;
  color: var(--dark-color);
}

.showcase-details {
  padding: 1.25rem;
}

.showcase-caption {
  font-size: 0.875rem;
  color: var(--dark-gray);
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.showcase-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--medium-gray);
}

.showcase-author {
  display: flex;
  align-items: center;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 4rem 1rem;
  background-color: var(--light-gray);
  border-radius: 1rem;
}

.empty-state p {
  font-size: 1.125rem;
  color: var(--dark-gray);
  margin-bottom: 1.5rem;
}

.share-empty-btn {
  background-color: var(--primary-color);
  color: var(--white);
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.share-empty-btn:hover {
  background-color: var(--primary-color-light);
}
</style> 