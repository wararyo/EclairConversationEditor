<template>
	<div class="conversation-item">
		<b-field>
      <b-input type="textarea" v-model="item.content" placeholder="セリフ" rows="3"></b-input>
    </b-field>
    <b-field>
      <b-input v-model.number="item.duration" placeholder="-1で無限" type="number" step="0.1" min="-1">
      </b-input>
      <p class="control">
        <span class="button is-static">秒</span>
      </p>
    </b-field>
	</div>
</template>

<script>
	export default {
    name: 'conversation-item',
    props: ['item'],
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
		padding: 16px;
    border-bottom: 1px solid $light-gray;
	}
</style>