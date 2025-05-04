'use client';

import { Model3dType } from "../types";
import ModelViewer from './model';
import React, {useState} from "react";
import styles from "../../public/css/caseStudy.module.css";
 
/*
    individual case study for a given model
*/
export default function CaseStudy({ model }: Model3dType) {

  return (
   <div className={styles.container}>
    <div className={styles.modelContainer}>
          <div className={styles.model}>
            <ModelViewer 
                model={model}
                width={null}
                height={null}
                camPos={model.CS_camPos}
                light={model.light}
                orbit={true}
                haveHover={false}
                inCaseStudy={true}
            />
          </div>
        </div>
    <div className={styles.contentContainer}>
        <div className={styles.header}>
              <div className={styles.modelName}>
                  {model.name}
              </div>
              <div className={styles.subheader}>
                  <i> {model.subtitle} </i>
              </div>

              <div className={styles.headInfo}>
                  <b> Time of Origin: </b> {model.origin}
              </div>
              
              <div className={styles.headInfo}>
                 
                  <div className={styles.allKeywords}> 
                  <b> Keywords: </b> 
                    {model.primary_influences.map((word) => {
                        return (
                        <span className={styles.keyword}>
                          {word}
                        </span>);
                      })}
                  </div>
                    
              </div>

          </div>
          
          <div className={styles.textContent}>
              {/* <div dangerouslySetInnerHTML={{ __html: model.textContent }} /> */}
              {model.textContent.map((par) => {
                return(
                  <div className={styles.para} key={par ? par.substring(0, 5) : "no para"}>
                    <div className={styles.innerPara} dangerouslySetInnerHTML={{__html: `<div> ${par} </div>`}} />
                  </div>
                );
              })}
          </div>
      </div>
      </div>
  );

}
