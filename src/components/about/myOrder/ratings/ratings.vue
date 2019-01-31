<template>
<div class="ratings animated fadeIn">
    <div class="conatiner">
        <p class="noGoods" v-show="goods.length === 0">暂无订单数据，快去选购吧~~</p>
        <yo-scroll :on-refresh="onRefresh" :on-infinite="onInfinite"  :loading-text="loadingText" >
            <ul v-for="(item, key) in goods" :key="item.id">
                <div class="goods-wrapper">
                    <div class="order">
                        <span>{{item.order.order_time}}</span>
                    </div>
                    <div class="goods">
                        <div class="goods-info">
                            <li v-for="(val, key) in item.order.order_detail" :key="key">
                                <div class="image">
                                    <img :src="val.product_pic">
                                </div>
                                <div class="text">
                                    <p class="description">{{ val.product_name }}</p>
                                    <p>金额：<span class="price">￥{{ val.total_money }}</span></p>
                                </div>
                            </li>
                        </div>
                        <div class="info-wrapper">
                            <div class="amount-wrapper">
                                <el-button type="danger" size="mini" @click="showAlert">申请退款</el-button>
                            </div>
                        </div>
                    </div>
                    <div class="goods-footer">
                        <p>共<span class="num">{{ item.order.order_num }}</span>件商品 合计：￥<span class="price">{{ item.order.order_money }}</span></p>
                    </div>
                </div>
            </ul>
        </yo-scroll>
    </div>
</div>
</template>
<script>
export default {
  data () {
    return {
      checked: false,
      num1: 1,
      show: false,
        goods: [],
        loadingText:'加载中...',
        counter : 1, //当前页面
        num : 4,  // 一次显示多少条
    }
  },
  methods: {
    showAlert () {
      this.show = true
    },
    hideAlert () {
      this.show = false
    },
    cancel (item, key) {
      this.show = false
      this.axios.post('http://www.ethedot.com/chatshop/Index/drawback', {
        oid: item.oid
      })
      .then(function (response) {
        if (response.data === 1) {
          alert('申请成功')
        } else {
          alert('申请异常')
        }
      })
      .catch(function (error) {
        console.log(error)
      })
    },
      // 上拉加载
      onRefresh(done) {
          this.loadingText='';
          this.goods = [];
          this.counter = 1;
          this.getData(done)
          done();
      },
      // 下拉刷新
      onInfinite(done) {
          this.getData(done)
      },
      //获取数据列表
      getData(done) {
          var that = this
          var strData = {
              'token': localStorage.getItem('token'),
              'type': 4,
              'page': this.counter,
              'size':this.num
          };
          this.axios.post('http://119.23.239.189/front/order/get-order-list',strData).then(function (response) {
              if(response.data.code===400||response.data.code===402){
                  that.$router.push({'path':'/login'})
              }
              var response = response.data.result
              for (var i = 0; i < response.data.length; i++) {
                  that.goods.push({
                      order:response.data[i],
                  })
              }
              if(response.pages===that.counter){
                  that.loadingText='';
                  return;
              }else{
                  that.counter++;
              }
          })
      },
  },
  mounted: function () {
      this.getData()
  }
}
</script>
<style lang="less">
    p,ul{
        margin: 0;
        padding: 0
    }
    .price{
        color: red;
    }
li{
    list-style: none;
}
.ratings{
    .noGoods{
        text-align: center;
        color:#666;
        margin-top: 50%;
    }
    position: absolute;
    width: 100%;
    height: 100%;
    top: 88px;
    bottom: 0px;
    overflow-y: scroll;
    background: #f2f2f2;
    &::-webkit-scrollbar{
        display: none;
    }
    li{
        list-style: none;
    }
    .goods-wrapper{
        background: #fff;
        margin-bottom: 8px;
        padding: 1px;
        .goods{
            margin: 10px auto;
            /*height: 80px;*/
            overflow: hidden;
            margin-left: 5%;
            .goods-info{
                width: 70%;
                float: left;
                font-size: 14px;
                li{
                    height: 60px;
                    margin-top: 5px;
                    .image{
                        width: 28%;
                        float: left;
                        height: 60px;
                        img{
                            height: 60px;
                            width: 60px;
                            display: block;
                        }
                    }
                    .text{
                        width: 50%;
                        float: left;
                        line-height: 35px;
                        .description{
                            overflow: hidden;
                            text-overflow:ellipsis;
                            white-space: nowrap;
                        }
                        .price{
                            color: red;
                        }
                    }
                }
            }
            .info-wrapper{
                wwidth: 25%;
                float: left;
                margin-left: 3%;
                /*height: 80px;*/
                color:#333;
                .description{
                    color:#333;
                }
                .amount-wrapper{
                    height: 80px;
                    width: 50%;
                    float: left;
                    text-align: center;
                    .el-button{
                        margin: 0 auto;
                        width: 80px;
                        height: 25px;
                        display: block;
                        margin-top: 10px;
                        border-radius: 8px;
                        outline: none;
                    }
                    a{
                        color: #666;
                    }
                }
            }
        }
        .goods-footer{
            border-top: 1px solid #ddd;
            height: 37px;
            .selectGood{
                float: left;
                margin-top: 13px;
                margin-left: 5%;
                width: 12px;
                height: 12px;
                background: #fff;
                border: 1px solid #ddd;
                font-size: 0;
                outline: none;
                position: relative;
                span{
                    position: absolute;
                    color: rgb(250, 140, 0);
                    font-size: 16px;
                    line-height: 10px;
                    text-align: center;
                }
            }
            p{
                float: right;
                color: #333;
                line-height: 38px;
                margin-right: 5%;
                font-size: 14px;
            }
        }
        .order{
            font-size: 14px;
            color: #999999;
            span{
                display: inline-block;
                margin-top: 5px;
                padding-left: 5%;
            }
        }
    }
}
</style>
