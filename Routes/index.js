const route = require('express').Router()

route.use('/tasks', require('./Tasks'))
route.use('/tasks', require('./Notes'))

exports = module.exports = {
    route
}