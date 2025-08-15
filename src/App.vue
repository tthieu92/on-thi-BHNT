<template>
  <div class="app-shell">
    <header class="topbar">
      <h1>Thi Thử Bảo Hiểm Trực Tuyến</h1>
      <p class="subtitle">Chọn đề để bắt đầu — không cần đăng nhập</p>
    </header>
    <main class="main">
      <router-view />
    </main>
    <footer class="footer">Design by Hiếu Tea viết cho Uyên lợn lười học</footer>
  </div>
</template>

<script setup>

</script>
<style scoped>
  footer {
      margin: 0;
      font-size: 14px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      vertical-align: auto;
      text-align: center;
      padding: 8px;
  }
</style>
