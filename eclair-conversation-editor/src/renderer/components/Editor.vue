<template>
  <div class="wrapper">
    <div class="sidebar">
      <div class="sidebar-header">
        <h1 class="sidebar-icon"><img src="~@/assets/icon-white.svg" alt="Eclair Conversation Editor"></h1>
        <preference-button ref="preferenceButton" v-on:close="applyPreference"></preference-button>
      </div>
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
          <div class="meta-header">
            <button class="button" style="border: none; margin-right: 8px;" @click="metaCollapsed = !metaCollapsed"><b-icon
          :icon="metaCollapsed ? 'menu-right' : 'menu-down'">
            </b-icon></button>
            <h3>メタデータ</h3>
          </div>
          <section v-if="!metaCollapsed">
            <b-field label="概要">
              <b-input v-model="conversation['description']"></b-input>
            </b-field>
            <b-field label="キャラクター">
              <b-field grouped>
                <character-input v-model="conversation['character-left']"></character-input>
                <character-input v-model="conversation['character-right']"></character-input>
              </b-field>
            </b-field>
            <b-field label="会話送りタイプ">
                <b-select placeholder="Select a type" v-model="conversation['type']">
                    <option
                        v-for="option in conversationTypes"
                        :value="option.id"
                        :key="option.id">
                        {{ option.name }}
                    </option>
                </b-select>
            </b-field>
          </section>
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
  import PreferenceButton from "./Editor/PreferenceButton"

  const util = require('util');

  var env = require('../variables');
  var uuid = require('uuid');

  var electron = require('electron');
  const {shell} = require('electron')
  const {ipcRenderer} = require('electron')
  var remote = electron.remote;
  var fs = remote.require('fs');

  const path = require('path');

  const Store = require('electron-store');
  const store = new Store();

  export default {
    name: 'editor',
    components: {
      ConversationItem,
      CharacterInput,
      PreferenceButton,
      draggable
    },
    data: function(){ return {
        conversation: env.default_conversation,
        projectPath: "",
        path: "",
        isDarwin: process.platform === 'darwin',
        metaCollapsed: false
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
        if(this.path == "") {
          //this.path = this.projectPath + "Untitled.eclairconversation";
          var p = remote.dialog.showSaveDialog(null,{
              title: "Select a EclairConversation File",
              defaultPath: this.projectPath,
              filters: [
                {name: 'EclairConversation File', extensions: ['eclairconversation']},
                {name: 'Json File', extensions: ['json']}
              ]
            });
          if(p) this.path = p;
        }
        if(this.path != "") {
          fs.writeFileSync(this.path,str);
          this.applyFiletree(this.projectPath);
        }
      },
      new() {
        this.path = "";
        this.conversation = env.default_conversation;
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
          if(this.path != "") this.save();
          this.load(path.resolve(this.projectPath, '../') + node.data.pathname);
        }
      },
      revealInFinder(a,b) {
        shell.showItemInFolder(this.projectPath);
      },
      applyFiletree(directory) {
        parent = path.resolve(directory, '../');
        this.$refs.filetree.nodes = [];
        GetFileList.readSubDir(directory,
            (err) => {throw err},
            (itemPath) => {
              if(itemPath.endsWith('.eclairconversation')||itemPath.endsWith('.json')) 
                this.$refs.filetree.addPathToTree(itemPath.replace(parent,''), '', false);
            }
          );
      },
      applyPreference() {
        if(!store.get('projectPath')) {
          //設定を開く
          this.$refs.preferenceButton.isComponentModalActive = true;
        }
        else {
          this.projectPath = store.get('projectPath');
        }
        this.applyFiletree(this.projectPath);
      }
    },
    computed: {
      name: function() {
        return this.path == "" ? "Untitled" :
          this.path.replace(this.projectPath,'').replace(/\.[a-z]+$/gi,'');
      },
      content: { 
        get: function() {
          return this.conversation['content']
        },
        set: function(value) {
          this.conversation['content'] = value;
        }
      },
      conversationTypes: () => {
        return env.conversationTypes;
      }
    },
    mounted: function() {
      //this.projectPath = '/Users/wararyo/Git/EclairConversationEditor/'
      if(!store.get('projectPath')) {
        //初回起動だったら設定を開く
        this.$refs.preferenceButton.isComponentModalActive = true;
      }
      else {
        this.projectPath = store.get('projectPath');
      }
      this.applyFiletree(this.projectPath);

      //引数でファイル指定があったらそれを開く
      if(remote.process.argv.length > 1) {
        var p = remote.process.argv[1];
        if(p.match(/\.[a-zA-Z]+$/)) this.load(p);
      }

      //各種メニュー項目
      ipcRenderer.on('PreferenceRequired', () => {
        this.$refs.preferenceButton.isComponentModalActive = true;
      });
      ipcRenderer.on('New', () => {if(this.path != "") this.save(); this.new();});
      ipcRenderer.on('Save', this.save);
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
  .sidebar-header {
    height: 48px;
    display: flex;
    align-items: center;
  }
  .sidebar-icon {
    height: 24px;
    margin: 12px;
    flex: 1;
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
  .meta-header {
    display: flex;
    align-items: center;
    h3 {
      margin: 0 !important;
    }
  }
</style>