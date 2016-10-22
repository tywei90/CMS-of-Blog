<template>
    <section class="articleList">
        <button @click="$router.go('/console/editor')">
            新增文章
        </button>
        <table>
            <tbody>
                <tr>
                    <th @click="sort('title')">标题</th>
                    <th @click="sort('date')">日期</th>
                    <th>选项</th>
                </tr>
                <tr v-for="article in articles">
                    <td @click="detail(article._id)">
                        {{article.title}}
                    </td>
                    <td>
                        {{article.date | dateParse}}
                    </td>
                    <td>
                        <i class="icon iconfont icon-xiugai"
                           @click="edit(article._id)">
                        </i>
                        <i class="icon iconfont icon-shanchu"
                           @click="deleteItem(article._id,$index)">
                        </i>
                    </td>
                </tr>
            </tbody>
        </table>
    </section>
</template>
<script>
    import {userName}   from '../vuex/getters'
    import {pop}        from '../vuex/actions'
    export default{
        data(){
            return {
                articles: null,
                sortState:{
                    date:0,
                }

            }
        },
        filters: {
            dateParse: value=>{
                let d = new Date(value)
                return d.getFullYear() + '年' +
                        (d.getMonth()+1) + '月' +
                        d.getDate() + '日'
            }
        },
        created(){
            this.$http.get('/web/articleList')
                .then((response)=> {
                    let res = JSON.parse(response.body)
                    let code = res.retcode
                    let data = res.data
                    switch (code){
                        case 200:
                            this.articles = data.articles.sort((i, j)=> {
                                return new Date(j.date) - new Date(i.date)
                            })
                            break
                        case 410:
                            alert('未登录')
                            break
                    }
                }, (response)=> {
                    console.log(response)
                })
        },
        methods:{
            edit(id){
                this.$router.go('/console/editor?id='+id)
            },
            deleteItem(id,index){
                this.pop({
                    pop:true,
                    content:'确定要删除吗',
                    cb1:function () {
                        this.$http.post('/web/delete',{id})
                            .then((response)=> {
                                let res = JSON.parse(response.body)
                                let code = res.retcode
                                let data = res.data
                                switch (code){
                                    case 200:
                                        this.pop({
                                            pop:true,
                                            content:'删除成功',
                                            cb1:function () {
                                                this.pop({})
                                                this.articles.splice(index,1)
                                            }.bind(this)
                                        })
                                        break
                                    case 410:
                                        alert('未登录')
                                        break
                                }
                            }, (response)=> {
                                console.log(response)
                            })
                    }.bind(this),
                    btn2: '取消'
                })

            },
            detail(id){
                this.$router.go('/article?id='+id)
            },
            sort(opt){
                if(opt=='date'){
                    if(this.sortState.date===0){
                        this.articles = this.articles.sort((i, j)=>{
                            return new Date(i.date) - new Date(j.date)
                        })
                        this.sortState.date=1
                    }else {
                        this.articles.reverse()
                    }
                }else if(opt=='title'){
                    this.articles.reverse()
                }
            }
        },
        vuex: {
            getters: {
                userName,
            },
            actions:{
                pop,
            }
        }
    }
</script>
<style lang="sass">
    @import "../style/components/ArticleList.scss";
</style>