import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import Header from './Header';
import Footer from './Footer';

const API_URL = 'https://todo-app-b5fr.onrender.com';

export default function Todos() {
    const [todos, setTodos] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editedTitle, setEditedTitle] = useState("");
    const [editedDescription, setEditedDescription] = useState("");

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = () => {
        console.log(API_URL);
        Axios.get(API_URL)
            .then(res => setTodos(res.data))
            .catch(err => console.error(err.message));
    };

    const handleAddTodo = (newTodo) => {
        console.log(API_URL);
        Axios.post(API_URL, newTodo)
            .then(fetchTodos)
            .catch(err => console.error(err.message));
    };

    const handleEdit = (id, title, description) => {
        setEditId(id);
        setEditedTitle(title);
        setEditedDescription(description);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        if (!editId) return;

        Axios.put(`${API_URL}/${editId}`, {
            title: editedTitle,
            description: editedDescription
        })
            .then(() => {
                setEditId(null);
                setEditedTitle("");
                setEditedDescription("");
                fetchTodos();
            })
            .catch(err => console.error(err.message));
    };

    const handleDelete = (id) => {
        Axios.delete(`${API_URL}/${id}`)
            .then(fetchTodos)
            .catch(err => console.error(err.message));
    };

    const toggleComplete = (id, isCompleted) => {
        Axios.put(`${API_URL}/${id}/complete`, { isCompleted, completedAt: isCompleted ? new Date().toISOString() : null })
            .then(() => fetchTodos())
            .catch((err) => console.error(err.message));
    };


    return (
        <div className="container-fluid p-0">
            <Header todos={todos} />
            <TodoForm onAddTodo={handleAddTodo} />
            <TodoList
                todos={todos}
                editId={editId}
                editedTitle={editedTitle}
                editedDescription={editedDescription}
                onEdit={handleEdit}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                setEditId={setEditId}
                setEditedTitle={setEditedTitle}
                setEditedDescription={setEditedDescription}
                toggleComplete={toggleComplete}
            />
            <Footer />
        </div>
    );
}
