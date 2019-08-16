<template>
    <div class="viewer">
        <div v-for="item in conversation.content" :key="item.id" >
            {{item.content}}
        </div>
    </div>
</template>

<style lang="scss" scoped>

</style>

<script>
var electron = require('electron');
const {shell} = require('electron')
const {ipcRenderer} = require('electron')
const remote = electron.remote;
export default {
    data: function() { return {
        conversation: {}
    }},
    mounted() {
        ipcRenderer.on('Play',(event,conversation,index) => {
            console.log(conversation);
            console.log(index);
            this.conversation = conversation;
        });
        ipcRenderer.send('viewer-ready');
    }
}
</script>