<template>
    <div class="container">
        <h3>資料處理中請稍後</h3>

    </div>
</template>


<script setup>
import { onMounted } from 'vue'
import { useRoute ,useRouter} from 'vue-router';
import axiosapi from "@/plugins/axiosConfig.js";
import Swal from 'sweetalert2';


const route = useRoute();
const router = useRouter();
const Toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
});







onMounted(function () {
    changeUserVerify();
})




function changeUserVerify() {
    axiosapi.put(`/user/pass/verify-email/${route.params.token }`,null).then((response) => {
        if (!response.data.success) {
            Swal.fire({
                text: response.data.message,
                icon: 'error',
                allowOutsideClick: false,
                confirmButtonText: '確認',
            }).then(function (result) {
                if (result.isConfirmed) {
                    router.push({ path: '/login' })
                }
            })
        }else{
            Toast.fire({
                icon: "success",
                title: response.data.message
            })
            router.push({ path: '/login' })
        }
        
    }).catch((error)=>{
        console.log(error)
    })
}








</script>

<style scoped></style>