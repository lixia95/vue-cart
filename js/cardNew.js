new Vue({
 	el:'#app',
 	data:{
 		totalMoney: 0,
 		productList:[],
 		checkAllFlag:false,
 		totalPrice: 0,
 		delFlag:false,
 		curProduct:'',
 	},
 	filters:{//局部过滤器
 		formatMoney:function(value){//格式化
 			return "¥" +value.toFixed(2);
 		}
 	},
 	// 编译完成之后默认需要查询某一个方法就要定义个mounted,替换ready
 	mounted: function(){
 		this.$nextTick(function(){
 			//保证 this.$el 已经插入文档
 			this.cartView();
 		});
 		
 	},
 	methods:{
 		cartView: function(){
 			// var _this = this;
 			// this.$http.get("data/cartData.json",{"id":123}).then(function(res){
 			// 	//resouce插件返回的不是json格式，封装好的，需要通过调试获得
 			// 	_this.productList = res.body.result.list;
 			// 	_this.totalMoney = res.body.totalMoney;
 			// })
 			let _this = this;
 			this.$http.get('data/cartData.json',{"id":123}).then(res=>{
 				this.productList = res.body.result.list;
 				this.totalMoney = res.body.totalMoney;
 			});
 		},
 		changeMoney:function(product,way){
 			if(way>0){
 				product.productQuantity++;
 			}else{
 				product.productQuantity--;
 				if(product.productQuantity<1){
 					product.productQuantity = 1;
 				}
 			}
 			this.calcTotalPrice();
 		},
 		selectedProduct:function(item){
 			if(typeof item.checked == 'undefined'){
 				// Vue.set(item,'checked',true);//在item全局注册checked属性
 				// 点击之后才会选中
 				this.$set(item,'checked',true);//局部注册
 			}else{
 				item.checked = !item.checked
 			}
 			this.calcTotalPrice();
 		},
 		checkAll:function(){
 			this.checkAllFlag = !this.checkAllFlag;
 			var _this=this;
 			// 遍历物品数组，让数组内的选中状态与全选按钮同步
 			this.productList.forEach((item,index)=>{
 				if(typeof item.checked == 'undefined'){
 					_this.$set(item,'checked',_this.checkAllFlag);//局部注册
 				}else{
 					item.checked = _this.checkAllFlag
 				}
 				this.calcTotalPrice();
 			});
 			// if(this.checkAllFlag){
 			// 	// $.each(function(index,value){});
 			// 	this.productList.forEach(function(item,index){
		 	// 		if(typeof item.checked == 'undefined'){
		 	// 			_this.$set(item,'checked',_this.checkAllFlag);//局部注册
		 	// 		}else{
		 	// 			item.checked = _this.checkAllFlag;
		 	// 		}
 			// 	})
 			// }
 		},
 		// 计算总价
 		calcTotalPrice: function(){
 			var _this= this;
 			this.totalPrice = 0;
 			this.productList.forEach((item,index)=>{
 				if(item.checked){
 					_this.totalPrice += item.productPrice*item.productQuantity;
 				}
 			});
 		},
 		// 删除物品
 		delConfirm:function(item){
 			this.delFlag=true;
 			this.curProduct = item;
 			console.log(this.curProduct);
 		},
 		delProduct:function(){
 			var index = this.productList.indexOf(this.curProduct);
 			console.log(index)
 			this.productList.splice(index, 1);
 			this.delFlag = false;
 		},
 	}
 });
// 全局过滤器
Vue.filter("money",function(value,type){
	return "¥" +value.toFixed(2)+ type;
});