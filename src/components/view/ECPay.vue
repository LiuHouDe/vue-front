<template>
</template>

<script setup>
import { useRoute } from 'vue-router'
const router = useRoute();
let form=router.query.form;
document.body.innerHTML=`${form}`;
allPayAPIForm.submit();
</script>

<style>

</style>