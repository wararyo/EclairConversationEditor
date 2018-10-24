<template>
  <div class="wrapper">
    <div class="sidebar">
      <h1 class="sidebar-icon"><img src="~@/assets/icon-white.svg" alt="Eclair Conversation Editor"></h1>
      <div class="file-brower-container">
        <file-browser-tree 
          id="file-tree"
          ref="filetree"
          @nodeClick="nodeClick">

          <template slot="context-menu">
              <div @click="revealInFinder">Reveal in {{isDarwin ? 'Finder':'Explorer'}}</div>
          </template>

        </file-browser-tree>
      </div>
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
          <b-field label="キャラクター">
            <b-field grouped>
              <character-input v-model="conversation['character-left']"></character-input>
              <character-input v-model="conversation['character-right']"></character-input>
            </b-field>
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
  import CharacterInput from "./Editor/CharacterInput"
  import GetFileList from "../utils/GetFileList"

  const util = require('util');

  var env = require('../variables');
  var uuid = require('uuid');

  var electron = require('electron');
  const {shell} = require('electron')
  var remote = electron.remote;
  var fs = remote.require('fs');

  const path = require('path');

  export default {
    name: 'editor',
    components: {
      ConversationItem,
      CharacterInput,
      draggable
    },
    data: function(){ return {
        conversation: env.default_conversation,
        projectPath: "",
        path: "",
        isDarwin: process.platform === 'darwin'
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
        if(this.path != "") fs.writeFileSync(this.path,str);
      },
      add(item) {
        var newItem = Object.assign({},item);
        newItem.id = uuid.v1();
        this.content.splice(this.content.indexOf(item)+1,0,newItem);
      },
      remove(item){
        this.content.splice(this.content.indexOf(item),1);
      },
      nodeClick(event, node) {
        if(node.isLeaf) {
          this.save();
          this.load(path.resolve(this.projectPath, '../') + node.data.pathname);
        }
      },
      revealInFinder(a,b) {
        shell.showItemInFolder(this.projectPath);
      },
      applyFiletree(directory) {
        parent = path.resolve(directory, '../');
        GetFileList.readTopDir(directory,
            (err) => {throw err},
            (itemPath) => {
              if(itemPath.endsWith('.eclairconversation')||itemPath.endsWith('.json')) 
                this.$refs.filetree.addPathToTree(itemPath.replace(parent,''), '', false);
            }
          );
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
    },
    mounted: function() {
      this.projectPath = '/Users/wararyo/Git/EclairConversationEditor/'
      this.applyFiletree(this.projectPath);
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
    width: 240px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: $gray;
  }
  .sidebar-icon {
    height: 24px;
    margin: 12px;
    text-align: center;
  }
  .file-brower-container {
    flex:1;
    overflow: scroll;
  }
  .sl-vue-tree.sl-vue-tree-root {
    border: none !important;
    background: none !important;
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