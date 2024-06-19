<template>
    <div>
        <h1>付款頁面TEST</h1>
        <form @submit.prevent="handlePayment">
            <input type="text" v-model="payment.total" placeholder="輸入金額" />
            <input type="text" v-model="payment.currency" placeholder="貨幣類型 預設USD）" />
            <button type="submit">通過Paypal付款</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axiosapi from '@/plugins/axiosConfig.js';
import Swal from 'sweetalert2';  


const payment = ref({
    total: 0,   // 金額
    currency: 'TWD'  // 貨幣
});

const handlePayment = async () => {
    
    try {
        const response = await axiosapi.post('/api/paypal/pay', payment.value);
        if (response.data) {
            window.location.href = response.data; 
        } else {
            alert('付款請求失敗');  
        }
    } catch (error) {  
        alert('付款請求失敗');  
    }
}

</script>
