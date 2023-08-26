import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: "/", redirect: "/product/feature"
        },
        {
            path: "/product/feature", component: () => import("@/components/FeaturedProduct.vue")
        },
        {
            path: "/product/:url", component: () => import("@/components/ProductList.vue")
        },
        {
            path: "/product/search/:searchText/:page", component: () => import("@/components/ProductList.vue")
        },
        {
            path: "/detail/:id", component: () => import("@/pages/ProductDetail/ProductDetail.vue")
        },
        {
            path: "/cart", component: () => import("@/pages/Cart/Cart.vue")
        },
        {
            path: "/login", component: () => import("@/pages/Login/Login.vue")
        },
        {
            path: "/register", component: () => import("@/pages/Register/Register.vue")
        },
        {
            path: "/profile", component: () => import("@/pages/Profile/Profile.vue")
        },
        {
            path: "/payment-success", component: () => import("@/pages/PaymentSuccess/PaymentSuccess.vue")
        },
        {
            path: "/order", component: () => import("@/pages/Order/Order.vue")
        },
        {
            path: "/order-detail/:id", component: () => import("@/pages/OrderDetail/OrderDetail.vue")
        }
    ]

})

export default router