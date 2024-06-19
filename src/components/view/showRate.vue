<template>
  <el-rate
    v-model="rate"
    disabled
    show-score
    text-color="#ff9900"
    :score-template="scoreTemplate"
  />
</template>

<script setup>
import axiosapi from "@/plugins/axiosConfig";
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const movieId = route.query.movie;
const rate = ref(0);
console.log(movieId);

const getRating = async (id) => {
  const response = await axiosapi.get(`/comment?movieId=${id}`);
  rate.value = response.data.rate;
};

onMounted(async () => {
  await getRating(movieId);
});

const scoreTemplate = computed(() => `${rate.value} points`);
</script>

<style></style>
