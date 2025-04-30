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
    //document.body.classList.add('no-scroll');
  };

  const handleCSClose = () => {
    setCaseStudy(null);
    // correcting scroll feature that we removed to avoid un-scroll when cs is open
    document.body.style.overflow='scroll';
    //document.body.classList.remove('no-scroll');
  };

  // const modelHovers = modelData.map((model) => {
  //      return {name: model.name,
  //      value: false,}
  // });

  // const options = {
  //   root: document.querySelector("#scrollArea"),
  //   rootMargin: "0px",
  //   threshold: 1.0,
  // };

  // const callback = (entries, observer) => {
  //   entries.forEach((entry) => {
  //     // Each entry describes an intersection change for one observed
  //     // target element:
  //     //   entry.boundingClientRect
  //     //   entry.intersectionRatio
  //     //   entry.intersectionRect
  //     //   entry.isIntersecting
  //     //   entry.rootBounds
  //     //   entry.target
  //     //   entry.time
  //   });
  // };

  // const observer = new IntersectionObserver(callback, options);

  // generating list of models for each item in modelData
  // const models = modelData.map((model, i) => (
  //   <div className={styles.model} onClick={() => (openCaseStudy(model))} key={`${model.modelPath}-${i}`}  >
  //       <ModelViewer 
  //           model={model}
  //           width={null} // not used
  //           height={null}
  //           camPos={model.camPos}
  //           light={model.light}
  //           // onLoaded={handleModelLoaded}
  //       />
  //   </div>
  // ));
  const models = modelData.map((model, i) => (
    // testing repeating the test object 8 times
    <div className={styles.model} onClick={() => (openCaseStudy(modelData[0]))} key={`${modelData[0].modelPath}-${i}`}  >
         <ModelViewer 
            model={modelData[0]}
            width={null} // not used
            height={null}
            camPos={modelData[0].camPos}
            light={modelData[0].light}
            // onLoaded={handleModelLoaded}
        />
    </div>
  ));

  /*

var link = document.querySelector('.link');
link.addEventListener( 'click', function(e) {
e.stopPropagation();
 alert("link");
});
  */

  const caseStudyDiv = caseStudy ? (
    // from https://stackoverflow.com/questions/10211203/scrolling-child-div-scrolls-the-window-how-do-i-stop-that 
    //<div className={styles.caseStudyBox} onMouseOver={() => {document.body.style.overflow='hidden'}} onMouseOut={() => {document.body.style.overflow='scroll'}}>
    <div className={styles.overlay}>
        <div className={styles.caseStudyBox}>
          <div className={styles.close} onClick={handleCSClose}>
              <PlusIcon fill={features.fontColor} size='30px' />
          </div>
          <CaseStudy model={caseStudy} className={styles.caseStudy} />
        </div>
    </div>
    
  ): null;

  return (
   <div className={styles.homeContainer}>

      {/* only show this when case study isn't open, otherwise action is kind of wierd */}
      { !caseStudy && <BackButton destination={"/"}  /> }
      {/* // just to get more models in */}
      <div className={styles.collection}>
          {/* {models} */}
          <div className={styles.model} onClick={() => (openCaseStudy(modelData[1]))} key={`${modelData[1].modelPath}`}  >
              <ModelViewer 
                  model={modelData[1]}
                  width={null} // not used
                  height={null}
                  camPos={modelData[1].camPos}
                  light={modelData[1].light}
                  // onLoaded={handleModelLoaded}
              />
          </div>
          <div className={styles.model} onClick={() => (openCaseStudy(modelData[1]))} key={`${modelData[1].modelPath}`}  >
              <ModelViewer 
                  model={modelData[1]}
                  width={null} // not used
                  height={null}
                  camPos={modelData[1].camPos}
                  light={modelData[1].light}
                  // onLoaded={handleModelLoaded}
              />
          </div>
          <div className={styles.model} onClick={() => (openCaseStudy(modelData[1]))} key={`${modelData[1].modelPath}`}  >
              <ModelViewer 
                  model={modelData[1]}
                  width={null} // not used
                  height={null}
                  camPos={modelData[1].camPos}
                  light={modelData[1].light}
                  // onLoaded={handleModelLoaded}
              />
          </div>
          <div className={styles.model} onClick={() => (openCaseStudy(modelData[1]))} key={`${modelData[1].modelPath}`}  >
              <ModelViewer 
                  model={modelData[1]}
                  width={null} // not used
                  height={null}
                  camPos={modelData[1].camPos}
                  light={modelData[1].light}
                  // onLoaded={handleModelLoaded}
              />
          </div>
      </div>

      {caseStudyDiv}

    </div>
  );
}