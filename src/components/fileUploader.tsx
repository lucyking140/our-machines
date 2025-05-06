'use client';
import { useState, useEffect } from 'react';
import {uploadedFileType} from "../types";

import { usePersContext } from '../app/contexts/usePersContext';

import { PlusIcon } from "./icons";

import styles from "../../public/css/homePage.module.css";

export function FileUploader({onUpload}: {onUpload: (param: any) => void}) {

    const [error, setError] = useState<string | null>(null);
    const {features}  = usePersContext();

    const handleFileUpload = (event) => {

        const selectedFile = event.target.files[0];

        if (!selectedFile) return;
        
        // type validation (TODO: add more file types)
        // if (selectedFile.type !== 'image/svg+xml') {
        //     console.log('Only SVG files are allowed.');
        //     event.target.value = '';
        //     return;
        // }
                
        const reader = new FileReader();

        // actually doing the reading of the file but to a URL
        reader.readAsDataURL(selectedFile);
        
        // from https://developer.mozilla.org/en-US/docs/Web/API/FileReader/load_event 
        // runs this after the file has loaded
        reader.onload = (e) => {
          console.log("reaching on load");
          const dataUrl = e.target.result;
  
          // getting additional file date from the submitted file
          const newFile = {
            name: selectedFile.name,
            type: selectedFile.type,
            size: selectedFile.size,
            lastModified: selectedFile.lastModified,
            uploadedAt: new Date().toISOString()
          };
          
          // adding dataURL to above info
          const fileWithData = {...newFile, url: dataUrl};
          //console.log("fileWithData: ", fileWithData);
          
          // actually doing the uploading
          try {
            //uploadSticker(fileWithData);
            onUpload(fileWithData);
          } catch (err) {
            console.error('Error:', err);
          }
          event.target.value = '';
        };

        reader.onerror = (e) => {
          alert("Something has gone wrong with the file upload. Please try again.");
        }
       
      };
    
    return(
        <div>
            {/* from https://www.youtube.com/watch?v=2tKQSenVzqQ */}
            <label htmlFor="svgFileInput" style={{cursor: 'pointer'}}>
                <PlusIcon fill={features.fontColor} size='30px'/>
            </label>
          <input 
            id="svgFileInput" 
            type="file" 
            className="hidden" 
            onChange={handleFileUpload}
            accept="image/*" //".svg" 
            style={{display: 'none'}}
          />
        </div>
    );
};