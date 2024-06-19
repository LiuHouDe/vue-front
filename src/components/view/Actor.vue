<template>
  <h2>演員名單</h2>
  <div class="demo-type">
    <div v-for="pic in pics" :key="pic.id" class="actor-item">
      <el-avatar :size="100" :src="pic.image" />
      <div>{{ pic.text }}</div>
    </div>
  </div>
</template>

<script setup>
/* 演員資訊 */
const pics = [
  { id: 1, text: "Alex", image: "/public/test.png" },
  { id: 2, text: "BOb", image: "/public/act1.png" },
  { id: 3, text: "caaa", image: "/public/film_20240327014.jpg" },
  { id: 3, text: "bibi", image: "/public/film_20240327014.jpg" },
  { id: 3, text: "show", image: "/public/film_20240327014.jpg" },

  { id: 3, text: "Item2", image: "/public/film_20240327014.jpg" },
  { id: 3, text: "Item2", image: "/public/film_20240327014.jpg" },
];
</script>

<style scoped>
.demo-type {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.actor-item {
  text-align: center;
  padding: 5px; /* 加入間距，讓圖片與文字之間有空間 */
}

/* 移除最後一個子元素的右邊框 */
.actor-item:last-child {
  border-right: none;
}
</style>
