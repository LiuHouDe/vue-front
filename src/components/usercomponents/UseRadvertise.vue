<template>
    <el-carousel :interval="5000" arrow="hover" height="100vh" :initial-index="initialindex">
        <el-carousel-item v-for="item in moviePosters" :key="item.id">
            <img :src="item.posterUrl" :alt="item.title" style="width: auto; height: 100%" />
        </el-carousel-item>
    </el-carousel>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';

const initialindex =ref(0)


onBeforeMount(() => {
    initialindex.value= Math.floor(Math.random() * 5)
});

const moviePosters = [
    { id: 1, text: "Item1", posterUrl: "/userNavBar1.jpg" },
    { id: 2, text: "Item2", posterUrl: "/userNavBar2.jpg" },
    { id: 3, text: "Item3", posterUrl: "/userNavBar3.jpg" },
    { id: 4, text: "Item4", posterUrl: "/userNavBar4.jpg" },
    { id: 5, text: "Item5", posterUrl: "/userNavBar5.jpg" },
];


</script>

<style scoped></style>