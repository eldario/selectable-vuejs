let gTemplate = '<div v-bind:class="[ownclass, isOpen ? openclass : \'\', list.width<100?\'small\':\'\', list.disabled?\'disabled\':\'\']" v-on:click="tryopen" v-bind:style="{ width:list.width }" v-click-outside="closeit">\
		<input class="gde-firstelem" v-if="list.withSearch" :placeholder="list.selectedtext" :value="list.selectedtext" v-on:keyup="searchValues">\
		<div class="gde-firstelem" v-else>{{ list.selectedtext }}</div>\
		<div class="gde-listitems">\
			<ul>\
				<li v-for="l in list.list" v-bind:value="l.ID" v-on:click="change" v-bind:class="[ list.selected == l.ID ? openclass : \'\' ]">{{ l.NAME }}</li>\
			</ul>\
		</div>\
	</div>';

Vue.directive('click-outside', {
	bind:function(el,binding,vnode){
		var self = this;
		this.event = function(event){
			if(!(el == event.target || el.contains(event.target))) vnode.context[binding.expression](event);
		}
		document.body.addEventListener('click',this.event)
	},
	unbind:function(){
		document.body.removeEventListener('click',this.event)
	}
});

Vue.component('g-selectable',{
	props:['list'],
	template: gTemplate,
	data:function(){
		return {ownclass:'gde-selectable',openclass:'a',isOpen:false,selectedtext:'',selected:'',disabled:this.list.disabled}
	},
	methods:{
		change: function(e){
			this.list.selected = e.target.value;
			this.list.selectedtext = e.target.innerText;
			this.list.change(this.$parent);
		},
		closeit: function(event){
			this.isOpen = false;
		},
		clean: function(event){
			console.log('clean')
		},
		searchValues: function(e){
			this.list.list.forEach(function(item){
				item.show = (String(item.NAME).toLowerCase().indexOf(e.target.value.toLowerCase())>-1);
			});
		},
		tryopen:function(){
			this.isOpen = (!this.disabled&&!this.isOpen);
		}
	}
});

var vm = new Vue({
	el: '#app',
	data:{
		src:{
			init:function(p){
				var find = p.src.filter(function(item){
				  return item.ID == p.city;
				});
				this.list = p.src.map(function(item){
				  return item.show = true;
				});
				this.list = p.src;
				this.selected = find[0].ID;
				this.selectedtext = find[0].NAME;
			},
			selected:'',
			selectedtext: '',
			width:380,
			list:[],
			withSearch:true
		},
	},
	created: function(){
		var p = {city:1,src:[{"ID":1,"NAME":"Moscow"},{"ID":2,"NAME":"Лондон"},{"ID":3,"NAME":"Miami"},{"ID":4,"NAME":"Delhi"},{"ID":5,"NAME":"Lima"},{"ID":6,"NAME":"Bangkok"}]};
		this.src.init(p);
	}
});
