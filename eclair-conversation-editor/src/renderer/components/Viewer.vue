<template>
    <p>hoge</p>
</template>

<style lang="scss" scoped>

</style>

<script>
var electron = require('electron');
const {shell} = require('electron')
const {ipcRenderer} = require('electron')
const remote = electron.remote;
export default {
    mounted() {
        ipcRenderer.on('Play',(event,index) => {
            console.log(index);
        });
    }
}
</script>