var express = require('express')
var router = express.Router()
var db = require('./db')
var init = require('./init')

// router.get('/', function(req, res, next) {
//     res.render('index', { title: 'CMS-blog' });
// })

router.post('/validateUsername', function(req, res, next) {
    var userName = req.body.userName,
        resBody = {
            retcode: '',
            retdesc: '',
            data: {}
        }
    db.User.count({ name: userName }, function(err, num) {
        if (err) {
            return console.log(err)
        } else {
            if (num === 0) {
                resBody = {
                    retcode: 200,
                    retdesc: '没有同名账号，可以使用注册',
                    data: {}
                }
            } else {
                resBody = {
                    retcode: 400,
                    retdesc: '已有同名账号',
                    data: {}
                }
            }
            res.send(resBody)
        }
    })
})

router.get('/article', function(req, res, next) {
    var id = req.query.id
    var name = req.cookies['user']
    var resBody = {
        retcode: '',
        retdesc: '',
        data: {}
    }
    if (!name) {
        resBody = {
            retcode: 410,
            retdesc: '未登录',
            data: {}
        }
        res.send(doc)
    }
    db.User.findOne({ name: name }, function(err, doc) {
        if (err) {
            return console.log(err)
        } else if (doc) {
            var article = doc.articles.id(id)
            if(article){
                resBody = {
                    retcode: 200,
                    retdesc: '请求成功',
                    data: {
                        article: article
                    }
                }
            }else{
                resBody = {
                    retcode: 400,
                    retdesc: '参数错误',
                    data: {}
                }
            }
            res.send(resBody)
        }
    })
})

router.get('/articleList', function(req, res, next) {
    var name = req.cookies['user']
    var resBody = {
        retcode: '',
        retdesc: '',
        data: {}
    }
    if (!name) {
        resBody = {
            retcode: 410,
            retdesc: '未登录',
            data: {}
        }
        res.send(doc)
    }
    db.User.findOne({ name: name }, function(err, doc) {
        if (err) {
            return console.log(err)
        } else if (doc) {
            resBody = {
                retcode: 200,
                retdesc: '请求成功',
                data: {
                    articles: doc.articles
                }
            }
            res.send(resBody)
        }
    })
})

router.post('/login', function(req, res, next) {
    var name = req.body.userName,
        password = req.body.password,
        resBody = {
            retcode: '',
            retdesc: '',
            data: {}
        }
    db.User.findOne({ name: name }, 'password', function(err, doc) {
        if (err) {
            return console.log(err)
        } else if (!doc) {
            resBody = {
                retcode: 401,
                retdesc: '账号不存在',
                data: {}
            }
            res.send(resBody)
        } else if (doc.password === password) {
            resBody = {
                retcode: 200,
                retdesc: '登陆成功',
                data: {}
            }
            res.send(resBody)
        } else {
            resBody = {
                retcode: 402,
                retdesc: '密码错误',
                data: {}
            }
            res.send(resBody)
        }
    })
})

router.post('/register', function(req, res, next) {
    var name = req.body.userName,
        password = req.body.password,
        tel = req.body.tel,
        resBody = {
            retcode: '',
            retdesc: '',
            data: {}
        }
    // 校验用户名，作为注册以后的用户博客对应的网址路径
    if(!/^[a-z]{1}[a-z0-9_]{3,15}$/.test(name)){
        resBody = {
            retcode: 401,
            retdesc: '用户名格式错误',
            data: {}
        }
        res.send(resBody)
    }
    db.User.findOne({ name: name }, function(err, doc) {
        if (err) {
            return console.log(err)
        } else if (doc) {
            resBody = {
                retcode: 400,
                retdesc: '账号已存在',
                data: {}
            }
            res.send(resBody)
        } else {
            // '设置'的href跟用户名有关
            var links = init.links
            links[0].href = '/' + name + links[0].href
            new db.User({
                name: name,
                password: password,
                tel: tel,
                articles: init.articles,
                links: links
            }).save(function(err) {
                if (err) return console.log(err)
                resBody = {
                    retcode: 200,
                    retdesc: '注册成功',
                    data: {
                        userName: name
                    }
                }
                res.send(resBody)
            })
        }
    })
})

router.post('/save', function(req, res, next) {
    var name = req.cookies['user']
    var resBody = {
        retcode: '',
        retdesc: '',
        data: {}
    }
    if (!name) {
        resBody = {
            retcode: 410,
            retdesc: '未登录',
            data: {}
        }
        res.send(doc)
    }
    db.User.findOne({ name: name }, function(err, doc) {
        if (err) {
            return console.log(err)
        } else if (doc) {
            console.log(req.body.content);
            if (req.body.id) {
                var article = doc.articles.id(req.body.id)
                article.title = req.body.title
                article.date = req.body.date
                article.content = req.body.input
            } else {
                var newArticleJSON = {
                    title: req.body.title,
                    date: req.body.date,
                    content: req.body.input
                }
                doc.articles.push(newArticleJSON)
            }
            doc.save(function (err) {
                if (err) return console.log(err)
                resBody = {
                    retcode: 200,
                    retdesc: '保存成功！',
                    data: {}
                }
                res.send(resBody)
            });
        }
    })
})

router.post('/getLinks', function(req, res, next) {
    var name = req.cookies['user']
    var resBody = {
        retcode: '',
        retdesc: '',
        data: {}
    }
    if (!name) {
        resBody = {
            retcode: 410,
            retdesc: '未登录',
            data: {}
        }
        res.send(doc)
    }
    db.User.findOne({ name: name }, function(err, doc) {
        if (err) {
            return console.log(err)
        } else if (doc) {
            resBody = {
                retcode: 200,
                retdesc: '请求成功',
                data: {
                    links: doc.links
                }
            }
            res.send(resBody)
        }
    })
})

router.post('/setLinks', function(req, res, next) {
    var name = req.cookies['user']
    var resBody = {
        retcode: '',
        retdesc: '',
        data: {}
    }
    if (!name) {
        resBody = {
            retcode: 410,
            retdesc: '未登录',
            data: {}
        }
        res.send(doc)
    }
    db.User.findOne({ name: name }, function(err, doc) {
        if (err) {
            return console.log(err)
        } else if (doc) {
            // doc.links.remove()
            doc.links = req.body.links
            doc.save(function(err) {
                if (err) return console.log(err)
                resBody = {
                    retcode: 200,
                    retdesc: '设置成功',
                    data: {}
                }
                res.send(resBody)
            })
        }
    })
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
                if (err) {
                    return console.log(err)
                } else {
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
    var name = req.cookies['user']
    var resBody = {
        retcode: '',
        retdesc: '',
        data: {}
    }
    if (!name) {
        resBody = {
            retcode: 410,
            retdesc: '未登录',
            data: {}
        }
        res.send(doc)
    }
    db.User.findOne({ name: name }, function(err, doc) {
        if (err) {
            return console.log(err)
        } else if (doc) {
            doc.articles.id(req.body.id).remove()
            doc.save(function(err) {
                if (err) return console.log(err)
                resBody = {
                    retcode: 200,
                    retdesc: '删除成功',
                    data: {}
                }
                res.send(resBody)
            })
        }
    })
})
module.exports = router;
