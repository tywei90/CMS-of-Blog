<!-- pop组件参数说明
    pop: 弹窗的显示与否, 根据content参数，有内容则为true
    css: 自定义弹窗的class, 默认为空
    close: 为false则不显示关闭按钮, 默认显示
    title: 弹窗的标题，默认'温馨提示', 如果不想显示title, 直接传空
    content(required): 弹窗的内容，支持传html
    btn1: '按钮1文案|按钮1样式class', 格式化后为btn1Text和btn1Css
    (formated)btn1Text: 按钮1文案
    (formated)btn1Css: 按钮1样式class
    cb1: 按钮1点击之后的回调，如果cb1没有明确返回true，则默认按钮点击后关闭弹窗
    btn2: '按钮2文案|按钮1样式class', 格式化后为btn2Text和btn2Css
    (formated)btn2Text: 按钮2文案
    (formated)btn2Css: 按钮2样式class
    cb2: 按钮2点击之后的回调，如果cb2没有明确返回true，则默认按钮点击后关闭弹窗
    按钮参数不传，文案默认'我知道了'，点击关闭弹窗
    init: 弹窗建立后的初始化函数，可以用来处理复杂交互的弹窗(注意弹窗一定要是从pop为false变成true才会执行)
-->

<template>
    <div class="m-dialog" :class="getPopPara.css">
        <div class="dialog-wrap">
            <span class="close" @click="pop()" v-if="getPopPara.close">+</span>
            <div class="title" v-if="getPopPara.title">{{getPopPara.title}}</div>
            <div class="content">{{{getPopPara.content}}}</div>
            <div class="button">
                <p class="btn" :class="getPopPara.btn1Css" @click="fn1">
                    <span>{{getPopPara.btn1Text}}</span>
                </p>
                <p class="btn" :class="getPopPara.btn2Css" @click="fn2" v-if="getPopPara.btn2Text">
                    <span>{{getPopPara.btn2Text}}</span>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    import {pop}  from '../vuex/actions'
    import {getPopPara} from '../vuex/getters'
    export default{
        computed:{
            showDialog(){
                return this.getPopPara.pop
            }
        },
        vuex: {
            getters: {
                getPopPara,
            },
            actions: {
                pop
            }
        },
        methods: {
            fn1(){
                let fn = this.getPopPara.cb1
                let closePop = false
                //  如果cb1函数没有明确返回true，则默认按钮点击后关闭弹窗
                if(typeof fn == 'function'){
                    closePop = fn()
                }
                // 初始值为false, 所以没传也默认关闭
                if(!closePop){
                    this.pop()
                }
                // !fn && this.pop()
            },
            fn2(){
                let fn = this.getPopPara.cb2
                let closePop = false
                //  如果cb1函数没有明确返回true，则默认按钮点击后关闭弹窗
                if(typeof fn == 'function'){
                    closePop = fn()
                }
                // 初始值为false, 所以没传也默认关闭
                if(!closePop){
                    this.pop()
                }
                // !fn && this.pop()
            }
        },
        watch:{
            // 监测每次pop为true, 即弹窗显示的时候执行
            'showDialog': function(newVal, oldVal){
                if(newVal){
                    let fn = this.getPopPara.init
                    typeof fn == 'function' && fn()
                }
            }
        }
    }
</script>
<style lang="sass">
    @import "../style/components/Pop.scss";
</style>