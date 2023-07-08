const Todo = require("../model/todo");
const asyncHandler = require('express-async-handler')



const getTodo = asyncHandler(async (socket) => {
    const todo = await Todo.find().lean()
    if (!todo.length) {
        return res.status(400).json({ message: 'No todo Found' })
    }
    socket.emit('todos', todo)
})

const addTodo = asyncHandler(async (io, data) => {
    const { title, completed } = data
    // confirm data
    if (!title) {
        return io.emit('error', 'All fields are required')
    }

    // check for duplicate
    const duplicate = await Todo.findOne({ title }).exec()
    if (duplicate) {
        io.emit('error', 'Title already exist')
    }

    const todo = await Todo.create({ title })
    if (todo) {
        io.emit('newTodo', todo)
    }
    else {
        io.emit('error', 'Invalid data')
    }

})
const updateTodo = asyncHandler(
    async (io, data) => {
        const { id, completed } = data

        // find todo 
        const todo = await Todo.findById(id).exec()

        if (!todo) {
            io.emit('error', 'Todo not found')
        }

        todo.completed = completed

        const result = await todo.save()
        io.emit('updatedTodo', todo)
    }
)


const deleteTodo = asyncHandler(async (io, data) => {
    const { id } = data
    // check id
    if (!id) {
        return io.emit('error', 'Todo id required')
    }

    const todo = await Todo.findById(id).exec()
    if (!todo) {
        return io.emit('error', 'No todo')
    }

    const result = await todo.deleteOne()
    io.emit('deletedTodo', result);
})

module.exports = {
    getTodo,
    addTodo,
    updateTodo,
    deleteTodo
}