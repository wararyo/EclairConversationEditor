import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

var electron = require('electron');
var remote = electron.remote;
var fs = remote.require('fs');
var data = JSON.parse(fs.readFileSync('/Users/wararyo/Git/EclairConversationEditor/test.json', 'utf8'));
console.log(data);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'editor',
      component: require('@/components/Editor').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
