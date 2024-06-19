<template>
    <div>
    </div>
</template>

<script setup>
import { onMounted ,ref} from 'vue';
import { useRoute ,useRouter} from 'vue-router';
import axiosapi from '@/plugins/axiosConfig.js';
import Swal from 'sweetalert2';

onMounted(() => {
    const route = useRoute();
    const router = useRouter();
    const params = new URLSearchParams(window.location.search);
    const paymentId = route.query.paymentId;
    const payerId = route.query.PayerID;
    const orderId = ref('')
    orderId.value = params.get('orderId');
    if (!paymentId || !payerId) {
        Swal.fire('錯誤', '缺少付款參數', 'error');
        return;
    }
    const waitingAlert = Swal.fire({
        title: "請稍候...",
        text: "付款請求正在處理中，請不要離開此頁面。",
        icon: "info",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        onBeforeOpen: () => {
            Swal.showLoading();
        }
    });
    console.log(orderId)
    axiosapi.get(`/api/paypal/execute`, { params: { paymentId, PayerID: payerId ,orderId: orderId.value} })
        .then(response => {
            Swal.close();
            if (response.data.status === 'success') {
                Swal.fire({
                    title: '付款成功!',
                    text: '你的訂單已成功付款',
                    icon: 'success',
                    confirmButtonText: '查看訂單'
                }).then(result => {
                    if (result.isConfirmed) {
                        window.location.href=response.data.url;
                        
                    }
                });
            } else {
                Swal.fire('付款失敗', response.data.message, 'error');
            }
        })
        .catch(error => {
            console.error('付款請求失敗:', error);
            Swal.fire('系統錯誤', '處理付款失敗', 'error');
        });
});
</script>