<template>
  <div>
    hello World
  </div>
</template>

<script>

import {getCookie} from '../../utils/CookieUtils.js'

export default {
  name: 'Index',
  components: {
  },
  created: function() {
    let username = getCookie(document, 'crasy-board-user')
    if(!username) {
      window.location.href="/login.html"
    }

    this.$http.post('http://localhost:5000/check/', JSON.stringify({'username':username})).then(function(response) {
        let data = response.data
        console.log(data)
        if (data || data.code !== 200) {
          console.log(data)
          window.location.href="/login.html"
        }
    }, function(response) {
      alert("服务异常，请稍后再试")
    })
  }
}
</script>

<style>
</style>
