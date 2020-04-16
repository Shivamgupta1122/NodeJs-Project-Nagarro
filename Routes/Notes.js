const Notes = require('../database').Notes

const route = require('express').Router()

route.get('/:title/notes', (req, res) => {
    
    Notes.findAll({ where: {title: req.params.title}}).then
    ((notes) => res.status(201).send(notes)).catch
    ((error) => res.status(501).send({error: "problem occured while fetching notes"}))
    
})

route.post('/:title/notes', (req, res) =>{
var title1 = req.params.title
Notes.create({
    title: req.body.title,
    Note: req.body.note
}).then((note) =>{
    res.status(201).send(note)
    }).catch((error) => {
res.status(501).send({
    error: "problem came when adding notes"
})
})
})

exports = module.exports = route


