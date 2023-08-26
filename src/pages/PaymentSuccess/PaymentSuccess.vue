<template>
    <h3>谢谢</h3>
    <span>支付成功! 您可以在 <a @click="ToOrder">订单中心</a> 查看您的订单!</span>
</template>

<script setup>
import { useRouter } from "vue-router"

const router = useRouter();

function ToOrder() {
    router.push({
        path: '/order'
    })
}

</script>

<style scoped>
a {
    color: purple;
    text-decoration: underline;
}

a:hover {
    text-decoration: none;
}
</style>