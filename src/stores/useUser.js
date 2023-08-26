import axios from "axios"
import { defineStore } from "pinia"

const BASE_URL = 'http://43.143.170.48:5169/'

const useUser = defineStore("User", {
    state: () => ({
        isLoggedIn: false,
        user: ({
            userId: "",
            userName: "",
            userRole: "",
            jwtVersion: "",
            exp: 0
        })
    }),
    getters: {

    },
    actions: {
        async getCode(phone) {
            await axios.post(BASE_URL + 'api/Login/GetCode', {
                phone: {
                    regionNumber: 86,
                    phoneNumberValue: phone
                },
                password: "",
                code: ""
            })
        },

        async loginByPassword(phone, pwd) {
            const result = await axios.post(BASE_URL + 'api/Login/LoginByPhoneAndPassword', {
                phone: {
                    regionNumber: 86,
                    phoneNumberValue: phone
                },
                password: pwd,
                code: ""
            }).then(res => {
                localStorage.setItem("authToken", res.data.data)
                this.isLoggedIn = true;

                return res.data.success;
            })

            return result;
        },
        async loginByCode(phone, code) {
            const result = await axios.post(BASE_URL + 'api/Login/LoginByPhoneAndCode', {
                phone: {
                    regionNumber: 86,
                    phoneNumberValue: phone
                },
                password: "",
                code: code
            }).then(res => {
                localStorage.setItem("authToken", res.data.data)
                this.isLoggedIn = true;
                return res.data.success;
            })

            return result;
        },

        async logout() {
            localStorage.removeItem("authToken");
            this.isLoggedIn = false;
            //todo: 向后端发送登出请求，改变JwtVersion
            const result = axios.post(BASE_URL + 'api/Login/Logout').then(res => {
                return res.data.success;
            })

            return result;
        },
        async register(register) {
            const result = await axios.post(BASE_URL + 'api/User/AddNewUser', {
                phone: {
                    regionNumber: 86,
                    phoneNumberValue: register.phoneNumber
                },
                name: register.userName,
                code: register.code,
                password: register.password
            })

            return result.data.success;
        },
        async changePassword(password) {
            const result = await axios.post(BASE_URL + 'api/User/ChangePassword/' + password);
            return result.data.success;
        }
    }
})

export default useUser;