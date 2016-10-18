var express = require('express');
var router = express.Router();
var db = require('./db')

router.get('/', function(req, res, next) {
    res.render('index', { title: 'CMS-blog' });
})

router.get('/article', function(req, res, next) {
    var id = req.query.id
    db.Article.findOne({ _id: id }, function(err, doc) {
        if (err) {
            return console.log(err)
        } else if (doc) {
            res.send(doc)
        }
    })
})

router.get('/articleList', function(req, res, next) {
    // // 查询符合条件的文档并返回根据键分组的结果
    // db.Article.distinct('date', {title: "Vue Components"}, function(err, doc){
    //     if(err){
    //         return console.log(err)
    //     }else{
    //         console.log(doc);
    //     }
    // })
    // // 直接指定js代码查询，返回结果为true的文档数组
    // db.Article.find({$where: function(){
    //     return /^Vue/.test(this.title)
    // }}, 'date', function(err,doc){
    //     if(err){
    //         return console.log(err)
    //     }else{
    //         console.log(doc);
    //     }
    // })
    // // 返回符合条件的文档数
    // db.Article.count({title: "Vue Components"}, function(err,doc){
    //     if(err){
    //         return console.log(err)
    //     }else{
    //         console.log(doc);
    //     }
    // })
    db.Article.find(null, 'title date', function(err, doc) {
        if (err) {
            return console.log(err)
        } else if (doc) {
            res.send(doc)
        }
    })
})

router.post('/login', function(req, res, next) {
    var name = req.body.userName,
        password = req.body.password,
        resBody = { state: '' }
    db.User.findOne({ name: name }, 'password', function(err, doc) {
        if (err) {
            return console.log(err)
        } else if (!doc) {
            resBody.state = '账号不存在'
            res.send(resBody)
        } else if (doc.password === password) {
            resBody.state = '登陆成功'
            res.send(resBody)
        } else {
            resBody.state = '密码错误'
            res.send(resBody)
        }
    })
})

router.post('/save', function(req, res, next) {
    if (req.body.id) {
        var obj = {
            title: req.body.title,
            date: req.body.date,
            content: req.body.input
        }

        db.Article.findByIdAndUpdate(req.body.id, obj, function(err) {
            if(err){
                return console.log(err);
            }
        })
    } else {
        // // 增加记录，基于entity的操作
        // var newArticle = new db.Article({
        //     title: req.body.title,
        //     date: req.body.date,
        //     content: req.body.input
        // })
        // newArticle.save(function(err) {
        //     if (err) return console.log(err)
        // })
        // 增加记录，基于model的操作
        var newArticleJSON = {
            title: req.body.title,
            date: req.body.date,
            content: req.body.input
        }
        db.Article.create(newArticleJSON, function(err) {
            if (err) return console.log(err)
        })
    }
    res.send('OK')
})

router.post('/getLinks', function(req, res, next) {
    db.Link.find(null, function(err, doc) {
        if (err) {
            return console.log(err)
        } else if (doc) {
            res.send(doc)
        }
    })
})

router.post('/setLinks', function(req, res, next) {
    db.Link.remove(null, function(err) {})
    req.body.links.forEach(function(item) {
        new db.Link({
            name: item.name,
            href: item.href
        }).save(function(err) {
            if (err) return console.log(err)
        })
    })
    res.send('ok')
})

router.post('/savePw', function(req, res, next) {
    var name = req.body.userName,
        oldPassword = req.body.oldPassword,
        newPassword = req.body.newPassword,
        resBody = {
            retcode: '',
            retdesc: '',
            data: {}
        }
    db.User.findOne({ name: name }, 'password', function(err, doc) {
        if (err) {
            return console.log(err);
        } else if (doc.password !== oldPassword) {
            resBody = {
                retcode: 420,
                retdesc: '原密码错误',
                data: {}
            }
            res.send(resBody)
        } else if (newPassword.length < 4) {
            resBody = {
                retcode: 430,
                retdesc: '密码格式错误',
                data: {}
            }
            res.send(resBody)
        } else {
            db.User.update({ name: name }, { password: newPassword }, function(err) {
                if(err){
                    return console.log(err)
                }else{
                    resBody = {
                        retcode: 200,
                        retdesc: '修改成功',
                        data: {}
                    }
                    res.send(resBody)
                }
            })
        }
    })
})

router.post('/delete', function(req, res, next) {
    db.Article.findByIdAndRemove(req.body.id, function(err) {
        console.log(err)
    })
    res.send('ok')
})
module.exports = router;
