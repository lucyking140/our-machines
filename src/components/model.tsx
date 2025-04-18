'use client';

import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center } from '@react-three/drei';
import { usePersContext } from "../app/contexts/usePersContext";
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { Model3D, Model3dType } from "../types";


import styles from "../../public/css/catalogue.module.css";

// loading the actual models
function Model({modelPath, onModelLoaded}: {modelPath: string, onModelLoaded: () => void}){
  // const gltf = useLoader(GLTFLoader, modelPath, (loader) => {}, (error) => {
  //   console.error("Error loading model:", error);
  //   onModelLoaded(); // Still call onModelLoaded on error
  // });
  const gltf = useLoader(GLTFLoader, modelPath);
  // After the model is fully loaded, call the callback

  const scene = gltf.scene.clone(); //THIS IS KEY TO AVOID THE CONTEXT LOSS ISSUE

  //const { scene } = useGLTF(modelPath);

  // centering the models
  useEffect(() => {
    if (scene) {
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      
      scene.position.x = -center.x;
      scene.position.y = -center.y;
      scene.position.z = -center.z;

      // console.log("Reaching place where onModelLoaded should be called");
      onModelLoaded();
    }
    
  }, [scene]);

  // grouping helps with manual centering
  const groupRef = useRef(undefined);

  // rotating just this one first to get the look right
  if (modelPath=="/3d_models/nintendo_switch_2/scene.gltf"){
    scene.rotation.x += 0.9;
    // groupRef.current.rotation.y += 0.5;
    // groupRef.current.rotation.z += 1;
  }

  // to rotate the models
  useFrame(() => {
    if (groupRef.current){
      groupRef.current.rotation.y -= 0.005;
    }
  });

  // const handleMouseEnter = () => {
  //   useFrame(() => {
  //     if (groupRef.current){
  //       groupRef.current.rotation.y -= 0.005;
  //     }
  //   });
  // };

  return(
    // <div  onMouseEnter={handleMouseEnter} style={{backgroundColor: 'lightblue'}}>
      <group ref={groupRef}>
          <primitive object={scene} />
      </group>    
  )
}

// setting up camera to take into account model size
function CameraSetup({modelPath, camPos}: {modelPath: string, camPos: number}) {
  const { camera } = useThree();
  const gltf = useLoader(GLTFLoader, modelPath);
  
  useEffect(() => {
    if (gltf && gltf.scene) {
      // Calculate appropriate camera position based on model size
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const size = box.getSize(new THREE.Vector3()).length();
      
      camera.position.z = size * camPos; // 1.5 for catalogue page
      camera.far = size * 10;
      camera.updateProjectionMatrix();
    }
  }, [camera, gltf]);

  return null;
}

const ModelViewer = ({model, width = 800, height=600, camPos=1, light=1, orbit=false, haveHover=true}: {model: Model3D, width: number, height: number, camPos: number, light: number, orbit: boolean, haveHover: boolean}) => {
  const { features } = usePersContext();
  // this for some reason also helps with the lost context thing!
  const [key] = useState(() => Math.random().toString(36));

  const [modelLoaded, setModelLoaded] = useState(false);

  const handleModelLoaded = () => {
    // console.log("reaching onLoaded in model");
    // if (onLoaded) {
    //   onLoaded();
    // }
    setModelLoaded(true);
  };

  const Loader = () => {
    return (
      <div className={styles.loader}>
        <div className={styles.loaderIcon} >
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill='none'
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="20"
                cy="20"
                r="18"
                stroke={features.fontColor} // fill color
                strokeWidth="4"
                strokeDasharray="113"
                strokeDashoffset="40"
                strokeLinecap="round"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 20 20"
                  to="360 20 20"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
          </div>

      </div>
    );
  }

  const [hoverName, setHoverName] = useState(false);
  
  const handleMouseEnter = () => {
    setHoverName(true);
    // leaving name hover on for 1 second
    setTimeout(() => {
      setHoverName(false);
    }, 2000);
  }

  const handleMouseLeave = () => {
    setHoverName(false);
  };

  return (
    <div className={styles.modelBox}>
      <div style={{ width, height}} >
        {/* name of model shown on hover -- haveHover is false for case studies bc name is already right there */}
        { hoverName && haveHover ? (
              <div className={styles.hoverName}>
                  {model.name}
              </div>
          ) : null }
        <Suspense fallback={Loader()} >
          <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <Canvas
            // camera={{ fov: 50, near: 0.1, far: 1000 }}
            // ref={canvasRef}
            key={key}
            // gl={{ 
            //   powerPreference: "default",
            //   alpha: true, 
            //   antialias: true,
            //   preserveDrawingBuffer: true,
            //   failIfMajorPerformanceCaveat: false
            // }}
            style={{ background: features.backgroundColor }}
            onCreated={({ gl }) => {
              // Add extra context loss handling
              // from https://www.khronos.org/webgl/wiki/HandlingContextLost 
              gl.getContext().canvas.addEventListener('webglcontextlost', (e) => {
                e.preventDefault();
                console.log('WebGL context lost');
              }, false);
            }}
          >
            
            <ambientLight intensity={light} />
            <directionalLight position={[1, 1, 1]} intensity={3} />
            
            <CameraSetup modelPath={model.modelPath} camPos={camPos}/>
            
            {/* TODO: add loading icon */}
            <Model modelPath={model.modelPath} onModelLoaded={handleModelLoaded} />
            
            {/* only turning orbit/user control on for case studies */}
            { orbit ? (
              <OrbitControls enableDamping dampingFactor={0.25} />
            ) : null } 
            
            </Canvas>
          </div>
          
        </Suspense>
      </div>
      
    </div>
  );
}

export default ModelViewer;