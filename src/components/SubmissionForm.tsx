'use client';

import { useState } from 'react';
import Switch from '@mui/material/Switch';

import { PlusIcon } from "./icons";

import { usePersContext } from "../app/contexts/usePersContext";

import useWindowDimensions from "../hooks/useWindowDimensions";

import styles from "../../public/css/subForm.module.css";

// FROM https://opennext.js.org/netlify/forms 
export function SubmissionForm({closeOnSubmit} : {closeOnSubmit: () => void}) {

    const {features, stickers} = usePersContext();

    const [status, setStatus] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isPublic, setPublic] = useState<boolean | null>(false);

    // cur window dims to determine if mobile or desktop for a given submission
    const {width, height} = useWindowDimensions();

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            setStatus('pending');
            setError(null);
            const myForm = event.target;
            const formData = new FormData(myForm);
            const res = await fetch('/form.html', {
                method: 'POST',
                //headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                headers: { 'Content-Type': 'multipart/form-data' },
                //body: new URLSearchParams(formData).toString()
                body: formData
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
        // finally closing the form window
        closeOnSubmit();
    };

    const handleSwitchChange = () => {
        setPublic(!isPublic);
    }
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
                    Submit your device
                </div>
                <div className={styles.subtitle}>
                    Your device will be included in a public gallery viewable by others. If you'd like,
                    submit it along with the personalizations you've made to this site -- those who 
                    view your description of the device will have a chance to apply your personalizations to their own 
                    site.
                </div>
            </div>
            <div className={styles.content} >
                <form name="designs" method="POST" encType="multipart/form-data" onSubmit={handleFormSubmit} className={styles.formContainer} >
                    {/* hidden inputs */}
                    <input type="hidden" name="form-name" value="designs" />
                    <input type="hidden" name="features" value={JSON.stringify(features)} />
                    <input type="hidden" name="stickers" value={JSON.stringify(stickers)} />
                    <input type="hidden" name="windowWidth" value={width} />
                    <input type="hidden" name="windowHeight" value={height} />

                    {/* visual styles inputs */}

                    <div className={styles.formEntry}>
                        <label htmlFor="title"> Device Name </label>
                        <input name="title" type="text" placeholder="Randomly generated if left blank" required className={styles.input}/>
                    </div>

                    <div className={styles.formEntry}>
                        <label htmlFor="name"> Your Name </label>
                        <input name="name" type="text" placeholder="Randomly generated if left blank" className={styles.input} />
                    </div>

                    <div className={styles.formEntry}>
                        <label htmlFor="dev_img"> Upload an image </label>
                        {/* <label htmlFor="dev_img" style={{cursor: 'pointer'}} className={styles.switchLabel}>
                            Upload an image
                            <PlusIcon fill={features.fontColor} size='30px'/>
                        </label> */}
                        <input name="dev_img" id="dev_img" type="file" placeholder="Upload an image" className={styles.input} />
                    </div>

                    <div className={styles.formEntry}>
                        <label htmlFor="about"> What about this device is meaningful to you? </label>
                        <input name="about" type="text" placeholder="Optional" className={styles.input} />
                    </div>

                    <div className={styles.formEntry}>
                        {/* <label htmlFor="personalizations"> Make your personalizations to this site public? </label>
                        <input name="personalizations" type="text" placeholder="Optional" className={styles.input} /> */}
                        <label htmlFor="personalizations" style={{cursor: 'pointer'}} className={styles.switchLabel}>
                            {/* <PlusIcon fill={features.fontColor} size='30px'/> */}
                            Make your personalizations to this site public?
                            <Switch color='primary' checked={isPublic} onChange={handleSwitchChange}/>
                        </label>
                       <input name="personalizations" id="personalizations" type="checkbox" checked={isPublic} onChange={handleSwitchChange} placeholder="Optional" className={styles.input} style={{display: 'none'}} />
                    </div>

                    {status === 'error' && <div>{error}</div>}

                    <button type="submit" disabled={status === 'pending'} style={{cursor: 'pointer'}}>
                        Submit
                    </button>

                    {/* {status === 'ok' && <div> Submitted!</div>} */}
                </form>
            </div>
        </div>
    );
}