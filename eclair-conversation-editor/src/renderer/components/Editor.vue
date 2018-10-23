<template>
  <div class="wrapper">
    <div class="sidebar">
      <p>ECE</p>
    </div>
    <div class="main">
      <header>
        <h2>Eclair Conversation Editor</h2>
        <button>Save</button>
      </header>
      <div class="content">
        <button class="button is-medium is-primary" @click="alert">
          Launch alert (default)
        </button>
        
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'editor',
    methods: {
      alert() {
          this.$dialog.alert('Everything looks fine!')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~styles/color";
  .wrapper {
    display: flex;
    height: 100vh;
    width: 100vw;
  }
  .sidebar {
    width: 200px;
    height: 100vh;
    background-color: $eclair-orange;
  }
  .main {
    flex: 1;
    position: relative;
  }
	header {
    height: 48px;
    padding: 0 16px;
    position: relative;
    z-index: 10;
    display: flex;
    align-items: center;
    color: $white;
    background-color: $color-eclair;
    box-shadow: 0 3px 6px rgba($black, .2);

    h2 {
      flex: 1;
      font-weight: bold;
    }
  }
  .content {
    max-width: 800px;
    margin: 0 auto;
    overflow:scroll;
  }
</style>