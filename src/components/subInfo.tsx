'use client';

import React, {useState} from "react";
import styles from "../../public/css/subInfo.module.css";

import useWindowDimensions from "../hooks/useWindowDimensions";

/*
    individual case study for a given model
*/
export default function SubInfo({sub, onSelect}: any) {

    // console.log("sub in case study: ", sub.human_fields);

    const data = sub.human_fields;

    const {width, height} = useWindowDimensions();

    // arbitrary pixel size to determine mobile vs web
    const mobileWid = 1000;

    // submits this submission to be applied
    const handleSelect = (sub) =>{
        // only actually select if valid
        //if(validateDims() && validateMods() && allowApp){
        if(isValid){
            onSelect(sub);
        }
    }

    // this is separate from validation so we can communicate if the problem is window size or permissions
    const [allowApp, setAllowApp] = useState<boolean>(true);

    // if this submission did not want personalization public
    React.useEffect(() => {
        if (data.Personalization === false) {
            setAllowApp(false);
        }
    }, [data.Personalization]);

    const validateDims = ():boolean =>{

        // win dims of submission
        console.log("data: ", data);
        const winHeight = data["Window Height"];
        const winWidth = data["Window Width"];        

        console.log("submission width: ", winWidth, " and cur width: ", width);

        // but this only matters if sub has stickers ... 

        if (JSON.parse(data.Stickers).length > 0){
            // console.log("data.stickers.length > 0");
            // sub mobile, user web || sub web, user mobile
            if ((winWidth < mobileWid && width > mobileWid) || (winWidth > mobileWid && width < mobileWid)){
                // setApplicable('invalid');
                return false;
            }
        }

        return true;
    }

    // checks if there are actually any personalizations at all, if not disable button with that message
    const validateMods = ():boolean => {
        const feats = JSON.parse(data.Features)
        if(feats.fontColor == "#000000" && feats.backgroundColor == "#fff9f5" && feats.font == "Helvetica, sans-serif" && JSON.parse(data.Stickers).length == 0){
            return false;
        } 

        return true;
    }

    // SETTING MESSAGE if button is disabled

    const dims = "This submission is not compatible with your currrent window dimensions.";
    const perms = "This author did not give permission to apply their personalizations.";
    const mods = "This submission contains no personalizations.";

    let message = data.Name ? `Apply ${data.Name}'s submission to your site` : "Apply this submission to your site";
    
    const isValid = validateMods() && validateDims() && allowApp;
    if(!allowApp){
        message = perms;
    } else if (!validateMods()){
        message=mods;
    } else if (!validateDims()){
        message=dims;
    } else{ //valid case
        message = data.Name ? `Apply ${data.Name}'s submission to your site` : "Apply this submission to your site";
    } 

    return (
    <div className={styles.container}>

        { data["Image Url"]? <div className={styles.topImageBox}>
            <img src={data["Image Url"]} className={styles.topImage}/>
        </div> : null }

        <div className={styles.header}>
            {data.Title}
        </div>
        
        {data.Name ? (<div className={styles.name}>
            By {data.Name}
        </div>) : null }

        {/* deciding which message to display based on if we have the name or not */}
        <div className={ isValid ? styles.exploreButton : styles.disabledExplore} onClick={() => handleSelect(sub)}>
            {message}
        </div>

        {/* allowApp = user submitted permissions; validateMods -- some personalization was done; validateDims -- they have done some personalization and it's the right screen size if it includes stickers */}
        {/* { !isValid ? 
            <div className={styles.incompatible}> 
                {message}
            </div> : null} */}

        {data.About ? (<div className={styles.textContent}>
            {data.About}
        </div>) : <div className={styles.textContent} style={{fontStyle: 'italic'}}>
            No description provided.
        </div> }
        
    </div>
    );

}
