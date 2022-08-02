module.exports = function (server) {
    //得到IO对象
    const io = require('socket.io')(server);
    //监视连接（当有一个客户连接上时回调
    //监听客户端与服务器的连接
    io.on('connection', function (socket) {
        console.log('有一个客户端连接上了服务器');
        // //绑定sendMsg监听，接受客户端发送的消息
        socket.on('sendMsg', function (data) {
            console.log('服务器接收到浏览器的消息', data);
            //         //向客户端发送消息（名称，消息）
            //以下两种方式都可以
            //socket.emit('receiveMsg', data.name + '_' + data.date)
            io.emit('receiveMsg', data.name + '_' + data.date)
            console.log('服务器向浏览器发送消息', data)
        })
    })
}