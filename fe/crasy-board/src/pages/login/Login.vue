<template>
    <el-container>
        <el-header>Crasy Board 登陆</el-header>
        <el-main>
            <el-card class="login-card" >
                <el-form status-icon label-width="100px" :model="loginForm" :rules="rules" ref="loginForm">
                    <el-form-item label="账号" prop="username">
                        <el-input  name="username" v-model="loginForm.username" ref="username" placeholder="请输入账号" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input name="password" v-model="loginForm.password" ref="passworld" type="password" placeholder="请输入密码" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitLogin('loginForm')">立即登陆</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </el-main>
    </el-container>
</template>

<script>
export default {
    name: 'Login',
    data() {
        return {
            loginForm: {
                username: '',
                password: ''
            },
            rules: {
                username: [
                    { required: true, message: '请输入账号', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ]
            }
        }
    },
    components: {
        
    },
    methods: {
        submitLogin(loginForm) {
            this.$refs[loginForm].validate((valid) => {
                if (valid) {
                    this.$http.post("http://localhost:5000/login/", JSON.stringify(this.loginForm)).then(function(response) {
                        let loginResult = response.data
                        console.log(loginResult)
                        if(loginResult && loginResult.code === 200) {
                            window.location.href="/index.html"
                        }
                    }, function(){
                        alert('服务异常, 请稍后再试')
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
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
