<template>
  <div class="not-found-container">
    <h1>404</h1>
    <p>Oops!你来到了知识的荒原...</p>
    <a href="/" class="back-link">带我回首页</a>
  </div>
</template>

<style scoped>
.not-found-container {
  text-align: center;
  padding: 100px 20px;
}
h1 {
  font-size: 4rem;
  font-weight: bold;
}
.back-link {
  display: inline-block;
  margin-top: 20px;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}
</style>