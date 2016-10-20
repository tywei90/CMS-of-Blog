<template>
    <div class="shade">
        <div class="content">
            <div class="pop-content">{{{getPopPara.content}}}</div>
            <div class="button">
                <button class="ok" @click="ok">{{getPopPara.btn1}}</button>
                <button class="cancel" @click="cancel"
                        v-if="getPopPara.btn2">{{getPopPara.btn2}}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import {pop}  from '../vuex/actions'
    import {getPopPara} from '../vuex/getters'
    export default{
        vuex: {
            getters: {
                getPopPara,
            },
            actions: {
                pop
            }
        },
        methods: {
            ok(){
                let fn = this.getPopPara.cb1
                typeof fn == 'function' && fn()
                !fn && this.pop({})
            },
            cancel(){
                let fn = this.getPopPara.cb2
                typeof fn == 'function' && fn()
                !fn && this.pop({})
            }
        }

    }
</script>
<style lang="sass">
    @import "../style/components/Pop.scss";
</style>