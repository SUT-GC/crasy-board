<template>
  <div>
    hello World
  </div>
</template>

<script>

export default {
  name: 'Index',
  components: {
  },
  created: function() {
    this.$http.get('http://localhost:5000/login/').then(function(response) {
        let data = response.data
        console.log(data)
        if (data || data.code !== 200) {
          window.location.href="/login.html"
        }
    }, function(response) {

    })
  }
}
</script>

<style>
</style>
