<template>
    <div class="login">
        <div class="login-bg">
            <div style="margin: 30px 0 ;">
                <h4 class="form-word" style="padding-left: 25px;display: inline-block">用户登录</h4>
            </div>
            <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="90px"
                     class="demo-ruleForm">
                <el-form-item label="手机号" prop="phone">
                    <el-input type="number" v-model="ruleForm2.phone" autocomplete="off" maxlength="11"
                              name="phone"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="pass">
                    <el-input type="password" v-model="ruleForm2.pass" autocomplete="off"></el-input>
                </el-form-item>
                <p class="form-word" style="margin:0 0 1rem 0;font-size: 14px;">
                    <router-link to="/register" style="color: #678bce;margin-left:24%;">手机快速注册</router-link></span>
                    <router-link to="/loginPwd" style="color: #678bce;margin-left: 34%;">忘记密码</router-link></span>
                </p>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm2')">立即登录</el-button>
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
                if (value === '') {
                    return callback(new Error('手机号码不能为空'));
                }
                if (value.length !== 11) {
                    return callback(new Error('请输入11位数手机号'));
                } else {
                    callback();
                }
            }
            ;
            var validatePass = (rule, value, callback) =>
            {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    callback();
                }
            }
            ;
            return {
                ruleForm2: {
                    pass: '',
                    phone: ''
                },
                rules2: {
                    pass: [
                        {validator: validatePass, trigger: 'blur'}
                    ],
                    phone: [
                        {validator: checkPhone, trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if(valid) {
                        //登录
                        let strData = {
                            'phone': this.ruleForm2.phone,
                            'password': this.ruleForm2.pass,
                        };
                        //重新定义作用域，每多一层func 需要重新定义this指向
                        const that = this;
                        this.axios.post('/api/front/user/login', strData).then(function (response) {
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
                                        //将登录成功的用户信息存储
                                        localStorage.setItem('token',response.data.result.token);
                                        localStorage.setItem('custNo',response.data.result.cust_no);
                                        that_.$router.push({path: '/about'});
                                    }
                                });
                            }
                        }).catch(function (error) {
                            console.log(error)
                            that.$alert(response.data.msg, '提示', {
                                confirmButtonText: '确定',
                                callback: action => {
                                that.$message({
                                type: 'info',
                                message: `action: ${ action }`
                            });
                        }
                        })
                            ;
                        })
                    } else {
                        console.log('error submit!!');
                return false;
            }
            })
                ;
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
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
        }

    }

</style>
