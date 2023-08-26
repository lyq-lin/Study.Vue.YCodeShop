import useAuthenticationState from "@/hook/auth/useAuthenticationState";
import axios from "axios";
import { defineStore } from "pinia";

const BASE_URL = 'http://43.143.170.48:5170/'

const useCart = defineStore("Cart", {
    state: () => ({
        Cart: [],
        CartProduct: [],
        jwtPayload: ""
    }),
    getters: {
        GetCartItemCount(state) {
            return state.Cart.reduce((total) => total + 1, 0)
        }
    },
    actions: {
        async AddToCart(cartItem) {

            const state = useAuthenticationState().state;

            if (state === true) {

                axios.post(BASE_URL + 'api/Cart/AddCartItems', {
                    id: "30961341-E2FC-4107-B5F6-169D156F53ED",
                    productId: cartItem.productId,
                    ProductTypeId: cartItem.productTypeId,
                    quantity: cartItem.quantity
                })

                await this.GetCartsInDb();

            } else {

                const localCart = localStorage.getItem("cart");
                this.Cart = localCart ? JSON.parse(localCart) : [];
                const sameItem = this.Cart.find(item => item.productId === cartItem.productId && item.productTypeId === cartItem.productTypeId);
                if (sameItem === undefined) {
                    this.Cart.push(cartItem);
                } else {
                    sameItem.quantity += cartItem.quantity;
                }
                localStorage.setItem("cart", JSON.stringify(this.Cart));
            }
        },
        async updateQuantity(product) {
            const state = useAuthenticationState().state;
            if (state === true) {

                await axios.put(BASE_URL + 'api/Cart/UpdateQuantity', {
                    id: "30961341-E2FC-4107-B5F6-169D156F53ED",
                    productId: product.ProductId,
                    ProductTypeId: product.ProductTypeId,
                    quantity: product.Quantity
                })
            } else {

                const localCart = localStorage.getItem("cart");
                this.Cart = localCart ? JSON.parse(localCart) : [];
                const sameItem = this.Cart.find(item => item.productId === product.ProductId && item.productTypeId == product.ProductTypeId);

                if (sameItem === undefined) {
                    return;
                }

                sameItem.Quantity = product.Quantity;
                localStorage.setItem("cart", JSON.stringify(this.Cart))
            }
        },
        async RemoveProduct(product, index) {
            const state = useAuthenticationState().state;

            if (state === true) {
                this.Cart.splice(index, 1);
                await axios.delete(BASE_URL + 'api/Cart/RemoveCartItem/' + product.ProductId + '/' + product.ProductTypeId)
            } else {
                this.Cart.splice(index, 1);
                localStorage.setItem("cart", JSON.stringify(this.Cart));
            }
        },
        async storeCartItems(jwtPayload) {
            const state = useAuthenticationState().state;

            if (state === true) {
                const localCart = localStorage.getItem("cart");
                this.Cart = localCart ? JSON.parse(localCart) : [];

                this.jwtPayload = jwtPayload;

                axios.interceptors.request.use(config => {
                    config.headers.Authorization = `Bearer ${jwtPayload}`;
                    return config;
                })

                if (this.Cart.length > 0) {
                    await axios.post(BASE_URL + 'api/Cart/StoreCartItems', this.Cart);
                    localStorage.removeItem("cart")
                }

            }
        },
        async GetCartsInDb() {
            await axios.get(BASE_URL + 'api/Cart/GetCartProductsInDb').then(res => {
                if (this.jwtPayload !== "" && this.jwtPayload !== undefined) {
                    axios.interceptors.request.use(config => {
                        config.headers.Authorization = `Bearer ${this.jwtPayload}`;
                        return config;
                    })
                }

                this.Cart = res.data.data
            })
        }

    }
})

export default useCart