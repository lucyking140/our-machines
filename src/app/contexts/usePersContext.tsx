"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';

import { addAllFonts } from "../../components/font-picker/utils";

//TODO: Figure out browser vs server rendering stuff
// var root: any = null;
// if (typeof document !== 'undefined') {
//     root = document.documentElement;    
// }
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
    deleteAllStickers: () => { null },
    handleDragEnd: (id: string, event: any) => { null },
    fonts: []
});

export const PersProvider = ({ children }: any) => {

  // setting initial-initial features
  const [features, setFeatures] = useState(() => {
    // const bgcOrig = root?.style.getPropertyValue("--background-color") ? root?.style.getPropertyValue("--background-color") : "#fff9f5";
    // const fcOrig = root?.style.getPropertyValue("--font-color") ? root?.style.getPropertyValue("--font-color") : "#000000";
    // const fOrig = root?.style.getPropertyValue("--font-family") ? root?.style.getPropertyValue("--font-family") : "Helvetica, sans-serif";
    const bgcOrig = "#fff9f5";
    const fcOrig = "#000000";
    const fOrig = "Helvetica, sans-serif";
    return {
        //TODO: change back to finalize use of local storage
        backgroundColor: bgcOrig,
        fontColor: fcOrig,
        font: fOrig
        }
    });

    // moved the font stuff here so that all fonts load before the font picker is opened;
    // works when applying community creations
    const [fonts, setFonts] = useState([]);

    useEffect(() => {
      // loading all fonts
      const fontFunc = async () => {
        const fontNames = await addAllFonts();
        setFonts(fontNames);
      };
      fontFunc();

      if (typeof document !== "undefined") {
        const root = document.documentElement;
        const bgcOrig = root.style.getPropertyValue("--background-color") || "#fff9f5";
        const fcOrig = root.style.getPropertyValue("--font-color") || "#000000";
        const fOrig = root.style.getPropertyValue("--font-family") || "Helvetica, sans-serif";
    
        setFeatures({
          backgroundColor: bgcOrig,
          fontColor: fcOrig,
          font: fOrig,
        });
      }
    }, []);

    const [stickers, setStickers] = useState<Array<{
          width: number;
          height: number;
          x: number;
          y: number;
          src: string;
          page: string;
          id: string;
        }>>([]);
  
const changeFeature = (type: string, newFeature: any) => {
    console.log("new feature: ", newFeature, newFeature.hex);
    let nf;
    if (typeof newFeature === 'object' && newFeature.hex) {
        nf = newFeature.hex;
    } else {
        nf = newFeature;
    }
    //const nf = newFeature.hex ? newFeature.hex : newFeature;
    const root = document.documentElement;    
        switch(type){
            case "fontColor":
                console.log("setting font color");
                root?.style.setProperty(
                    "--font-color",
                    nf
                );
                setFeatures(prevFeatures => ({...prevFeatures, fontColor: nf}));
                break;
            case "backgroundColor":
                console.log("setting background color");
                root?.style.setProperty(
                    "--background-color",
                    nf
                );
                setFeatures(prevFeatures => ({...prevFeatures, backgroundColor: nf}));
                break;
            case "font":
                  root?.style.setProperty(
                    "--font-family",
                    newFeature
                );
                setFeatures(prevFeatures => ({...prevFeatures, font: newFeature}));
                break;
            };

    };

    // updates the current list of stickers, adding or removing one and changes location on drag

    const addSticker = ({src, page, width, height, x, y}: any) => {
        console.log("reaching add sticker!");

        const randInt = Math.random() * 100000;

        const newSticker = { 
          width,
          height,
          x,
          y,
          src,
          page,
          id: `${src}-${Date.now()}-${randInt}`
        };
        
        setStickers(prevImages => {
          const updatedImages = [...prevImages, newSticker];
          return updatedImages;
        });
        console.log("current sticker list: ", stickers);
      };

      // const upload_ui = <div className="input-group">
      //     <input id="file" type="file" onChange={handleFileChange} />
      //   </div>

    const deleteSticker = (id: string) => {
        setStickers(prevImages => {
            console.log("Image ID to be deleted: ", id);
            console.log("Images before filtering: ", prevImages);
            const updatedImages = prevImages.filter((image) => image.id !== id);
            console.log("Images after deletion:", updatedImages);
            return updatedImages;
          });
    };

    // removes all stickers, used when applying other submissions
    const deleteAllStickers = () =>{
      setStickers([]);
    }

    const handleDragEnd = (id: string, event: any) => {

          setStickers(prevImages => {
            const updatedImages = prevImages.map(image => {
                if (image.id === id) {
                    return {
                        ...image,
                        x: event.target.x(),
                        y: event.target.y(),
                        width: event.target.width(),
                        height: event.target.height()
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
      deleteAllStickers,
      handleDragEnd,
      fonts
    }}>
      {children}
    </PersContext.Provider>
  );
};

export const usePersContext = () => useContext(PersContext);