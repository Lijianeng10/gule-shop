<template>
<div class="setUp">
    <mt-header title="设置">
        <router-link to="" slot="left">
            <mt-button  onclick="window.history.go(-1)" icon="back">返回</mt-button>
        </router-link>
    </mt-header>
    <mt-cell title="基本信息"> </mt-cell>
    <div class="content">
        <p><span class="con-text">登录名</span><span class="con-val">{{custNo}}</span></p>
        <p><span class="con-text">昵称</span><span class="con-val">{{name}}</span></p>
        <p><span class="con-text">手机号</span><span class="con-val">{{tel}}</span></p>
    </div>
    <div>
        <!--<el-button type="danger" icon="el-icon-edit"  style="width: 48%;margin-top: 10px;" v-on:click="editNname">修改昵称</el-button>-->
        <!--<el-button type="danger" icon="el-icon-error" style="width: 48%;margin-top: 10px;" v-on:click="loginOut">退出登录</el-button>-->
    </div>

    <!--<mt-cell title="退出登录" is-link > </mt-cell>-->

    <!--<router-view></router-view>-->
</div>
</template>

<script>
export default {
  data () {
      return {
          custNo: '',
          name: '',
          tel: '',
          show: false
      }
  },
  methods: {
      loginOut: function () {
          var that = this;
          that.$confirm('您确定要退出登录吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(()=>{
              localStorage.removeItem('token');
              localStorage.removeItem('custNo');
              localStorage.removeItem('userDetail');
              that.$router.push({path: '/login'});
          });
      },
      editNname:function() {
          var that = this;
          that.$prompt('请输入昵称', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
              // inputErrorMessage: '邮箱格式不正确'
          }).then(({ value }) => {
              if(value==null){
                that.$message.error('昵称不能为空，请输入昵称！');
              }else{
                  let strData = {
                      'token': localStorage.getItem('token'),
                      'nickname': value,
                  };
                  this.axios.post('/api/front/user/set-nickname', strData).then(function (response) {
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
                              that_.name = value;
                            }
                      });
                      }
                  })
          }
      })
      }
  },
  mounted: function() {
      var that = this
      this.distinguish()
      this.getUserDetail()//获取用户信息
      var userDetail = JSON.parse(localStorage.getItem('userDetail'));
      this.custNo = userDetail.cust_no;
      this.name = userDetail.nickname;
      this.tel = userDetail.phone;
      this.show = false
  }
}
</script>

<style lang="less">
*{
    outline: none;
    margin: 0;
    padding: 0;
}
.setUp{
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
                width: 20%;
                text-align: right;
            }
            .con-val{
                display: inline-block;
                width: 80%;
                text-align: right;
            }
        }
    }
}
</style>
