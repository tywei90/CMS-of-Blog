<template>
    <section class="links">
        <div class="title">链接编辑</div>
        <table>
            <tbody>
            <tr>
                <th>链接名称</th>
                <th>链接地址</th>
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
            </tr>
            </tbody>
        </table>
        <div class="panel">
            <button @click="saveLinks">保存</button>
        </div>
    </section>
</template>

<script>
    import {userName}   from '../vuex/getters'
    import {pop}        from '../vuex/actions'
    import {get}    from '../js/cookieUtil'
    export default{
        data(){
            return {
                links: null
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
        },
        methods: {
            addLink(i){
                this.links.splice(i + 1, 0, {
                    name: '',
                    href: ''
                })
            },
            removeLink(i){
                this.links.splice(i, 1)
            },
            saveLinks(){
                if (this.userName === '游客') {
                    this.pop({
                        pop: true,
                        content: '游客无此权限',
                        cb1: function () {
                            this.pop({})
                        }.bind(this)
                    })
                    return
                }
                this.$http.post('/setLinks', this.$data)
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
            getters: {
                userName,
            },
            actions: {
                pop,
            }
        }
    }
</script>

<style lang="sass">
    @import "../style/components/Links.scss";
</style>