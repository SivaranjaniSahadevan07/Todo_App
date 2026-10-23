import React, { useState } from 'react';

const dateKey = (date) => typeof date === 'string' ? date.slice(0, 10) : '';
const todayKey = () => {
    const today = new Date();
    return [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');
};

const formatDate = (date) => new Intl.DateTimeFormat('en', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
}).format(new Date(date));
const formatDeadline = (date) => formatDate(new Date(`${dateKey(date)}T00:00:00`));
const isDueToday = (deadline) => Boolean(deadline) && dateKey(deadline) === todayKey();

export default function TodoList({ todos, editId, editedTitle, editedDescription, onEdit, onUpdate, onDelete, setEditId, setEditedTitle, setEditedDescription, toggleComplete, query, onClearSearch, onAddClick, isComposerOpen }) {
    const [activeFilter, setActiveFilter] = useState('all');
    const normalizedQuery = query.trim().toLowerCase();
    const dueTodayCount = todos.filter(todo => !todo.isCompleted && isDueToday(todo.deadline)).length;
    const completedCount = todos.filter(todo => todo.isCompleted).length;
    const filteredTodos = todos
        .filter(todo => {
            if (activeFilter === 'dueToday') return !todo.isCompleted && isDueToday(todo.deadline);
            if (activeFilter === 'completed') return todo.isCompleted;
            return true;
        })
        .filter(todo => !normalizedQuery || `${todo.title} ${todo.description}`.toLowerCase().includes(normalizedQuery))
        .sort((first, second) => {
            if (first.isCompleted !== second.isCompleted) return first.isCompleted ? 1 : -1;
            return new Date(second.createdAt) - new Date(first.createdAt);
        });

    const filters = [
        { id: 'all', label: 'All tasks', count: todos.length },
        { id: 'dueToday', label: 'Due today', count: dueTodayCount },
        { id: 'completed', label: 'Completed', count: completedCount }
    ];

    const renderTask = (todo) => {
        const isOverdue = !todo.isCompleted && todo.deadline && dateKey(todo.deadline) < todayKey();

        return (
            <article className={`task-row${todo.isCompleted ? ' task-row--complete' : ''}${editId === todo._id ? ' task-row--editing' : ''}`} key={todo._id}>
                {editId === todo._id ? (
                    <form className="edit-form" onSubmit={onUpdate}>
                        <div className="edit-field">
                            <label htmlFor={`edit-title-${todo._id}`}>Task name</label>
                            <input id={`edit-title-${todo._id}`} value={editedTitle} onChange={(event) => setEditedTitle(event.target.value)} required maxLength="120" />
                        </div>
                        <div className="edit-field edit-field--wide">
                            <label htmlFor={`edit-description-${todo._id}`}>Details</label>
                            <textarea id={`edit-description-${todo._id}`} value={editedDescription} onChange={(event) => setEditedDescription(event.target.value)} required rows="3" maxLength="500" />
                        </div>
                        <div className="task-actions">
                            <button className="text-button text-button--accent" type="submit">Save changes</button>
                            <button className="text-button" type="button" onClick={() => setEditId(null)}>Cancel</button>
                        </div>
                    </form>
                ) : (
                    <>
                        <label className="complete-control" aria-label={`Mark ${todo.title} ${todo.isCompleted ? 'incomplete' : 'complete'}`}>
                            <input type="checkbox" checked={Boolean(todo.isCompleted)} onChange={() => toggleComplete(todo._id, !todo.isCompleted)} />
                            <span aria-hidden="true" />
                        </label>
                        <div className="task-copy">
                            <h3>{todo.title}</h3>
                            {todo.description && <p>{todo.description}</p>}
                            <div className="task-meta">
                                <span className="task-meta-icon" aria-hidden="true">◷</span>
                                {todo.isCompleted
                                    ? `Completed ${formatDate(todo.completedAt || todo.createdAt)}`
                                        : todo.deadline
                                            ? `${isOverdue ? 'Overdue' : 'Due'} ${formatDeadline(todo.deadline)}`
                                        : 'No due date'}
                            </div>
                        </div>
                        <div className="task-row-end">
                            <span className={`task-status${todo.isCompleted ? ' task-status--done' : isOverdue ? ' task-status--late' : ''}`}>
                                {todo.isCompleted ? 'Done' : isOverdue ? 'Overdue' : todo.deadline ? 'Scheduled' : 'In progress'}
                            </span>
                            <div className="task-actions">
                                {!todo.isCompleted && <button className="text-button" type="button" onClick={() => onEdit(todo._id, todo.title, todo.description)}>Edit</button>}
                                <button className="text-button text-button--quiet" type="button" onClick={() => onDelete(todo._id)}>Delete</button>
                            </div>
                        </div>
                    </>
                )}
            </article>
        );
    };

    return (
        <section className="task-panel" aria-labelledby="task-panel-title">
            <div className="task-panel-heading">
                <div>
                    <h2 id="task-panel-title">Today's tasks</h2>
                    <p>{todos.filter(todo => !todo.isCompleted).length} tasks remaining</p>
                </div>
                <button type="button" className={`add-button${isComposerOpen ? ' add-button--open' : ''}`} onClick={onAddClick} aria-expanded={isComposerOpen}>
                    <span aria-hidden="true">{isComposerOpen ? '−' : '+'}</span> {isComposerOpen ? 'Close form' : 'Add new task'}
                </button>
            </div>
            <div className="task-filters" role="group" aria-label="Filter tasks">
                {filters.map(filter => (
                    <button
                        type="button"
                        aria-pressed={activeFilter === filter.id}
                        className={`filter-tab${activeFilter === filter.id ? ' filter-tab--active' : ''}`}
                        key={filter.id}
                        onClick={() => setActiveFilter(filter.id)}
                    >
                        {filter.label} <span>{filter.count}</span>
                    </button>
                ))}
            </div>
            <div className="task-list" role="tabpanel">
                {filteredTodos.length ? filteredTodos.map(renderTask) : (
                    <div className="list-empty-state">
                        <span className="empty-check" aria-hidden="true">✓</span>
                        <p>{normalizedQuery ? `No tasks match “${query}”.` : activeFilter === 'dueToday' ? 'Nothing is due today. Enjoy the breathing room.' : activeFilter === 'completed' ? 'Completed tasks will appear here.' : 'A fresh page. Add a task when you are ready.'}</p>
                    </div>
                )}
            </div>
            <div className="task-panel-footer">
                <span>Showing {filteredTodos.length} of {todos.length} tasks</span>
                {(activeFilter !== 'all' || query) && <button type="button" className="text-button" onClick={() => { setActiveFilter('all'); onClearSearch(); }}>View all tasks <span aria-hidden="true">→</span></button>}
            </div>
        </section>
    );
}