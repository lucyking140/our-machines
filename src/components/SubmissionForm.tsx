'use client';

import { useState } from 'react';

import { usePersContext } from "../app/contexts/usePersContext";

import styles from "../../public/css/subForm.module.css";

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
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.modelName}>
                    Submit your Creation
                </div>
            </div>
            <div className={styles.content} >
                <form name="designs" onSubmit={handleFormSubmit} className={styles.formContainer} >
                    {/* hidden inputs */}
                    <input type="hidden" name="form-name" value="designs" />
                    <input type="hidden" name="features" value={JSON.stringify(features)} />
                    <input type="hidden" name="stickers" value={JSON.stringify(stickers)} />

                    {/* visual styles inputs */}
                    <div className={styles.formEntry}>
                        <label for="title"> Title </label>
                        <input name="title" type="text" placeholder="Randomly generated if left blank" required className={styles.input}/>
                    </div>
                    
                    <div className={styles.formEntry}>
                        <label for="title"> Your Name </label>
                        <input name="name" type="text" placeholder="Optional" className={styles.input} />
                    </div>

                    <div className={styles.formEntry}>
                        <label for="title"> Description </label>
                        <input name="description" type="text" placeholder="Optional" className={styles.input} />
                    </div>

                    <button type="submit" disabled={status === 'pending'}>
                        Submit
                    </button>

                    {/* {status === 'ok' && <div> Submitted!</div>} */}
                    {status === 'error' && <div>{error}</div>}
                </form>
            </div>
        </div>
    );
}