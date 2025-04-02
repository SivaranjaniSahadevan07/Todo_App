import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function Todo() {
    const [todos, setTodos] = useState([])
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [editId, setEditId] = useState(null)
    const [editedTitle, setEditedTitle] = useState("")
    const [editedDescription, setEditedDescription] = useState("")

    const API_URL = 'http://localhost:8010'

    const fetchTodos = () => {
        fetch(API_URL, { method: 'GET' })
            .then(res => res.json())
            .then(data => setTodos(data))
            .catch((err) => console.error(err.message))
    }

    useEffect(() => {
        fetchTodos()
    }, [])

    const handleForm = (e) => {
        e.preventDefault()
        const newTodo = { title, description }
        Axios.post(API_URL, newTodo)
            .then(() => {
                setTitle("")
                setDescription("")
                fetchTodos()
            })
            .catch((err) => console.error(err.message))
    }

    const handleEdit = (id, title, description) => {
        setEditId(id)
        setEditedTitle(title)
        setEditedDescription(description)
    }

    const handleUpdate = (e) => {
        e.preventDefault()
        const updatedTodo = { title: editedTitle, description: editedDescription }
        Axios.put(`${API_URL}/${editId}`, updatedTodo)
            .then(() => {
                setEditId(null)
                setEditedTitle("")
                setEditedDescription("")
                fetchTodos()
            })
            .catch((err) => console.error(err.message))
    }

    const handleDelete = (id) => {
        Axios.delete(`${API_URL}/${id}`)
            .then(() => fetchTodos())
            .catch((err) => console.error(err.message))
    }

    return (
        <div className="container p-4">
            <h2 className="text-center mb-4">Todo App</h2>

            {/* Add Todo Form */}
            <form onSubmit={handleForm} className="mb-4 p-4 border border-primary rounded mx-auto">
                <div className="mb-3">
                    <label className="form-label">Enter Title</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Enter Description</label>
                    <textarea
                        type="text"
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required>
                    </textarea>
                </div>
                <div className='d-flex justify-content-center'>
                    <button type="submit" className="btn btn-primary">Add Todo</button>
                </div>
            </form>

            {/* Todos List */}
            <h3 className="mb-3">Todos List</h3>
            {todos.length > 0 ? (
                <div className="row">
                    {todos.map((todo) => (
                        <div key={todo._id} className="col-md-12 mb-3">
                            <div className="card">
                                <div className="card-body">
                                    {editId !== todo._id ? (
                                        <>
                                            <h5 className="card-title">{todo.title}</h5>
                                            <p className="card-text">{todo.description}</p>
                                            <small className="text-muted">{new Date(todo.createdAt).toLocaleString()}</small>
                                            <div className="mt-3 d-flex justify-content-between">
                                                <button className="btn btn-warning me-2" onClick={() => handleEdit(todo._id, todo.title, todo.description)}>Edit</button>
                                                <button className="btn btn-danger" onClick={() => handleDelete(todo._id)}>Delete</button>
                                            </div>
                                        </>
                                    ) : (
                                        <form onSubmit={handleUpdate}>
                                            <input
                                                type="text"
                                                className="form-control mb-2"
                                                value={editedTitle}
                                                onChange={(e) => setEditedTitle(e.target.value)}
                                                required
                                            />
                                            <input
                                                type="text"
                                                className="form-control mb-2"
                                                value={editedDescription}
                                                onChange={(e) => setEditedDescription(e.target.value)}
                                                required
                                            />
                                            <div className="mt-3 d-flex justify-content-between">
                                                <button className="btn btn-success me-2" type="submit">Update</button>
                                                <button className="btn btn-secondary" onClick={() => setEditId(null)}>Cancel</button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <h5 className="text-center text-muted">Loading...</h5>
            )}
        </div>
    )
}
