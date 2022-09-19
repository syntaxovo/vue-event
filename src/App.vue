<template>
<div>

<el-button>1231</el-button>
</div>
</template>
<script>
import { registerAPI } from '@/api/index'

export default {
  async  created () {
    const res = await registerAPI()
    console.log(res)
  }
}
</script>
<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
