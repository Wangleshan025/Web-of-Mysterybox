<template>
  <div class="news-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>最新资讯</h1>
      <p>了解盲盒新品发布和活动信息</p>
    </div>

    <!-- 资讯分类 -->
    <div class="news-filters">
      <button 
        @click="activeCategory = 'all'"
        :class="activeCategory === 'all' ? 'active' : ''"
        class="filter-btn"
      >
        全部
      </button>
      <button 
        @click="activeCategory = 'new-release'"
        :class="activeCategory === 'new-release' ? 'active' : ''"
        class="filter-btn"
      >
        新品发布
      </button>
      <button 
        @click="activeCategory = 'event'"
        :class="activeCategory === 'event' ? 'active' : ''"
        class="filter-btn"
      >
        活动公告
      </button>
      <button 
        @click="activeCategory = 'tips'"
        :class="activeCategory === 'tips' ? 'active' : ''"
        class="filter-btn"
      >
        收藏攻略
      </button>
      <button 
        @click="activeCategory = 'stories'"
        :class="activeCategory === 'stories' ? 'active' : ''"
        class="filter-btn"
      >
        玩家故事
      </button>
    </div>

    <!-- 资讯列表 -->
    <div class="news-grid">
      <div 
        v-for="news in filteredNews" 
        :key="news.id" 
        class="news-card"
      >
        <div class="news-image-container">
          <img :src="news.image" :alt="news.title" class="news-image">
          <span class="news-category">{{ getCategoryName(news.category) }}</span>
        </div>
        <div class="news-content">
          <h3 class="news-title">{{ news.title }}</h3>
          <div class="news-meta">
            <span class="news-date">{{ formatDate(news.date) }}</span>
            <span class="news-views"><i class="fa fa-eye"></i> {{ news.views }}</span>
          </div>
          <p class="news-excerpt">{{ news.excerpt }}</p>
          <button class="read-more-btn">
            阅读全文 <i class="fa fa-arrow-right ml-1"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredNews.length === 0" class="empty-state">
      <p>没有找到相关资讯</p>
      <button @click="activeCategory = 'all'" class="reset-btn">
        查看全部资讯
      </button>
    </div>

    <!-- 分页 -->
    <div v-if="filteredNews.length > 0" class="pagination">
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
  name: 'News',
  props: {
    newsItems: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    const activeCategory = ref('all');
    const currentPage = ref(1);
    const itemsPerPage = 6;

    // 根据分类筛选资讯
    const filteredNews = computed(() => {
      let result = [...newsItems.value];
      
      if (activeCategory.value !== 'all') {
        result = result.filter(item => item.category === activeCategory.value);
      }
      
      // 分页处理
      const startIndex = (currentPage.value - 1) * itemsPerPage;
      return result.slice(startIndex, startIndex + itemsPerPage);
    });

    // 总页数
    const totalPages = computed(() => {
      let count = newsItems.length;
      
      if (activeCategory.value !== 'all') {
        count = newsItems.filter(item => item.category === activeCategory.value).length;
      }
      
      return Math.ceil(count / itemsPerPage);
    });

    // 格式化日期
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    };

    // 获取分类名称
    const getCategoryName = (category) => {
      const categories = {
        'new-release': '新品发布',
        'event': '活动公告',
        'tips': '收藏攻略',
        'stories': '玩家故事'
      };
      return categories[category] || category;
    };

    // 模拟数据
    const newsItems = ref([
      {
        id: 1,
        title: '星际漫游系列盲盒即将上线，抢先了解隐藏款信息',
        excerpt: '备受期待的星际漫游系列盲盒将于下周五正式发售，本系列包含5款常规款和1款超稀有隐藏款...',
        image: 'https://picsum.photos/id/1/600/400',
        category: 'new-release',
        date: '2023-06-15',
        views: 1254
      },
      {
        id: 2,
        title: '夏日限定活动：购买任意盲盒即可参与抽奖',
        excerpt: '夏日炎炎，惊喜不断！即日起至7月31日，购买任意盲盒即可获得抽奖机会，100%中奖...',
        image: 'https://picsum.photos/id/2/600/400',
        category: 'event',
        date: '2023-06-10',
        views: 987
      },
      {
        id: 3,
        title: '盲盒收藏者必看：如何辨别正版与仿冒产品',
        excerpt: '随着盲盒热度上升，市场上出现了不少仿冒产品。本文将教你从细节处辨别正版与仿冒盲盒...',
        image: 'https://picsum.photos/id/3/600/400',
        category: 'tips',
        date: '2023-06-05',
        views: 2103
      },
      {
        id: 4,
        title: '从普通玩家到收藏达人：李明的盲盒故事',
        excerpt: '李明用两年时间收集了超过300个盲盒，其中不乏超稀有隐藏款。让我们听听他的收藏故事...',
        image: 'https://picsum.photos/id/4/600/400',
        category: 'stories',
        date: '2023-05-28',
        views: 1567
      },
      {
        id: 5,
        title: '森林精灵系列第二弹：新增3款神秘角色',
        excerpt: '深受欢迎的森林精灵系列将推出第二弹，除了原有角色外，将新增3款神秘角色...',
        image: 'https://picsum.photos/id/5/600/400',
        category: 'new-release',
        date: '2023-05-20',
        views: 1842
      },
      {
        id: 6,
        title: '端午节特别活动：限定款龙舟盲盒限时发售',
        excerpt: '为庆祝端午节，我们特别推出龙舟限定款盲盒，全球限量1000个，6月20日正式发售...',
        image: 'https://picsum.photos/id/6/600/400',
        category: 'event',
        date: '2023-05-15',
        views: 1321
      }
    ]);

    return {
      activeCategory,
      currentPage,
      filteredNews,
      totalPages,
      formatDate,
      getCategoryName
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
}

/* 页面容器 */
.news-container {
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

/* 资讯分类筛选 */
.news-filters {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
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

/* 资讯列表 */
.news-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

@media (min-width: 768px) {
  .news-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .news-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* 资讯卡片 */
.news-card {
  background-color: var(--white);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: transform 0.2s ease;
}

.news-card:hover {
  transform: translateY(-5px);
}

.news-image-container {
  position: relative;
  height: 180px;
}

.news-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.news-category {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background-color: var(--secondary-color);
  color: var(--white);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
}

.news-content {
  padding: 1.25rem;
}

.news-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--dark-color);
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

.news-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: var(--medium-gray);
  margin-bottom: 0.75rem;
}

.news-views {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.news-excerpt {
  font-size: 0.875rem;
  color: var(--dark-gray);
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.read-more-btn {
  background: none;
  border: none;
  color: var(--primary-color);
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: color 0.2s ease;
  padding: 0;
}

.read-more-btn:hover {
  color: var(--primary-color-light);
}

.read-more-btn i {
  font-size: 0.75rem;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 4rem 1rem;
}

.empty-state p {
  font-size: 1.125rem;
  color: var(--dark-gray);
  margin-bottom: 1.5rem;
}

.reset-btn {
  background-color: var(--primary-color);
  color: var(--white);
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.reset-btn:hover {
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