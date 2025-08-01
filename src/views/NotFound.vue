<template>
  <div class="not-found-container">
    <div class="error-code">404</div>
    <h1 class="error-title">页面未找到</h1>
    <p class="error-message">抱歉，您访问的页面不存在或已被移除</p>
    <div class="error-actions">
      <button @click="$router.push('/')" class="home-btn">
        返回首页
      </button>
      <button @click="$router.go(-1)" class="back-btn">
        返回上一页
      </button>
    </div>
    <div class="error-image">
      <img src="https://picsum.photos/id/338/600/400" alt="页面未找到插图" class="illustration">
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
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
  --dark-color: #1f2937;
  --light-gray: #f3f4f6;
  --dark-gray: #4b5563;
  --white: #ffffff;
}

/* 页面容器 */
.not-found-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  text-align: center;
  background-color: var(--light-gray);
}

/* 错误代码 */
.error-code {
  font-size: 6rem;
  font-weight: 900;
  color: var(--primary-color);
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
  position: relative;
}

.error-code::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 6px;
  background-color: var(--primary-color);
  border-radius: 3px;
}

/* 错误标题 */
.error-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--dark-color);
  margin-bottom: 1rem;
  margin-top: 2rem;
}

/* 错误信息 */
.error-message {
  font-size: 1.125rem;
  color: var(--dark-gray);
  max-width: 600px;
  margin-bottom: 2.5rem;
  line-height: 1.6;
}

/* 操作按钮 */
.error-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
}

.home-btn {
  background-color: var(--primary-color);
  color: var(--white);
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.home-btn:hover {
  background-color: var(--primary-color-light);
}

.back-btn {
  background-color: var(--white);
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background-color: var(--primary-color);
  color: var(--white);
}

/* 错误图片 */
.error-image {
  max-width: 600px;
  width: 100%;
}

.illustration {
  width: 100%;
  border-radius: 1rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}
</style>
    