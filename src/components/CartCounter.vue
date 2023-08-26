<template>
    <div class="media-cart">
        <el-button color="#626aef" :icon="CartItemCount <= 0 ? ShoppingTrolley : ShoppingCartFull" @click="ToCartPage"
            size="large">
            {{ CartItemCount }}
        </el-button>
    </div>
</template>

<script setup>
import useCart from '@/stores/useCart';
import { computed, onMounted } from 'vue';
import { ShoppingCartFull, ShoppingTrolley } from "@element-plus/icons-vue"

import { useRouter } from 'vue-router';
import useAuthenticationState from '@/hook/auth/useAuthenticationState';

const Cart = useCart();
const router = useRouter();

onMounted(async () => {

    if (useAuthenticationState().state) {
        await Cart.GetCartsInDb();
    } else {
        const localCart = localStorage.getItem("cart");
        Cart.Cart = localCart ? JSON.parse(localCart) : [];
    }
})

const CartItemCount = computed(() => {
    return Cart.GetCartItemCount
})

function ToCartPage() {
    router.push({
        path: '/cart'
    })
}

</script>

<style scoped>
.media-cart {
    margin: 15px;
}
</style>