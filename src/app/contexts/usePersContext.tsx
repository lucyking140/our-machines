"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';

//TODO: Figure out browser vs server rendering stuff
var root: any = null;
if (typeof document !== 'undefined') {
    root = document.documentElement;    
}
const PersContext = createContext({
    features: {backgroundColor: "" as string, fontColor: "" as string, font: "" as string},
    stickers: [{
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        src: "",
        page: "",
        id: ""
      }],
    changeFeature: (type: string, newFeature: any) => { null },
    addSticker: ({src, page, width, height, x, y}: any) => {null },
    uploadSticker: ({src}: {src: string}) => { null},
    deleteSticker: (id: string) => { null },
    handleDragEnd: (id: string, event: any) => { null }
});

export const PersProvider = ({ children }: any) => {
  
  const [features, setFeatures] = useState(() => {
    const bgcOrig = root?.style.getPropertyValue("--background-color") ? root?.style.getPropertyValue("--background-color") : "#fff9f5";
    const fcOrig = root?.style.getPropertyValue("--font-color") ? root?.style.getPropertyValue("--font-color") : "#000000";
    const fOrig = root?.style.getPropertyValue("--font-family") ? root?.style.getPropertyValue("--font-family") : "Helvetica, sans-serif";
    return {
      
        //TODO: change back to finalize use of local storage
        backgroundColor: bgcOrig,
        fontColor: fcOrig,
        font: fOrig
        }
    });

    const [stickers, setStickers] = useState<Array<{
          width: number;
          height: number;
          x: number;
          y: number;
          src: string;
          page: string;
          id: string;
        }>>([]);
  
  // toggling likes so there is an available unlike feature
const changeFeature = (type: string, newFeature: any) => {
    const root = document.documentElement;    
        switch(type){
            case "fontColor":
                console.log("setting font color");
                root?.style.setProperty(
                    "--font-color",
                    newFeature.hex
                );
                setFeatures({...features, fontColor: newFeature.hex });
                break;
            case "backgroundColor":
                console.log("setting background color");
                root?.style.setProperty(
                    "--background-color",
                    newFeature.hex
                );
                setFeatures({...features, backgroundColor: newFeature.hex });
                break;
            case "font":
                  root?.style.setProperty(
                    "--font-family",
                    newFeature
                );
                setFeatures({...features, font: newFeature }); //TODO: figure out format for this -- is it a string??
                break;
            };

    };

    // updates the current list of stickers, adding or removing one and changes location on drag

    const addSticker = ({src, page, width, height, x, y}: any) => {
        console.log("reaching add sticker!");

        const newSticker = { 
          width,
          height,
          x,
          y,
          src,
          page,
          id: `${src}-${Date.now()}`
        };
        
        setStickers(prevImages => {
          const updatedImages = [...prevImages, newSticker];
          return updatedImages;
        });
        console.log("current sticker list: ", stickers);
      };

      const [file, setFile] = useState<File | null>(null);

      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
          setFile(e.target.files[0]);
        }
      };

      const handleUpload = async () => {
        if (file) {
          console.log('Uploading file...');
      
          const formData = new FormData();
          formData.append('file', file);
      
          try {
            // You can write the URL of your server or any other endpoint used for file upload
            const result = await fetch('https://httpbin.org/post', {
              method: 'POST',
              body: formData,
            });
      
            const data = await result.json();
      
            console.log(data);
          } catch (error) {
            console.error(error);
          }
        }
      };

      // const upload_ui = <div className="input-group">
      //     <input id="file" type="file" onChange={handleFileChange} />
      //   </div>

    const deleteSticker = (id: string) => {
        setStickers(prevImages => {
            // Create a new array without the deleted item
            console.log("Image ID to be deleted: ", id);
            console.log("Images before filtering: ", prevImages);
            const updatedImages = prevImages.filter((image) => image.id !== id);
            console.log("Images after deletion:", updatedImages);
            return updatedImages;
          });
    };

    const handleDragEnd = (id: string, event: any) => {

          setStickers(prevImages => {
            const updatedImages = prevImages.map(image => {
                if (image.id === id) {
                    return {
                        ...image,
                        x: event.target.x(),
                        y: event.target.y()
                    };
                }
                return image;
            });
            return updatedImages;
        });
          
          console.log("Setting new location of image: ", id);
    }
  
  return (
    <PersContext.Provider value={{ 
      features,
      // defaultFeatures,
      stickers,
      changeFeature,
      addSticker,
      deleteSticker,
      handleDragEnd
    }}>
      {children}
    </PersContext.Provider>
  );
};

export const usePersContext = () => useContext(PersContext);