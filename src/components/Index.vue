<template>
    <div class="wrap">
        <my-header></my-header>
        <section class="index">
            <h2>这是待开发的博客首页，参见<a href="http://www.csdn.net/">csdn</a></h1>
        </section>
        <my-footer></my-footer>
    </div>
</template>
<script>
    import myHeader     from './MyHeader.vue'
    import myFooter     from './MyFooter.vue'
    import {bgToggle}   from '../vuex/actions'
    import {get}    from '../js/cookieUtil'
    export default{
        data(){
            return {

            }
        },
        created(){
            
        },
        ready(){
            this.bgToggle('MyCanvas')
        },
        methods: {
            
        },
        components: {
            myHeader,
            myFooter,
        },
        computed: {
            
        },
        vuex:{
            actions:{
                bgToggle
            }
        }
    }
</script>
<style lang="sass">
    @import "../style/components/Index.scss";
</style>