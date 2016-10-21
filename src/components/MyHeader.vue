<template>
    <header class="myHeader">
        <div class="circle" @click="this.$router.go('/')">
            <img src="../img/me.jpg" alt="ycwalker">
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
    </header>
</template>
<script>
    import {get}    from '../js/cookieUtil'
    export default{
        data(){
            return{
                links:null,
            }
        },
        created(){
            let userName = get('user')
            if (!userName) {
                return
            }
            this.$http.post('/getLinks')
                .then((response)=> {
                    let res = JSON.parse(response.body)
                    let code = res.retcode
                    let data = res.data
                    switch (code){
                        case 200:
                            this.links = data.links
                            break
                        case 410:
                            alert('未登录')
                            break
                    }
                }, (response)=> {
                    console.log(response)
                })
        }

    }
</script>
<style lang="sass">
    @import "../style/components/MyHeader.scss";
</style>