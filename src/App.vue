<template>
  <div class="main">
      <router-view></router-view>
      <!--<div class="loading" v-show="show">-->
      <!--<button @click="loading">进入商城</button>-->
      <!--</div>-->



  </div>
</template>

<script>
    export default {
        name: 'app',
        data () {
            return {
                show: true,
                myArr: []
                // distinguish: 0
            }
        },
        methods: {
            // dist () {
            //   if (this.distinguish === 1) {
            //     console.log(0)
            //   }
            // }
        },
        components: {
        },
        mounted: function () {
            this.bindPhone()
        }
    }
</script>

<style lang="less">

    html,body,.main {
        width: 100%;
        height: 100%;
        margin: 0;
    }
  .aStyle{
    text-decoration: none;
  }
  .loading{
    top: 0;
    left: 0;
    position: fixed;
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.8);
    z-index: 100;
    button{
      width: 50%;
      height: 40px;
      margin-left: 25%;
      margin-top: 300px;
      background: #f96000;
      border: none;
      border-radius: 5px;
      color: #fff;
    }
  }
  .mynav{
    position: fixed;
    height: 50px;
    bottom: -1px;
    width: 100%;
    z-index: 2;
    border-top: 1px solid #ebebeb;
    .mint-tabbar{
      width: 100%;
      z-index:2;
      position: fixed;
      height: 50px;
      bottom: -1px;
      mt-tab-item{
        float: left;
        width: 25%;
        text-align: center;
      }
      a{
        .aStyle;
        color: #999;
        &.active{
          color: rgb(250,140,0);
        }
        img{
          width: 25px;
          height: 25px;
        }
      }
      .mint-tab-item-label{
        a{
          display: block;
        }
      }
    }
  }

</style>
