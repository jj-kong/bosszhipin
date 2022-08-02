// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// // router.get('/', function (req, res, next) {
// //   res.render('index', { title: '老孔最酷！' });
// // });

// router.post('/register', function (req, res, next) {
//   const { username, password } = req.body
//   console.log('register', username, password)
//   if (username === 'admin') {
//     res.send({
//       code: 1,
//       msg: '用户存在'
//     })
//   } else {
//     res.send({ code: 0, data: { _id: 'bac', username, password } })
//   }
// })

// module.exports = router;
var express = require('express');
var router = express.Router();
const md5 = require('blueimp-md5')
const { UserModel, ChatModel } = require('../db/models')
//import {UserModel,ChatModel} from '../db/models'
const filter = { password: 0, __v: 0 }
router.post('/register', function (req, res) {
  const { username, password, type } = req.body

  UserModel.findOne({ username }, function (err, user) {
    if (user) {
      res.send({ code: 1, msg: '此用户已经存在' })
    }
    else {
      new UserModel({ username, password: md5(password), type }).save(function (err, user) {
        res.cookie('userid', user._id, { maxAge: 1000 * 60 * 60 * 24 * 7 })//user._id是分配给名为userid的cookie的值
        res.send({ code: 0, data: { _id: user._id, username, type } })
      })
    }
  })
})

router.post('/login', function (req, res) {
  const { username, password } = req.body;
  UserModel.findOne({ username, password: md5(password) }, filter, function (err, user) { //findOne()若是在数据库中找到了当前所查询的用户信息就返回这个用户信息
    if (user) {
      res.cookie('userid', user._id, { maxAge: 1000 * 60 * 60 * 24 * 7 })
      res.send({ code: 0, data: user }) //user中没有password
    } else {
      res.send({ code: 1, msg: '用户名或密码错误或用户不存在！' });
    }
  })
})
//更新用户路由
router.post('/update', function (req, res) {
  const userid = req.cookies.userid;//得到请求cookie的userid
  if (!userid) {
    return res.send({ code: 1, msg: '请先登录！' }) //这里必须要有返回，返回到登录界面
  }
  //更新数据库中对应的数据
  UserModel.findByIdAndUpdate({ _id: userid }, req.body, function (err, olduser) {//user是数据库中原来的数据
    if (!olduser) {
      //通知浏览器删除userid cookie
      res.clearCookie('userid');
      res.send({ code: 1, msg: '请先登录' })
    } else {
      //准备返回一个user对象
      const { _id, username, type } = olduser;
      const data = Object.assign(req.body, { _id, username, type })
      res.send({ code: 0, data: data })
    }

  })

})
//根据cookie获取对应的user
router.get('/user', function (req, res) {
  const userid = req.cookies.userid;//得到请求cookie的userid
  if (!userid) {
    return res.send({ code: 1, msg: '请先登录！' })
  }
  //查询对应的user
  UserModel.findOne({ _id: userid }, filter, function (err, user) {//user是数据库中原来的数据
    res.send({ code: 0, data: user })
  })

})
//获取用户列表（根据用户类型）
router.get('/userlist', function (req, res) {
  const { type } = req.query;
  UserModel.find({ type }, filter, function (err, users) {
    res.send({ code: 0, data: users })
  })
})

/*获取当前用户所有相关聊天信息列表 */
router.get('/msglist', function (req, res) {
  const userid = req.cookies.userid;
  UserModel.find(function (err, userDocs) {
    const users = {};
    userDocs.forEach(doc => {
      users[doc._id] = { username: doc.username, header: doc.header }
    })
    ChatModel.find({ '$or': [{ from: userid }, { to: userid }] }, filter, function (err, chatMsgs) {
      res.send({ code: 0, data: { users, chatMsgs } })
    })
  })
})

router.post('/readmsg', function (req, res) {
  //得到请求中的from和to
  const from = req.body.from;
  const to = req.cookies.userid;

  ChatModel.update({ from, to, read: false }, { read: true }, { multi: true }, function (err, doc) {
    console.log('/readmsg', doc)
    res.send({ code: 0, data: doc.nModified })
  })
})
module.exports = router; //注意这里特别重要，写丢了就直接报错了
