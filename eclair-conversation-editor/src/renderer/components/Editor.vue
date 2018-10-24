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
        <draggable v-model="content" :options="{animation:160,handle:'.conversation-item'}" @start="drag=true" @end="drag=false">
          <div v-for="item in content" :key="item.id" >
            <conversation-item :removable="content.length != 1" :item="item" v-on:add="add($event)" v-on:remove="remove($event)"></conversation-item>
          </div>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script>
  import ConversationItem from "./Editor/ConversationItem"
  import draggable from 'vuedraggable'

  var env = require('../variables');
  var uuid = require('uuid');
  console.log(uuid.v1());

  var electron = require('electron');
  var remote = electron.remote;
  var fs = remote.require('fs');

  export default {
    name: 'editor',
    components: {
      ConversationItem,
      draggable
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
      },
      add(item) {
        var newItem = Object.assign({},item);
        newItem.id = uuid.v1();
        this.content.splice(this.content.indexOf(item)+1,0,newItem);
      },
      remove(item){
        this.content.splice(this.content.indexOf(item),1);
      }
    },
    computed: {
      name: function() {
        return this.path == "" ? "Untitled" : this.path.match(".+/(.+?)\.[a-z]+([\?#;].*)?$")[1];
      },
      content: { 
        get: function() {
          return this.conversation['content']
        },
        set: function(value) {
          this.conversation['content'] = value;
        }
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
    display: flex;
    flex-direction: column;
    align-items: stretch;
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
    width: 100%;
    max-width: 800px;
    flex: 1;
    margin: 0 auto;
    overflow:scroll;
    .content-meta {
      padding: 16px;
      border-bottom: 1px solid $light-gray;
    }
    > ul {
      margin: 0 0 16px 0;
    }
  }
</style>