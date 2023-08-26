import axios from "axios";
import { defineStore } from "pinia";

const BASE_URL = "http://43.143.170.48:5172/"

const useOrder = defineStore("Order", {
    state: () => ({
        Order: [],
        OrderDetails: []
    }),
    getters: {
        getOrderDetailByOrderId(state) {
            return orderId => {
                return state.Order.find(item => item.orderId === orderId)
            }
        },
    },
    actions: {
        async getOrder() {
            const result = await axios.get(BASE_URL + 'api/Order/GetOrders').then(res => {
                return res.data.data
            })

            return result;
        },
        async getOrderDetails(orderId) {
            const result = await axios.get(BASE_URL + 'api/Order/GetOrderDetail/' + orderId).then(res => {
                return res.data.data
            })

            return result;
        }
    }
});

export default useOrder;