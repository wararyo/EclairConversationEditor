<template>
    <div class="viewer">
        {{currentItem.content}}
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
        conversation: {},
        currentItemIndex: 0
    }},
    computed: {
        currentItem() {
            if(this.conversation.content === void 0) return {content:"Hello!"};
            return this.conversation.content[this.currentItemIndex];
        }
    },
    mounted() {
        ipcRenderer.on('Play',(event,conversation,id) => {
            this.conversation = conversation;
            if(conversation)
                this.currentItemIndex = conversation.content.findIndex((i) => i.id === id);
        });
        ipcRenderer.send('viewer-ready');
    }
}
</script>