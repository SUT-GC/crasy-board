var app = new Vue({
    el: "#index",
    data: {
        refreshMT: 5000,
        message: "hello world",
        diskData: {
            columns: ['类型', '大小'],
            rows: [
                { '类型': '空闲中', '大小': 1523},
                { '类型': '使用中', '大小': 1223},
            ]
        },
        diskChartSettings: {
            dimension: '类型',
            radius: 120,
            offsetY: 220,
        },
        ramData: {
            columns: ['类型', '大小'],
            rows: [
                { '类型': '空闲中', '大小': 1523},
                { '类型': '使用中', '大小': 1223},
            ]
        },
        ramChartSettings: {
            dimension: '类型',
            radius: 120,
            offsetY: 220,
        },
        cpuData: {
            columns: ['时间', '使用率'],
            rows: [
                { '时间': '1月1日', '使用率': 50},
                { '时间': '1月1日', '使用率': 50}
            ]
        },
        cpuLineSettings:{
            area: true,
            yAxisType: ['percent'],
        },
        lastCpuIdle: 0,
        lastCpuAll: 0,
        netData: {
            columns: ['时间', '收到数据'],
            rows: [
                { '时间': '1月1日', '收到数据': 50},
            ]
        },
        netLineSettings:{
            area: true,
            yAxisName: ['MB'],
            label: {
                normal: {
                    show: true
                }
            }
        },
        dashBoardShow: true,
        // 以上变量跟DashBoard里面的展示有关
        cpuBoardShow: false,
        cpuBoardData: {
            cpuPercentData: {
                columns: [],
                rows: [
                ]
            },
            cpuPrecentSetting: {

            }
        }
    },
    computed: {
        
    },
    methods: {
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
        logout(){
            username = getCookie(document, "crasy-board-user")
            console.log('logout', username)

            this.$http.post("/logout/", JSON.stringify({"username": username})).then(function(response){
                let loginResult = response.data
                console.log(loginResult)
                if(loginResult && loginResult.code === 200) {
                    setCookie(document, 'crasy-board-user', loginResult.data)
                    window.location.href="/"
                }
            }, function(response){

            });
        },
        countDashboardCpuTime() {
            console.log('count cpu time')
            this.diskData.rows = []
            this.ramData.rows = []
            this.cpuData.rows = []
            this.netData.rows = []

            let getDashboardAllData = this.getDashboardInfo
            getDashboardAllData()

            setInterval(function(){
                getDashboardAllData()
            }, this.refreshMT)
            
        },
        getDashboardInfo() {
            if (!this.dashBoardShow) {
                return 
            }

            this.$http.get("/data/dashboard/").then(function(response){
                let responseData = response.body.data
                let responseCpuData = responseData.cpu_data
                let responseVmData = responseData.vm_data
                let responseDiskData = responseData.disk_data 
                let responseNetData = responseData.net_data
                
                this.diskData.rows = [ { '类型': '空闲中', '大小': responseDiskData.disk_free}, { '类型': '使用中', '大小': responseDiskData.disk_totle - responseDiskData.disk_free}]
                this.ramData.rows = [ { '类型': '空闲中', '大小': responseVmData.vm_available},{ '类型': '使用中', '大小': responseVmData.vm_totle - responseVmData.vm_available}]
                this.calculateCpuData(responseCpuData)
                this.calculateNetData(responseNetData)

            }, function(response){
                console.log('服务异常', response)
            });
        },
        calculateCpuData(responseCpuData){
            let date = new Date()
            let timeString = "" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ""
            if(this.cpuData.rows.length <= 0){
                this.cpuData.rows.push({ '时间': timeString, '使用率': 0.0})
            }else if(this.cpuData.rows.length > 10){
                this.cpuData.rows.shift()
            }else{
                this.cpuData.rows.push({ '时间': timeString, '使用率': (responseCpuData.cpu_usage/100)})
            }
        },
        calculateNetData(responseNetData){
            let date = new Date()
            let timeString = "" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ""
            if(this.netData.rows.length <= 0){
                this.netData.rows.push({ '时间': timeString, '收到数据': 0.0})
            }else if(this.netData.rows.length > 10){
                this.netData.rows.shift()
            }else{
                this.netData.rows.push({ '时间': timeString, '收到数据': parseInt(responseNetData.bytes_recv/1024/1024, 10)})
            }
        },
        fillCpuBoardInfo(){
            let getCpuBoardAllData = this.getCpuBoardData
            setInterval(function(){
                getCpuBoardAllData()
            }, this.refreshMT)
        },
        getCpuBoardData(){
            if (!this.cpuBoardShow) {
                return
            }

            this.$http.get("/data/cpudashboard/").then(function(response){
                let responseData = response.body.data
                let responseCpuData = responseData.cpu_data

                this.fillCpuPercentData(responseCpuData.eve_cpu_persent)

            }, function(response){
                console.log('服务异常', response)
            });
        },
        fillCpuPercentData(eveCpuPercent){
            console.log(eveCpuPercent)
            if (this.cpuBoardData.columns.length == 0){
                this.cpuBoardData.columns.push('时间')
                for(let i = 0; i < eveCpuPercent.length; i++){
                    this.cpuBoardData.columns.push('CPU-'+ (i+1))
                }
            }

            let date = new Date()
            let timeString = "" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ""
            let oneRecord = {'时间': timeString}

            for(let i = 0; i < eveCpuPercent.length; i++){
                this.cpuBoardData.columns.push('CPU-'+ (i+1))
            }
        },
        selectMenuHandler(key, keypath){
            if (key == 1) {
                this.dashBoardShow = true
                this.cpuBoardShow = false
            }else if(key == 2) {
                this.fillCpuBoardInfo()
                this.cpuBoardShow = true
                this.dashBoardShow = false
            }
        }
    },
})

app.countDashboardCpuTime()