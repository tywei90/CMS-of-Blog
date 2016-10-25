<template>
    <section class="links">
        <div class="title">链接编辑</div>
        <table>
            <tbody>
            <tr>
                <th>链接名称</th>
                <th>链接地址</th>
                <th>新开页面</th>
            </tr>
            <tr v-for="link in links">
                <td>
                    <i class="icon iconfont icon-jia"
                       @click="addLink($index)"
                       v-if="links.length<4">
                    </i>
                    <i class="icon iconfont icon-jian"
                       @click="removeLink($index)"
                       v-if="links.length>1">
                    </i>
                    <input type="text" v-model="link.name">
                </td>
                <td>
                    <input type="text" v-model="link.href">
                </td>
                <td>
                    <span class="check" @click="changeCheckState($index)">
                        <i class="icon iconfont icon-fuxuangougou" :class="{'unChecked': !link.newPage}"></i>
                    </span>
                </td>
            </tr>
            </tbody>
        </table>
        <div class="panel">
            <button @click="saveLinks">保存</button>
        </div>
    </section>
</template>

<script>
    import {pop}        from '../vuex/actions'
    export default{
        data(){
            return {
                links: null
            }
        },
        created(){
            this.$http.get('/web/console/getLinks')
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
        },
        methods: {
            changeCheckState(index){
                this.links[index].newPage = !this.links[index].newPage
            },
            addLink(i){
                this.links.splice(i + 1, 0, {
                    name: '',
                    href: '',
                    newPage: true
                })
            },
            removeLink(i){
                this.links.splice(i, 1)
            },
            saveLinks(){
                this.$http.post('/web/setLinks', this.$data)
                .then((response)=> {
                    let res = JSON.parse(response.body)
                    let code = res.retcode
                    let data = res.data
                    switch (code){
                        case 200:
                            this.pop({
                                pop: true,
                                content: '保存成功',
                                cb1: function () {
                                    this.pop({})
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
            },
        },
        vuex: {
            actions: {
                pop
            }
        }
    }
</script>

<style lang="sass">
    @import "../style/components/Links.scss";
</style>