import React, { useState } from 'react';

export default function TodoForm({ onAddTodo }) {
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
        <div className="container p-4 pb-0">
            <form onSubmit={handleSubmit} className="mb-5 p-4 border border-primary rounded mx-auto">
                <fieldset className="border p-3 rounded">
                    <legend className="float-none w-auto px-2 text-primary fw-bold">Create New Todo</legend>

                    <div className="mb-3">
                        <label className="form-label">Enter Title <span className='text-danger'>*</span></label>
                        <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Enter Description <span className='text-danger'>*</span></label>
                        <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Enter Deadline</label>
                        <input type="date" className="form-control" value={deadline} onChange={(e) => setDeadline(e.target.value)} min={new Date().toISOString().split('T')[0]} />
                    </div>

                    <div className="d-flex justify-content-center">
                        <button type="submit" className="btn btn-primary">Add Todo</button>
                    </div>
                </fieldset>
            </form>

        </div>
    );
}
