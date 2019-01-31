<template>
    <div class="home">
        <router-view></router-view>
        <div class="mynav">
            <mt-tabbar class="mint-tabbar">
                <mt-tab-item>
                    <router-link to="/home">
                        <img src="../../images/icon/home.png" alt=""><br>
                        首页
                    </router-link>
                </mt-tab-item>
                <mt-tab-item>
                    <router-link to="/catalog">
                        <img src="../../images/icon/Category.png" alt=""><br>
                        分类
                    </router-link>
                </mt-tab-item>
                <mt-tab-item>
                    <router-link to="/cart">
                        <img src="../../images/icon/cart.png" alt=""><br>
                        购物车
                    </router-link>
                </mt-tab-item>
                <mt-tab-item>
                    <router-link to="/about">
                        <img src="../../images/icon/account.png" alt=""><br>
                        我的
                    </router-link>
                </mt-tab-item>
            </mt-tabbar>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      city: '上海'
    }
  },
  methods: {
  }
}
</script>
<style lang="less">

</style>
