'use client';

import { useState } from 'react';

import { usePersContext } from "../app/contexts/usePersContext";

// FROM https://opennext.js.org/netlify/forms 
export function SubmissionForm() {

    const {features, stickers} = usePersContext();

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
    /*
    things to submit:
    - features
    - stickers
    - maker's name
    - site name
    - description
    */
    return (
        <div>
            <form name="designs" onSubmit={handleFormSubmit} >
                <input type="hidden" name="form-name" value="designs" />
                <input type="hidden" name="features" value={JSON.stringify(features)} />
                <input type="hidden" name="stickers" value={JSON.stringify(stickers)} />
                <input name="title" type="text" placeholder="Your Site's Title (randomly generated if left blank)" className="input" />
                <input name="name" type="text" placeholder="Your Name (optional)" required className="input" />
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