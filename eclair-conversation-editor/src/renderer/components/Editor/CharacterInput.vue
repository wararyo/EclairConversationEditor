<template>
    <section>
        <my-taginput
            v-model="characterList"
            :data="filteredCharacters"
            autocomplete
            :allow-new="false"
            field="name"
            :placeholder="placeholder"
            :disabled="!enabled"
            :closable="enabled"
            @typing="getFilteredCharacters"
            v-on:input="$emit('input', value)">
        </my-taginput>
    </section>
</template>

<script>
	import MyTaginput from './MyTaginput'
	var env = require('../../variables');

	export default {
    name: 'character-input',
    components: {
    	MyTaginput
    },
    props: {//['value','placeholder','enabled'],
        value: Array,
        placeholder: String,
        enabled: {
            type:Boolean,
            default:true
        }
    },
    data: function(){ return {
    		filteredCharacters: env.characters
    	};
	},
    methods: {
    	getFilteredCharacters(text) {
            this.filteredCharacters = env.characters.filter((c) => {
                return c.name
                    .toString()
                    .toLowerCase()
                    .indexOf(text.toLowerCase()) >= 0
            });
    	}
    },
    computed: {
    	characterList: {
    		//valueは数値の配列でidlはCharacter Objectの配列だよ
    		get: function() {
    			var list = [];
    			this.value.forEach(function(item){
    				list.push(env.characters.find((c) => {return c.id === item}));
    			});
    			return list;
    		},
    		set: function(idl) {
    			var list = [];
    			idl.forEach(function(item){
    				list.push(item.id);
    			});
    			this.value = list;
    		}
    	}
    }
  }
</script>

<style lang="scss">

</style>