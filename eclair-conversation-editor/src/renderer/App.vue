<template>
  <div id="app">
    <router-view></router-view>
    <b-modal :width="360" v-on:close="$emit('close')" :active.sync="isComponentModalActive" has-modal-card>
      <update-modal :currentVersion="currentVersion" :latestVersion="latestVersion"></update-modal>
    </b-modal>
  </div>
</template>

<script>
import UpdateModal from './components/UpdateModal'
export default {
  name: 'eclair-conversation-editor',
  components: {
    UpdateModal
  },
  data: function() {return {
    isComponentModalActive: false,
    latestVersion: "",
    currentVersion: ""
  }},
  mounted() {
    //最新バージョンをチェック
    if (process.env.NODE_ENV === 'production') {
      this.currentVersion = process.env.npm_package_version;
      fetch("https://api.github.com/repos/wararyo/eclairconversationeditor/releases/latest")
      .then((response) => response.json())
      .then((o) => {
        this.latestVersion = o.tag_name.match(/[0-9¥.]+/)[0];
        if(this.currentVersion !== this.latestVersion) { //最新版がある
          this.isComponentModalActive = true;
        }
      });
    }
  }
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
