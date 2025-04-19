'use client';

import BackButton from "../../components/backButton";

import styles from "../../../public/css/gallery.module.css";

import React, {useState, useEffect} from 'react';

import {SubmissionForm} from "../../components/SubmissionForm";
import {MenuIcon, PlusIcon} from "../../components/icons";
import SubInfo from "../../components/subInfo";

import { usePersContext } from "../contexts/usePersContext";

/*
Collection of other users' personalizations
*/
export default function Gallery() {

    const {features, changeFeature, stickers, addSticker, deleteAllStickers} = usePersContext();

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

    // applying all of the features and stickers from sub onto the current page, removing all others
    const applySubmission = (sub) =>{

        const data = sub.human_fields;

        const feats = JSON.parse(data.Features)
        const sticks = JSON.parse(data.Stickers);

        console.log("feats: ", feats);

        changeFeature("backgroundColor", feats.backgroundColor);
        changeFeature("fontColor", feats.fontColor);
        changeFeature("font", feats.font);

        // clearing all stickers to replace them with new sub's stickers
        deleteAllStickers();

        //adding new stickers
        sticks.map((stick) =>{
            addSticker(stick);
        });

        setCaseStudy(null); //auto-closing case study

    }

    // represents current open case study or none if there isn't one
    const [caseStudy, setCaseStudy] = React.useState(null);

    // opens a case study component for the given model
    const openCaseStudy = (sub) => {
        setCaseStudy(sub);
    };

    const handleCSClose = () => {
        setCaseStudy(null);
    };

    const caseStudyDiv = caseStudy ? (
        <div className={styles.caseStudyBox}>
          <div className={styles.close} onClick={handleCSClose}>
              <PlusIcon fill={features.fontColor} size='30px' />
          </div>
          <SubInfo sub={caseStudy} onSelect={applySubmission} className={styles.caseStudy} />
        </div>
      ): null;

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

    var submissionBoxes = null;
    if(submissions.length > 0){
        submissionBoxes = submissions.map((sub, i) =>{
            console.log("SUB: ", sub);
            const feats = JSON.parse(sub.data.features);
            return (<div className={styles.submission} key={`${sub.name}-${i}`} onClick={() => (openCaseStudy(sub))}>
                <div className={styles.thumbnail} style={{backgroundColor: feats.backgroundColor}}>
                    <div className={styles.tnTitle} style={{color: feats.fontColor, fontFamily: feats.font}}>
                        OUR MACHINES
                    </div>
                    <div className={styles.menuicon}>
                        <MenuIcon fill={feats.fontColor}/>
                    </div>
                </div>
                <div className={styles.nameBox}> 
                    {sub.name}
                </div>
            </div>)
        });
    }
    
    return(
        <div>
            <SubmissionForm />
            <BackButton destination={"/"} />
            {loading ? <div> 
                Loading...
            </div> 
            : <div className={styles.submissionContainer}>
                {submissionBoxes}
            </div> }

            {caseStudyDiv}
            
        </div>
    );
};
