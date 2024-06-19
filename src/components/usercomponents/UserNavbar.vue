<template>
    <!-- 資料過少暫停使用 -->
    <el-col :span="24">
        <h5 class="mb-2 text-center">會員導覽</h5>
        <el-menu :default-active="currentPath" class="el-menu-vertical-demo" router>

            <el-menu-item index="/user/profile">
                <el-icon>

                </el-icon>
                <span>個人信息頁面</span>
            </el-menu-item>
            <el-menu-item index="/user/change-password">
                <el-icon>

                </el-icon>
                <span>修改密碼</span>
            </el-menu-item>
            <el-menu-item index="/user/profile/update">
                <el-icon>

                </el-icon>
                <span>修改會員資料</span>
            </el-menu-item>
        </el-menu>
    </el-col>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const currentPath = ref(route.path);

// 監聽path變化顯示 激活bar
watch(route, (newRoute) => {
    currentPath.value = newRoute.path;
});

</script>

<style scoped></style>
