import React, { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import Header from './Header';
import Footer from './Footer';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const apiRequest = (url, method = 'GET', body) => fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined
}).then((response) => {
    if (!response.ok) throw new Error('Request failed');
    return response.json();
});

export default function Todos() {
    const [todos, setTodos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [actionError, setActionError] = useState('');
    const [query, setQuery] = useState('');
    const [isComposerOpen, setIsComposerOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editedTitle, setEditedTitle] = useState("");
    const [editedDescription, setEditedDescription] = useState("");

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = (showLoading = false) => {
        if (showLoading) setIsLoading(true);
        setLoadError('');
        apiRequest(API_URL)
            .then(setTodos)
            .catch(() => setLoadError('The server is taking longer than expected. Please try again.'))
            .finally(() => setIsLoading(false));
    };

    const handleAddTodo = (newTodo) => {
        setActionError('');
        apiRequest(API_URL, 'POST', newTodo)
            .then(() => fetchTodos())
            .catch(() => setActionError('Could not save your task. Check the server connection and try again.'));
    };

    const handleEdit = (id, title, description) => {
        setEditId(id);
        setEditedTitle(title);
        setEditedDescription(description);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        if (!editId) return;

        setActionError('');
        apiRequest(`${API_URL}/${editId}`, 'PUT', {
            title: editedTitle,
            description: editedDescription
        })
            .then(() => {
                setEditId(null);
                setEditedTitle("");
                setEditedDescription("");
                fetchTodos(true);
            })
            .catch(() => setActionError('Could not update this task. Please try again.'));
    };

    const handleDelete = (id) => {
        setActionError('');
        apiRequest(`${API_URL}/${id}`, 'DELETE')
            .then(() => fetchTodos())
            .catch(() => setActionError('Could not delete this task. Please try again.'));
    };

    const toggleComplete = (id, isCompleted) => {
        setActionError('');
        apiRequest(`${API_URL}/${id}/complete`, 'PUT', { isCompleted, completedAt: isCompleted ? new Date().toISOString() : null })
            .then(() => fetchTodos())
            .catch(() => setActionError('Could not update this task. Please try again.'));
    };


    return (
        <div className="app-shell">
            <Header todos={todos} query={query} onQueryChange={setQuery} />
            <main className="main-content">
                <section className="page-intro" aria-labelledby="page-title">
                    <p className="eyebrow">YOUR DAY, AT A GLANCE</p>
                    <h1 id="page-title">Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}.</h1>
                    <p className="intro-copy">You have {todos.filter(todo => !todo.isCompleted).length} tasks to keep moving today.</p>
                </section>
            {isLoading && (
                <div className="server-message" role="status">
                    <span className="loading-indicator" aria-hidden="true" />
                    <div>
                        <strong>Waking up your task list</strong>
                        <p>The hosted server may take up to a minute to start. Your tasks will appear as soon as it responds.</p>
                    </div>
                </div>
            )}
            {loadError && (
                <div className="server-message server-message--error" role="alert">
                    <div>
                        <strong>Could not reach the task server</strong>
                        <p>{loadError}</p>
                    </div>
                    <button type="button" className="retry-button" onClick={() => fetchTodos(true)}>Try again</button>
                </div>
            )}
            {actionError && <p className="action-error" role="alert">{actionError}</p>}
            {isComposerOpen && <TodoForm onAddTodo={(todo) => { handleAddTodo(todo); setIsComposerOpen(false); }} onCancel={() => setIsComposerOpen(false)} />}
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
                query={query}
                onClearSearch={() => setQuery('')}
                onAddClick={() => setIsComposerOpen((open) => !open)}
                isComposerOpen={isComposerOpen}
            />
            </main>
            <Footer />
        </div>
    );
}
