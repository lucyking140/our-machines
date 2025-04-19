'use client';

import React, {useState} from "react";
import styles from "../../public/css/subInfo.module.css";
 
/*
    individual case study for a given model
*/
export default function SubInfo({sub, onSelect}: any) {

    // console.log("sub in case study: ", sub.human_fields);

    const data = sub.human_fields;

    const handleSelect = (sub) =>{
        onSelect(sub);
    }

    return (
    <div className={styles.container}>
        <div className={styles.header}>
            {data.Title}
        </div>
        
        {data.Name ? (<div className={styles.name}>
            By {data.Name}
        </div>) : null }

        {data.Name ? (<div className={styles.exploreButton} onClick={() => handleSelect(sub)}>
            Explore {data.Name}'s submission 
        </div>) : <div className={styles.exploreButton} onClick={() => handleSelect(sub)}> Explore this submission </div> }

        {data.Description ? (<div className={styles.textContent}>
            {data.Description}
        </div>) : null }
        
    </div>
    );

}
