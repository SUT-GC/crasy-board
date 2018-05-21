var app = new Vue({
    el: "#index",
    data: {
        refreshMT: 5000,
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
            yAxisType: ['percent']
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
            yAxisName: ['GB']
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

            let getCpuTimeMethod = this.getDashboardCpuTime
            getCpuTimeMethod()

            setInterval(function(){
                getCpuTimeMethod()
            }, this.refreshMT)
            
        },
        getDashboardCpuTime() {
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
                this.netData.rows.push({ '时间': timeString, '收到数据': (responseNetData.bytes_recv/1024/1024/1024)})
            }
        }
    },
})

app.countDashboardCpuTime()