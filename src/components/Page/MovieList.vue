<template>
  <div style="background-color: #272727;color: white;">
  <div class="movie-list-header">
    電影列表<input
      type="text"
      @change="callFind"
      v-model="name"
      maxlength="12"
      @keypress.enter="callFind"
      placeholder="輸入以查詢電影"
      style="width: 200px; height: 30px; margin-left: auto; margin-bottom: 0px"
    />
  </div>
  <div class="contain">
    <div v-for="movie in movies" :key="movie.id" class="info">
      <RouterLink :to="{ name: 'MovieD-link', query: { movie: movie.id } }">
        <img
          :src="photoURL + movie.id"
          alt="Movie Poster"
          :id="movie.id"
          :value="movie.id"
          @click="click1"
        />
      </RouterLink>
      <div class="movietext">
        <h2>{{ movie.name }}</h2>
        <p>{{ movie.name_eng }}</p>
        <h2 class="release-date">
          {{ formatDate(movie.releaseDate) }}
        </h2>
      </div>
    </div>
  </div>

  <div class="pagination-container">
    <Paginate
      v-show="pages !== 0"
      first-button-text="&lt;&lt;"
      last-button-text="&gt;&gt;"
      prev-text="&lt;"
      next-text="&gt;"
      :first-last-button="true"
      :page-count="pages"
      :initial-page="current"
      :click-handler="callFind"
      v-model="current"
    >
    </Paginate>
  </div>
</div>
</template>

<script setup lang="ts">
import axiosapi from "@/plugins/axiosConfig.js";
import Swal from "sweetalert2";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Paginate from "vuejs-paginate-next";
import UseRadvertise from '../usercomponents/UseRadvertise.vue';


const movies = ref([]);
const pages = ref(100); //最多需要幾個分頁
const current = ref(1); // 目前分頁
const rows = ref(12); //一頁幾筆
const total = ref(0); // total number of movies
const start = ref(0); //起始位置
const sort = ref(null);
const name = ref(null);

const photoURL = import.meta.env.VITE_END_URL + "/backstage/movie/photo/";
const route = useRouter();

function callFind(page) {
  Swal.fire({
    text: "Loading......",
    showConfirmButton: false,
    allowOutsideClick: false,
  });

  if (page) {
    if (page > 1) {
      start.value = page - 1;
    } else {
      start.value = 0;
    }
    current.value = page;
  } else {
    start.value = 0;
    current.value = 1;
  }
  let data = {
    start: start.value,
    rows: rows.value,
    order: sort.value,
    name: name.value,
  };

  axiosapi
    .post("/backstage/movie/find", data)
    .then((res) => {
      movies.value = res.data.list;
      //page start
      total.value = res.data.count;
      pages.value = Math.ceil(total.value / rows.value);
      //page end

      setTimeout(function () {
        Swal.close();
      }, 100);
    })
    .catch((error) => {
      Swal.close();
      console.error("Error fetching movies:", error);
    });
}

const loadMovies = () => {
  callFind(current.value);
};

const formatDate = (dateString: string) => {
  return dateString ? dateString.substring(0, 10) : "";
};

onMounted(() => {
  loadMovies();
});

function click1(event) {
  route.push({
    name: "MovieD-link",
    query: { movie: event.target.id },
  });
}
</script>

<style scoped>

.movie-list-header {
  margin-left: 200px;
  margin-right: 200px;
  font-size: 24px;
  padding: 10px 0;
  border-bottom: 1px solid #ccc;
  justify-content: space-between;
  display: flex;
}

.contain {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1em;
  padding-top: 2em;
  margin-right: 250px;
  margin-left: 250px;
  min-height: 300px; /* Ensures minimum height */
}

.info {
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s;
  box-sizing: border-box;
}

.info:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.movietext {
  text-align: left;
  width: 100%;
}

p {
  font-size: 15px;
  text-align: left;
}

.release-date {
  font-size: 15px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px 0;
}

@media (max-width: 1200px) {
  .contain {
    margin-right: 100px;
    margin-left: 100px;
  }
}

@media (max-width: 768px) {
  .contain {
    margin-right: 50px;
    margin-left: 50px;
  }
}

@media (max-width: 576px) {
  .contain {
    margin-right: 20px;
    margin-left: 20px;
  }
}
</style>
