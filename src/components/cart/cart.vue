<template>
  <div class="cart">
    <div class="head">
      <mt-cell title="购物清单">
        购物车内共<span class="amount">{{ goods.length }}</span>件商品
      </mt-cell>    
    </div>
    <div class="container">
      <div class="noGoods" v-show="goods.length === 0">
        <img src="./bag.png" alt="">
        <p>购物车空空哒</p>
        <button><router-link to="/catalog">开始购物</router-link></button>
      </div>
      <li v-for="(item, key) in goods" :key="item.id">
        <div class="list">
          <div class="left">
              <button class="selectGood" @click.stop.prevent="selectGoods(item)"><span v-show="item.status === true"></span></button>
              <img :src="item.pic" alt="">
          </div>
          <div class="right">
            <p class="product_name">{{ item.name }}  <span class="product_bill">￥{{ item.price }}</span></p>
            <div class="product_amount">
              <!--<input type="button" value="-" @click="mins(item)" class="mins">-->
              <input type="text" disabled class="num" v-model="item.counter"> 
              <!--<input type="button" value="+" @click="plus(item)" class="plus">-->
              <i class="el-icon-delete" @click="deleteItem(key,item)"></i>
            </div>
          </div>      
        </div>
      </li>
    </div>     
    <div class="total-wrapper" v-show="goods.length !== 0">
      <p><button @click='selectAll' class="selectAll"><span v-show="checkAll"></span></button>全选 合计：￥<span class="bill">{{ sum }}</span></p>
      <mt-button type="primary" @click="buy">结算</mt-button>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      goods: [],
      sum: '0.00',
      checkAll: false,
      name: '',
      menu: [],
      num: 0
    }
  },
  methods: {
      //下单
    buy () {
      var that = this
      var goods = this.goods
        var goods_nums = 0;
        var order_money = 0;
      for (let i = 0; i < goods.length; i++) {
        if (goods[i].status === true) {
          this.menu.push({
              product_id: goods[i].gid,
              nums: goods[i].counter,

          })
            goods_nums +=goods[i].counter;
            order_money +=goods[i].counter*goods[i].price
        }
      }
      if (this.menu.length !== 0) {
          let strData = {
              'token': localStorage.getItem('token'),
              concent: that.menu,
              goods_nums:goods_nums,
              order_money:order_money
          }
        this.axios.post('http://119.23.239.189/front/order/play-order',strData).then(function (response) {
            const that_ = that;
            if(response.data.code !=600){
                that.$alert(response.data.msg, '提示', {
                    confirmButtonText: '确定',
                });
            }else{
                that.$alert(response.data.msg, '提示', {
                    confirmButtonText: '确定',
                    callback: action => {
                        that.$router.push('/about');
                    }
                });
            }
        })
        .catch(function (error) {
          console.log(error)
        })
      }else{
          this.$alert('请选择需要购买的产品！', '提示', {
              confirmButtonText: '确定',
          });
      }
    },
    mins (item) {
      if (item.counter <= 1) {
        return
      }
      item.counter --
      item.price -= item.total
      if (item.status === true) {
        this.sum -= item.total
      }
    },
    plus (item) {
      item.counter += 1
      item.price += item.total
      if (item.status === true) {
        this.sum += item.total
      }
    },
      //全选反选
    selectGoods (item) {
      if (item.status === false) {
          this.sum = this.accAdd(this.sum,item.price);
        item.status = true
        if (item.status === true) {
          this.num += 1
        }
      } else {
        // this.sum -= item.price
          this.sum = this.accSub(this.sum,item.price);
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
      //删除购物车商品
    deleteItem (key, item) {
        var that = this
        that.$confirm('您确定要删除该产品吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(()=>{
            let strData = {
                'token': localStorage.getItem('token'),
                'product_id':item.gid ,
                'type':3
            };
            this.axios.post('http://119.23.239.189/front/user/opt-user-shop-car',strData).then(function (response) {
                const that_ = that;
                if(response.data.code !=600){
                    that.$alert(response.data.msg, '提示', {
                        confirmButtonText: '确定',
                    });
                }else{
                    that.$alert(response.data.msg, '提示', {
                        confirmButtonText: '确定',
                        callback: action => {
                            that_.goods.splice(key, 1);
                         }
                    });
                }
            }).catch(function (error) {
                    console.log(error)
            })
        });
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
    }
  },
  mounted: function () {
    this.distinguish()
    var that = this
    this.axios.post('http://119.23.239.189/front/user/get-shop-car-list', {
        'token': localStorage.getItem('token')
    }).then(function (response) {
      var response = response.data.result
      for (var i = 0; i < response.length; i++) {
        that.goods.push({
          gid: response[i].product_id,
          name: response[i].product_name,
          price: parseFloat(response[i].product_price),
          total: parseFloat(response[i].product_price),
          counter: parseFloat(response[i].nums),
          pic: response[i].product_pic,
          status: false
        })
      }
    })
    .catch(function (error) {
      console.log(error)
    })
  }
}
</script>

<style lang='less'>
@import "../../common/animate.css";
*{
  margin:0;
  padding: 0;
}
.checkboxStyle{
  position: relative;
  .input_check {
    position: absolute;visibility: hidden;
  }
  .input_check+label {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 1px solid #ebebeb;
    border-radius: 50%;
    margin-bottom: -2px;
  }
  .input_check:checked+label:after {
    content: "";
    position: absolute;
    left: 3px;
    bottom: 4px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgb(250,140,0);
  }
}
.cart{
  margin-bottom: 100px;
  .head{
    padding: 0 5%;
    height: 48px;
    border-bottom: 1px solid #ddd;
    .amount{
      color: red;
      padding: 0 2px;
    }
    .mint-cell-value{
      font-size: 0.875em;
      span {
        .checkboxStyle;
        span{
          padding-left: 5px;
        }
      }
    }
  }
  .container{
    position: fixed;
    top: 48px;
    bottom: 102px;
    left: 0;
    width: 100%;
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
          height: 40px;
          width: 40px;
          margin-top: 30px;
          margin-left: 10%;
        }
      }
      .right{
        width: 70%;
        height: 100px;
        float: right;
        p{
          line-height: 25px;
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
          font-size: 0;
          margin-top: 15px;
          .num{
            width: 40px;
            /*outline: none;*/
            height: 25px;
            border: 1px solid #d8d3d0;
            text-align: center;
            vertical-align: top;
            /*border-left: none;*/
            /*border-right: none;*/
            background: #fff;
          }
          .plus,.mins{
            width: 35px;
            height: 27px;
            background: none;
            border: 1px solid #d8d3d0;
            font-size: 16px;
            outline: none;
          }
          .el-icon-delete{
            float: right;
            color: #666;
            font-size: 18px;
            line-height: 35px;
          }
        }
      }      
    }

  }
  .total-wrapper{
    z-index: 2;
    width: 100%;
    position: fixed;
    bottom: 49px;
    background: #fff;
    p{
      float: left;
      padding-left: 5%;
      line-height: 50px;
      width: 75%;
      border-top: 1px solid #ebebeb;
      .selectAll{
        width: 20px;
        height: 20px;
        background: none;
        border: 1px solid #ddd;
        border-radius: 50%;
        font-size: 0;
        outline: none;
        margin-right: 2%;
        span{
          background: red;
          width: 10px;
          height: 10px;
          display: inline-block;
          border-radius: 50%;
        }
      }
      .bill{
        color: red;
        padding-right: 14%;
      }
    }
    .mint-button--primary{
      float: right;
      border: none;
      border-radius: 0;
      height: 50px;
      width: 20%;
      background: rgb(250,140,0);
    }
  }
}
</style>
