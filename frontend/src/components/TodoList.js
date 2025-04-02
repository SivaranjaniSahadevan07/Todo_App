import React from 'react';

export default function TodoList({ todos, editId, editedTitle, editedDescription, onEdit, onUpdate, onDelete, setEditId, setEditedTitle, setEditedDescription, toggleComplete }) {
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

    const pendingWithDeadline = todos.filter(todo => !todo.isCompleted && todo.deadline);
    const pendingWithoutDeadline = todos.filter(todo => !todo.isCompleted && !todo.deadline);
    const completedTodos = todos.filter(todo => todo.isCompleted);

    return (
        <>
            <div className="container p-4">
                <div className="row">
                    {/* Column for Pending Todos with Deadlines */}
                    <div className="col-12 col-md-4 mb-4">
                        <h3 className="mb-3 text-center">Pending Todos (With Deadline)</h3>
                        {pendingWithDeadline.length > 0 ? (
                            <div className="row">
                                {pendingWithDeadline.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(todo => {
                                    const isExpired = new Date(todo.deadline) < new Date();
                                    return (
                                        <div key={todo._id} className="col-md-12 mb-3">
                                            <div className={`card ${isExpired ? 'bg-danger text-white' : 'bg-success text-white'}`}>
                                                <div className="card-body d-flex flex-column mb-2">
                                                    {editId !== todo._id ? (
                                                        <>
                                                            {!isExpired && (
                                                                <div className='d-flex justify-content-end'>
                                                                    <label style={{ "width": "fit-content" }} className="form-check-label mb-3 p-1 text-end float-end bg-light text-dark">
                                                                        Mark as Complete
                                                                        <input className='ms-2' type="checkbox" onChange={() => toggleComplete(todo._id, !todo.isCompleted)} />
                                                                    </label>
                                                                </div>
                                                            )}
                                                            <h5 className="card-title">{todo.title}</h5>
                                                            <p className="card-text">{todo.description}</p>
                                                            <small className="text-muted bg-light text-dark p-1 rounded text-center">
                                                                Deadline: {new Date(todo.deadline).toISOString().split('T')[0].split('-').reverse().join('-')}
                                                                ({calculateDaysLeft(todo.deadline)})
                                                            </small>
                                                            <div className="mt-3 d-flex justify-content-between">
                                                                {!isExpired && <button className="btn btn-warning me-2" onClick={() => onEdit(todo._id, todo.title, todo.description)}>Edit</button>}
                                                                <button className="btn btn-danger border border-1 border-light" onClick={() => onDelete(todo._id)}>Delete</button>
                                                            </div>

                                                        </>
                                                    ) : (
                                                        <form onSubmit={onUpdate}>
                                                            <input type="text" className="form-control mb-2" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} required />
                                                            <input type="text" className="form-control mb-2" value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} required />
                                                            <div className="mt-3 d-flex justify-content-between">
                                                                <button className="btn btn-success border border-1 border-light me-2" type="submit">Update</button>
                                                                <button className="btn btn-secondary" onClick={() => setEditId(null)}>Cancel</button>
                                                            </div>
                                                        </form>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : <h5 className="text-center text-muted">No pending todos with deadlines</h5>}
                    </div>
                    {/* Column for Pending Todos with Deadlines */}
                    <div className="col-12 col-md-4 mb-4">
                        <h3 className="mb-3 text-center">Pending Todos (Without Deadline)</h3>
                        {pendingWithoutDeadline.length > 0 ? (
                            <div className="row">
                                {pendingWithoutDeadline.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(todo => (
                                    <div key={todo._id} className="col-md-12 mb-3">
                                        <div className="card bg-info text-white">
                                            <div className="card-body d-flex flex-column">
                                                {editId !== todo._id ? (
                                                    <>
                                                        <div className='d-flex justify-content-end'>
                                                            <label style={{ "width": "fit-content" }} className="form-check-label p-1 float-end bg-light text-end text-dark mb-3">
                                                                Mark as Complete
                                                                <input className='ms-2' type="checkbox" onChange={() => toggleComplete(todo._id, !todo.isCompleted)} />
                                                            </label>
                                                        </div>

                                                        <h5 className="card-title">{todo.title}</h5>
                                                        <p className="card-text">{todo.description}</p>
                                                        <div className="mt-3 d-flex justify-content-between">
                                                            <button className="btn btn-warning me-2" onClick={() => onEdit(todo._id, todo.title, todo.description)}>Edit</button>
                                                            <button className="btn btn-danger" onClick={() => onDelete(todo._id)}>Delete</button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <form onSubmit={onUpdate}>
                                                        <input type="text" className="form-control mb-2" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} required />
                                                        <input type="text" className="form-control mb-2" value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} required />
                                                        <div className="mt-3 d-flex justify-content-between">
                                                            <button className="btn btn-success border border-1 border-light me-2" type="submit">Update</button>
                                                            <button className="btn btn-secondary" onClick={() => setEditId(null)}>Cancel</button>
                                                        </div>
                                                    </form>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : <h5 className="text-center text-muted">No pending todos without deadlines</h5>}
                    </div>
                    {/* Column for Pending Todos with Deadlines */}
                    <div className="col-12 col-md-4 mb-4">
                        <h3 className="mb-3 text-center">Completed Todos</h3>
                        {completedTodos.length > 0 ? (
                            <div className="row">
                                {completedTodos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(todo => (
                                    <div key={todo._id} className="col-md-12 mb-3">
                                        <div className="card bg-light">
                                            <div className="card-body">
                                                <h5 className="card-title">{todo.title}</h5>
                                                <p className="card-text">{todo.description}</p>
                                                <small className="text-muted">Created: {new Date(todo.createdAt).toISOString().split('T')[0].split('-').reverse().join('-')}</small><br />
                                                <small className="text-muted">Completed: {new Date(todo.completedAt).toISOString().split('T')[0].split('-').reverse().join('-')}</small>
                                                <div className="mt-3 d-flex justify-content-between">
                                                    <button className="btn btn-danger" onClick={() => onDelete(todo._id)}>Delete</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : <h5 className="text-center text-muted">No completed todos</h5>}
                    </div>
                </div>
            </div>
        </>
    );
}
