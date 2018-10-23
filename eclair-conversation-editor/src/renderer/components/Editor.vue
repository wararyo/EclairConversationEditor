<template>
  <div class="wrapper">
    <div class="sidebar">
      <h1 class="sidebar-icon"><img src="~@/assets/icon-white.svg" alt="Eclair Conversation Editor"></h1>
      <button class="button is-medium is-primary" @click="test">
        Load Test
      </button>
    </div>
    <div class="main">
      <header>
        <h2>{{name}}</h2>
        <button @click="save">Save</button>
      </header>
      <div class="content">
        <div class="content-meta">
          <h3>メタデータ</h3>
          <b-field label="概要">
            <b-input v-model="conversation['description']"></b-input>
          </b-field>
        </div>
        <conversation-item v-for="item in conversation['content']" v-bind:item="item"></conversation-item>
      </div>
    </div>
  </div>
</template>

<script>
  import ConversationItem from "./Editor/ConversationItem"
  var env = require('../variables');

  var electron = require('electron');
  var remote = electron.remote;
  var fs = remote.require('fs');

  export default {
    name: 'editor',
    components: {
      ConversationItem
    },
    data: function(){ return {
        conversation: env.default_conversation,
        path: ""
      };
    },
    methods: {
      test() {
          this.load('/Users/wararyo/Git/EclairConversationEditor/test.json');
      },
      load(path) {
        this.path = path;
        this.conversation = JSON.parse(fs.readFileSync(path, 'utf8'));
      },
      save() {
        var str = JSON.stringify(this.conversation,null,2);
        fs.writeFileSync('/Users/wararyo/Git/EclairConversationEditor/test.json',str);
      }
    },
    computed: {
      name: function() {
        return this.path == "" ? "Untitled" : this.path.match(".+/(.+?)\.[a-z]+([\?#;].*)?$")[1];
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
    background-color: $gray;
  }
  .sidebar-icon {
    height: 24px;
    margin: 12px;
    text-align: center;
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
    .content-meta {
      padding: 16px;
      border-bottom: 1px solid $light-gray;
    }
  }
</style>