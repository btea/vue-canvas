<template>
  <div class="box">
    <router-view class="views"></router-view>  
  </div>
</template>

<script lang="ts">
export default {
  name: 'App'
}
</script>
<style lang="less" scoped>
@width: 100px;
.box,.views{
  height: 100%;
}
</style>
