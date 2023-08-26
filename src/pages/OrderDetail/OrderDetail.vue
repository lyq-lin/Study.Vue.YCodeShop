<template>
    <template v-if="OrderProduct === null">
        <span>加载订单...</span>
    </template>

    <template v-else>
        <h1>{{ OrderProduct.title }} 订单详情</h1>
        <h3>
            购买日期: {{ new Date(OrderProduct.dateTime).toLocaleDateString() }} {{ new
                Date(OrderProduct.dateTime).toLocaleTimeString() }}
        </h3>

        <div>
            <template v-for="product in OrderProduct.orderDetails" :key="product.productId">
                <div class="container">
                    <div class="image-wrapper">
                        <img :src="product.imageUrl" class="image" />
                    </div>

                    <div class="name">
                        <h3><a @click="ToDetail(product.productId)">{{ product.title }}</a></h3>
                        <span>套餐: {{ product.typeName }}</span>
                        <span>数量: {{ product.quantity }}</span>
                    </div>

                    <div class="product-price">
                        ￥{{ product.totalPrice }}
                    </div>

                </div>
            </template>

            <div class="product-price">
                ￥{{ OrderProduct.totalPrice }}
            </div>
        </div>
    </template>
</template>
  
<script setup>
import useOrder from "@/stores/useOrder";
import { useRoute, useRouter } from "vue-router";

const Order = useOrder();
const route = useRoute();
const router = useRouter();

function ToDetail(id) {
    router.push({
        path: `/detail/${id}`
    })
}

const OrderProduct = Order.getOrderDetailByOrderId(route.params.id);

</script>
  
<style scoped>
.container {
    display: flex;
    padding: 6px;
}

.image-wrapper {
    width: 150px;
    text-align: center;
}

.image {
    max-height: 150px;
    max-width: 150px;
    padding: 6px;
}

img:hover {
    transform: scale(1.1);
}

.name {
    flex-grow: 1;
    padding: 6px;
    margin-left: 20px;
}

.product-price {
    font-weight: 600;
    text-align: right;
}

a {
    color: purple;
    text-decoration: underline;
}

a:hover {
    text-decoration: none;
}
</style>