<template>
    <div class="viewer">
        {{currentItem.content}}
        <div class="progress-bar" :style="`transform:translateX(calc(-100% + ${progress}%))`"></div>
    </div>
</template>

<style lang="scss" scoped>
.viewer {
    white-space: pre;
    text-align: center;
}
.progress-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 3px;
    background-color: orangered;
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
        lastTime: Date.now(),
        progress: 0
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
                this.isPlaying = false;
                if(conversation.type !== 1) this.isPlaying = true;
            }
        });
        ipcRenderer.send('viewer-ready');
        this.tick();
    },
    methods: {
        tick() {
            let time = Date.now() - this.lastTime;
            if(this.currentItem) this.progress = time / this.currentItem.duration / 10;
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