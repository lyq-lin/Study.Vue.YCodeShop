import axios from "axios";
import { defineStore } from "pinia";

const BASE_URL = 'http://43.143.170.48:5168/';
const useProductList = defineStore("productList", {
    state: () => ({
        Products: [],
        ProductTypes: [],
        Pages: 1,
        CurrentPage: 1,
        LastSearchText: ""
    }),
    getters: {
        GetProdcutById(state) {
            return productId => {
                return state.Products.find(item => item.id === productId)
            }
        }
    },
    actions: {
        async getAllProduct() {
            await axios.get(BASE_URL + "api/Product/GetProductList").then(res => {
                this.Products = res.data.data
            })
        },
        async getProductsByCategory(url) {
            await axios.get(BASE_URL + "api/Product/GetProductByCategory/" + url).then(res => {
                this.Products = res.data.data
            })
        },
        async getProductsByFeatured() {
            await axios.get(BASE_URL + "api/Product/GetFeaturedProducts").then(res => {
                this.Products = res.data.data
            })
        },
        async getProductTypeByProductId(typeId) {
            await axios.get(BASE_URL + "api/ProductType/GetProductTypeByProductId/" + typeId).then(res => {
                this.ProductTypes = res.data.data
            })
        },
        async getProductById(id) {
            const product = await axios.get(BASE_URL + "api/Product/GetProductById/" + id);
            return product.data.data;
        },
        async getProductSearchSuggestions(searchText) {
            const response = await axios.get(BASE_URL + "api/Product/GetProductSearchSuggestions/" + searchText)
            return response.data;
        },
        async getProductBySearch(searchText, page) {

            this.LastSearchText = searchText;

            await axios.get(BASE_URL + "api/Product/GetProductBySearch/" + searchText + "/" + page).then(res => {
                const result = res.data.data;
                if (result != null && result.products.length != 0) {
                    this.Pages = result.pages;
                    this.CurrentPage = result.currentPage;
                    this.Products = result.products;
                }
            })
        },
        async getProductVariant(id, typeid) {
            const variant = await axios.get(BASE_URL + 'api/ProductVariant/GetVariantByProduct/' + id + '/' + typeid)
            return variant.data.data;
        },
        async getTypeNameByTypeId(typeId) {
            const result = await axios.get(BASE_URL + 'api/ProductType/GetTypeNameByTypeId/' + typeId);
            return result.data.data;
        }
    }
})

export default useProductList;