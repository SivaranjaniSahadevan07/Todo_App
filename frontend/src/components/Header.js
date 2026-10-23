import React from "react";

const dateKey = (date) => typeof date === 'string' ? date.slice(0, 10) : '';
const todayKey = () => {
    const today = new Date();
    return [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');
};

const isDueToday = (deadline) => {
    return Boolean(deadline) && dateKey(deadline) === todayKey();
};

export default function Header({ todos, query, onQueryChange }) {
    const completedTodos = todos.filter(todo => todo.isCompleted).length;
    const remainingTodos = todos.length - completedTodos;
    const completion = todos.length ? Math.round((completedTodos / todos.length) * 100) : 0;
    const dueToday = todos.filter(todo => !todo.isCompleted && isDueToday(todo.deadline)).length;

    return (
        <>
            <header className="topbar">
                <a className="brand" href="/" aria-label="Daymark dashboard">
                    <span className="brand-mark" aria-hidden="true">✓</span>
                    <span>daymark<span className="brand-period">.</span></span>
                </a>
                <span className="nav-current">Dashboard</span>
                <label className="topbar-search">
                    <span className="search-icon" aria-hidden="true" />
                    <span className="sr-only">Search tasks</span>
                    <input type="search" placeholder="Search tasks..." value={query} onChange={(event) => onQueryChange(event.target.value)} />
                </label>
                <span className="topbar-date">{new Intl.DateTimeFormat('en', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date())}</span>
            </header>
            <section className="summary-grid" aria-label="Task summary">
                <article className="summary-card summary-card--blue">
                    <div className="summary-card-top"><span className="summary-icon" aria-hidden="true">≡</span><span className="summary-tag">ALL LISTS</span></div>
                    <p>Total tasks</p>
                    <strong>{todos.length}</strong>
                    <small>Across all your task lists</small>
                </article>
                <article className="summary-card summary-card--green">
                    <div className="summary-card-top"><span className="summary-icon" aria-hidden="true">✓</span><span className="summary-tag">{completion}%</span></div>
                    <p>Completed</p>
                    <strong>{completedTodos}</strong>
                    <small>{todos.length ? 'Progress, one task at a time' : 'Your wins will show up here'}</small>
                </article>
                <article className="summary-card summary-card--amber">
                    <div className="summary-card-top"><span className="summary-icon" aria-hidden="true">◷</span><span className="summary-tag">{dueToday ? 'DUE TODAY' : 'IN PROGRESS'}</span></div>
                    <p>Pending</p>
                    <strong>{remainingTodos}</strong>
                    <small>{dueToday ? `${dueToday} due today` : 'Tasks still in motion'}</small>
                </article>
            </section>
        </>
    );
}
