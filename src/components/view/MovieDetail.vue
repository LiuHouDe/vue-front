<template>
  <div>
    <div class="movieContainer" v-for="movies in movieList" :key="movies.id">
      <figure>
        <img :src="photoURL + movies.id" alt="" class="moviePoster" />
        <figcaption class="view">
          <RouterLink :to="{ name: 'order-ticket' }"
            ><el-button color="#c52726" plain style="width: 250px"
              >立即訂票</el-button
            ></RouterLink
          >
        </figcaption>
      </figure>
      <section class="movieInfo" v-bind="movies">
        <div class="titleArea">
          <h1 style="font-size: 32px">{{ movies.name }}</h1>
          <p style="font-family: monospace; font-size: 18px">
            <em>{{ movies.name_eng }}</em>
          </p>
          <time> 上映日期：{{ movies.releaseDate.substring(0, 10) }} </time>
          <h3
            style="
              padding-top: 15px;
              font-family: Arial;
              font-size: 26px;
              color: #ccc;
              font-weight: 400;
              margin: 10px 0;
            "
          >
            MOVIE INFO
          </h3>

          <h3 style="margin-bottom: 5px">導演：{{ movies.director }}</h3>
          <!-- <h3 style="padding-top: 8px">演員：{{ movies.actors }}</h3> -->
          類型:
          <span
            v-for="option in optionCategory"
            :key="option.id"
            style="margin-top: 5px"
          >
            <span
              v-if="movies.category.includes(option.code)"
              style="margin-left: 10px"
            >
              {{ option.categoryContent }},
            </span>
          </span>

          <div
            v-for="option in optionsRated"
            :key="option.id"
            style="margin-top: 5px"
          >
            <h3 v-if="movies.rated.includes(option.code)">
              分級： {{ option.context }}
            </h3>
          </div>

          <h3 style="padding-top: 8px">片長：{{ movies.duration }}分鐘</h3>

          <h3 style="padding-top: 8px">
            電影簡介:<br />{{ movies.description }}
          </h3>
        </div>
      </section>
      <showRate></showRate>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import Swal from "sweetalert2";
import showRate from "../view/showRate.vue";
import axiosapi from "@/plugins/axiosConfig.js";

const optionCategory = ref(null);
const optionsRated = ref(null);
const route = useRoute();
const movieId = route.query.movie;
const movieList = ref([]);
const photoURL = import.meta.env.VITE_END_URL + "/backstage/movie/photo/";
console.log(movieList);
const loadMovie = () => {
  fetch(import.meta.env.VITE_END_URL + `/backstage/movie/${movieId}`)
    .then((res) => {
      if (res.status === 500) {
        Swal.fire({
          icon: "error",
          title: "載入失敗",
        });
        return {};
      }
      return res.json();
    })
    .then((res) => {
      movieList.value = res.list || [];
    });
};

function findRated() {
  axiosapi
    .get("/backstage/movie/ratedlist")
    .then(function (response) {
      console.log("rated", response);
      optionsRated.value = response.data.ratedlist;
      console.log("rated", optionsRated.value);
    })
    .catch(function (error) {
      console.log("callFind error", error);
    });
}
function findCategory() {
  axiosapi
    .get("/backstage/movie/categorylist")
    .then(function (response) {
      console.log("cate", response);
      optionCategory.value = response.data.categorylist;
    })
    .catch(function (error) {
      console.log("callFind error", error);
    });
}
onMounted(loadMovie);

onMounted(findCategory);
onMounted(findRated);

console.log("optionCategory:", optionCategory.value);
</script>
<style scoped>
.body {
  background-color: black;
}
.movieContainer {
  display: flex;
  align-items: flex-start;
}

img {
  width: 250px;
  height: 360px;
}
figure {
  border: 1px solid;
  margin-right: 20px;
  width: 250px;
  height: 360px;
}

.movieInfo {
  flex: 1;
  padding-left: 5%;
  text-align: left;
  flex-direction: column;
}

.titleArea {
  text-align: left;
}

.moviePoster {
  max-width: 400px;
}
</style>
