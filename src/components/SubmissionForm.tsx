'use client';

import { useState } from 'react';

// FROM https://opennext.js.org/netlify/forms 
export function SubmissionForm() {
    const [status, setStatus] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            setStatus('pending');
            setError(null);
            const myForm = event.target;
            const formData = new FormData(myForm);
            const res = await fetch('/form.html', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            });
            if (res.status === 200) {
                setStatus('ok');
            } else {
                setStatus('error');
                setError(`${res.status} ${res.statusText}`);
            }
        } catch (e) {
            setStatus('error');
            setError(`${e}`);
        }
    };

    return (
        <div>
            <form name="designs" onSubmit={handleFormSubmit} >
                <input type="hidden" name="form-name" value="designs" />
                <input name="name" type="text" placeholder="Name" required className="input" />
                <input name="title" type="text" placeholder="Title (randomly generated if left blank)" className="input" />
                <input name="description" type="text" placeholder="Description (optional)" className="input" />
                <button type="submit" disabled={status === 'pending'}>
                    Submit
                </button>
                {status === 'ok' && <div> Submitted!</div>}
                {status === 'error' && <div>{error}</div>}
            </form>
        </div>
    );
}