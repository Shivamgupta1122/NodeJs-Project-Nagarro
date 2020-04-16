const Task = require('../database').Task

const route = require('express').Router()

route.get('/', (req, res) => {
Task.findAll().then((tasks) =>{
    res.status(200).send(tasks)
}).catch((err) =>{
    res.status(500).send({
        error: "could not retrive tasks"
    })
})
})

route.post('/', (req, res) =>{

Task.create({
    title: req.body.title,
    description: req.body.description,
    due_date: req.body.due_date,
    priority: req.body.priority
}).then((task) =>{
    res.status(201).send(task)
    }).catch((error) => {
res.status(501).send({
    error: "problem came when adding task"
})
})
})

route.get('/:title', (req, res) => {
    var title = req.params.title;

    Task.findByPk(title).then((task) =>{
        res.status(200).send(task)
    }).catch((error) => {
        res.status(500).send({error: "cant retrive the task"})
    })
})

route.patch('/:title', (req, res) =>{
    var title = req.params.title;

    Task.update({ status: req.body.status,
    due_date: req.body.due_date,
    priority: req.body.priority
    },
    { where: { title: title } }).then( (task) => {
        res.status(201).send(task)
    }).catch((error) => {
        res.status(501).send({error: "cant update the task"})
    })
    
})

exports = module.exports = route

