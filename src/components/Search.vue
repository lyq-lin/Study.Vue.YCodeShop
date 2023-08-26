<template>
    <div class="search-body">
        <el-autocomplete v-model="searchText" style="width: 100%;" class="media-search inline-input" size="large"
            :fetch-suggestions="querySearch" :trigger-on-focus="false" placeholder="请输入想要的商品" :suffix-icon="Search"
            @select="handleSelect" select-when-unmatched clearable>

        </el-autocomplete>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { Search } from '@element-plus/icons-vue'
import { useRouter } from "vue-router";
import useProductList from "@/stores/useProductList";
import router from "@/router";

const ProductList = useProductList();
const Router = useRouter();

const searchText = ref("");
const suggestions = ref([]);

const createFilter = (queryString) => {
    return (suggestion) => {
        return (
            suggestion.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
    }
}

const querySearch = async (queryString, cb) => {
    suggestions.value = await ProductList.getProductSearchSuggestions(queryString);

    const suggestionsWithId = suggestions.value.data.map((value, index) => ({
        id: index + 1,
        value: value
    }));

    const results = queryString ? suggestionsWithId.filter(createFilter(queryString)) : suggestionsWithId;

    cb(results);
}

async function handleSelect(selectItem) {
    await ProductList.getProductBySearch(selectItem.value, 1);

    router.push({
        path: `/product/search/${selectItem.value}/1`
    });
}

</script>

<style scoped>
.search-body {
    margin: 15px;
    width: 100%;
}
</style>