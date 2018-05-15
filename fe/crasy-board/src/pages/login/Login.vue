<template>
    <el-container>
        <el-header>Crasy Board 登陆</el-header>
        <el-main>
            <el-card class="login-card">
                <el-form status-icon label-width="100px" class="demo-ruleForm">
                    <el-form-item label="账号" >
                        <el-input placeholder="请输入账号" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="密码" >
                        <el-input type="password" placeholder="请输入密码" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary">立即登陆</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </el-main>
    </el-container>
</template>

<script>
export default {
    name: 'Login',
    components: {
        
    }
}
</script>

<style>
.el-header{
    background-color: #409EFF;
    color: #fff;
    text-align: center;
    font-size: 20px;
    line-height: 60px;
}

.el-main{
    color: #333;
    text-align: center;
    line-height: 160px;
    height: 100%;
}

.login-card{
    margin-top: 10%;
    margin-left: 25%;
    width: 50%;
}
</style>
