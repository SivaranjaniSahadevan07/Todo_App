const Todo = require('../models/todoModel')

const getAllTodos = async (req, res) => {
    const todos = await Todo.find()
    res.json(todos)
}

const createNewTodo = async (req, res) => {
    const { title, description, deadline } = req.body
    const newTodo = new Todo({ title, description, deadline })
    await newTodo.save()
    res.json(newTodo)
}

const updateTodo = async (req, res) => {
    const id = req.params.id
    const { title, description } = req.body
    const updatedTodo = await Todo.findByIdAndUpdate(id, { title, description })
    res.json(updatedTodo)
}

const deleteTodo = async (req, res) => {
    const id = req.params.id
    await Todo.findByIdAndDelete(id)
    const todo = await Todo.find()
    res.json(todo)
}

const markAsComplete = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTodo = await Todo.findByIdAndUpdate(
            id,
            { isCompleted: true, completedAt: new Date() },
            { new: true }
        );

        if (!updatedTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        res.json(updatedTodo);
    } catch (error) {
        res.status(500).json({ message: "Error updating todo", error });
    }
}

module.exports = { getAllTodos, createNewTodo, updateTodo, deleteTodo, markAsComplete }

