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
                            window.location.href="/index/"
                        }else{
                            this.$alert('账号密码不正确，请确认后重新输入', '登陆异常')
                        }
                    }, function(){
                        
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    }
})