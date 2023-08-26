<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <el-row :gutter="20">
                    <el-col :span="2" :offset="4">
                        <LogoButton />
                    </el-col>
                    <el-col :span="12">
                        <!-- 搜索框 -->
                        <Search />
                    </el-col>
                    <el-col :span="2">
                        <!-- 用户登录 -->
                        <UserButton />
                    </el-col>
                    <el-col :span="2">
                        <!-- 购物车 -->
                        <CartCounter />
                    </el-col>
                </el-row>
            </el-header>

            <el-main>
                <Nav />
                <router-view></router-view>
            </el-main>
        </el-container>
    </div>
</template>

<script setup>
import LogoButton from "@/components/LogoButton.vue"
import Nav from "@/components/Nav.vue"
import Search from "@/components/Search.vue"
import CartCounter from "@/components/CartCounter.vue";
import UserButton from "@/components/UserButton.vue";

</script>

<style></style>