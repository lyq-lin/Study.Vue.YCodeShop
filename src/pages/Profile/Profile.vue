<template>
    <h1>你好!欢迎登录YCodeShop网站! <i>{{ User.user.userName }}</i></h1>

    <div class="container">
        <div class="change-password">
            <h3>修改密码</h3>
            <div class="password">
                <el-input v-model="changePassord.password" type="password" placeholder="请输入新密码" size="large"
                    show-password></el-input>
            </div>

            <div class="confirm-password">
                <el-input v-model="changePassord.confirmPassword" type="password" placeholder="请再次输入密码" size="large"
                    show-password></el-input>
            </div>

            <el-button color="#626aef" size="large" class="ChangePasswordButton" @click="ToChangePassword">
                修改密码
            </el-button>
        </div>
    </div>
</template>

<script setup>
import useUser from "@/stores/useUser";
import { reactive } from "vue";
import { useRouter } from "vue-router";

const User = useUser();
const router = useRouter();

const changePassord = reactive({
    password: "",
    confirmPassword: ""
})

async function ToChangePassword() {
    if (changePassord.password === "" || changePassord.password === undefined) {
        alert("密码不能为空!");
        return;
    }

    if (changePassord.password !== changePassord.confirmPassword) {
        alert("两次密码输入不一致!");
        return;
    }

    const result = await User.changePassword(changePassord.password);

    if (result === true) {
        localStorage.removeItem("authToken");
        User.isLoggedIn = false;
        alert("修改成功!请重新登录!");
        router.push({
            path: '/product/feature'
        })
    } else {
        alert("修改失败")
    }
}

</script>

<style scoped>
.container {
    width: 95%;
    margin: 20px;
}

.change-password>div {
    width: 50%;
    margin: 15px;
}

.ChangePasswordButton {
    margin: 20px;
}
</style>