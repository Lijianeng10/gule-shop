<template>
  <div class="myOrder">
    <mt-header title="确认订单">
        <router-link to="" slot="left">
            <mt-button  onclick="window.history.go(-1)" icon="back">返回</mt-button>
        </router-link>
    </mt-header>        
    <!--<p @click="showA"><mt-cell is-link>{{ this.defaultAddress }}</mt-cell></p>-->
      <div class="container">
          <li v-for="(item, key) in goods" :key="item.id">
              <div class="list">
                  <div class="left">
                      <img :src="item.pic" alt="">
                  </div>
                  <div class="right">
                      <p class="product_name">{{ item.name }}  <span class="product_bill">￥{{ item.price }}</span></p>
                      <div class="product_amount">
                          <p>{{item.detail}}</p>
                      </div>
                  </div>
              </div>
          </li>
      </div>
      <div class="total-wrapper">
          <div class="left">
              <p> 共<span style="color: red">{{ goods.length }}</span>件商品,合计：￥<span style="color: red">{{ sum }}</span></p>
              <!--<div class="store">-->
              <!--<img src="./store.png" alt="">-->
              <!--<p @click="store">收藏</p>-->
              <!--</div>-->
          </div>
          <div class="right">
              <button class="bill" @click="buy">提交订单</button>
          </div>
      </div>
    <Vaddress v-show="show" ref='address' @addr="childAddr" :child-order='this.order'></Vaddress>
  </div>
</template>
<script>
import Vaddress from './address'
export default {
  data () {
    return {
      goods: [],
      message: '',
      defaultAddress: '',
      order: '',
      show: false,
        pidAry:'',
        sum: '0.00',
        menu: [],
        num: 0
    }
  },
  methods: {
    // childAddr (data) {
    //   this.defaultAddress = data
    // },
    // showA () {
    //   this.$refs.address.showaddress()
    // },
    // bill () {
    //   if (this.defaultAddress !== null) {
    //     console.log(this.order)
    //     window.open('http://www.ethedot.com/chatshop/Pay/pubpay/order/' + this.order)
    //   } else {
    //     alert('请选地址')
    //   }
    // },
      //下单
      buy () {
          var that = this
          var goods = this.goods
          var goods_nums = 0;
          var order_money = 0;
          for (var i = 0; i < goods.length; i++) {
              // if (goods[i].status === true) {
                  this.menu.push({
                      product_id: goods[i].gid,
                      nums: goods[i].counter,

                  })
                  goods_nums +=goods[i].counter;
                  order_money +=goods[i].counter*goods[i].price
              // }
          }
          if (this.menu.length !== 0) {
              var that = this;
              var strData = {
                  'token': localStorage.getItem('token'),
                  concent: that.menu,
                  goods_nums:goods_nums,
                  order_money:order_money
              }
              this.axios.post('/api/front/order/play-order',strData).then(function (response) {
                  if(response.data.code !=600){
                      that.mintUI.Toast(response.data.msg);
                  }else{
                      if (typeof WeixinJSBridge == "undefined"){
                          if( document.addEventListener ){
                              document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                          }else if (document.attachEvent){
                              document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                              document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                          }
                      }else{
                          that.onBridgeReady(response.data.result);
                      }

                  }
              }).catch(function (error) {
                  console.log(error)
              })
          }else{
              this.mintUI.Toast('请选择需要购买的产品！');
          }
      },
       onBridgeReady(data){
            var that = this
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', {
                    "appId":data.appId,     //公众号名称，由商户传入
                    "timeStamp":data.timeStamp,         //时间戳，自1970年以来的秒数
                    "nonceStr":data.nonceStr, //随机串
                    "package":data.package,
                    "signType":data.signType,         //微信签名方式：
                    "paySign":data.paySign //微信签名
                },
                function(res){
                    if(res.err_msg == "get_brand_wcpay_request:ok" ){
                        // 使用以上方式判断前端返回,微信团队郑重提示：
                        //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                        that.mintUI.MessageBox.alert('支付成功').then(action => {
                            that.$router.push('/about/orderList/delivery')
                        });
                    }else if(res.err_msg == "get_brand_wcpay_request:fail" ){
                        that.mintUI.Toast('支付失败，请稍后再试！');
                    }else if(res.err_msg == "get_brand_wcpay_request:cancel" ){
                        that.mintUI.Toast('您已取消支付！');
                    }
                });
        }
  },
  components: {
    Vaddress
  },
  mounted: function () {
      var that = this
     // this.pidAry.push(this.$route.params.pid);
      var strData = {
          pidStr: this.$route.params.pid
      };
      this.axios.post('/api/front/product/get-product-list-detail', strData)
      .then(function (response) {
          var response = response.data.result
          var total = 0;
          for (var i = 0; i < response.length; i++) {
              total +=eval(response[i].product_price);
              that.goods.push({
                  gid: response[i].product_id,
                  name: response[i].product_name,
                  price: parseFloat(response[i].product_price),
                  total: parseFloat(response[i].product_price),
                  counter: 1,
                  pic: response[i].product_pic,
                  detail: response[i].description,
                  status: false
              })
          }
          that.sum = total.toFixed(2);
      })

    // this.distinguish()
    // //  收货地址
    //   var that = this
    //   var strData = {
    //       'token': localStorage.getItem('token'),
    //       order: this.$route.params.num
    //   };
    // var that = this
    // this.order = that.$route.params.num
    // this.axios.post('/api/front/order/get-order-list', strData)
    // .then(function (response) {
    //   that.defaultAddress = response.data.address
    //   that.goods.push({
    //     order: that.order,
    //     adress: response.data.address,
    //     count: response.data.count,
    //     shuliang: response.data.shuliang
    //   })
    // })
    // .catch(function (error) {
    //   console.log(error)
    // })
  }
}
</script>
<style lang="less">
p{
    margin: 0;
}
li{
    list-style: none;
}
.myOrder{
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 5;
    background:#fff;
    .mint-cell{
        margin: 0 0 8px 0;
        border-bottom: 1px solid #ddd;
    }
    .content{
        background: #fff;
        border-bottom: 2px dotted #ddd;
        margin-bottom: 10px;
        p{
            padding: 0 5%;
            line-height: 30px;
        }
   }
    .container{
        /*position: fixed;*/
        /*top: 48px;*/
        /*bottom: 102px;*/
        /*left: 0;*/
        width: 100%;
        height: 83%;
        overflow-y: scroll;
        &::-webkit-scrollbar {
            display: none;
        }
        li{
            list-style: none;
            border-bottom: 3px dotted #ddd;
        }
        li:last-child{
            border: none;
        }
        .noGoods{
            text-align: center;
            color:#999;
            margin-top: 15%;
            button{
                background: #fa8c00;
                border: none;
                height: 40px;
                width: 50%;
                font-size: 0.875em;
                margin-top: 8%;
                border-radius: 4px;
                a{
                    color: #fff;
                    text-decoration: none;
                    display: block;
                }
            }
        }
        .list{
            width: 90%;
            margin: 0 auto;
            height: 100px;
            .left{
                width: 30%;
                height: 100px;
                float: left;
                .selectGood{
                    width: 20px;
                    height: 20px;
                    background: none;
                    border: 1px solid #ddd;
                    border-radius: 50%;
                    font-size: 0;
                    outline: none;
                    vertical-align: top;
                    margin-top: 40px;
                    span{
                        background: red;
                        width: 10px;
                        height: 10px;
                        display: inline-block;
                        border-radius: 50%;
                    }
                }
                img{
                    height: 60px;
                    width: 60px;
                    margin-top: 25px;
                    /*margin-left: 10%;*/
                }
            }
            .right{
                width: 70%;
                height: 100px;
                float: right;
                p{
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 3;
                    overflow: hidden;
                    /*line-height: 25px;*/
                }
                .product_name{
                    font-size: 16px;
                    margin-top: 15px;
                }
                .product_describe{
                    color: #999;
                    font-size: 14px;
                }
                .product_bill{
                    float: right;
                    color: red;
                }
                .product_amount{
                    font-size: 5px;
                    margin-top: 3px;
                    color: #cccccc;
                }
            }
        }

    }
    .total-wrapper{
        z-index: 3;
        width: 100%;
        /*height: 50px;*/
        /*position: fixed;*/
        bottom: 0px;
        border-top: 1px solid #ebebeb;
        background: #fff;
        .left{
            width: 65%;
            float: left;
            height: 50px;
            text-align: left;
            font-size: 0;
            margin: 0;
            border: none;
            p{
                font-size: 14px;
                line-height: 50px;
                color:#666;
            }
            img{
                width: 20px;
                height: 20px;
                display: inline-block;
                margin-top: 8px;
            }
            .store{
                width: 100%;
                float: right;
                height: 50px;
            }
        }
        .right{
            float: right;
            width: 35%;
            height: 50px;
            font-size: 0;
            button{
                padding: 0;
                margin: 0;
                border: none;
                height: 50px;
                font-size: 14px;
                color:#ebebeb;
            }
            .bill{
                background: #f29600;
                width: 55%;
                float: right;
            }
        }
    }
}
</style>
