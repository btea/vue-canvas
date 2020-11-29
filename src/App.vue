<template>
  <div class="container">
    <div class="menu"></div>
    <div class="view">
      <router-view></router-view>
    </div>  
  </div>
</template>

<script lang="ts">
export default {
  name: 'App'
}
</script>
<style lang="less" scoped>
@width: 400px;
.container{
  margin: 0;
  padding: 0;
  display: flex;
  height: 100%;
  .menu{
    width: @width;
    height: 100%;
    overflow-y: auto;
  }
  .view{
    flex: 1;
  }
}

</style>
