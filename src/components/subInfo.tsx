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
        if(validateApplication() && allowApp){
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

    const validateApplication = ():boolean =>{

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

        // setApplicable('yes');
        return true;

    }

    return (
    <div className={styles.container}>

        { data["Dev Img"]? <div className={styles.topImageBox}>
            <img src={data["Dev Img"]} className={styles.topImage}/>
        </div> : null }

        <div className={styles.header}>
            {data.Title}
        </div>
        
        {data.Name ? (<div className={styles.name}>
            By {data.Name}
        </div>) : null }

        {data.Name ? (<div className={ validateApplication() ? styles.exploreButton : styles.disabledExplore} onClick={() => handleSelect(sub)}>
            Apply {data.Name}'s submission to your site
        </div>) : <div className={ validateApplication() ? styles.exploreButton : styles.disabledExplore} onClick={() => handleSelect(sub)}> Apply this submission to your site </div> }

        { allowApp && !validateApplication() ? 
            <div className={styles.incompatible}> 
                This submission is not compatible with your currrent window dimensions.
            </div> : null}

        { !allowApp ? 
            <div className={styles.incompatible}> 
                This author did not give permission to apply their personalizations.
            </div> : null}

        {data.About ? (<div className={styles.textContent}>
            {data.About}
        </div>) : <div className={styles.textContent} style={{fontStyle: 'italic'}}>
            No description provided.
        </div> }
        
    </div>
    );

}
