import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// TODO: could be cool to have users click to activate but not scroll 
import { OrbitControls } from 'three/addons';

const ModelViewer = ({ modelPath, width = 800, height = 600 }) => {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const scene = new THREE.Scene();
    // SET BACKGROUND TO DEFAULT EVENTUALLY 0xfff9f5
    scene.background = new THREE.Color(0xfff9f5);
    
    // adding lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    const camera = new THREE.PerspectiveCamera(
      35,  // how far away the camera is, increase to make image smaller
      width / height, 
      0.1, 
      1000
    );
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    
    // Took out orbit controls to stop user control of the models
    // const controls = new OrbitControls(camera, renderer.domElement);
    // controls.enableDamping = true;
    // controls.dampingFactor = 0.25;
    
    // Load the model
    const loader = new GLTFLoader();

    try {
      loader.load(
        modelPath,
        (gltf) => {
          // centering the model
          const box = new THREE.Box3().setFromObject(gltf.scene);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3()).length();
          
          // Reset model position and scale
          gltf.scene.position.x = -center.x;
          gltf.scene.position.y = -center.y;
          gltf.scene.position.z = -center.z;
          
          // Adjust camera position based on model size
          camera.position.z = size * 2;
          camera.far = size * 10;
          camera.updateProjectionMatrix();
          
          scene.add(gltf.scene);
          setLoading(false);
        },
        (err) => {
          console.error('Error loading model:', err);
          setError('Failed to load 3D model');
          setLoading(false);
        }
      );
    } catch (err) {
      console.error('Error in model loading process:', err);
      setError('There was a problem loading the model');
      setLoading(false);
    }
    
    // animation for constant rotation
    const animate = () => {
        requestAnimationFrame(animate);
        scene.rotation.y -= 0.005;
        // controls.update();
        renderer.render(scene, camera);
    };
    
    animate();
    
    // clean up
    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [modelPath, width, height]);
  
  return (
    <div className="model-viewer-container">
      <div ref={containerRef} style={{ width, height }} />
      {loading && <div className="loading">Loading model...</div>}
      {/* {error && <div className="error">{error}</div>} */}
    </div>
  );
};

export default ModelViewer;
