<script setup>
import MovieDetail from "../view/MovieDetail.vue";
import Stagephoto from "../view/Stagephoto.vue";
import Actor from "../view/Actor.vue";
import showComment from "../view/showComment.vue";
import showRate from "../view/showRate.vue";
</script>

<template>
  <div style="background-color:#272727 ;color: white">
  <div class="MD">
    <MovieDetail></MovieDetail>
  </div>

  <div class="Sp">
    <Stagephoto></Stagephoto>
  </div>
  <!-- <div class="Sp">
    <Actor></Actor> -->
  <!-- </div> -->
  <div class="Sp">
    <showComment></showComment>
  </div>
</div>
</template>

<style scoped>
@media (min-width: 1024px) {
  .logo {
    margin: 0 2rem 0 0;
  }
}
.body {
  background-color: black;
}
.MP {
  float: left;
}
.MD {
  margin-left: 150px;
  margin-right: 150px;

  padding-top: 2%;
  padding-left: 50px;
  text-align: center;
  margin-top: 30px;
  position: relative;
  display: inline-block;
  width: 80%;
  margin-bottom: 40px;
}
.Sp {
  margin-left: 150px;
  margin-right: 150px;

  padding-top: 2%;
  padding-left: 50px;
  text-align: center;
  margin-top: 30px;
  position: relative;
  display: inline-block;
  width: 80%;
  margin-bottom: 40px;
}
</style>
