<template>
    <section class="account">
        <validator name="loginValidator">
            <div class="title">修改密码</div>
            <div class="password">
                <i class="icon iconfont icon-mima"></i>
                <input type="password"
                       placeholder="输入原密码"
                       initial="off"
                       detect-change="off"
                       detect-blur="off"
                       v-validate:password1="passwordRule"
                       v-model="opw">
                <br>
                <i class="icon iconfont icon-mima"></i>
                <input type="password"
                       placeholder="输入新密码"
                       initial="off"
                       detect-change="off"
                       detect-blur="off"
                       v-validate:password2="passwordRule"
                       v-model="pw">
                <br>
                <i class="icon iconfont icon-mima"></i>
                <input type="password"
                       placeholder="重新输入"
                       initial="off"
                       detect-change="off"
                       detect-blur="off"
                       v-validate:password3="passwordRule"
                       @keydown.enter="savePw"
                       v-model="rpw">
            </div>
            <div class="panel">
                <button @click="savePw">保存</button>
            </div>
        </validator>
    </section>
</template>
<script>
    import {pop}        from '../vuex/actions'
    import {unset}           from '../js/cookieUtil'
    export default{
        data(){
            return {
                opw: '',
                pw: '',
                rpw: '',
                passwordRule: {
                    minlength: 4,
                    maxlength: 16
                }
            }
        },
        methods: {
            savePw(){
                this.$validate(true, ()=> {
                    if (this.$loginValidator.valid) {
                        if (this.pw === this.rpw) {
                            this.$http.post('/web/savePw', {
                                oldPassword: this.opw,
                                newPassword: this.pw
                            }).then((res)=> {
                                let data = JSON.parse(res.body);
                                switch (data.retcode){
                                    case 200:
                                        this.pop({
                                            pop: true,
                                            content: data.retdesc,
                                            btn1: '重新登录',
                                            cb1: function () {
                                                this.pop({})
                                                unset('user', '/', location.hostname)
                                                location.href = "/#!/login"
                                            }.bind(this),
                                        })
                                        break
                                    case 410:
                                        alert('未登录')
                                        break
                                    default:
                                        this.pop({
                                            pop: true,
                                            content: data.retdesc,
                                            cb1: function () {
                                                this.pop({})
                                            }.bind(this)
                                        })
                                }
                            }, (res)=> {
                                console.log(res)
                            })
                        }else {
                            this.pop({
                                pop: true,
                                content: '两次输入不一致',
                                cb1: function () {
                                    this.pop({})
                                }.bind(this)
                            })
                        }
                    }else{
                        this.pop({
                            pop: true,
                            content: '密码格式错误',
                            cb1: function () {
                                this.pop({})
                            }.bind(this)
                        })
                    }
                })
            }
        },
        vuex: {
            actions: {
                pop
            }
        }
    }
</script>
<style lang="sass">
    @import "../style/components/Account.scss";
</style>