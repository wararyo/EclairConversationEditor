<template>
  <div class="wrapper" id="wrapper">
    <div class="sidebar">
      <div class="sidebar-header">
        <h1 class="sidebar-icon"><img src="~@/assets/icon-white.svg" alt="Eclair Conversation Editor"></h1>
        <preference-button ref="preferenceButton" v-on:close="applyPreference"></preference-button>
      </div>
      <div class="file-brower-container">
        <tree ref="tree" :options="treeOptions" v-model="selectedFileInTree">
          <span class="tree-text" slot-scope="{ node }">
            <template v-if="node.hasChildren()">
              <i :class="[node.expanded() ? 'mdi mdi-folder-open mdi-16px' : 'mdi mdi-folder mdi-16px']"></i>
              {{ node.text }}
            </template>

            <template v-else>
              <i class="mdi mdi-comment mdi-16px"></i>
              {{ node.text }}
            </template>
          </span>
        </tree>
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
  import PreferenceButton from "./Editor/PreferenceButton"
  import copy from 'copy-to-clipboard'
  import Tree from 'liquor-tree'

  const util = require('util');
  const GetFileList = require("../utils/GetFileList");

  var env = require('../variables');
  var uuid = require('uuid');

  var electron = require('electron');
  const {shell} = require('electron')
  const {ipcRenderer} = require('electron')
  const remote = electron.remote;
  const Menu = remote.Menu;
  const MenuItem = remote.MenuItem;
  const fs = remote.require('fs');

  const path = require('path');

  const Store = require('electron-store');
  const store = new Store();

  export default {
    name: 'editor',
    components: {
      ConversationItem,
      CharacterInput,
      PreferenceButton,
      draggable,
      Tree
    },
    data: function(){ return {
        conversation: env.default_conversation,
        projectPath: "",
        path: "",
        isDarwin: process.platform === 'darwin',
        metaCollapsed: false,
        treeOptions: {
          multiple: false,
          fetchData(node) {
            if(store.get('projectPath') !== void 0) {
              return GetFileList.generateFileTree(node.id === 'root'?store.get('projectPath'):node.id,(p) => {
                return p.endsWith('.eclairconversation') || p.endsWith('.json');
              });
            }
            else return Promise.reject();
          }
        },
        selectedFileInTree: {},
        hasChange: false
      };
    },
    methods: {
      test() {
        this.load('/Users/wararyo/Git/EclairConversationEditor/test.json');
      },
      load(path) {
        if(this.path != "" && this.hasChange) this.save();
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
        }
      },
      open() {
        var p = remote.dialog.showOpenDialog(null,{
              title: "Open a EclairConversation File",
              defaultPath: this.projectPath,
              filters: [
                {name: 'EclairConversation File', extensions: ['eclairconversation']},
                {name: 'Json File', extensions: ['json']}
              ]
            });
        if(p[0]) this.load(p[0]);
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
      textize() {
        let str = "";
        str += this.conversation.description + "\n";
        for(let item of this.conversation.content) {
          item.character.forEach(c => {str += env.characters.find(x => x.id === c).abbreviation});
          str += ": " + item.content.replace(/\n/g,"") + "\n";
        }
        return str;
      },
      copyAsText() {
        copy(this.textize());
      },
      copyAsTextFromFolder() {
        var p = remote.dialog.showOpenDialog(null,{
          title: "Choose Folder",
          defaultPath: this.projectPath,
          properties: ['openDirectory']
        })[0];
        fs.readdir(p, (err, dir) => {
          if(err) {
            console.log(err);
            return;
          }
          let str = "";
          for (let file of dir) {
            const ext = path.extname(file);
            if (ext === '.eclairconversation' || ext === '.json') {
              this.load(path.resolve(path.join(p, file)));
              str += this.textize() + "\n";
            }
          }
          copy(str);
          console.log("Copied.")
        });
      },
      revealInFinder(path) {
        shell.showItemInFolder(path);
      },
      applyPreference() {
        if(!store.get('projectPath')) {
          //設定を開く
          this.$refs.preferenceButton.isComponentModalActive = true;
        }
        else {
          this.projectPath = store.get('projectPath');
        }
        this.$refs.tree.tree.fetchInitData().then(data => this.$refs.tree.tree.setModel(data));
      }
    },
    watch: {
      selectedFileInTree(node) {
        if(node !== null) if(!node.hasChildren()) {
          this.load(node.id);
        }
      },
      conversation: {
        handler() {
          this.hasChange = true;
        },
        deep: true
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
    mounted() {
      if(!store.get('projectPath')) {
        //初回起動だったら設定を開く
        this.$refs.preferenceButton.isComponentModalActive = true;
      }
      else {
        this.projectPath = store.get('projectPath');
      }

      //引数でファイル指定があったらそれを開く
      if(remote.process.argv.length > 1) {
        var p = remote.process.argv[1];
        if(p.match(/\.[a-zA-Z]+$/)) this.load(p);
      }

      //Macでファイル指定があったらそれを開く
      if(remote.process.openFile !== void 0) {
        if(remote.process.openFile.match(/\.[a-zA-Z]+$/)) this.load(remote.process.openFile);
      }

      //ツリービュー右クリック
      var treePopup = new Menu();
      treePopup.$vm = this;
      treePopup.append(new MenuItem({ label: `Reveal in ${this.isDarwin ? 'Finder':'Explorer'}`, click: function(e) { treePopup.$vm.revealInFinder(treePopup.path); } }));

      this.$refs.tree.$el.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        treePopup.path = e.path.find((i) => i.dataset.id !== void 0).dataset.id;
        treePopup.popup(remote.getCurrentWindow());
      }, false);

      //各種メニュー項目
      ipcRenderer.on('PreferenceRequired', () => {
        this.$refs.preferenceButton.isComponentModalActive = true;
      });
      ipcRenderer.on('New', () => {if(this.path != "" && this.hasChange) this.save(); this.new();});
      ipcRenderer.on('Load',(event,path) => this.load(path));
      ipcRenderer.on('Open', this.open);
      ipcRenderer.on('Save', this.save);
      ipcRenderer.on('CopyAsText', this.copyAsText);
      ipcRenderer.on('CopyAsTextFromFolder', this.copyAsTextFromFolder);
      ipcRenderer.on('ExpandAll', () => {this.metaCollapsed = false;});
      ipcRenderer.on('CollapseAll', () => {this.metaCollapsed = true;});

      //ドラッグ&ドロップ
      var dropArea = document.getElementById('wrapper');
      dropArea.$vm = this;
      dropArea.ondragover = function () {
        return false;
      };
      dropArea.ondragleave = dropArea.ondragend = function () {
        return false;
      };
      dropArea.ondrop = function (e) {
        e.preventDefault();
        var file = e.dataTransfer.files[0];
        dropArea.$vm.load(file.path);
        return false;
      };
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
    overflow: hidden auto;
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
    overflow: hidden scroll;
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

<style lang="scss">
  @import "~styles/color";
  .tree {
    height: 100%;
    font-size: 0.8rem;
    &::-webkit-scrollbar {
      display: none;
    }
    > .tree-root {
      padding: 0;
    }
    i {
      margin: 0 4px;
    }
  }
  .tree-arrow {
    display: none;
  }
  .tree-anchor {
    color: #F0F0F0;  
    line-height: 16px;
    overflow: hidden;
  }
  .tree-node:not(.selected) > .tree-content:hover {
    background: rgba(white,.3);
  }
  .tree-node.selected > .tree-content {
    background: rgba(white,.3);
  }
  .tree-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .mdi-comment {
    color:lighten($color-eclair,10%);
  }
</style>