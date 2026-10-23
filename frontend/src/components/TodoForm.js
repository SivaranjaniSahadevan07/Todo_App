import React, { useState } from 'react';

export default function TodoForm({ onAddTodo, onCancel }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [deadline, setDeadline] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddTodo({ title, description, deadline });
        setTitle("");
        setDescription("");
        setDeadline("");
    };

    return (
        <section className="composer" aria-labelledby="composer-title">
            <div className="section-heading">
                <div>
                    <h2 id="composer-title">Add a task</h2>
                    <p>Keep it simple. You can add details now or later.</p>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="todo-form">
                <label htmlFor="todo-title">Task name</label>
                <input id="todo-title" type="text" placeholder="What needs doing?" value={title} onChange={(e) => setTitle(e.target.value)} required maxLength="120" />

                <label htmlFor="todo-description">A few details</label>
                <textarea id="todo-description" placeholder="Add a note to future you..." value={description} onChange={(e) => setDescription(e.target.value)} required rows="3" maxLength="500" />

                <label htmlFor="todo-deadline">Due date <span>OPTIONAL</span></label>
                <input id="todo-deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} min={new Date().toISOString().split('T')[0]} />

                <div className="form-actions">
                    <button type="submit" className="add-button"><span aria-hidden="true">+</span> Add task</button>
                    <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
                </div>
            </form>
        </section>
    );
}
