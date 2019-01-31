<template>
<div class="obligation animated fadeIn">
    <div class="conatiner">
        <p class="noGoods" v-show="goods.length === 0">您未购买商品，快去选购吧~~</p>
        <yo-scroll :on-refresh="onRefresh" :on-infinite="onInfinite"  :loading-text="loadingText" >
        <!--<Scroll  :on-refresh="onRefresh" :on-infinite="onInfinite" noMoreData scrollFooterHidden>-->
        <ul v-for="(item, key) in goods" :key="item.id">
            <div class="goods-wrapper">
                <div class="order">
                    <span>{{item.order.order_time}}</span>
                    <!--<span>订单编号:</span><span>{{item.order.order_code}}</span>-->
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
                            <el-button type="danger" size="mini"  @click="deleteItem(key,item)">取消订单</el-button>
                            <el-button type="primary" size="mini" @click="account(item)">结算</el-button>
                        </div>
                    </div>
                </div>
                <div class="goods-footer">
                    <!--<p class="selectGood" @click.stop.prevent="selectGoods(item)"><span v-show="item.status === true">✔</span></p>-->
                    <p>共<span class="num">{{ item.order.order_num }}</span>件商品 合计：￥<span class="price">{{ item.order.order_money }}</span></p>
                </div>
            </div>
        </ul>
        </yo-scroll>
    </div>
</div>
</template>
<script>
    // import Scroll from '../../../../common/pull-refresh';
export default {
    // components: {
    //     'v-scroll': Scroll,
    // },
  data () {
    return {
      show: false,
      checkAll: false,
      checked: false,
      num1: 1,
      goods: [],
      sum: 0,
      num: 0,
      oidArr: [],
        loadingText:'加载中...',
        counter : 1, //当前页面
        num : 4,  // 一次显示多少条

    }
  },
  methods: {
    account (item) {
      var that = this
      if (item.status === true) {
        this.oidArr.push(item.oid)
        that.axios.post('http://www.ethedot.com/chatshop/Index/account', {
          oid: that.oidArr,
          id: sessionStorage.id
        })
        .then(function (response) {
          if (response.data !== 2) {
            that.$router.push('/about/orderList/obligation/myOrder/' + response.data)
          } else if (response.data === 2) {
            alert('失败！')
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      } else {
        alert('请选择该商品！')
      }
    },
    accounts () {
      var that = this
      for (let i = 0; i < this.goods.length; i++) {
        if (this.goods[i].status === true) {
          this.oidArr.push(this.goods[i].oid)
        }
      }
      if (this.oidArr.length !== 0) {
        that.axios.post('http://www.ethedot.com/chatshop/Index/account', {
          oid: that.oidArr,
          id: sessionStorage.id
        })
        .then(function (response) {
          if (response.data !== 2) {
            that.$router.push('/about/orderList/obligation/myOrder/' + response.data)
          } else if (response.data === 2) {
            alert('失败')
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      } else {
        alert('请选择商品！')
      }
    },
    cancel (item, key) {
      var that = this
      this.axios.post('http://www.ethedot.com/chatshop/Index/orderDel', {
        oid: item.oid,
        id: sessionStorage.id
      })
      .then(function (response) {
        if (response.data === 1) {
          alert('取消成功！')
          that.goods.splice(key, 1)
        } else if (response.data === 2) {
          alert('取消失败！')
        }
      })
      .catch(function (error) {
        console.log(error)
      })
    },
    closeAlert () {
      this.show = false
    },
    deleteItem () {
      this.show = true
    },
    selectAll () {
      this.sum = 0
      if (this.checkAll === false) {
        this.checkAll = true
        this.num = this.goods.length
        for (var i = 0; i < this.goods.length; i++) {
          this.sum += this.goods[i].total * this.goods[i].counter
          this.goods[i].status = true
        }
      } else {
        this.checkAll = false
        this.num = 0
        for (var j = 0; j < this.goods.length; j++) {
          this.goods[j].status = false
          this.sum = 0
        }
      }
    },
    selectGoods (item) {
      if (item.status === false) {
        this.sum += item.price
        item.status = true
        if (item.status === true) {
          this.num += 1
        }
      } else {
        this.sum -= item.price
        item.status = false
        if (item.status === false) {
          this.num -= 1
        }
      }
      if (this.num === this.goods.length) {
        this.checkAll = true
      } else {
        this.checkAll = false
      }
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
              'type': 0,
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
              if(response.pages===that.num){
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
.el-button{
    /*background: #fff;*/
    /*color: #666;*/
    border: 1px solid #ddd;
}
.obligation{
    height: 100%;
    overflow-y: scroll;
    &::-webkit-scrollbar{
        display: none;
    }
    .conatiner{
        .noGoods{
            text-align: center;
            color:#666;
            margin-top: 50%;
        }
        position: absolute;
        width: 100%;
        height: 100%;
        top: 88px;
        bottom: 50px;
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
                    width: 25%;
                    float: left;
                    margin-left: 3%;
                    /*height: 80px;*/
                    color:#333;
                    .text{
                        width: 50%;
                        float: left;
                        line-height: 35px;
                        .price{
                            color: red;
                        }
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
    .total-wrapper{
        z-index: 2;
        width: 100%;
        position: fixed;
        bottom: 0;
        left: 0; 
        height: 48px;
        border-bottom: 1px solid #ddd;
        border-top: 1px solid #ddd;
        background: #fff;
        .left{
            line-height: 48px;
            float: left;
            margin-left: 5%;
            width: 65%;
            .selectAll{
                float: left;
                margin-top: 18px;
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
            .bill{
                color: red;
                padding-right: 14%;
            }
        }
        .el-button  {
            margin-top: 12px;  
            height: 30px;
            width: 100px;  
            border-radius: 16px; 
            float: right; 
            a{
                color: #333;
                padding: 2px 5px;
            }      
        }
    }
    .cancel-wrapper{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0, 0.1);
        z-index: 5;
        .alert{
            position: absolute;
            height: 20%;
            width: 50%;
            top: 40%;
            left: 25%;
            background: #ebebeb;
            border-radius: 6px;
            p{
                text-align: center;
                color: #000;
                font: 16px;
                margin-top: 10%;
            }
            button{
                border: 0;
                background: rgb(250, 140, 0);
                color: #ebebeb;
                font-size: 14px;
                padding: 2px 10px;
                border-radius: 4px;
            }
            .confirm{
                float: left;
                margin-top: 10%;
                margin-left: 15%;
            }
            .cancel{
                float: right;
                margin-top: 10%;
                margin-right: 15%;
            }
        }
    }
}
</style>
