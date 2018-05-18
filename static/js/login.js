var app = new Vue({
    el: "#app",
    data: {
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
    },
    methods: {
        submitLogin: function (loginForm) {
            this.$refs[loginForm].validate((valid) => {
                if (valid) {
                    this.$http.post("/login/", JSON.stringify(this.loginForm)).then(function(response) {
                        let loginResult = response.data
                        console.log(loginResult)
                        if(loginResult && loginResult.code === 200) {
                            setCookie(document, 'crasy-board-user', loginResult.data)
                            window.location.href="/"
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
})