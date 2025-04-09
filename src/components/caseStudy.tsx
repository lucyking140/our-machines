'use client';

import { Model3dType } from "../types";
// import BackButton from "./backButton";
import ModelViewer from './model';

import styles from "../../public/css/caseStudy.module.css";
 
/*
    individual case study for a given model
*/
export default function CaseStudy({ model }: Model3dType) {

    // const finalModel = model.model;
  return (
   <div className={styles.container}>
        <div className={styles.header}>
            <div className={styles.modelName}>
                {model.name}
            </div>
        </div>
      <div className={styles.content}>
        <ModelViewer 
            modelPath={model.modelPath}
            width={500}
            height={500}
        />
        <div className={styles.textContent}>
            Text content:
            {model.textContent}
        </div>
      </div>
    </div>
  );

}
