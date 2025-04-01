'use client';

import ModelViewer from '../../components/model';

// import "../../public/css/catalogue.module.css";
 
/*
Collection of 3D graphics corresponding to objects that can be opened for more information
*/
export default function Catalogue() {
 return (
   <div className="home-container">
      <div className="collection">
        <ModelViewer 
          modelPath="/gameboy_challenge/scene.gltf" 
          // OR: just give each animation a square of the same size
          width={200} // maybe could figure out how to get this to fit the model perfectly 
          // just by manually doing it? won't have too many
          height={200}  // changing this also changes the size of the model ...
        />

        <ModelViewer 
          modelPath="/chapstick.glb" 
          width={200}
          height={200}
        />

        <ModelViewer 
          modelPath="/nintendo_ds_lite_3d_pixel_art/scene.gltf" 
          width={200}
          height={200}
        />

        <ModelViewer 
          modelPath="/drawer.gltf" 
          width={200}
          height={200}
        />
      </div>
       
   </div>
 );
}
