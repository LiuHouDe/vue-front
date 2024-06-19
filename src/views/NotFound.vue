<template>
    <div class="limiter">
        <h3 class="errortext fs-1">404</h3>
        <h3 class="errortext">Page Not Found</h3>
        <div>
            <RouterLink class="btn btn-primary" :to="{ name: 'index-link' }">回首頁</RouterLink>
        </div>
    </div>
</template>
<script setup>


</script>
<style scoped>
.limiter {
    width: 100%;
    min-height: 93vh;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    padding: 15px;
    background: #272727;
}
.errortext{
    color: white
}
</style>