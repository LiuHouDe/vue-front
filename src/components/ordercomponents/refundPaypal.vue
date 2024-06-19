<template>
    <div>
        <button @click="handleRefund">退款</button>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import axiosapi from '@/plugins/axiosConfig';
import Swal from 'sweetalert2';
import router from '@/router/router.js'
const props = defineProps(['orderId'])
const emits = defineEmits(['refundProcessed']);
const handleRefund = async () => {
    const id = props.orderId;
    console.log(props.orderId)
    const result = await Swal.fire({
        title: "確定退款?",
        text: "確定要退款嗎?一旦確認則不可回復。",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "確定退款",
        cancelButtonText: "取消",
        buttonsStyling: true,
    });
    if (!result.isConfirmed) {
        return;
    }
    try {
        const response = await axiosapi.post(`/api/paypal/refund?orderId=` + id);
        if (response.data.status === 'success') {
            Swal.fire({
                title: '退款成功!',
                text: '你的訂單已成功退款',
                icon: 'success',
                confirmButtonText: '查看訂單'
            }).then(result => {
                if (result.isConfirmed) {
                    router.push({ name: 'order-findOrder' });
                }
            });
        } else {
            Swal.fire('退款失敗', 'error');
        }
    } catch (error) {
        Swal.close()
        console.error('Error processing refund:', error);
        Swal.fire('退款請求發送失敗', 'error');
    }


};

defineExpose({
    handleRefund
});
</script>