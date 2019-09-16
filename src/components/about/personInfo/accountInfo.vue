<template>
<div class="baseInfo">
    <mt-header title="账户信息">
        <router-link to="" slot="left">
            <mt-button  onclick="window.history.go(-1)" icon="back">返回</mt-button>
        </router-link>
    </mt-header>
    <div class="content">
        <p>
            <span class="con-text">开户名称</span>
            <span class="con-val"><input type="text" placeholder="请填写开户名称" v-model="accountName"/></span>
        </p>
        <p>
            <span class="con-text">开户银行</span>
            <span class="con-val"><input type="text" placeholder="请填写开户银行" v-model="bankName"/></span>
        </p>
        <p>
            <span class="con-text">银行卡号</span>
            <span class="con-val"><input type="text" placeholder="请填写银行卡号" v-model="bankCardNum"/></span>
        </p>
    </div>
    <div v-if="show">
        <el-button type="danger" icon="el-icon-check"  style="display:block;width:90%;margin: 10px auto;" v-on:click="sureBtn">确定提交</el-button>
    </div>

</div>
</template>

<script>
export default {
  data () {
      return {
          accountName: '',
          bankName: '',
          bankCardNum: '',
          show:true,
      }
  },
  methods: {
      sureBtn:function() {
          var that = this;
          var accountName = this.accountName;
          var bankName = this.bankName;
          var bankCardNum = this.bankCardNum;
          if(accountName===''||bankName===''||bankCardNum===''){
              that.$message.error('请将表单填写完整！');
          }else{
              let strData = {
                  'token': localStorage.getItem('token'),
                  'accountName': accountName,
                  'bankName': bankName,
                  'bankCardNum': bankCardNum,
              };
              this.axios.post('/api/front/user/set-user-bank-info', strData).then(function (response) {
                  //重新this定义作用域，每多一层func 需要重新定义this指向
                  const that_ = that;
                  if(response.data.code !=600){
                      that_.$alert(response.data.msg, '提示', {
                          confirmButtonText: '确定',
                      });
                  }else{
                      that_.$alert(response.data.msg, '提示', {
                          confirmButtonText: '确定',
                          callback: action => {
                                that_.updateUserDetail()//更新用户信息
                                that_.accountName = accountName;
                                that_.bankName = bankName;
                                that_.bankCardNum = bankCardNum;
                                that_.show = false;
                            }
                      });
                  }
              })
          }
      },
  },
  mounted: function() {
      var that = this
      this.distinguish()
      this.getUserDetail()//获取用户信息
      var userDetail = JSON.parse(localStorage.getItem('userDetail'));
      this.accountName = userDetail.account_name;
      this.bankName = userDetail.bank_name;
      this.bankCardNum = userDetail.bank_card_num;
      if(this.accountName!==''&& this.bankName!==''&& this.bankCardNum!==''){
          this.show = false;
      }
  }
}
</script>

<style lang="less">
    *{
        outline: none;
        margin: 0;
        padding: 0;
    }
    a {
        text-decoration: none;
        color: #ddd;
    }
    .baseInfo {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            background: #eee;
            .mint-header{
                height: 44px;
                background: #fff;
                color: #999;
                border-bottom: 1px solid #ddd;
                margin-bottom: 3px;
            }
            .mint-cell{
                margin-top: 5px;
            }
            .button{
                position: fixed;
                bottom: 50px;
                width: 100%;
                height: 50px;
                background: #f19600;
                border: none;
                color: #fff;
            }
            .alterShow{
                position: absolute;
                top: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.4);
                .content{
                    height: 150px;
                    width: 250px;
                    background: #fff;
                    margin: 150px auto 0;
                    text-align: center;
                    padding: 1px;
                    p{
                        margin: 35px auto;
                    }
                    button{
                        border: none;
                        width: 60px;
                        height: 18px;
                        font-size: 12px;
                        color: #fff;
                        background: #b3b3b3;
                    }
                    .cancel{
                        margin-right: 13px;
                    }
                    .comfirm{
                        background: #f19600;
                        margin-left: 13px;
                    }
                }
            }
            //用户基本信息
            .content{
                background: #fff;
                p{
                    padding: 0 5%;
                    border-top: 1px solid #ddd;
                    height: 40px;
                    line-height: 40px;
                    color: #333;
                    .con-text{
                        display: inline-block;
                        width: 25%;
                        text-align: right;
                    }
                    .con-val{
                        display: inline-block;
                        width: 70%;
                        text-align: right;
                        height: 100%;
                        input{
                            display: inline-block;
                            height: 70%;
                            border: none;
                        }
                    }
                }
            }
        }
</style>
