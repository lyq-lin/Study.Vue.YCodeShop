import axios from "axios";
import { defineStore } from "pinia";

const BASE_URL = 'http://43.143.170.48:5168/';

const useCategory = defineStore("Category", {
    state: () => ({
        Categories: []
    }),
    getters: {

    },
    actions: {
        async getCategories() {
            axios.get(BASE_URL + 'api/Category/GetCategories').then(res => {
                this.Categories = res.data.data
            })
        }
    }
});

export default useCategory;