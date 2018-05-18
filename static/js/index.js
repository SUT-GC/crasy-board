var app = new Vue({
    el: "#app",
    data: {
        message: "hello world",
        chartData: {
            columns: ['日期', '销售额'],
            rows: [
                { '日期': '1月1日', '销售额': 123 },
                { '日期': '1月2日', '销售额': 1223 },
                { '日期': '1月3日', '销售额': 2123 },
                { '日期': '1月4日', '销售额': 4123 },
                { '日期': '1月5日', '销售额': 3123 },
                { '日期': '1月6日', '销售额': 7123 }
            ]
        }
    },
    methods: {
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        }
    }
})