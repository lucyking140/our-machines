'use client';

import React, { createRef, useState, useCallback, useEffect } from "react";
import { IndividualSticker } from "../components/individual-sticker";
import { stickersData } from "./stickers.data";
import TitlePage from "../components/title_page";
import PersonalizationMenu from "../components/personalization-menu";

import styles from "../../public/css/homePage.module.css";

export default function Home() {
  // const [images, setImages] = useState<Array<{
  //   width: number;
  //   height: number;
  //   x: number;
  //   y: number;
  //   src: string;
  // }>>([]);

  // const [menu, setMenu] = useState(false);

  // const handleOpenMenu = () => {
  //   setMenu(!menu);
  // }

  // // Log images whenever they change
  // useEffect(() => {
  //   console.log("Current images state:", images);
  // }, [images]);

  // // Adds sticker to current list of things to be generated
  // const addStickerToPanel = ({src, width, height, x, y}: any) => {
  //   const newSticker = { 
  //     width,
  //     height,
  //     x,
  //     y,
  //     src,
  //     id: `sticker-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` // Generate unique ID
  //   };
    
  //   setImages(prevImages => {
  //     const updatedImages = [...prevImages, newSticker];
  //     return updatedImages;
  //   });
  // };

  //   // Handle deletion of a sticker
  //   const handleDeleteSticker = (indexToDelete: number) => {
  //     console.log("Deleting sticker at index:", indexToDelete);
  //     console.log("Current images:", images);
      
  //     // Use a different approach to filter out the item
  //     // const newImages = images.filter((_, index) => index !== indexToDelete);
  //     // console.log("New images after deletion:", newImages);
      
  //     // Set the state directly
  //     // setImages(newImages);
  //     setImages(prevImages => {
  //       // Create a new array without the deleted item
  //       const updatedImages = prevImages.filter((_, index) => index !== indexToDelete);
  //       console.log("Images after deletion:", updatedImages);
  //       return updatedImages;
  //     });
  //   };

  //   // Handle drag end for updating position
  //   const handleDragEnd = (index: number, event: any) => {
  //     setImages(prevImages => {
  //       const updatedImages = [...prevImages];
  //       updatedImages[index] = {
  //         ...updatedImages[index],
  //         x: event.target.x(),
  //         y: event.target.y()
  //       };
  //       return updatedImages;
  //     });
  //     console.log("Setting new location");
  //   };

  return (
    <TitlePage />
    // <div style={{ position: 'relative', minHeight: '400px' }}>
      
    //   <TitlePage />
      
    //   {/* Stickers container */}
    //   <div className={styles.stickersContainer}>
    //     {images.map((image, i) => (
    //       <IndividualSticker
    //         key={`sticker-${i}-${image.src}`}
    //         // key = {i}
    //         image={image}
    //         onDelete={() => {
    //           console.log("Delete callback triggered for index", i);
    //           handleDeleteSticker(i);
    //         }}
    //         onDragEnd={(event: any) => handleDragEnd(i, event)}
    //       />
    //     ))}
    //   </div>

    //   {/* palette */}
    //   <div className={styles.personalizemenubox}>
        
    //     { menu ? ( 
    //       <PersonalizationMenu />
    //       //   <div className="personalize-menu">
    //       //     <div className="stickers-palette">
    //       //       <h4 className="heading">Click/Tap to add sticker to photo!</h4>
    //       //       <div className="stickers-buttons">
    //       //         {stickersData.map((sticker, index) => (
    //       //           <button
    //       //             key={`palette-${index}`}
    //       //             className="button"
    //       //             onClick={() => {
    //       //               console.log("Adding new sticker");
    //       //               addStickerToPanel({
    //       //                 src: sticker.url,
    //       //                 width: sticker.width,
    //       //                 height: sticker.height,
    //       //                 x: 100,
    //       //                 y: 100
    //       //               });
    //       //             }}
    //       //           >
    //       //             <img 
    //       //               alt={sticker.alt} 
    //       //               src={sticker.url} 
    //       //               width={sticker.width} 
    //       //               height={sticker.height} 
    //       //             />
    //       //           </button>
    //       //         ))}
    //       //       </div>
    //       //     </div>
    //       //   </div>
    //       ) : null }
    //       <div className={styles.personalizemenubutton} onClick={handleOpenMenu}>
    //         Add Personalization
    //       </div>
    //     </div>
    // </div>
  );
}