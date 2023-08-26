<template>
  <h2>请登录</h2>

  <div class="container">
    <div class="phone-number">
      <el-input v-model="loginModel.phoneNumber" placeholder="请输入手机号码" size="large" />
    </div>
    <div class="pwssword" v-if="isPwdOrCode">
      <el-input v-model="loginModel.password" type="password" placeholder="请输入密码" size="large" show-password />
    </div>
    <div class="code" v-else>
      <el-input v-model="loginModel.code" placeholder="请输入验证码" size="large" style="width:80%" />

      <el-button color="#626aef" size="large" style="margin-left:15px;" @click="getCode(loginModel.phoneNumber)">
        获取验证码
      </el-button>
    </div>

    <el-button color="#626aef" size="large" class="loginButton" @click="login">
      登录
    </el-button>

    <a @click="ToCodeLogin">{{ isPwdOrCode ? "使用验证码登录" : "使用密码登录" }}</a>
  </div>
</template>

<script setup>
import useUser from '@/stores/useUser'
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import jwt_decode from "jwt-decode"
import useAuthenticationState from '@/hook/auth/useAuthenticationState';
import useCart from '@/stores/useCart';

const isPwdOrCode = ref(true);
const User = useUser();
const router = useRouter();
const Cart = useCart();

const loginModel = reactive({
  phoneNumber: "",
  password: "",
  code: ""
})

onMounted(async () => {
  const isAuth = ref(useAuthenticationState());
  if (isAuth.value.state) {
    router.push({
      path: '/product/feature'
    })
  }
})

function ToCodeLogin() {
  isPwdOrCode.value = !isPwdOrCode.value
}

async function getCode(phone) {
  await User.getCode(phone);
}

async function login() {
  const result = ref(false);

  if (isPwdOrCode.value) {
    result.value = await User.loginByPassword(loginModel.phoneNumber, loginModel.password);
  } else {
    result.value = await User.loginByCode(loginModel.phoneNumber, loginModel.code);
  }

  if (result.value === true) {
    const jwtPayload = localStorage.getItem("authToken");
    const decodeJwt = jwt_decode(jwtPayload);

    User.user.userId = decodeJwt["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    User.user.userName = decodeJwt["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
    User.user.userRole = decodeJwt["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    User.user.jwtVersion = decodeJwt["JwtVersion"];
    User.user.exp = decodeJwt["exp"];

    await Cart.storeCartItems(jwtPayload);

    await Cart.GetCartsInDb();

    router.push({
      path: '/product/feature'
    })
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

.loginButton {
  margin: 20px;
}

a:hover {
  color: purple;
  text-decoration: underline;
}
</style>