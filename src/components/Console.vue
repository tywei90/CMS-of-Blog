<template>
    <navi-header></navi-header>
    <aside class="console">
        <div class="circle">
            <img src="../img/me.jpg" alt="me">
        </div>
        <menu class="navigation">
            <ul>
                <li @click="$router.go('/')">
                    <i class="icon iconfont icon-zhuye"></i>
                    <span>主页</span>
                </li>
                <li @click="$router.go('/console/articleList')">
                    <i class="icon iconfont icon-wenzhang"></i>
                    <span>文章</span>
                </li>
                <li @click="$router.go('/console/menu')">
                    <i class="icon iconfont icon-lianjie"></i>
                    <span>链接</span>
                </li>
                <li @click="$router.go('/console/account')">
                    <i class="icon iconfont icon-zhanghu"></i>
                    <span>账户</span>
                </li>
            </ul>
        </menu>
    </aside>
    <router-view></router-view>
</template>
<script>
import NaviHeader               from './NaviHeader.vue'
    import {setUser,bgToggle}   from '../vuex/actions'
    import {userName}           from '../vuex/getters'
    import {get, set, unset}    from '../js/cookieUtil'
    export default{
        created(){
            let userName = get('user')
            if (!this.userName && !userName) {
                this.$router.go('/login')
            } else if (!this.userName) {
                this.setUser(userName)
            }
        },
        components: {
            NaviHeader,
        },
        ready(){
            this.bgToggle('NightSky')
        },
        vuex: {
            getters: {
                userName,
            },
            actions: {
                setUser,
                bgToggle
            }
        }
    }
</script>
<style lang="sass">
    @import "../style/components/Console.scss";
</style>