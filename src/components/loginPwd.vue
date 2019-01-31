<template>
    <div class="login">
        <div class="login-bg">
            <div  style="margin-top: 30px;margin-left: 20px;"> <a  onclick="window.history.go(-1)" class="el-icon-d-arrow-left"></a></div>
            <div style="margin: 15px 0">
                <h4 class="form-word" style="padding-left: 25px;display: inline-block">重置密码</h4>
            </div>
            <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="90px"
                     class="demo-ruleForm">
                <el-form-item label="手机号" prop="phone">
                    <el-input type="number" v-model="ruleForm2.phone" autocomplete="off" maxlength="11"
                              name="phone"></el-input>
                </el-form-item>
                <el-form-item label="验证码" prop="smsCode">
                    <el-input type="number"  v-model="ruleForm2.smsCode" name="smsCode" style="width: 44%"></el-input>
                    <el-button type="primary"  :class="{disabled: !this.canClick}"  @click="getSms()">{{content}}</el-button>
                </el-form-item>
                <el-form-item label="新密码" prop="pass">
                    <el-input type="password" v-model="ruleForm2.pass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm2')">修改密码</el-button>
                    <el-button @click="resetForm('ruleForm2')">重置</el-button>
                </el-form-item>
            </el-form>

        </div>

    </div>
</template>

<script>
    export default {
        data() {
            var checkPhone = (rule, value, callback) =>
            {
                if (value == '') {
                    return callback(new Error('手机号码不能为空'));
                }
                if (value.length != 11) {
                    return callback(new Error('请输入11位数手机号'));
                } else {
                    callback();
                }
            }
            ;
            var validatePass = (rule, value, callback) =>{
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    callback();
                }
            };
            var validateSmsCode = (rule, value, callback) =>{
                if (value === '') {
                    callback(new Error('请输入验证码'));
                } else {
                    callback();
                }
            };
            return {
                ruleForm2: {
                    pass: '',
                    phone: '',
                    smsCode: '',
                },
                rules2: {
                    pass: [
                        {validator: validatePass, trigger: 'blur'}
                    ],
                    phone: [
                        {validator: checkPhone, trigger: 'blur'}
                    ],
                    smsCode: [
                        {validator: validateSmsCode, trigger: 'blur'}
                    ],
                },
                content: '发送验证码',  // 按钮里显示的内容
                totalTime: 60,      //记录具体倒计时时间
                canClick: true, //添加canClick

            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if(valid) {
                        //登录
                        let strData = {
                            'phone': this.ruleForm2.phone,
                            'smsCode': this.ruleForm2.smsCode,
                            'password': this.ruleForm2.pass,

                        };
                        //重新定义作用域，每多一层func 需要重新定义this指向
                        const that = this;
                        this.axios.post('http://119.23.239.189/front/user/update-pwd', strData).then(function (response) {
                            //重新this定义作用域，每多一层func 需要重新定义this指向
                            const that_ = that;
                            if(response.data.code !=600){
                                that.$alert(response.data.msg, '提示', {
                                    confirmButtonText: '确定',
                                });
                            }else{
                                that.$alert(response.data.msg, '提示', {
                                    confirmButtonText: '确定',
                                    callback: action => {
                                        //密码重置成功跳转到登录页面
                                        that_.$router.push({path: '/login'});
                                    }
                                });
                            }
                        })
                    } else {
                        console.log('error submit!!');
                return false;
            }
            })
                ;
            },
            //重置表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            //获取验证码
            getSms(){
                const that = this;
                //获取验证码
                var phone = this.ruleForm2.phone;
                if(phone==''||phone.length != 11){
                    that.$alert('请输入正确的手机号！', '提示', {
                        confirmButtonText: '确定',
                    });
                    return ;
                }else{
                    let strData = {
                        'phone':phone,
                        'cType':4
                    }
                    this.axios.post('http://119.23.239.189/front/user/get-sms-code', strData).then(function (response) {
                        //重新this定义作用域，每多一层func 需要重新定义this指向
                        const that_ = that;
                        if(response.data.code !=600){
                            that.$alert(response.data.msg, '提示', {
                                confirmButtonText: '确定',
                            });
                        }else{
                            that.$alert(response.data.msg, '提示', {
                                confirmButtonText: '确定',
                            });
                            //60s 倒计时
                            if (!that.canClick) return  //改动的是这两行代码
                            that.canClick = false
                            that.content = that.totalTime + 's后重新发送'
                            let clock = window.setInterval(() => {
                                that.totalTime--
                                that.content = this.totalTime + 's后重新发送'
                                if (that.totalTime < 0) {
                                    window.clearInterval(clock)
                                    that.content = '发送验证码'
                                    that.totalTime = 60
                                    that.canClick = true  //这里重新开启
                                }
                            },1000)
                        }
                    })
                }
            }

        }
    }
</script>
<style lang="less" scoped>
    h4{
        margin: 0;
        padding: 0;
    }
    body{
        margin: 0;
    }
    .login{
        width: 100%;
        height: 100%;
        .login-bg {
            width: 100%;
            height: 100%;
            overflow: auto;
            background: url(/static/images/login-bg.jpg) center no-repeat fixed;
            background-size: cover;
            .form-word{
                color: white;
            }
            .disabled{
                background-color: #ddd;
                border-color: #ddd;
                color:#57a3f3;
                cursor: not-allowed; // 鼠标变化
            }
        }

    }

</style>
