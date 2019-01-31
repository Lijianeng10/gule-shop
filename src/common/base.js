exports.install = function (Vue, options) {
  //验证登录
  Vue.prototype.distinguish = function () {
      var token = localStorage.getItem('token');
      if(token === null){
          this.$router.push({path: '/login'});
      }
  }
  //获取用户详细信息
  Vue.prototype.getUserDetail = function () {
      var userDetail = localStorage.getItem('userDetail');
      if(userDetail === null){
          var token = localStorage.getItem('token');
          var strData = {
              'token':token
          }
          this.axios.post('http://119.23.239.189/front/user/get-user-detail', strData).then(function (response) {
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
        this.axios.post('http://119.23.239.189/front/user/get-user-detail', strData).then(function (response) {
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

