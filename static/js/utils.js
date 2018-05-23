var setCookie = function(doc, key, value) {
    console.log(doc, key, value)
    var days = 30;   
    var expires = new Date();   
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000 );   
    doc.cookie = key + "="+ escape(value) + ";expires=" + expires.toGMTString();     
}
var getCookie = function(doc, key) {
    console.log(doc, key)

    var arr,reg = new RegExp("(^| )"+key+"=([^;]*)(;|$)");  
    if(arr=doc.cookie.match(reg)) {  
        return unescape(arr[2]);   
    }  
    return "";  
}

var getNowTimeString = function() {
    let date = new Date()
    let timeString = "" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ""

    return timeString
}