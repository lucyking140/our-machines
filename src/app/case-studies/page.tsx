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

  // gets current window dims to dictate model size directly in pixels
  //TODO::: if want to do this, looks like it needs 
  // const {width, height} = useWindowDimensions();

  // const modelWidth = width / 3;
  const modelWidth = 300;

  // represents current open case study or none if there isn't one
  const [caseStudy, setCaseStudy] = React.useState<Model3dType | null>(null);

  // opens a case study component for the given model
  const openCaseStudy = (model: Model3dType) => {
    setCaseStudy(model);
  };

  const handleCSClose = () => {
    setCaseStudy(null);
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
            width={modelWidth}
            height={modelWidth}
            camPos={model.camPos}
            light={model.light}
            // onLoaded={handleModelLoaded}
        />
    </div>
  ));

  const caseStudyDiv = caseStudy ? (
    <div className={styles.caseStudyBox}>
      <div className={styles.close} onClick={handleCSClose}>
          <PlusIcon fill={features.fontColor} size='30px' />
      </div>
      <CaseStudy model={caseStudy} className={styles.caseStudy} />
    </div>
  ): null;

  return (
   <div className={styles.homeContainer}>

      <BackButton destination={"/"}  />
    
      <div className={styles.collection}>
          {models}
      </div>

      {caseStudyDiv}

    </div>
  );
}