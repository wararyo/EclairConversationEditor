<template>
    <div class="viewer">
        {{currentItem.content}}
    </div>
</template>

<style lang="scss" scoped>
.viewer {
    white-space: pre;
    text-align: center;
}
</style>

<script>
var electron = require('electron');
const {shell} = require('electron')
const {ipcRenderer} = require('electron')
const remote = electron.remote;
export default {
    data: function() { return {
        conversation: {},
        currentItemIndex: 0,
        isPlaying: false,
        lastTime: Date.now()
    }},
    computed: {
        currentItem() {
            if(this.conversation.content === void 0) return {content:"Hello!"};
            return this.conversation.content[this.currentItemIndex];
        },
    },
    watch: {
        isPlaying() {
            if(this.isPlaying){
                this.lastTime = Date.now();
                this.tick();
            }
        }
    },
    mounted() {
        ipcRenderer.on('Play',(event,conversation,id) => {
            this.conversation = conversation;
            if(conversation) {
                this.currentItemIndex = conversation.content.findIndex((i) => i.id === id);
                if(this.currentItemIndex === -1) this.currentItemIndex = 0;
                if(conversation.type !== 1) this.isPlaying = true;
            }
        });
        ipcRenderer.send('viewer-ready');
        this.tick();
    },
    methods: {
        tick() {
            let time = Date.now() - this.lastTime;
            console.log(time);
            if(time > this.currentItem.duration * 1000) {
                if(this.currentItemIndex === this.conversation.content.length - 1) this.isPlaying = false;
                else this.currentItemIndex++;
                this.lastTime = Date.now();
            }
            if(this.isPlaying) window.requestAnimationFrame(this.tick);
        }
    }
}
</script>