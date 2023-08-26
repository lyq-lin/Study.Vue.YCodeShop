<template>
  <h1>订单中心</h1>

  <template v-if="OrderProduct.length <= 0">
    <h3>您当前尚未购物</h3>
  </template>
  <template v-else>
    <template v-for="order in OrderProduct" :key="order.orderId">
      <div class="container">
        <div class="image-wrapper">
          <img class="image" :src="order.imageUrl" :alt="order.title">
        </div>

        <div class="details">
          <h4>{{ order.title }}</h4>

          <span>
            {{ new Date(order.dateTime).toLocaleDateString() }} {{ new Date(order.dateTime).toLocaleTimeString() }}
          </span>

          <br>

          <a @click="ToDetail(order.orderId)">
            查看详情
          </a>
        </div>

        <div class="order-price">￥{{ order.totalPrice }}</div>
      </div>
    </template>
  </template>
</template>

<script setup>
import useAuthenticationState from "@/hook/auth/useAuthenticationState";
import useOrder from "@/stores/useOrder"
import useProductList from "@/stores/useProductList"
import { onMounted, reactive, ref } from "vue"
import { useRouter } from "vue-router";

const ProductList = useProductList();
const Order = useOrder();

const OrderProduct = ref([])

const router = useRouter();

function ToDetail(id) {
  router.push({
    path: `/order-detail/${id}`
  })
}

onMounted(async () => {

  const OrderObj = await Order.getOrder();

  for (let detail of OrderObj) {
    const OrderDetail = await Order.getOrderDetails(detail.id);

    const orderdetails = []

    for (let productDetail of OrderDetail) {

      const product = await ProductList.getProductById(productDetail.productId);

      const typeName = await ProductList.getTypeNameByTypeId(productDetail.productTypeId);

      const pdObj = {
        productId: product.id,
        title: product.title,
        imageUrl: product.imageUrl,
        quantity: productDetail.quantity,
        totalPrice: productDetail.totalPrice,
        typeName: typeName
      }

      orderdetails.push(pdObj);
    }

    Order.OrderDetails = orderdetails;

    const OrderProductDetail = reactive({
      orderId: detail.id,
      title: orderdetails[0].title + `等${OrderDetail.length}件商品`,
      dateTime: detail.orderDate,
      totalPrice: detail.totalPrice,
      imageUrl: orderdetails[0].imageUrl,
      orderDetails: orderdetails
    })


    OrderProduct.value.push(OrderProductDetail)
  }

  Order.Order = OrderProduct.value;

})

</script>

<style scoped>
.container {
  display: flex;
  padding: 6px;
  border: 1px solid;
  border-radius: 6px;
  margin-bottom: 10px;
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

.details {
  flex-grow: 1;
  padding: 6px;
  margin-left: 20px;
}

.order-price {
  font-weight: 600;
  font-size: 1.2em;
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