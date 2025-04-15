'use client';

import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center } from '@react-three/drei';
import { usePersContext } from "../app/contexts/usePersContext";
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


// loading the actual model
function Model({modelPath}: {modelPath: string}){
  const gltf = useLoader(GLTFLoader, modelPath, (loader) => {});

  const scene = gltf.scene.clone(); //THIS IS KEY TO AVOID THE CONTEXT LOSS ISSUE

  //const { scene } = useGLTF(modelPath);

  // Centering the model
  useEffect(() => {
    if (scene) {
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      
      scene.position.x = -center.x;
      scene.position.y = -center.y;
      scene.position.z = -center.z;
    }
  }, [scene]);

  // grouping helps with manual centering
  const groupRef = useRef(undefined);

  // to rotate the model
  useFrame(() => {
    if (groupRef.current){
      groupRef.current.rotation.y -= 0.005;
    }
  });

  return(
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  )
}

// setting up camera to take into account model size
function CameraSetup({modelPath}: {modelPath: string}) {
  const { camera } = useThree();
  const gltf = useLoader(GLTFLoader, modelPath);
  
  useEffect(() => {
    if (gltf && gltf.scene) {
      // Calculate appropriate camera position based on model size
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const size = box.getSize(new THREE.Vector3()).length();
      
      camera.position.z = size * 1.5;
      camera.far = size * 10;
      camera.updateProjectionMatrix();
    }
  }, [camera, gltf]);

  return null;
}

const ModelViewer = ({modelPath, width = 800, height=600}: {modelPath: string, width: number, height: number}) => {
  const { features } = usePersContext();
  // this for some reason also helps with the lost context thing!
  const [key] = useState(() => Math.random().toString(36));

  // const canvasRef = useRef(undefined);

  return (
    <div className="model-viewer-container">
      
      <div style={{ width, height }}>
      
        <Canvas
          // camera={{ fov: 50, near: 0.1, far: 1000 }}
          // ref={canvasRef}
          key={{key}}
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
          <ambientLight intensity={1} />
          <directionalLight position={[1, 1, 1]} intensity={3} />
          
          <CameraSetup modelPath={modelPath}/>
          
          {/* TODO: add loading icon */}
          
          <Model modelPath={modelPath} />
          
          
          {/* <OrbitControls enableDamping dampingFactor={0.25} /> */}
        </Canvas>
      </div>
      
    </div>
  );
}

export default ModelViewer;