<template>
    <div class="homePage">
        <div class="search-top">
            <div class="search">
                <router-link to="/home/search">
                    <i class="el-icon-search"></i>
                    <input type="text">
                    <button class="btn-search">搜索</button>
                </router-link>
            </div>
        </div>
        <div class="block">
            <el-carousel height="150px">
                <el-carousel-item v-for="(item,index) in banners" :key="index">
                    <img :src="item.pic" alt="" width="100%" height="180px">
                </el-carousel-item>
            </el-carousel>
        </div>
        <!--<div class="list">-->
            <!--<div class="loadhome" v-show="loading">-->
            <!--<div class="spinner">-->
                <!--<div class="rect1"></div>-->
                <!--<div class="rect2"></div>-->
                <!--<div class="rect3"></div>-->
                <!--<div class="rect4"></div>-->
                <!--<div class="rect5"></div>-->
            <!--</div>-->
            <!--</div>-->
        <!--</div>-->
        <div class="title">
            <font>推荐</font>
        </div>
        <div>
            <li v-for="item in goods" >
                <div class="goods" @click="goDetail(item)">
                    <img v-lazy='item' :src="item.src" alt="">
                    <p class="text">
                        <span class="name">{{ item.name }}</span>
                        ￥<span class="price">{{ item.price }}</span>
                    </p>
                </div>
            </li>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                mark: 0,
                nums:0,
                goods: [],
                banners: [],
                loading: false
            }
        },
        // created() {
        //     this.play()
        // },
        methods: {
            banner(item) {
                // sessionStorage.gid = item.gid
                this.$router.push('/catalog/detail/' + item.bid)
            },
            goDetail(item) {
                this.$router.push('/catalog/detail/' + item.gid)
            },
            //轮播图效果
            change(i) {
                this.mark = i
            },
            autoPlay() {
                this.mark++
                if (this.mark === this.nums) {
                    this.mark = 0
                    return
                }
            },
        },
        mounted: function () {
            this.distinguish()
            var that = this
            this.loading = true
            //请求产品列表
            this.axios.post('/api/front/product/get-hot-product').then(function (response) {
                that.loading = false
                var data = response.data.result;
                for (var i = 0; i < data.length; i++) {
                    that.goods.push({gid: data[i].product_id, name: data[i].product_name, price: data[i].product_price, src:data[i].product_pic})
                }
            }).catch(function (error) {
              console.log(error)
            })
            // banner
            this.axios.post('/api/front/public/get-banner').then(function (response) {
                that.nums =0;
                for (var i = 0; i < response.data.result.length; i++) {
                    that.banners.push({
                        bid: response.data.result[i].banner_id,
                        pic: response.data.result[i].pic_url,
                    })
                }
                that.nums = response.data.result.length;
            }).catch(function (error) {
                    console.log(error)
                })
        }
    }
</script>

<style lang='less'>
    body {
        margin: 0;
    }

    li {
        list-style: none;
    }

    p {
        padding: 0;
        margin: 0;
    }

    .homePage {
        margin-bottom: 60px;
        position: relative;
        overflow-y: scroll;
        &::-webkit-scrollbar {
            display: none;
        }
        .title {
            text-align: center;
            margin-top: 3%;
            font {
                padding-bottom: 2px;
                border-bottom: 2px solid #f29600;
            }
        }
        .goods {
            float: left;
            width: 44%;
            background: #ddd;
            margin-left: 4%;
            margin-top: 4%;
            height: 150px;
            position: relative;
            overflow: hidden;
            img {
                width: 100%;
                height: 150px;
            }
            img[lazy=loading] {
                width: 40px;
                height: 40px;
                margin: 55px auto;
            }
            .text {
                width: 100%;
                background: rgba(0, 0, 0, 0.6);
                position: absolute;
                bottom: 0;
                height: 30px;
                line-height: 30px;
                padding: 0 3%;
                color: #999;
                .name {
                    width: 55%;
                    display: block;
                    float: left;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    color: white;
                }
                .price {
                    color: #f29600;
                }
            }
        }
        .list {
            width: 100%;
            .loadhome {
                .spinner {
                    margin: 100px auto;
                    width: 50px;
                    height: 60px;
                    text-align: center;
                    font-size: 10px;
                }
                .spinner > div {
                    background-color: #f29600;
                    height: 100%;
                    width: 6px;
                    display: inline-block;

                    -webkit-animation: stretchdelay 1.2s infinite ease-in-out;
                    animation: stretchdelay 1.2s infinite ease-in-out;
                }
                .spinner .rect2 {
                    -webkit-animation-delay: -1.1s;
                    animation-delay: -1.1s;
                }
                .spinner .rect3 {
                    -webkit-animation-delay: -1.0s;
                    animation-delay: -1.0s;
                }
                .spinner .rect4 {
                    -webkit-animation-delay: -0.9s;
                    animation-delay: -0.9s;
                }
                .spinner .rect5 {
                    -webkit-animation-delay: -0.8s;
                    animation-delay: -0.8s;
                }
                @-webkit-keyframes stretchdelay {
                    0%, 40%, 100% {
                        -webkit-transform: scaleY(0.4)
                    }
                    20% {
                        -webkit-transform: scaleY(1.0)
                    }
                }
                @keyframes stretchdelay {
                    0%, 40%, 100% {
                        transform: scaleY(0.4);
                        -webkit-transform: scaleY(0.4);
                    }
                    20% {
                        transform: scaleY(1.0);
                        -webkit-transform: scaleY(1.0);
                    }
                }
            }
        }
        .search-top {
            background: #eee;
            height: 50px;
            .el-icon-arrow-left {
                line-height: 50px;
                margin-left: 2%;
            }
            .search {
                height: 30px;
                width: 80%;
                vertical-align: top;
                margin-top: 10px;
                margin-left: 10%;
                border-radius: 8px;
                display: inline-block;
                overflow: hidden;
                font-size: 0;
                background: #fff;
                .el-icon-search {
                    margin: 0 2%;
                    height: 30px;
                    line-height: 30px;
                    width: 6%;
                    color: #f29600;
                    font-size: 15px;
                }
                input {
                    height: 30px;
                    vertical-align: top;
                    outline: none;
                    border: none;
                    width: 75%;
                }
                .btn-search {
                    border: none;
                    background: #f29600;
                    color: #fff;
                    height: 30px;
                    line-height: 30px;
                    width: 15%;
                    vertical-align: top;
                    margin: 0;
                    padding: 0;
                }
            }
        }
        .top {
            position: absolute;
            height: 30px;
            top: 50px;
            z-index: 1;
            width: 80%;
            left: 10%;
            p {
                margin: 0;
                padding: 0;
                line-height: 30px;
                color: #bbb;
            }
            .location, .name, .search {
                float: left;
                width: 33.3%;
                height: 30px;
            }
            .location {
                text-align: left;
                img {
                    width: 12px;
                    margin-right: 4%;
                    float: left;
                    margin-top: 6px;
                }
                .city {
                    margin: 0;
                    padding: 0;
                    float: left;
                    line-height: 30px;
                }
                .el-icon-caret-bottom {
                    float: left;
                    margin-left: 4%;
                    font-size: 12px;
                    margin-top: 10px;
                    color: #bbb;
                }
            }
        }
        //轮播
        .bullet {
            width: 100%;
            position: absolute;
            bottom: 10px;
            margin: 0 auto;
            text-align: center;
            z-index: 10;
            span {
                width: 20px;
                height: 5px;
                border: 1px solid;
                background: white;
                display: inline-block;
                margin-right: 10px;
            }
            .active {
                background: red;
            }
            .image-enter-active {
                transform: translateX(0);
                transition: all 1s ease;
            }

            .image-leave-active {
                transform: translateX(-100%);
                transition: all 1s ease;
            }

            .image-enter {
                transform: translateX(100%)
            }

            .image-leave {
                transform: translateX(0)
            }
        }
    }

    .mint-swipe {
        height: 175px;
        width: 100%;
        img {
            display: inline-block;
            height: auto;
            width: 100%;
        }
        .mint-swipe-indicator {
            opacity: 1;
            background: #fff;
        }
        .mint-swipe-indicator.is-active {
            background: #f29600;
        }
    }
</style>
