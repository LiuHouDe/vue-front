<template>
  <!-- 劇照輪播 -->
  <h2>精彩剪輯</h2>
  <el-carousel :interval="4000" type="card" height="300px">
    <el-carousel-item v-for="item in photos" :key="item.id">
      <img
        :src="`data:image/jpeg;base64,${item.picture}`"
        alt="carousel item image"
        style="width: 100%; height: 100%"
      />
      <h3>{{ item.title }}</h3>
    </el-carousel-item>
  </el-carousel>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axiosapi from "@/plugins/axiosConfig";

const route = useRoute();
const id = route.query.movie;
const photos = ref([]);

onMounted(() => {
  findPhotos();
});

function findPhotos() {
  axiosapi
    .get(`/moviePicture/${id}`)
    .then((res) => {
      photos.value = res.data;
    })
    .catch((error) => {
      console.error("Error fetching photos:", error);
    });
}
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
