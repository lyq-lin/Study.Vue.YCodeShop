<template>
    <div class="container">
        <template v-for="product in ProductList.Products" :key="product.id">
            <div class="product">
                <a @click="detail(product.id)">
                    <img class="media-img" :src="product.imageUrl">
                </a>

                <div class="media-body">
                    <a @click="detail(product.id)">
                        <h3>{{ product.title }}</h3>
                    </a>

                    <p>{{ product.description }}</p>

                    <template v-if="product.variants != null && product.variants.length > 0">
                        <h5 class="price">
                            {{ getMinPrice(product) }}
                        </h5>
                    </template>

                </div>

            </div>
        </template>

        <!-- 搜索结果分页展示 -->
        <el-row :gutter="20">
            <el-col :span="8" :offset="10">
                <el-pagination background layout="prev, pager, next" :page-count="ProductList.Pages"
                    :current-page="ProductList.CurrentPage" :default-page-size="2" hide-on-single-page
                    @current-change="selectPagination" />
            </el-col>
        </el-row>

    </div>
</template>

<script setup>
import useProductList from "@/stores/useProductList"
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router"

const ProductList = useProductList();

const route = useRoute();
const router = useRouter();

onMounted(async () => {
    if (ProductList.Products.length == 0) {
        await ProductList.getProductsByCategory(route.params.url);
    }

    if (route.params.searchText != undefined && route.params.page != undefined) {
        await ProductList.getProductBySearch(route.params.searchText,route.params.page)
    }
})


function detail(id) {
    router.push({
        path: `/detail/${id}`
    })
}

const getMinPrice = function GetPriceText(product) {
    var variants = product.variants
    if (variants.length == 0) {
        return "";
    } else if (variants.length == 1) {
        return "￥" + variants[0].price;
    }

    var prices = variants.map(variant => variant.price);
    var minPrice = Math.min(...prices);

    return "最低￥" + minPrice + "起";
}

const selectPagination = async function (page) {
    await ProductList.getProductBySearch(ProductList.LastSearchText, page)

    router.push({
        path: `/product/search/${ProductList.LastSearchText}/${page}`
    })
}

</script>

<style scoped>
.container .product {
    width: 100%;
}

.media-img {
    margin: 20px;
    max-height: 200px;
    max-width: 200px;
    border-radius: 6px;
    margin-bottom: 10px;
    transition: transform .2s;
    flex: 1;
}

a:hover {
    color: purple;
    text-decoration: underline;
}

.media-img:hover {
    transform: scale(1.1);
}

.product {
    width: 200px;
    text-align: center;
    display: flex;
}

.media-body {
    text-align: left;
    flex: 1;
    margin-left: 20px;
}

.price {
    color: green;
}
</style>