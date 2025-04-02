const express = require('express')
const router = express.Router()
const { getAllTodos, createNewTodo, updateTodo, deleteTodo, markAsComplete } = require('../controllers/todoController')

router.get('/', getAllTodos)

router.post('/', createNewTodo)

router.put('/:id', updateTodo)

router.put('/:id/complete', markAsComplete)

router.delete('/:id', deleteTodo)

module.exports = router

