<template>
    <div class="limiter">
    <el-row :span="24">
     <el-col :span="4">
        <UseRadvertise></UseRadvertise>
      </el-col>
    <el-col :span="16"> 
    <div class="div1">
        <h6>請選擇要預訂的座位</h6>
        <h5 class="h5-1">電影名：{{ movieName }}</h5>
        <h5 class="h5-2">開始時間：{{ movieTime }}</h5>
        <h5 class="h5-3">電影廳次：第{{ auditoriumNumber }}廳</h5>
        <div class="div2">購買票數：共<select @change="countMax">
                <option :value=1>1</option>
                <option :value=2>2</option>
                <option :value=3>3</option>
                <option :value=4>4</option>
                <option :value=5>5</option>
            </select>張</div>
        <div class="div3">付款方式：<select @change="paymentMethod">
                <option value='linePay'>LINEPay</option>
                <option value='ecPay'>ECPay</option>
                <option value='paypal'>paypal</option>
            </select>
        </div>
        <img src="/public/SeatScreen.png" />
        <table>
            <tr v-for="tr in movieShowtimes">
                <td v-for="td in tr">
                    <img :id="td.Ticket_id" v-if="td.is_available == '未售出'" src="/public/standard_available.png"
                        data-mytype=0 @click="addTicket" />
                    <img :id="td.Ticket_id" v-else-if="td.is_available == '已售出'" src="/public/sold.png" />
                </td>
            </tr>
        </table>
        <div>
            <button @click="payment" type="button" class="button1">付款</button>
            <button @click="reset" type="button" class="button2">重置</button>
        </div>
    </div>
</el-col>
    <el-col :span="4">
        <UseRadvertise></UseRadvertise>
    </el-col>
</el-row>
</div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import axiosApi from '@/plugins/axiosConfig.js';
import Swal from 'sweetalert2'
import Advertise from '../ordercomponents/Advertise.vue';
import UseRadvertise from '../usercomponents/UseRadvertise.vue';

const Toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
});


const route = useRoute();
const router = useRouter();
const screeningId = ref('');
const movieShowtimes = ref('');
const images = ref('');
// let movieId = ref('');
let movieName = '';
let movieTime = '';
let auditoriumNumber = '';
let queue = [];
let details = {
    "ticketId": queue,
    "movieId": -1,
    "paymentOptions": 'linePay',
    "userId": sessionStorage.getItem("id")
}; //測試用 2 3 
let count = 0;
let currentIndex = -1;
let max = 1;


images.value = [{ src: "/standard_available.png", },
{ src: "/standard_selected.png", }]
// const movieTime=ref('');
screeningId.value = route.query.screeningId;

axiosApi.get("/order/movie/tickets?screeningId=" + screeningId.value).then(function (response) {
    movieShowtimes.value = response.data.tickets;
    let outerArray = [];
    let innerArray = [];
    let length = movieShowtimes.value.length;
    movieName = movieShowtimes.value[0].name;
    movieTime = movieShowtimes.value[0].Start_time;
    auditoriumNumber = movieShowtimes.value[0].auditorium_number;
    details.movieId = movieShowtimes.value[0].movie_id;
    // movieId.value=movieShowtimes.value[0].movie_id;
    for (let i = 1; i <= length; i++) {
        innerArray.push(movieShowtimes.value[i - 1]);
        if (i % 18 == 0) {
            outerArray.push(innerArray.slice(i - 18, i + 1));
            continue;
        }
        if (i == length) {
            outerArray.push(innerArray.slice((i - length / 18), i + 1));
        }
    }
    movieShowtimes.value = outerArray;
}).catch(function (response) {
    console.log(response);
})

function addTicket(event) {
    if ((queue.indexOf(parseInt(event.target.id)) != -1)) {
        return;
    }
    let condition = parseInt(document.getElementById(event.target.id).getAttribute("data-mytype"));
    if (count < max) {
        document.getElementById(event.target.id).src = images.value[(condition + 1) % images.value.length].src;
        document.getElementById(event.target.id).setAttribute("data-mytype", 1);
        queue[++currentIndex] = parseInt(event.target.id);
        count++;
        return;
    }
    currentIndex = (++currentIndex) % queue.length;
    document.getElementById(queue[currentIndex]).src = images.value[0].src;
    document.getElementById(queue[currentIndex]).setAttribute("data-mytype", 0);
    queue[currentIndex] = parseInt(event.target.id);
    document.getElementById(event.target.id).src = images.value[(condition + 1) % images.value.length].src;
    document.getElementById(event.target.id).setAttribute("data-mytype", 1);
}

function payment() {
    if (queue.length == 0) {
        Toast.fire({
            icon: "error",
            title: "請選擇座位！"
        });
        return;
    }
    if (max != queue.length) {
        Toast.fire({
            icon: "error",
            title: "請選擇完座位！"
        });
        return;
    }
    axiosApi.post("/order/movie/booking", details).then(function (response) {
        if (details.paymentOptions == 'linePay') {
            window.open(response.data, '_self');
        }
        if (details.paymentOptions == 'ecPay') {
            router.push({ path: "/order/ecpay", query: { form: response.data } });
        }
        if (details.paymentOptions == 'paypal') {
            window.location.href = response.data
        }
    }).catch(function (response) {
        console.log(response);
    });
}

function reset() {
    for (let i = 0; i < queue.length; i++) {
        document.getElementById(queue[i]).src = images.value[0].src;
        document.getElementById(queue[i]).setAttribute("data-mytype", 0);
    }
    queue.length = 0;
    count = 0;
    currentIndex = -1;
}

function countMax(event) {
    for (let i = 0; i < queue.length; i++) {
        document.getElementById(queue[i]).src = images.value[0].src;
        document.getElementById(queue[i]).setAttribute("data-mytype", 0);
    }
    queue.length = 0;
    count = 0;
    currentIndex = -1;
    max = event.target.value;
}

function paymentMethod(event) {
    details.paymentOptions = event.target.value;
}

</script>

<style scoped>
td {
    padding: 5px;
}
.div1 {
    width: 900px;
    /* height: 900px; */
    margin: 0 auto;
    margin-top: 30px;
}

table {
    margin: 0 auto;
    margin-top: 50px;
    margin-bottom: 50px;
}

.td1 {
    padding-left: 10px;
}

.h5-1 {
    margin-left: 30px;
    margin-bottom: 3px;
}

.h5-2 {
    margin-left: 30px;
    margin-bottom: 3px;
}

.h5-3 {
    margin-left: 30px;
    margin-bottom: 3px;
}

h6 {
    margin-left: 30px;
    font-size: 30px;
    font-weight: bold;
    margin-bottom: 20px;
}

.button1 {
    float: right;
    /* margin-top: 20px; */
    margin-right: 50px;
}

.button2 {
    float: right;
    /* margin-top: 20px; */
}

.div2 {
    margin-left: 30px;
}

.div3 {
    margin-left: 30px;
    margin-bottom: 20px;
}
.limiter {
  width: 100%;
  min-height: 88vh;
  /* display: flex; */
  /* flex-wrap: wrap; */
}
</style>