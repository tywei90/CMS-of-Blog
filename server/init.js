module.exports={
    articles:[{
        title: '欢迎使用博客系统',
        date: new Date(),
        content: "此博客系统前端是用vue全家桶搭建的，负责路由跳转，是个单页面应用。后台用的nodejs的express框架，用mongoose驱动mongodb数据库来实现数据库管理。\n---\n####   此博客系统支持一下功能：\n* 一个基本的博客内容管理器功能，如后台登陆，发布并管理文章等\n* 支持[markdown语法编辑](http://www.appinn.com/markdown/basic.html)\n* 支持代码高亮\n* 可以管理博客页面的链接\n* 博客页面对移动端适配优化*账户管理(修改密码)\n* 页面足够大气、酷炫嘿"
    }],
    links:[{
        name:'GITHUB',
        href:'https://www.github.com'
    },{
        name:'设置',
        href:'/#!/console'
    }]
}