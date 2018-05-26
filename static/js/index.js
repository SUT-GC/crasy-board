var app = new Vue({
    el: "#index",
    data: {
        refreshMT: 5000,
        defaultLonePoint: 10,
        maxMultiple: 3,
        minMultiple: 1,
        cpuFreqEnlargeMultiple: 1,
        cpuTimeEnlargeMultiple: 1,
        cpuPercentEnlargeMultiple: 1,
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
                columns: ['时间', '使用率'],
                rows: [
                ]
            },
            cpuPrecentSetting: {
                area: true,
                yAxisType: ['percent'],
            },
            cpuFreqData :{
                columns: ['时间', '当前频率', '最小频率', '最大频率'],
                rows: [
                    
                ]
            },
            cpuFreqSetting: {
                yAxisName: ['MHZ'],
                label: {
                    normal: {
                        show: true
                    }
                }
            },
            cpuTimesData: {
                columns: ['时间', 'System', 'User', 'Idle'],
                rows: [
                    
                ]
            },
            cpuTimesSetting: {
                label: {
                    normal: {
                        show: true
                    }
                }
            },
            eveCpuFreqData: [
                
            ],
        },
        bigShowCpuFreq: false,
        bigShowCpuPercent: false,
        bigShowCpuTime: false,
        detailShowCpuFreq: false
        // 以上为CPU board 页面
    },
    computed: {
        cpuFreqMaxLinePoint(){
            return this.defaultLonePoint * this.cpuFreqEnlargeMultiple
        },
        cpuTimeMaxLinePoint(){
            return this.defaultLonePoint * this.cpuTimeEnlargeMultiple
        },
        cpuPersentMaxLinePoint(){
            return this.defaultLonePoint * this.cpuPercentEnlargeMultiple
        }
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
            let timeString = getNowTimeString()
            if(this.cpuData.rows.length <= 0){
                this.cpuData.rows.push({ '时间': timeString, '使用率': 0.0})
            }else if(this.cpuData.rows.length > this.defaultLonePoint){
                this.cpuData.rows.shift()
            }else{
                this.cpuData.rows.push({ '时间': timeString, '使用率': (responseCpuData.cpu_usage/100)})
            }
        },
        calculateNetData(responseNetData){
            let timeString = getNowTimeString()
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
                let timeString = getNowTimeString()

                let responseData = response.body.data
                let responseCpuData = responseData.cpu_data

                this.fillCpuPercentData(timeString, responseCpuData.total_cpu_persent)
                this.fillCpuFreqData(timeString, responseCpuData.total_cpu_freq)
                this.fillCpuTimesData(timeString, responseCpuData.total_cpu_times)
                this.fillEveCpuFreqData(timeString, responseCpuData.eve_cpu_freq)

            }, function(response){
                console.log('服务异常', response)
            });
        },
        fillCpuPercentData(timeString, totalCpuPersent){
            this.cpuBoardData.cpuPercentData.rows.push({ '时间': timeString, '使用率': (totalCpuPersent/100)})

            this.cpuBoardData.cpuPercentData.rows = sliceArrayLeftEndPoints(this.cpuBoardData.cpuPercentData.rows, this.cpuPersentMaxLinePoint)
        },
        fillCpuFreqData(timeString, totalCpuFreq){
            this.cpuBoardData.cpuFreqData.rows.push({ '时间': timeString, '当前频率': totalCpuFreq.current, '最小频率': totalCpuFreq.min, '最大频率': totalCpuFreq.max})
            
            this.cpuBoardData.cpuFreqData.rows = sliceArrayLeftEndPoints(this.cpuBoardData.cpuFreqData.rows, this.cpuFreqMaxLinePoint)
        },
        fillCpuTimesData(timeString, totalCpuTimes){
            this.cpuBoardData.cpuTimesData.rows.push({ '时间': timeString, 'System': totalCpuTimes.system_times, 'User': totalCpuTimes.user_times, 'Idle': totalCpuTimes.idle_times})

            this.cpuBoardData.cpuTimesData.rows = sliceArrayLeftEndPoints(this.cpuBoardData.cpuTimesData.rows, this.cpuTimeMaxLinePoint)
        },
        fillEveCpuFreqData(timeString, eveCpuData){
            for(let index = 0; index < eveCpuData.length; index++){
                let cpuData = eveCpuData[index]
                if(this.cpuBoardData.eveCpuFreqData.length < index + 1){
                    this.cpuBoardData.eveCpuFreqData.push({'columns': ['时间', '当前频率', '最小频率', '最大频率'],'rows':[{'时间':timeString, '当前频率': cpuData.current, '最小频率': cpuData.min, '最大频率': cpuData.max }]})
                }else{
                    this.cpuBoardData.eveCpuFreqData[index].rows.push({'时间':timeString, '当前频率': cpuData.current, '最小频率': cpuData.min, '最大频率': cpuData.max })
                }
            }

            for(let index = 0; index < this.cpuBoardData.eveCpuFreqData.length; index++){
                this.cpuBoardData.eveCpuFreqData[index].rows = sliceArrayLeftEndPoints(this.cpuBoardData.eveCpuFreqData[index].rows, this.cpuFreqMaxLinePoint)
            }
        },
        selectMenuHandler(key, keypath){
            if (key == 1) {
                this.dashBoardShow = true
                this.cpuBoardShow = false
            }else if(key == 2) {
                this.cpuBoardShow = true
                this.dashBoardShow = false
            }
        },
        showBigCpuFreq() {
            this.bigShowCpuFreq = true
            this.cpuFreqEnlargeMultiple = this.maxMultiple
        },
        showBigCpuPersent() {
            this.bigShowCpuPercent = true
            this.cpuPercentEnlargeMultiple = this.maxMultiple
        },
        showBigCpuTime() {
            this.bigShowCpuTime = true
            this.cpuTimeEnlargeMultiple = this.maxMultiple
        },
        showDetailCpuFreq() {
            this.detailShowCpuFreq = true
            this.cpuFreqEnlargeMultiple = this.maxMultiple
        },
        closeBigCpuFreq() {
            this.bigShowCpuFreq = false
            this.cpuFreqEnlargeMultiple = this.minMultiple
        },
        closeDetailCpuFreq() {
            this.detailShowCpuFreq = false
            this.cpuFreqEnlargeMultiple = this.minMultiple
        },
        closeBigCpuPersent() {
            this.bigShowCpuPercent = false
            this.cpuPercentEnlargeMultiple = this.minMultiple
        },
        closeBigCpuTime(){
            this.bigShowCpuTime = false
            this.cpuTimeEnlargeMultiple = this.minMultiple
        }
    },
})

app.countDashboardCpuTime()
app.fillCpuBoardInfo()