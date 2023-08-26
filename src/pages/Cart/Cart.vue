<template>
    <h1>购物车页面</h1>
    <template v-if="CartProducts.length > 0">
        <template v-for="(product, index) in CartProducts" :key="index">
            <div class="container">
                <div class="image-wrapper">
                    <img :src="product.ImageUrl" :alt="product.Title">
                </div>

                <div class="name">
                    <h4>
                        <a @click="detail(product.ProductId)">
                            {{ product.Title }}
                        </a>
                    </h4>

                    当前选择的套餐是:
                    <span class="productType">
                        {{ product.ProductType }}
                    </span>
                    <br>

                    <el-input-number v-model="product.Quantity" :min="1" :max="10" @change="handleChange(product)"
                        size="small" />

                    <br>
                    <button class="btn-delete" @click="removeProductFromCart(product, index)">
                        移出购物车
                    </button>
                </div>

                <div class="cart-product-price">
                    ￥{{ (product.Price * product.Quantity).toFixed(2) }} 元
                </div>
            </div>
        </template>

        <div class="cart-product-price">
            Total ({{ CartProducts.length }}) : ￥{{ Cart.CartProduct.reduce((total, item) => total + item.Price *
                item.Quantity,
                0).toFixed(2) }} 元
            <br><br>
            <el-button color="#D1E7DD" size="large" @click="payment">结账</el-button>
        </div>

    </template>

    <template v-else>
        <h2>您尚未添加购物车~~~</h2>
    </template>
</template>

<script setup>
import useCart from "@/stores/useCart";
import useProductList from "@/stores/useProductList";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router"
import usePayment from "@/stores/usePayment";

const ProductList = useProductList();
const router = useRouter();
const Cart = useCart();
const Payment = usePayment();
const CartProducts = ref([])

onMounted(async () => {
    Cart.CartProduct = [];
    //1. 获得购物车数据
    for (let item of Cart.Cart) {
        //2. 根据购物车的ProductId去获取商品
        var product = await ProductList.getProductById(item.productId);
        if (product === undefined) {
            continue;
        }
        //3. 根据商品Id和TypeId去查找套餐
        var variantByProduct = await ProductList.getProductVariant(item.productId, item.productTypeId);
        if (variantByProduct === undefined) {
            continue;
        }
        //4. 定义一个对象按需存储结构
        var cartObj = {
            ProductId: product.id,
            Title: product.title,
            ImageUrl: product.imageUrl,
            ProductTypeId: variantByProduct.productTypeId,
            ProductType: variantByProduct.productType.name,
            Price: variantByProduct.price,
            Quantity: item.quantity
        };
        //5. 拼接好数据后存入数组
        Cart.CartProduct.push(cartObj);
    }
    CartProducts.value = Cart.CartProduct
})

function detail(id) {
    router.push({
        path: `/detail/${id}`
    })
}

async function payment() {
    await Payment.CreateCheckoutSession(CartProducts.value);
}


async function handleChange(product) {
    await Cart.updateQuantity(product);
}

async function removeProductFromCart(product, index) {
    await Cart.RemoveProduct(product, index);
    CartProducts.value.splice(index, 1);
}

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

img {
    max-width: 110px;
    max-height: 110px;
    padding: 6px;
}

img:hover {
    transform: scale(1.1);
}

.name {
    flex-grow: 1;
    padding: 6px;
}

.cart-product-price {
    font-weight: 600;
    text-align: right;
}

.btn-delete {
    background: none;
    border: none;
    padding: 0px;
    color: red;
    font-size: 12px;
}

.btn-delete:hover {
    text-decoration: underline;
}

.productType {
    color: purple;
    text-decoration: underline;
}

a:hover {
    color: purple;
    text-decoration: underline;
}
</style>