const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()

app.use(express.json())
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'public')))
} else {
    const corsOptions = {
        origin: ['http://127.0.0.1:5173'],
        // credentials: true
    }
    app.use(cors(corsOptions))
}

const userRoutes = require('./api/user/user.routes')
const stayRoutes = require('./api/review/stay.routes')
const orderRoutes = require('./api/review/order.routes')

app.use('/api/user', userRoutes)
app.use('/api/stay', stayRoutes)
app.use('/api/order', orderRoutes)

app.get('/**', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

const logger = require('./services/logger.service')
const port = process.env.PORT || 3030
http.listen(port, () => {
    logger.info('Server is running on port: ' + port)
})


//fCFpUGjH0JjhGplL