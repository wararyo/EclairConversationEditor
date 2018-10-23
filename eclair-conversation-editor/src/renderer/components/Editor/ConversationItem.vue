<template>
	<div class="conversation-item">
		<p>hogehoge</p>
		<p>{{ item.content }}</p>
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

</style>