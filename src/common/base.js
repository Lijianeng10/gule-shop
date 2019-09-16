exports.install = function (Vue, options) {
  //验证是否绑定手机号
  Vue.prototype.bindPhone = function () {
      var userInfo = JSON.parse(this.$route.query.userInfo);
      localStorage.setItem('token',userInfo.token);
      localStorage.setItem('wxUserInfo',JSON.stringify(userInfo.wxUserInfo));
      localStorage.setItem('phone',userInfo.mobile);
      if(userInfo.mobile == ''||userInfo.mobile == null){
          this.$prompt('请输入手机号', '绑定手机', {
              confirmButtonText: '确定',
              // cancelButtonText: '取消',
              inputPattern: /^1[3456789]\d{9}$/,
              inputErrorMessage: '手机格式不正确',
              showClose:false,//是否显示左上角X
              showCancelButton:false,//是否显示取消按钮
              closeOnClickModal:false,
          }).then(({ value }) => {
              var strData = {
                  'userTel':value,
                  'wxUserInfo':JSON.stringify(userInfo.wxUserInfo),
              }
              const that = this;
              this.axios.post('/api/front/user/bind-user-tel', strData).then(function (response) {
                 //重新this定义作用域，每多一层func 需要重新定义this指向
                  if(response.data.code !=600){
                      that.$alert(response.data.msg, '提示', {
                          confirmButtonText: '确定',
                      });
                  }else{
                      that.$alert(response.data.msg, '提示', {
                          confirmButtonText: '确定',
                          callback: action => {
                              //将登录成功的用户信息存储
                              localStorage.setItem('phone',value);
                          }
                      });
                  }
              })
        })
      }
  }
  //验证是否登录
    Vue.prototype.distinguish = function () {

    }
  //获取用户详细信息
  Vue.prototype.getUserDetail = function () {
      var userDetail = localStorage.getItem('userDetail');
      if(userDetail === null){
          var token = localStorage.getItem('token');
          var strData = {
              'token':token
          }
          this.axios.post('/api/front/user/get-user-detail', strData).then(function (response) {
              localStorage.setItem('userDetail',JSON.stringify(response.data.result));
          })
      }
  }
    //获取用户详细信息
    Vue.prototype.updateUserDetail = function () {
        var token = localStorage.getItem('token');
        var strData = {
            'token':token
        }
        this.axios.post('/api/front/user/get-user-detail', strData).then(function (response) {
            localStorage.setItem('userDetail',JSON.stringify(response.data.result));
        })
    }
    //加法函数，用来得到精确的加法结果
    Vue.prototype.accAdd = function (arg1,arg2) {
        var r1, r2, m, c;
        try {
            r1 = arg1.toString().split(".")[1].length;
        }
        catch (e) {
            r1 = 0;
        }
        try {
            r2 = arg2.toString().split(".")[1].length;
        }
        catch (e) {
            r2 = 0;
        }
        c = Math.abs(r1 - r2);
        m = Math.pow(10, Math.max(r1, r2));
        if (c > 0) {
            var cm = Math.pow(10, c);
            if (r1 > r2) {
                arg1 = Number(arg1.toString().replace(".", ""));
                arg2 = Number(arg2.toString().replace(".", "")) * cm;
            } else {
                arg1 = Number(arg1.toString().replace(".", "")) * cm;
                arg2 = Number(arg2.toString().replace(".", ""));
            }
        } else {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", ""));
        }
        return (arg1 + arg2) / m;
    }
    //减法函数
    Vue.prototype.accSub = function (arg1,arg2) {
        var r1, r2, m, n;
        try {
            r1 = arg1.toString().split(".")[1].length;
        }
        catch (e) {
            r1 = 0;
        }
        try {
            r2 = arg2.toString().split(".")[1].length;
        }
        catch (e) {
            r2 = 0;
        }
        m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
        n = (r1 >= r2) ? r1 : r2;
        return ((arg1 * m - arg2 * m) / m).toFixed(n);
    }
  //弹窗
  //   Vue.prototype.alert = function () {
  //
  //   }
}

