import Ticket from "@/components/view/BuyTickets.vue"
import Screening from "@/components/view/FindScreening.vue"
import Booking from "@/components/view/Booking.vue"
import OrderCompleted from "@/components/view/OrderCompleted.vue"
import ecpay from "@/components/view/ECPay.vue"
import ECPayOrderCompleted from "@/components/view/ECPayOrderCompleted.vue"
import FindOrder from "@/components/view/FindOrder.vue"
import FindOrderDetail from "@/components/view/FindOrderDetail.vue"
import Test from "@/components/view/test.vue"
import PaymentSuccess from "@/components/ordercomponents/PaymentSuccess.vue"
import refundPaypal from "@/components/ordercomponents/refundPaypal.vue"

export default[
    {name:'order-ticket',path: '/order/showtimes', component: Ticket },
    {name:'order-screening',path: '/order/screening',component:Screening},
    {name:'order-booking',path:'/order/booking',component:Booking},
    {name:'order-complete',path:'/order/complete',component:OrderCompleted},
    {name:'order-ecpay',path:'/order/ecpay',component:ecpay},
    {name:'order-ecpay-complete',path:'/order/ecpay-complete',component:ECPayOrderCompleted},
    {name:'order-findOrder',path:'/order/findOrder',component:FindOrder},
    {name:'order-findOrderDetail',path:'/order/findOrderDetail',component:FindOrderDetail},
    {name:'order-test',path:'/order/test',component:Test},
    {name:'payment-success',path: '/order/paymentsuccess',component: PaymentSuccess},
    {name: 'refund-paypal-link', path: '/order/refundpaypal' , component: refundPaypal},
]