//引入操作chats集合数据的Model
const { ChatModel } = require('../db/models');

/*启动socket.io服务的函数*/
module.exports = function (server) {
    const io = require('socket.io')(server)
    io.on('connect', function (socket) {
        console.log('有客户连接上了');
        socket.on('sendMsg', function ({ from, to, content }) {
            console.log('服务器接收到客户端发送的消息', {from, to, content })
            //保存消息（处理消息）
            //准备chatMsg对象的相关消息
            const chat_id = [from, to].sort().join('_')
            const create_time = Date.now();
            const chatModel = new ChatModel({ chat_id, from, to, create_time, content })

            chatModel.save(function (err, chatMsg) {
                io.emit('receiveMsg', chatMsg)
                console.log('向所有连接的客户端发送消息', chatMsg)
            })
        })
    })
}