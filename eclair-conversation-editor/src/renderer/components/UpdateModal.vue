<template>
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
</template>

<script>
const { shell } = require('electron');
export default {
  props: ['latestVersion','currentVersion'],
  methods: {
    openUpdater() {
      shell.openExternal("https://github.com/wararyo/EclairConversationEditor/releases");
    }
  }
}
</script>