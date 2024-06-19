<script setup>
import Navbar from "./components/view/Navbar.vue";
import "bootstrap/dist/css/bootstrap.min.css";

import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Footer from "./components/view/Footer.vue";
import { nextTick, provide, ref } from "vue";

//透過Prop 跟 Inject 控制顯示//
const isRouterAlive = ref(true);
provide("relode", relode);
function relode() {
  isRouterAlive.value = false;
  nextTick(() => (isRouterAlive.value = true));
}

</script>

<template>
  <div class="navbar-wrapper">
    <Navbar v-if="isRouterAlive"></Navbar>
  </div>
  <RouterView></RouterView>
  <Footer></Footer>
</template>

<style></style>
