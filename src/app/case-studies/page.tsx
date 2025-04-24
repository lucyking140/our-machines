'use client';

import ModelViewer from '../../components/model';
import CaseStudy from "../../components/caseStudy";
import { modelData } from "./models.data";
import React, {useState, useEffect, useRef} from "react";

import { Model3dType } from "../../types";

import BackButton from "../../components/backButton";

import { PlusIcon } from "../../components/icons";

import useWindowDimensions from "../../hooks/useWindowDimensions";

import styles from "../../../public/css/catalogue.module.css";
import { usePersContext } from "../contexts/usePersContext";

 
/*
Collection of 3D graphics corresponding to objects that can be opened for more information
*/
export default function Catalogue() {

  const {features} = usePersContext();
  
  // represents current open case study or none if there isn't one
  const [caseStudy, setCaseStudy] = React.useState<Model3dType | null>(null);

  // opens a case study component for the given model
  const openCaseStudy = (model: Model3dType) => {
    setCaseStudy(model);
    document.body.style.overflow='hidden';
  };

  const handleCSClose = () => {
    setCaseStudy(null);
    // correcting scroll feature that we removed to avoid un-scroll when cs is open
    document.body.style.overflow='scroll';
  };

  // const modelHovers = modelData.map((model) => {
  //      return {name: model.name,
  //      value: false,}
  // });

  // generating list of models for each item in modelData
  const models = modelData.map((model, i) => (
    <div className={styles.model} onClick={() => (openCaseStudy(model))} key={`${model.modelPath}-${i}`}  >
        
        <ModelViewer 
            model={model}
            width={null} // not used
            height={null}
            camPos={model.camPos}
            light={model.light}
            // onLoaded={handleModelLoaded}
        />
    </div>
  ));

  const caseStudyDiv = caseStudy ? (
    // from https://stackoverflow.com/questions/10211203/scrolling-child-div-scrolls-the-window-how-do-i-stop-that 
    //<div className={styles.caseStudyBox} onMouseOver={() => {document.body.style.overflow='hidden'}} onMouseOut={() => {document.body.style.overflow='scroll'}}>
    <div className={styles.caseStudyBox}>
      <div className={styles.close} onClick={handleCSClose}>
          <PlusIcon fill={features.fontColor} size='30px' />
      </div>
      <CaseStudy model={caseStudy} className={styles.caseStudy} />
    </div>
  ): null;

  return (
   <div className={styles.homeContainer}>

      {/* only show this when case study isn't open, otherwise action is kind of wierd */}
      { !caseStudy && <BackButton destination={"/"}  /> }
    
      <div className={styles.collection}>
          {models}
      </div>

      {caseStudyDiv}

    </div>
  );
}