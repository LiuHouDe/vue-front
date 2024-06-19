<template>
  <div >
  <div>
    <el-carousel :interval="5000" arrow="hover" height="650px">
      <el-carousel-item v-for="item in moviePosters" :key="item.id">
        <img
          :src="item.posterUrl"
          :alt="item.text"
          style="width: 100%; height: 100%"
        />
      </el-carousel-item>
    </el-carousel>
  </div>
  <h2 style="font-size: 28px; margin-top: 20px; margin-left: 20px">
    <strong>熱門強檔</strong>
  </h2>
  <div class="movie">
    <div v-for="item in movie" :key="item.id" class="movie-item">
      <img :src="item.posterUrl" :alt="item.text" class="movie-poster" />
    </div>
  </div>

  <section class="note">
    <h2 style="font-size: 28px"><strong>最新公告</strong></h2>
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item title="會員出示APP QR Code方享各項優惠折扣" name="1">
        <div class="collapse-content">
          會員於購票、點餐 提前開啟APP出示QR Code 方享各項會員優惠折扣
        </div>
      </el-collapse-item>
      <el-collapse-item
        title="本場所全面禁菸!室內工作及公共場所全面禁菸!違者最高罰1萬元"
        name="2"
      >
        <div class="collapse-content">
          這是影城公告的內容。您可以在這裡添加更多詳細信息。
        </div>
      </el-collapse-item>
      <el-collapse-item title="影廳內嚴禁拍照、錄影、錄音" name="3">
        <div class="collapse-content">
          戲院影廳內 嚴禁拍照、錄音、錄影（含電影正片、片尾）
          任何未經授權之攝錄行為 已觸犯著作權法第91條 最高可處5年有期徒刑
        </div>
      </el-collapse-item>
      <el-collapse-item title="反詐騙宣導" name="4">
        <div class="collapse-content">
          若您接獲可疑電話訊息，請立即掛斷，並通報165反詐騙諮詢電話。
          凡有任何疑慮，歡迎致電各影城專線查證
        </div>
      </el-collapse-item>
    </el-collapse>
  </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const activeNames = ref(["1"]);
const handleChange = (val: string[]) => {
  console.log(val);
};
const photoURL = import.meta.env.VITE_END_URL + "/backstage/movie/photo/";

const moviePosters = [
  { id: 1, text: "Item 1", posterUrl: "/homepage.jpg" },
  { id: 2, text: "Item2", posterUrl: "/homepage.jpeg" },
  { id: 3, text: "Item2", posterUrl: "/index.jpg" },
  { id: 4, text: "Item2", posterUrl: "/index1.jpg" },
  { id: 5, text: "Item2", posterUrl: "/index.png" },
  { id: 6, text: "Item2", posterUrl: "/index1.webp" },
  { id: 7, text: "Item2", posterUrl: "/home.jpg" },
];

const movie = [
  { id: 2, text: "Item2", posterUrl: photoURL + 6 },
  { id: 3, text: "Item2", posterUrl: photoURL + 3 },
  { id: 4, text: "Item2", posterUrl: photoURL + 4 },
  { id: 5, text: "Item2", posterUrl: photoURL + 5 },
  { id: 6, text: "Item2", posterUrl: photoURL + 1 },
  { id: 7, text: "Item2", posterUrl: photoURL + 2 },
];
</script>

<style scoped>
.movie {
  display: flex;
  overflow-x: auto;
  gap: 20px;
  padding: 20px 0;
  justify-content: space-between;
}
.movie-item {
  flex: 0 0 auto;
}
.movie-poster {
  width: 250px;
  height: 360px;
  display: block;
  object-fit: cover;
}
.note {
  flex: 1;
  padding-left: 20px;
  min-width: 300px;
  margin-top: 20px;
}

.collapse-content {
  padding: 10px 0;
}
.el-button {
  margin-top: 20px;
}
</style>
