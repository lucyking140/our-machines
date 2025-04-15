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
        
        reader.onload = (e) => {
            console.log("reaching on load");
          const dataUrl = e.target.result;
          
          // Additional validation: Check if the file content actually contains SVG
        //   if (!dataUrl.includes('<svg') && !dataUrl.includes('<?xml')) {
        //     console.log('The file does not appear to be a valid SVG.');
        //     return;
        //   }
          
          // Create file object with metadata
          const newFile = {
            name: selectedFile.name,
            type: selectedFile.type,
            size: selectedFile.size,
            lastModified: selectedFile.lastModified,
            uploadedAt: new Date().toISOString()
          };
          
          // Update state with new file
          const fileWithData = {...newFile, url: dataUrl};
          console.log("fileWithData: ", fileWithData);
          
          // Store file in sessionStorage
          try {
            //TODO: add hook function here
            //uploadSticker(fileWithData);
            // const str_file = JSON.stringify(fileWithData);

            // // getting current list
            // const all = localStorage.getItem('stickers');;
            // var cur_files = {}
            // if(all){
            //     cur_files = JSON.parse(all);
            // }

            // const new_files = JSON.stringify({...cur_files, str_file});

            // localStorage.setItem('stickers', new_files);
            // console.log("Finished setting new sticker in storage!");
            uploadSticker(fileWithData);
          } catch (err) {
            console.error('Error saving to localStorage:', err);
          }
          event.target.value = '';
        };
        
        reader.onerror = () => {
          console.log(`Error reading file: ${selectedFile.name}`)
        };
        
        // Read file as data URL
        reader.readAsDataURL(selectedFile);
       
      };
    
    return(
        <div>
            {/* from https://www.youtube.com/watch?v=2tKQSenVzqQ */}
            <label htmlFor="svgFileInput">
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