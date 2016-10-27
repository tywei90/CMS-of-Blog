<template>
    <header class="myHeader">
        <div class="circle" @click="goHome">
            <img src="../img/me.jpg">
        </div>
        <ul class="menu">
            <li v-for="link in links">
                <a v-if="link.newPage" :href="link.href" target="_blank">
                    {{link.name}}
                </a>
                <a v-else :href="link.href">
                    {{link.name}}
                </a>
            </li>
        </ul>
        <div class="userGiude f-fl" v-if="!loginUserName">
            <span class="login-no">您还未登录</span>
            <a href="/#!/login">登录</a>|
            <a href="/#!/register">注册</a>
        </div>
        <div class="userGiude f-fl" v-else>
            <span class="login-yes">您好，<em>{{loginUserName}}</em></span>
        </div>
    </header>
</template>
<script>
    import {get}    from '../js/cookieUtil'
    export default{
        data(){
            return{
                links:null,
                visitUserName: '',
                loginUserName: ''
            }
        },
        created(){
            // 获取访问博客的用户名(地址栏上)
            var href = document.URL
            var indexEnd = href.lastIndexOf('#!')
            var indexStart = href.lastIndexOf('/', indexEnd) + 1
            this.visitUserName = href.slice(indexStart, indexEnd)

            this.loginUserName = get('user')
            let name = this.loginUserName || this.visitUserName || ''
            this.$http.post('/web/common/getLinks', {name: name})
            .then((response)=> {
                let res = JSON.parse(response.body)
                let code = res.retcode
                let desc = res.retdesc
                let data = res.data
                switch (code){
                    case 200:
                        this.links = data.links
                        break
                    default:
                        this.pop({
                            content: desc,
                            btn1: '返回',
                            cb1: ()=>{
                                window.history.back(-1); 
                            }
                        })
                }
            }, (response)=> {
                console.log(response)
            })
        },
        methods:{
            goHome(){
                if(this.loginUserName){
                    location.href = '/' + this.loginUserName + '#!/'
                }else{
                    this.$router.go('/')
                }
            }
        }

    }
</script>
<style lang="sass">
    @import "../style/components/MyHeader.scss";
</style>