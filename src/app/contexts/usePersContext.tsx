"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';

//TODO: Figure out browser vs server rendering stuff
var root: any = null;
if (typeof document !== 'undefined') {
    root = document.documentElement;    
}
const PersContext = createContext({
    features: {backgroundColor: null as string | null, fontColor: null as string | null, font: null as string | null},
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
    deleteSticker: (id: string) => { null },
    handleDragEnd: (id: string, event: any) => { null }
});

export const PersProvider = ({ children }: any) => {
  
  const [features, setFeatures] = useState(() => {
    const bgcOrig = root?.style.getPropertyValue("--background-color") ? root?.style.getPropertyValue("--background-color") : "#fff9f5";
    const fcOrig = root?.style.getPropertyValue("--font-color") ? root?.style.getPropertyValue("--font-color") : "#000000";
    const fOrig = root?.style.getPropertyValue("--font-family") ? root?.style.getPropertyValue("--font-family") : "Helvetica, sans-serif";
    // Initialize from localStorage if available
    return {
        // backgroundColor: localStorage.getItem('backgroundColor') ? localStorage.getItem('backgroundColor') : bgcOrig,
        // fontColor: localStorage.getItem('fontColor') ? localStorage.getItem('fontColor') : fcOrig,
        // font: localStorage.getItem('font') ? localStorage.getItem('font') : fOrig

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
    
  
  // to preserve features
  // TODO: fix with implementation of local storage
//   useEffect(() => {
//     localStorage.setItem('backgroundColor', root?.style.getPropertyValue("--background-color"));
//     localStorage.setItem('fontColor', root?.style.getPropertyValue("--font-color"));
//     localStorage.setItem('font', root?.style.getPropertyValue("--font-family"));
//     // localStorage.setItem('stickers', stickers);
//   }, [features]);
  
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
          id: `sticker-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` // Generate unique ID
        };
        
        setStickers(prevImages => {
          const updatedImages = [...prevImages, newSticker];
          return updatedImages;
        });
      };

    const deleteSticker = (id: string) => {
        setStickers(prevImages => {
            // Create a new array without the deleted item
            const updatedImages = prevImages.filter((image) => image.id !== id);
            console.log("Images after deletion:", updatedImages);
            return updatedImages;
          });
    };

    const handleDragEnd = (id: string, event: any) => {
        setStickers(prevImages => {
            const allOtherImages = prevImages.filter((image) => image.id !== id);
            var changedImage = prevImages[0];
            changedImage = {
              ...changedImage,
              x: event.target.x(),
              y: event.target.y()
            };
            const updatedImages = [... allOtherImages, changedImage];
            return updatedImages;
          });
          console.log("Setting new location of image: ", id);
    }
  
  return (
    <PersContext.Provider value={{ 
      features,
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