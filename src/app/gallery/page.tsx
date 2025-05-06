'use client';

import BackButton from "../../components/backButton";

import styles from "../../../public/css/gallery.module.css";

import React, {useState, useEffect} from 'react';

import {SubmissionForm} from "../../components/SubmissionForm";
import {Loader} from "../../components/loader";

import {MenuIcon, PlusIcon, UploadIcon} from "../../components/icons";
import SubInfo from "../../components/subInfo";

import { usePersContext } from "../contexts/usePersContext";
import { getSelectUtilityClasses } from "@mui/material";

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
            const form_id = '681a79a9a98d5a00081d9749'; //'67fe837ccde56500077832c6';
            const api_key = process.env.NEXT_PUBLIC_NETLIFY_AUTH_TOKEN;
            //console.log("API key: ", api_key);
            const res = await fetch(`https://api.netlify.com/api/v1/forms/${form_id}/submissions`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${api_key}`
                }
            });
            console.log("res: ", res);
            const data = await res.json();
            return data;

        } catch (e) {
            //setStatus('error');
            //setError(`${e}`);
            console.log("Error: ", e);
            return null;
        }
    }

    const verifyApply = (sub) => {
        const data = sub.human_fields;
        const sticks = JSON.parse(data.Stickers);

        // if the user has applied any stickers, tell them before we delete them
        if(sticks.length > 0){
            // returning early and cancelling the action if so
            if(confirm("Applying another user's submission will erase your current personalizations, including stickers")){
                console.log("reaching affirmative case");
                applySubmission(sub);
            }

        } else {
            applySubmission(sub);
        }
    }

    // applying all of the features and stickers from sub onto the current page, removing all others
    const applySubmission = (sub) =>{
        console.log("Reaching apply submission!");

        const data = sub.human_fields;

        const feats = JSON.parse(data.Features)
        const sticks = JSON.parse(data.Stickers);

        console.log("feats: ", feats);

        changeFeature("backgroundColor", feats.backgroundColor);
        changeFeature("fontColor", feats.fontColor);
        changeFeature("font", feats.font);

        // clearing all stickers to replace them with new sub's stickers
        console.log("reaching delete all stickers");
        deleteAllStickers();

        //adding new stickers
        sticks.map((stick) =>{
            addSticker(stick);
        });

        handleCSClose(); //auto-closing case study
    }

    // represents current open case study or none if there isn't one
    const [caseStudy, setCaseStudy] = React.useState(null);

    // show or hide upload submission form
    const [uploadForm, setUploadForm] = React.useState<boolean | null>(false);

    const toggleSubForm = () =>{
        //console.log("reaching toggle form");
        if (uploadForm){ // we are now turning the uploadForm OFF
            document.body.style.overflow='scroll';
            console.log("changing to scroll");
        } else {
            document.body.style.overflow='hidden';
            console.log("changing to hidden");
        }

        setUploadForm(!uploadForm);
    }

    // opens a case study component for the given model
    const openCaseStudy = (sub) => {
        setCaseStudy(sub);
        document.body.style.overflow='hidden';
        console.log("setting hidden HAT");
    };

    const handleCSClose = () => {
        setCaseStudy(null);
        document.body.style.overflow='scroll';
        console.log("setting scroll HAT");
    };

    const caseStudyDiv = caseStudy ? (
        
        <div className={styles.overlay}>
            {/* onMouseOver={() => {document.body.style.overflow='hidden'}} onMouseOut={() => {document.body.style.overflow='scroll'}} */}
            <div className={styles.caseStudyBox}>
                <div className={styles.close} onClick={handleCSClose}>
                    <PlusIcon fill={features.fontColor} size='30px' />
                </div>
                <div className={styles.caseStudy}>
                <SubInfo sub={caseStudy} onSelect={verifyApply}/>
                </div>
            </div>
        </div>
      ): null;

    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    // loading subs on init
    useEffect(() => {
        const loadSubs = async () => {
            setLoading(true)
            const results = await fetchSubmissions();
            if(results){
                setSubmissions(results);
            } else {
                alert("Can't get form submissions");
            }
            setLoading(false)
            console.log("FINAL: ", results);
        }
        loadSubs();
    }, []);

    console.log("submissions: ", submissions);
    // // gets all stickers and scales them to the case study box size to apply there
    const appliedStickers = submissions.map((sub, i) =>{
        const cs_width = document.getElementById("thumbnail")?.style.width;
        const cs_height = document.getElementById("thumbnail")?.style.height;

        // scaling the images to match the original window size
        const scaleFactor = cs_width / sub.window_width;
        return(
        <div>
            <img   

            />
        </div>);
    });

    var submissionBoxes = null;
    if(submissions.length > 0){
        submissionBoxes = submissions.map((sub, i) =>{
            console.log("SUB: ", sub);
            // console.log("Sub img: ", sub.data.dev_img);
            const feats = JSON.parse(sub.data.features);
            return (<div className={styles.submission} key={`${sub.name}-${i}`} onClick={() => (openCaseStudy(sub))}>
                {/* maps stickers over entire caseStudyBox
                <div className={styles.stickersContainer}>
                
                </div> */}
                {/* checking if the submission has an image attached, otherwise using plain background */}
                { sub.data.imageUrl ? 
                    <div id="thumbnail" className={styles.thumbnail} style={{backgroundColor: feats.backgroundColor}}>
                        {/* IMAGE: {sub.data.dev_img.url.toString()} */}
                        <img src={sub.data.imageUrl} className={styles.thumbImg}/>
                    </div>
                 : <div id="thumbnail" className={styles.thumbnail} style={{backgroundColor: feats.backgroundColor}}>
                        <div className={styles.tnTitle} style={{color: feats.fontColor, fontFamily: feats.font}}>
                            OUR MACHINES
                        </div>
                        {/* <div className={styles.menuicon}>
                            <MenuIcon fill={feats.fontColor}/>
                        </div> */}
                    </div>
                }

                <div className={styles.nameBox}> 
                    {sub.data.title}
                </div>
                
            </div>)
        });
    }
    
    return(
        <div>
            {/* <div className={styles.backButton}> */}
            {/* only want back button possible if case study NOT open */}
            { !caseStudy && <BackButton destination={"/"} /> }
            {/* </div> */}
            
            <div className={styles.allContainer}>

                <div className={styles.title}>
                    Other Peoples' Things
                </div>

                <div className={styles.subtitle}> 
                    {/* So many of our projections of self are meaningless without interaction with others  */}
                    Expressive objects gain meaning when experienced collectively. Here, explore personal devices that others consider particularly   
                    meaningful and submit your own.

                    <br />
                    <br />

                    For a closer connection, step into their shoes by applying their personalizations to this site to your own.   
                
                </div>
                
                { uploadForm &&
                // onMouseOver={() => {document.body.style.overflow='hidden'}} onMouseOut={() => {document.body.style.overflow='scroll'}}
                    <div className={styles.overlay}>
                        <div className={styles.caseStudyBox}>
                            <div className={styles.close} onClick={() => {toggleSubForm()}}>
                                <PlusIcon fill={features.fontColor} size='30px' />
                            </div>
                            <div className={styles.subContent}>
                                <SubmissionForm closeOnSubmit={toggleSubForm}/>
                            </div>
                        </div>
                    </div>
                }
                {/* <div className={styles.header}> */}
                    
                {/* { !uploadForm ? 
                    <div className={styles.uploadButton} onClick={() =>{toggleSubForm()}}>
                        Submit your Creation
                    </div> : 
                    // just a blank button to make the page the same size
                    <div className={styles.uploadButtonBlank}> </div> 
                }    */}
            
                
                {loading ? 
                    <div className={styles.loaderBox}> 
                        <Loader fill={features.fontColor} />
                    </div> 
                : <div className={styles.submissionContainer}>
                    {/* submit box */}
                    <div className={styles.submission} onClick={() => (toggleSubForm())}>
                        
                        <div className={styles.uploadBlock}>
                            {/* <UploadIcon size='50px' fill={features.backgroundColor}/> */}
                            <PlusIcon fill={features.backgroundColor} size='40px' />
                            Share a personal device
                        </div>
                    </div>
                    {submissionBoxes}
                </div> }

                {caseStudyDiv}
                
            </div>
        </div>
    );
};
