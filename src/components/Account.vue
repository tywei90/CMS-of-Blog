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
    import {pop}            from '../vuex/actions'
    import {unset}          from '../js/cookieUtil'
    import popLogin         from '../js/login'

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
            popLogin,
            savePw(){
                this.$validate(true, ()=> {
                    if (!this.$loginValidator.valid) {
                        this.pop('密码格式错误')
                        return
                    }
                    if (this.pw !== this.rpw) {
                        this.pop('两次输入不一致')
                        return
                    }
                    this.$http.post('/web/savePw', {
                        oldPassword: this.opw,
                        newPassword: this.pw
                    }).then((res)=> {
                        let data = JSON.parse(res.body);
                        switch (data.retcode){
                            case 200:
                                this.pop({
                                    close: false,
                                    content: data.retdesc,
                                    btn1: '重新登录',
                                    cb1: function () {
                                        unset('user', '/', location.hostname)
                                        location.href = "/#!/login"
                                    },
                                })
                                break
                            case 410:
                                this.popLogin(this.savePw)
                                break
                            case 430:
                                this.pop({
                                    close: false,
                                    content: desc,
                                    btn1: '确定',
                                    cb1: ()=>{
                                        location.href = data.name + '#!/console'
                                    }
                                })
                                break
                            default:
                                this.pop({
                                    content: data.retdesc,
                                })
                        }
                    }, (res)=> {
                        console.log(res)
                    })
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