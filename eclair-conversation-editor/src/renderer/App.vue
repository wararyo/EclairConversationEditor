<template>
  <div id="app">
    <router-view></router-view>
    <b-modal :width="360" v-on:close="$emit('close')" :active.sync="isComponentModalActive" has-modal-card>
      <update-modal :currentVersion="currentVersion" :latestVersion="latestVersion"></update-modal>
    </b-modal>
  </div>
</template>

<script>
const { shell } = require('electron');

//アップデートがある時に表示するモーダル
const UpdateModal = {
  template: `
      <form action="">
          <div class="modal-card">
              <header class="modal-card-head">
                  <p class="modal-card-title">New Version is Available!</p>
              </header>
              <section class="modal-card-body">
                  <p>Current: {{currentVersion}}</p>
                  <p>Latest: {{latestVersion}}</p>
              </section>
              <footer class="modal-card-foot">
                  <button class="button" type="button" @click="$parent.close()">Cancel</button>
                  <button class="button is-primary" @click="openUpdater();$parent.close()">Update</button>
              </footer>
          </div>
      </form>
  `,
  props: ['latestVersion','currentVersion'],
  methods: {
    openUpdater() {
      shell.openExternal("https://github.com/wararyo/EclairConversationEditor/releases");
    }
  }
}

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
    if (process.env.NODE_ENV === 'production') {
      this.currentVersion = process.env.npm_package_version;
      fetch("https://api.github.com/repos/wararyo/eclairconversationeditor/releases/latest")
      .then((response) => response.json())
      .then((o) => {
        this.latestVersion = o.tag_name.match(/[0-9¥.]+/)[0];
        if(this.currentVersion === this.latestVersion) { //最新版がある
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
