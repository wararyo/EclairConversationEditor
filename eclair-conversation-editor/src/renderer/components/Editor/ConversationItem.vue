<template>
	<li tabIndex="1" class="conversation-item">
    <b-field>
      <character-input v-model="item.character"></character-input>
    </b-field>
		<b-field>
      <b-input type="textarea" v-model="item.content" placeholder="セリフ" rows="3"></b-input>
    </b-field>
    <b-field grouped group-multiline>
      <b-field>
        <b-input v-model.number="item.duration" placeholder="-1で無限" type="number" step="0.1" min="-1">
        </b-input>
        <p class="control">
          <span class="button is-static">秒</span>
        </p>
      </b-field>
      <b-field grouped>
        <button class="add is-success is-outlined button" v-on:click="$emit('add', item)">+</button>
        <button v-if="removable" class="remove is-danger is-outlined button" v-on:click="$emit('remove', item)">×</button>
      </b-field>
    </b-field>
	</li>
</template>

<script>
  import CharacterInput from "./CharacterInput"

	export default {
    name: 'conversation-item',
    components: {
      CharacterInput
    },
    props: ['item','removable'],
    data: function(){ return {
        
      }
    },
    methods: {
      alert() {
          this.$dialog.alert('Everything looks fine!')
      }
    }
  }
</script>

<style lang="scss">
  @import "~styles/color";
	.conversation-item {
    position: relative;
    display: block;
		padding: 16px;
    border-bottom: 1px solid $light-gray;
	}
  .add.button {
    //position: absolute;
    //z-index: 50;
    //right: 16px;
    //bottom: 0;
    //transform: translateY(50%);
  }
  .is-focus-only {
    //visibility: hidden;
    &:focus {
      visibility: visible;
    }
  }
  .conversation-item:focus {
    background-color: rgba($eclair-orange,.05);
    .is-focus-only{
      visibility: visible;
    }
  }
  .conversation-item *:focus ~ .is-focus-only {
    visibility: visible;
  }
</style>