<template>
    <h2>欢迎成为YCode Shop 网站会员</h2>
    <div class="container">
        <div class="phone-number">
            <el-input v-model="registerModel.phoneNumber" placeholder="请输入手机号码" size="large" />
        </div>

        <div class="username">
            <el-input v-model="registerModel.userName" placeholder="请输入昵称" size="large" />
        </div>

        <div class="code">
            <el-input v-model="registerModel.code" placeholder="请输入验证码" size="large" style="width: 85%;" />
            <el-button color="#626aef" size="large" style="margin-left: 15px;"
                @click="GetCode(registerModel.phoneNumber)">获取验证码</el-button>
        </div>

        <div class="password">
            <el-input v-model="registerModel.password" type="password" placeholder="请输入密码" size="large" show-password />
        </div>

        <div class="confirmPassword">
            <el-input v-model="registerModel.comfirmPassword" type="password" placeholder="请再次输入密码" size="large"
                show-password />
        </div>

        <el-button color="#626aef" size="large" class="registerButton" @click="ToRegister">
            注册
        </el-button>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
import useUser from '@/stores/useUser';
import { useRouter } from 'vue-router';

const router = useRouter();
const User = useUser();

const registerModel = reactive({
    phoneNumber: "",
    userName: "",
    code: "",
    password: "",
    comfirmPassword: ""
})

async function GetCode(phone) {
    await User.getCode(phone);
}

async function ToRegister() {

    if (registerModel.password !== registerModel.comfirmPassword) {
        alert("两次输入密码不一致");
        return;
    }

    const result = await User.register(registerModel);

    if (result === true) {
        alert("注册成功!前往登录页面")
        router.push({
            path: '/login'
        })
    } else {
        alert("注册失败")
    }
}

</script>

<style scoped>
.container {
    width: 95%;
}

.container>div {
    width: 50%;
    margin: 15px;
}

.registerButton {
    margin: 20px;
}
</style>