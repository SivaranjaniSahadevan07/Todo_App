import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function TodoTwo() {
    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [editId, setEditId] = useState(null);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedDescription, setEditedDescription] = useState('');

    const API_URL = 'http://localhost:8010';

    const fetchTodos = () => {
        fetch(API_URL, { method: 'GET' })
            .then(res => res.json())
            .then(data => setTodos(data))
            .catch((err) => console.error(err.message));
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    const handleForm = (e) => {
        e.preventDefault();
        const newTodo = { title, description, deadline, completed: false, createdAt: new Date().toISOString() };
        Axios.post(API_URL, newTodo)
            .then(() => {
                setTitle('');
                setDescription('');
                setDeadline('');
                fetchTodos();
            })
            .catch((err) => console.error(err.message));
    };

    const handleEdit = (id, title, description) => {
        setEditId(id);
        setEditedTitle(title);
        setEditedDescription(description);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        const updatedTodo = { title: editedTitle, description: editedDescription };
        Axios.put(`${API_URL}/${editId}`, updatedTodo)
            .then(() => {
                setEditId(null);
                setEditedTitle('');
                setEditedDescription('');
                fetchTodos();
            })
            .catch((err) => console.error(err.message));
    };

    const handleDelete = (id) => {
        Axios.delete(`${API_URL}/${id}`)
            .then(() => fetchTodos())
            .catch((err) => console.error(err.message));
    };

    const toggleComplete = (id, isCompleted) => {
        Axios.put(`${API_URL}/${id}/complete`, { isCompleted, completedAt: isCompleted ? new Date().toISOString() : null })
            .then(() => fetchTodos())
            .catch((err) => console.error(err.message));
    };

    const calculateDaysLeft = (deadline) => {
        const deadlineDate = new Date(deadline);
        const today = new Date();
        const timeDiff = deadlineDate - today;

        if (timeDiff <= 0) return "Expired";

        const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        if (daysLeft < 30) return `${daysLeft} days left`;
        const monthsLeft = Math.floor(daysLeft / 30);
        if (monthsLeft < 12) return `${monthsLeft} months left`;
        const yearsLeft = Math.floor(monthsLeft / 12);

        return `${yearsLeft} years left`;
    };

    return (
        <div className="container p-4">
            <h2 className="text-center mb-4">Todo App</h2>

            {/* Add Todo Form */}
            <form onSubmit={handleForm} className="mb-4 p-4 border border-primary rounded mx-auto">
                <div className="mb-3">
                    <label className="form-label">Enter Title *</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Enter Description *</label>
                    <textarea
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required>
                    </textarea>
                </div>
                <div className="mb-3">
                    <label className="form-label">Enter Deadline</label>
                    <input
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="form-control mb-2"
                    />
                </div>
                <div className='d-flex justify-content-center'>
                    <button type="submit" className="btn btn-primary">Add Todo</button>
                </div>
            </form>

            {/* Active Todos List */}
            <h3 className="mb-3">Pending Todos</h3>
            {todos.filter(todo => !todo.isCompleted).length > 0 ? (
                <div className="row">
                    {todos
                        .filter(todo => !todo.isCompleted)
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .map((todo) => {
                            const isExpired = todo.deadline && new Date(todo.deadline) < new Date();
                            return (
                                <div key={todo._id} className="col-md-12 mb-3">
                                    <div className={`card ${isExpired ? 'bg-danger text-white' : 'bg-success text-white'}`}>
                                        <div className="card-body">
                                            <label className="form-check-label me-2">Mark as Complete</label>
                                            <input type="checkbox" onChange={() => toggleComplete(todo._id, !todo.isCompleted)} />
                                            {editId !== todo._id ? (
                                                <>
                                                    <h5 className="card-title">{todo.title}</h5>
                                                    <p className="card-text">{todo.description}</p>
                                                    <small className="text-muted">
                                                        Deadline: {todo.deadline
                                                            ? `${new Date(todo.deadline).toISOString().split('T')[0].split('-').reverse().join('-')} (${calculateDaysLeft(todo.deadline)})`
                                                            : 'not mentioned'}
                                                    </small>
                                                    <div className="mt-3 d-flex justify-content-between">
                                                        {!isExpired && <button className="btn btn-warning me-2" onClick={() => handleEdit(todo._id, todo.title, todo.description)}>Edit</button>}
                                                        <button className={`btn ${!isExpired ? 'btn-warning' : 'btn-light'}`} onClick={() => handleDelete(todo._id)}>Delete</button>
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
                            )
                        })}
                </div>
            ) : (
                <h5 className="text-center text-muted">No pending todos</h5>
            )}

            {/* Completed Todos List */}
            <h3 className="mb-3">Completed Todos</h3>
            {todos.filter(todo => todo.isCompleted).length > 0 ? (
                <div className="row">
                    {todos
                        .filter(todo => todo.isCompleted)
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .map((todo) => (
                            <div key={todo._id} className="col-md-12 mb-3">
                                <div className="card bg-light">
                                    <div className="card-body">
                                        <h5 className="card-title">{todo.title}</h5>
                                        <p className="card-text">{todo.description}</p>
                                        <small className="text-muted">Created: {new Date(todo.createdAt).toISOString().split('T')[0].split('-').reverse().join('-')}</small><br />
                                        <small className="text-muted">Completed: {new Date(todo.completedAt).toISOString().split('T')[0].split('-').reverse().join('-')}</small>
                                        <div className="mt-3 d-flex justify-content-between">
                                            <button className="btn btn-danger" onClick={() => handleDelete(todo._id)}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            ) : (
                <h5 className="text-center text-muted">No completed todos</h5>
            )}
        </div>
    );
}
