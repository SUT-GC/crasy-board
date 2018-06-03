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
        vmPercentEnlargeMultiple: 1,
        swapPercentEnlargeMultiple:1,
        vmInfoEnlargeMultiple: 1,
        swapInfoEnlargeMultiple: 1,
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
            eveCpuTimesData: [

            ],
            eveCpuPercentData: {
                columns: [],
                rows: [
                ]
            },
            eveCpuPercentSetting: {
                yAxisType: ['percent']
            }
        },
        bigShowCpuFreq: false,
        bigShowCpuPercent: false,
        bigShowCpuTime: false,
        detailShowCpuFreq: false,
        detailShowCpuTimes: false,
        detailShowCpuPercent: false,
        // 以上为CPU board 页面
        memBoardShow: false,
        bigShowVmPercent: false,
        bigShowSwapPercent: false,
        detailShowVmInfo: false,
        detailShowSwapInfo: false,
        memBoardData: {
            vmPercentData: {
                columns: ['时间', '使用率'],
                rows: [
                    
                ]
            },
            vmPrecentSetting: {
                area: true,
                yAxisType: ['percent']
            },
            swapPercentData: {
                columns: ['时间', '使用率'],
                rows: [
                    
                ]
            },
            swapPrecentSetting: {
                area: true,
                yAxisType: ['percent']
            },
            vmDetailData: {
                columns: ['时间', 'total', 'avalible', 'used', 'free'],
                rows: [
                    
                ]
            },
            vmDetailSetting: {
                yAxisName: ['GB'],
                label: {
                    normal: {
                        show: true
                    }
                }
            },
            swapDetailData: {
                columns: ['时间', 'total', 'used', 'free', 'sin', 'sout'],
                rows: [
                    
                ]
            },
            swapDetailSetting: {
                yAxisName: ['GB'],
                label: {
                    normal: {
                        show: true
                    }
                }
            }
        },
        // 以上为内存面板的数据
        diskBoardShow:false,
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
        },
        vmPercentMaxLinePoint(){
            return this.defaultLonePoint * this.vmPercentEnlargeMultiple
        },
        swapPercentMaxLinePoint(){
            return this.defaultLonePoint * this.swapPercentEnlargeMultiple
        },
        vmInfoMaxLinePoint(){
            return this.defaultLonePoint * this.vmInfoEnlargeMultiple
        },
        swapInfoMaxLinePoint(){
            return this.defaultLonePoint * this.swapInfoEnlargeMultiple
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
        // 上面是 DashBoard 的计算
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
                this.fillEveCpuTimesData(timeString, responseCpuData.eve_cpu_times)
                this.fillEveCpuPercentData(timeString, responseCpuData.eve_cpu_persent)

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
        fillEveCpuTimesData(timeString, eveCpuData){
            for(let index = 0; index < eveCpuData.length; index++) {
                let cpuData = eveCpuData[index]
                if(this.cpuBoardData.eveCpuTimesData.length < index + 1){
                    this.cpuBoardData.eveCpuTimesData.push({'columns': ['时间', 'System', 'User', 'Idle'], 'rows': [{'时间': timeString, 'System': cpuData.system_times, 'User': cpuData.user_times, 'Idle': cpuData.idle_times}]})
                } else {
                    this.cpuBoardData.eveCpuTimesData[index].rows.push({'时间': timeString, 'System': cpuData.system_times, 'User': cpuData.user_times, 'Idle': cpuData.idle_times})
                }
            }

            for(let index = 0; index < this.cpuBoardData.eveCpuTimesData.length; index++) {
                this.cpuBoardData.eveCpuTimesData[index].rows = sliceArrayLeftEndPoints(this.cpuBoardData.eveCpuTimesData[index].rows, this.cpuTimeMaxLinePoint)
            }
        },
        fillEveCpuPercentData(timeString, eveCpuData) {
            let columns = ['时间']
            let row = {'时间': timeString}
            for(let index = 0; index < eveCpuData.length; index++) {
                let column_name = '第' + (index + 1) + 'CPU'
                columns.push(column_name)
                row[column_name] = eveCpuData[index].cpu_percent / 100
            }

            if(this.cpuBoardData.eveCpuPercentData.columns.length <= 0) {
                this.cpuBoardData.eveCpuPercentData.columns = columns
                this.cpuBoardData.eveCpuPercentData.rows.push(row)
            } else {
                this.cpuBoardData.eveCpuPercentData.rows.push(row)
            }

            this.cpuBoardData.eveCpuPercentData.rows = sliceArrayLeftEndPoints(this.cpuBoardData.eveCpuPercentData.rows, this.cpuPersentMaxLinePoint)
        },
        selectMenuHandler(key, keypath){
            if (key == 1) {
                this.dashBoardShow = true
                this.cpuBoardShow = false
                this.memBoardShow = false
                this.diskBoardShow = false
            }else if(key == 2) {
                this.cpuBoardShow = true
                this.dashBoardShow = false
                this.memBoardShow = false
                this.diskBoardShow = false
            }else if(key == 3){
                this.cpuBoardShow = false
                this.dashBoardShow = false
                this.memBoardShow = true
                this.diskBoardShow = false
            }else if(key == 4) {
                this.cpuBoardShow = false
                this.dashBoardShow = false
                this.memBoardShow = false
                this.diskBoardShow = true
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
        showDetailCpuTimes() {
            this.detailShowCpuTimes = true
            this.cpuTimeEnlargeMultiple = this.maxMultiple
        },
        showDetailCpuPercent() {
            this.detailShowCpuPercent = true
            this.cpuPercentEnlargeMultiple = this.maxMultiple
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
        },
        closeDetailCpuTimes(){
            this.detailShowCpuTimes = false
            this.cpuTimeEnlargeMultiple = this.minMultiple
        },
        closeDetailCpuPercent(){
            this.detailShowCpuPercent = false
            this.cpuPercentEnlargeMultiple = this.minMultiple
        },
        // 上面是CPU Board 的计算
        fillVmBoardInfo(){
            let getMemBoardAllData = this.getMemBoardData
            setInterval(function(){
                getMemBoardAllData()
            }, this.refreshMT)
        },
        getMemBoardData(){
            if (!this.memBoardShow) {
                return
            }

            this.$http.get("/data/memdashboard/").then(function(response){
                let timeString = getNowTimeString()

                let responseData = response.body.data
                let responseMemData = responseData.mem_data

                this.fillVmPercentData(timeString, responseMemData.vmem)
                this.fillSwapPercentData(timeString, responseMemData.swap)
                this.fillVmDetailData(timeString, responseMemData.vmem)
                this.fillSwapDetailData(timeString, responseMemData.swap)
            }, function(response){
                console.log('服务异常', response)
            });
        },
        fillVmPercentData(timeString, vmData){
            this.memBoardData.vmPercentData.rows.push({ '时间': timeString, '使用率': (vmData.percent/100)})

            this.memBoardData.vmPercentData.rows = sliceArrayLeftEndPoints(this.memBoardData.vmPercentData.rows, this.vmPercentMaxLinePoint)
        },
        fillSwapPercentData(timeString, swapData) {
            this.memBoardData.swapPercentData.rows.push({ '时间': timeString, '使用率': (swapData.percent/100)})

            this.memBoardData.swapPercentData.rows = sliceArrayLeftEndPoints(this.memBoardData.swapPercentData.rows, this.swapPercentMaxLinePoint)
        },
        fillVmDetailData(timeString, vmData) {
            this.memBoardData.vmDetailData.rows.push({ '时间': timeString, 'total': vmData.total, 'avalible': vmData.avalible, 'used': vmData.used, 'free': vmData.free})

            this.memBoardData.vmDetailData.rows = sliceArrayLeftEndPoints(this.memBoardData.vmDetailData.rows, this.vmInfoMaxLinePoint)
        },
        fillSwapDetailData(timeString, vmData) {
            this.memBoardData.swapDetailData.rows.push({ '时间': timeString, 'total': vmData.total, 'sin': vmData.sin, 'sout': vmData.sout, 'used': vmData.used, 'free': vmData.free})

            this.memBoardData.swapDetailData.rows = sliceArrayLeftEndPoints(this.memBoardData.swapDetailData.rows, this.swapInfoMaxLinePoint)
        },
        showBigVmPersent() {
            this.bigShowVmPercent = true,
            this.vmPercentEnlargeMultiple = this.maxMultiple
        },
        showBigSwapPercent() {
            this.bigShowSwapPercent = true,
            this.swapPercentEnlargeMultiple = this.maxMultiple
        },
        showDetailVmInfo(){
            this.detailShowVmInfo = true,
            this.vmInfoEnlargeMultiple = this.maxMultiple
        },
        showDetailSwapInfo(){
            this.detailShowSwapInfo = true,
            this.swapInfoEnlargeMultiple = this.maxMultiple
        },
        closeBigVmPercent() {
            this.bigShowVmPercent = false,
            this.vmPercentEnlargeMultiple = this.minMultiple
        },
        closeBigSwapPercent() {
            this.bigShowSwapPercent = false,
            this.swapPercentEnlargeMultiple = this.minMultiple
        },
        closeDetailVmInfo(){
            this.detailShowVmInfo = false,
            this.vmInfoEnlargeMultiple = this.maxMultiple
        },
        closeDetailSwapInfo(){
            this.detailShowSwapInfo = false,
            this.swapInfoEnlargeMultiple = this.minMultiple
        }
    }
})

app.countDashboardCpuTime()
app.fillCpuBoardInfo()
app.fillVmBoardInfo()