const express = require('express')
const { getTodo, addTodo, updateTodo, deleteTodo } = require('../controller/todo')
const router = express.Router()

router.route('/')
    .get(getTodo)
    .post(addTodo)
    .patch(updateTodo)
    .delete(deleteTodo)

module.exports = router