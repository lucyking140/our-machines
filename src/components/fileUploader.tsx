'use client';
import { useState, useEffect } from 'react';
import {uploadedFileType} from "../types";

import { usePersContext } from '../app/contexts/usePersContext';

import { PlusIcon } from "./icons";

import styles from "../../public/css/homePage.module.css";

export function FileUploader() {

    const [error, setError] = useState<string | null>(null);
    const {features}  = usePersContext();

    // function to add sticker to local storage
    const uploadSticker = (fileInfo: uploadedFileType) => {
        // based on a provided file info json, add this 
        // information to the list of stickers in localstorage

        // getting current list
        const all = localStorage.getItem('stickers');
        console.log("all stickers: ", all);
        let cur_files = [];
        if(all){
            cur_files = JSON.parse(all);
        }

        //need: alt, url, width, height
        console.log("fileInfo: ", fileInfo);
        const fullFile = {...fileInfo, alt: fileInfo.name, width: 100, height: 100};

        //const new_files = JSON.stringify({...cur_files, str_file});
        cur_files.push(fullFile);
        console.log("cur files after loading most recent sticker: ", cur_files);


        localStorage.setItem('stickers', JSON.stringify(cur_files));
        // triggering useEffect in sticker component
        window.dispatchEvent(new Event('stickers-updated'));

        console.log("Finished setting new sticker in storage!");
    }

    const handleFileUpload = (event) => {

        const selectedFile = event.target.files[0];

        if (!selectedFile) return;
        
        // SVG Type validation
        if (selectedFile.type !== 'image/svg+xml') {
            //setError('Only SVG files are allowed.');
            console.log('Only SVG files are allowed.');
            event.target.value = ''; // Reset the input
            return;
        }
        
        // Size validation (limit to 2MB for SVG files)
        if (selectedFile.size > 2 * 1024 * 1024) {
            //   setError('SVG file is too large. Please select a file smaller than 2MB.');
            console.log('SVG file is too large. Please select a file smaller than 2MB.');
            event.target.value = ''; // Reset the input
            return;
        }
        
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
            uploadSticker(fileWithData);
          } catch (err) {
            console.error('Error:', err);
          }
          event.target.value = '';
        };
        
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
            accept=".svg" 
            style={{display: 'none'}}
          />
        </div>
    );
};