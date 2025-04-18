'use client';

import styles from "../../../public/css/gallery.module.css";

import React, {useState, useEffect} from 'react';

import {SubmissionForm} from "../../components/SubmissionForm";

/*
Collection of other users' personalizations
*/
export default function Gallery() {

    const fetchSubmissions = async () => {
        // getting form responses
        try {
            // setStatus('pending');
            // setError(null);
            // const myForm = event.target;
            // const formData = new FormData(myForm);
            const form_id = '67fe837ccde56500077832c6';
            const api_key = process.env.NEXT_PUBLIC_NETLIFY_AUTH_TOKEN;
            console.log("API key: ", api_key);
            const res = await fetch(`https://api.netlify.com/api/v1/forms/${form_id}/submissions`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${api_key}`
                }
            });

            const data = await res.json();
            return data;

        } catch (e) {
            //setStatus('error');
            //setError(`${e}`);
            console.log("Error: ", e);
            return null;
        }
    }

    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    // loading subs on init
    useEffect(() => {
        const loadSubs = async () => {
            setLoading(true)
            const results = await fetchSubmissions();
            setSubmissions(results);
            setLoading(false)
            console.log("FINAL: ", results);
        }
        loadSubs();
    }, []);

    const submissionBoxes = Array(submissions).map((sub) =>{
        console.log("SUB: ", sub);
        if(sub.length != 0){ // used to avoid issue on start with rendering the empty sub
            return (<div className={styles.submission}>
                <div className={styles.thumbnail} >
    {/* style={{backgroundColor: sub[0].features.backgroundColor}} */}
                </div>
                <div className={styles.nameBox}> 
                    {sub[0].name}
                </div>
            </div>)
        } else{
            return null;
        }
       
    });

    return(
        <div>
            <SubmissionForm />
            {loading ? <div> 
                Loading...
            </div> 
            : submissionBoxes}
        </div>
    );
};
