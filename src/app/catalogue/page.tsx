'use client';

import ModelViewer from '../../components/model';
import CaseStudy from "../../components/caseStudy";
import { modelData } from "./models.data";
import * as React from "react";

import { Model3dType } from "../../types";

import useWindowDimensions from "../../hooks/useWindowDimensions";

import styles from "../../../public/css/catalogue.module.css";
 
/*
Collection of 3D graphics corresponding to objects that can be opened for more information
*/
export default function Catalogue() {

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

  // generating list of models for each item in modelData
  const models = modelData.map((model) => (
    <div className={styles.model} onClick={() => (openCaseStudy(model))}>
        <ModelViewer 
            modelPath={model.modelPath}
            width={modelWidth}
            height={modelWidth}
        />
    </div>
  ));

  const caseStudyDiv = (
    <div className={styles.caseStudyBox}>
      <div className={styles.close} onClick={() => (handleCSClose())}>
        Close
      </div>
      <CaseStudy model={caseStudy} className={styles.caseStudy} />
    </div>
  );

  return (
   <div className={styles.homeContainer}>
      <div className={styles.collection}>
        {models}
      </div>
      { caseStudy ? caseStudyDiv : null}
    </div>
  );

//  return (
//    <div className="home-container">
//       <div className="collection">
//         <ModelViewer 
//           modelPath="/3d_models/gameboy_challenge/scene.gltf" 
//           // OR: just give each animation a square of the same size
//           width={200} // maybe could figure out how to get this to fit the model perfectly 
//           // just by manually doing it? won't have too many
//           height={200}  // changing this also changes the size of the model ...
//         />

//         <ModelViewer 
//           modelPath="/3d_models/chapstick.glb" 
//           width={200}
//           height={200}
//         />

//         <ModelViewer 
//           modelPath="/3d_models/nintendo_ds_lite_3d_pixel_art/scene.gltf" 
//           width={200}
//           height={200}
//         />

//         <ModelViewer 
//           modelPath="/3d_models/drawer.gltf" 
//           width={200}
//           height={200}
//         />
//       </div>
       
//    </div>
//  );
}
