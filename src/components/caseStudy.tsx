'use client';

import { Model3dType } from "../types";
// import BackButton from "./backButton";
import ModelViewer from './model';
import React, {useState} from "react";
import styles from "../../public/css/caseStudy.module.css";
 
/*
    individual case study for a given model
*/
export default function CaseStudy({ model }: Model3dType) {

  return (
   <div className={styles.container}>
        <div className={styles.header}>
            <div className={styles.modelName}>
                {model.name}
            </div>
        </div>
      <div className={styles.content} >
        <div>
          <ModelViewer 
              modelPath={model.modelPath}
              width={500}
              height={500}
          />
        </div>
        
        <div className={styles.textContent}>
            Text content:
            {model.textContent}
        </div>
      </div>
    </div>
  );

}
