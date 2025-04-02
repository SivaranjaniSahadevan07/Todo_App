import React from "react";

export default function Header({ todos }) {
    const pendingWithDeadline = todos.filter(todo => !todo.isCompleted && todo.deadline && new Date(todo.deadline) >= new Date()).length;
    const pendingWithoutDeadline = todos.filter(todo => !todo.isCompleted && !todo.deadline).length;
    const expiredTodos = todos.filter(todo => !todo.isCompleted && todo.deadline && new Date(todo.deadline) < new Date()).length;
    const completedTodos = todos.filter(todo => todo.isCompleted).length;

    return (
        <nav className="navbar navbar-light bg-secondary bg-opacity-25 shadow-sm p-4 mb-4">
            <div className="container-fluid d-flex flex-column flex-md-row align-items-center justify-content-between">
 
                <span className="navbar-brand fw-bold mb-2 mb-md-0">✅ Todo App</span>

                <div className="d-flex flex-wrap justify-content-center">
                    <span className="badge bg-primary me-2 mb-2">🕒 Pending (Deadline): {pendingWithDeadline}</span>
                    <span className="badge bg-warning me-2 mb-2">🚫 Pending (No Deadline): {pendingWithoutDeadline}</span>
                    <span className="badge bg-danger me-2 mb-2">❌ Expired: {expiredTodos}</span>
                    <span className="badge bg-success mb-2">✅ Completed: {completedTodos}</span>
                </div>
            </div>
        </nav>
    );
}
