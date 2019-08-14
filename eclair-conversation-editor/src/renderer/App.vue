<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'eclair-conversation-editor'
  }
</script>

<style lang="scss">
body {
  overflow: hidden;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
