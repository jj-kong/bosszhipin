/*使用 mongoose 操作 mongodb 的测试文件 
1. 连接数据库 
1.1. 引入 mongoose 
1.2. 连接指定数据库(URL 只有数据库是变化的) 
1.3. 获取连接对象 
1.4. 绑定连接完成的监听(用来提示连接成功) 
2. 得到对应特定集合的 Model 
2.1. 字义 Schema(描述文档结构) 
2.2. 定义 Model(与集合对应, 可以操作集合) 
3. 通过 Model 或其实例对集合数据进行 CRUD 操作 
3.1. 通过 Model 实例的 save()添加数据 
3.2. 通过 Model 的 find()/findOne()查询多个或一个数据 
3.3. 通过 Model 的 findByIdAndUpdate()更新某个数据 
3.4. 通过 Model 的 remove()删除匹配的数据 */
const md5 = require('blueimp-md5')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/myDB')
const conn = mongoose.connection
conn.on('connected', function () {
    console.log('bosszhipin_new数据库连接成功')
})
//定义users集合的文档结构
const userSchema = mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    type: { type: String, required: true },
    header: { type: String },
    job: { type: String },
    info: { type: String },
    company: { type: String },
    salary: { type: String }
})
const UserModel = mongoose.model('user', userSchema)
exports.UserModel = UserModel

//定义chats集合的文档集合
const chatSchema = mongoose.Schema({
    from: { type: String, required: true }, //发送给用户的id
    to: { type: String, required: true }, //接收用户的id
    chat_id: { type: String, required: true }, //from和to组成的字符串，用于对消息分组
    content: { type: String, required: true }, //内容
    read: { type: Boolean, default: false }, //标识是否已读
    create_time: { type: Number } //创建时间，用于排序显示
})



const ChatModel = mongoose.model('chat', chatSchema)

exports.ChatModel = ChatModel 
