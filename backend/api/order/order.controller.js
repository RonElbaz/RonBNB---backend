const logger = require('../../services/logger.service')
// const userService = require('../user/user.service')
const authService = require('../auth/auth.service')
const socketService = require('../../services/socket.service')
const orderService = require('./order.service')

async function getOrders(req, res) {
    try {
        const orders = await orderService.query(req.query)
        res.send(orders)
    } catch (err) {
        logger.error('Cannot get orders', err)
        res.status(500).send({ err: 'Failed to get orders' })
    }
}

async function updateOrder(req, res) {
    try {
        // console.log(req.body);
        const orders = await orderService.update(req.body)
        // console.log(orders);
        socketService.broadcast({type: 'order-updated', data: orders, userId: orders.host._id})
        res.send(orders)
    } catch (err) {
        logger.error('Cannot get orders', err)
        res.status(500).send({ err: 'Failed to get orders' })
    }
}

async function addOrder(req, res) {

    var loggedinUser = authService.validateToken(req.cookies.loginToken)
 
    try {
        var order = req.body
        // console.log(order);
        // order.byUserId = loggedinUser._id
        order = await orderService.add(order)

        // prepare the updated order for sending out
        // order.aboutUser = await userService.getById(order.aboutUserId)
        
        // Give the user credit for adding a order
        // var user = await userService.getById(order.byUserId)
        // user.score += 10
        // loggedinUser.score += 10

        // loggedinUser = await userService.update(loggedinUser)
        // order.byUser = loggedinUser

        // User info is saved also in the login-token, update it
        // const loginToken = authService.getLoginToken(loggedinUser)
        // res.cookie('loginToken', loginToken)


        socketService.broadcast({type: 'order-added', data: order, userId: loggedinUser._id.toString()})
        
        // const fullUser = await userService.getById(loggedinUser._id)
        // socketService.emitTo({type: 'user-updated', data: fullUser, label: fullUser._id})

        res.send(order)

    } catch (err) {
        logger.error('Failed to add order', err)
        res.status(500).send({ err: 'Failed to add order' })
    }
}

module.exports = {
    getOrders,
    addOrder,
    updateOrder
}