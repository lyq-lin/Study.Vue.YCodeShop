import axios from "axios";

export default function useAuthenticationState() {

    var state = false;

    const token = localStorage.getItem("authToken");
    if (token !== undefined && token !== null) {
        try {

            axios.interceptors.request.use(config => {
                config.headers.Authorization = `Bearer ${token}`;

                return config;
            })

            state = true;

        } catch (error) {
            localStorage.removeItem("authToken")
            state = false;
        }
    }

    return {
        state
    }
}