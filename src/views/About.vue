<template>
  <div class="about-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>关于我们</h1>
      <p>了解MysteryBox的故事和理念</p>
    </div>

    <!-- 品牌故事 -->
    <section class="brand-story">
      <div class="story-content">
        <h2>品牌故事</h2>
        <p>MysteryBox成立于2020年，源于对收藏文化和惊喜体验的热爱。我们相信每个盲盒都应该是独一无二的艺术品，承载着设计师的创意和收藏者的期待。</p>
        <p>从最初的小型工作室到如今拥有多个原创系列的盲盒品牌，我们始终坚持品质与创意并重，为收藏者带来一次次惊喜体验。</p>
      </div>
      <div class="story-image">
        <img src="https://picsum.photos/id/65/600/400" alt="品牌故事图片" class="main-image">
        <img src="https://picsum.photos/id/68/300/300" alt="品牌故事装饰图" class="decor-image">
      </div>
    </section>

    <!-- 团队介绍 -->
    <section class="team-section">
      <h2 class="section-title">我们的团队</h2>
      <div class="team-grid">
        <div class="team-member">
          <img src="https://picsum.photos/id/1005/200/200" alt="团队成员" class="member-photo">
          <h3>李明</h3>
          <p class="member-role">创始人 & CEO</p>
        </div>
        <div class="team-member">
          <img src="https://picsum.photos/id/1011/200/200" alt="团队成员" class="member-photo">
          <h3>张华</h3>
          <p class="member-role">首席设计师</p>
        </div>
        <div class="team-member">
          <img src="https://picsum.photos/id/1012/200/200" alt="团队成员" class="member-photo">
          <h3>王芳</h3>
          <p class="member-role">市场总监</p>
        </div>
        <div class="team-member">
          <img src="https://picsum.photos/id/1025/200/200" alt="团队成员" class="member-photo">
          <h3>赵伟</h3>
          <p class="member-role">产品经理</p>
        </div>
      </div>
    </section>

    <!-- 联系我们 -->
    <section class="contact-section">
      <h2 class="section-title">联系我们</h2>
      <div class="contact-container">
        <div class="contact-info">
          <p class="contact-item">
            <i class="fa fa-map-marker"></i>
            <span>南京市鼓楼区汉口路9号</span>
          </p>
          <p class="contact-item">
            <i class="fa fa-phone"></i>
            <span>400-888-8888</span>
          </p>
          <p class="contact-item">
            <i class="fa fa-envelope"></i>
            <span>contact@mysterybox.com</span>
          </p>
          <p class="contact-item">
            <i class="fa fa-clock-o"></i>
            <span>周一至周日 9:00-21:00</span>
          </p>
        </div>
        <div class="contact-form">
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="name">您的姓名</label>
              <input type="text" id="name" v-model="name" required class="form-input">
            </div>
            <div class="form-group">
              <label for="email">电子邮箱</label>
              <input type="email" id="email" v-model="email" required class="form-input">
            </div>
            <div class="form-group">
              <label for="message">留言内容</label>
              <textarea id="message" v-model="message" rows="4" required class="form-textarea"></textarea>
            </div>
            <button type="submit" class="submit-btn">发送留言</button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'About',
  setup() {
    const name = ref('');
    const email = ref('');
    const message = ref('');

    const handleSubmit = () => {
      alert(`感谢您的留言，${name.value}！我们会尽快回复您。`);
      name.value = '';
      email.value = '';
      message.value = '';
    };

    return {
      name,
      email,
      message,
      handleSubmit
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
.about-container {
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

/* 品牌故事 */
.brand-story {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 4rem;
}

@media (min-width: 768px) {
  .brand-story {
    flex-direction: row;
  }
  
  .story-content {
    flex: 1;
    padding-right: 2rem;
  }
  
  .story-image {
    flex: 1;
  }
}

.story-content h2 {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--dark-color);
  margin-bottom: 1.5rem;
}

.story-content p {
  font-size: 1rem;
  color: var(--dark-gray);
  line-height: 1.7;
  margin-bottom: 1.25rem;
}

.story-image {
  position: relative;
  height: 300px;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 1rem;
  box-shadow: var(--shadow);
}

.decor-image {
  position: absolute;
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 0.5rem;
  box-shadow: var(--shadow);
  border: 4px solid var(--white);
  bottom: -20px;
  right: 20px;
}

/* 团队介绍 */
.team-section {
  margin-bottom: 4rem;
}

.section-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--dark-color);
  text-align: center;
  margin-bottom: 2.5rem;
}

.team-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 640px) {
  .team-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .team-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.team-member {
  text-align: center;
}

.member-photo {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto 1rem;
  border: 4px solid var(--light-gray);
}

.team-member h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--dark-color);
  margin-bottom: 0.25rem;
}

.member-role {
  font-size: 0.875rem;
  color: var(--dark-gray);
}

/* 联系我们 */
.contact-section {
  margin-bottom: 2rem;
}

.contact-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

@media (min-width: 768px) {
  .contact-container {
    flex-direction: row;
  }
  
  .contact-info {
    flex: 1;
  }
  
  .contact-form {
    flex: 1;
  }
}

.contact-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  color: var(--dark-gray);
  font-size: 1rem;
}

.contact-item i {
  color: var(--primary-color);
  margin-right: 0.75rem;
  margin-top: 0.25rem;
  width: 1.25rem;
  text-align: center;
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
  font-size: 0.875rem;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--medium-gray);
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-textarea {
  resize: vertical;
}

.submit-btn {
  background-color: var(--primary-color);
  color: var(--white);
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.submit-btn:hover {
  background-color: var(--primary-color-light);
}
</style>