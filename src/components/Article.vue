<template>
    <div class="wrap">
        <my-header></my-header>
        <section class="article">
            <article class="post-block">
                <div class="post-title">{{title}}</div>
                <div class="post-info">{{date}}</div>
                <div class="post-content">
                    {{{content | marked}}}
                </div>
            </article>
        </section>
        <my-footer></my-footer>
    </div>
</template>
<script>
    import myHeader     from './MyHeader.vue'
    import myFooter     from './MyFooter.vue'
    import marked       from '../js/marked.min'
    import hljs         from '../js/highlight.min'
    import {bgToggle, pop}   from '../vuex/actions'
    import {get}    from '../js/cookieUtil'

    export default{
        data(){
            return {
                title: '',
                date: '',
                content: ''
            }
        },
        filters: {
            marked
        },
        route: {
            canReuse:()=>false
        },
        watch: {
            content: hljs.initHighlighting
        },
        created(){
            let userName = get('user')
            if (!userName) {
                this.$router.go('/login')
                return
            }
            let id = this.$route.query.id
            this.$http.get('/article?id=' + id)
                    .then((response)=> {
                        let res = JSON.parse(response.body)
                        let code = res.retcode
                        let desc = res.retdesc
                        let data = res.data
                        switch (code){
                            case 200:
                                this.content = data.article.content
                                this.title = data.article.title
                                let d = new Date(data.article.date)
                                this.date = d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日'
                                break
                            case 410:
                                alert('未登录')
                                break
                            case 400:
                                this.pop({
                                    pop: true,
                                    content: desc,
                                    btn1: '返回上一页',
                                    cb1: ()=>{
                                        window.history.back(-1); 
                                    }
                                })
                                break
                        }
                    }, (response)=> {
                        console.log(response)
                    })
        },
        components: {
            myHeader,
            myFooter
        },
        ready(){
            this.bgToggle('MyCanvas')
            hljs.initHighlighting()
            hljs.initHighlighting.called = false
        },
        vuex: {
            actions: {
                bgToggle,
                pop
            }
        }
    }
</script>
<style lang="sass">
    @import "../style/components/Article.scss";
</style>