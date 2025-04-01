"use client";

import type { Metadata } from "next";
import '../../public/css/global.css';

import { PersProvider, usePersContext } from "./contexts/usePersContext";

import React, { createRef, useState, useCallback, useEffect } from "react";
import { IndividualSticker } from "../components/individual-sticker";
import { stickersData } from "./stickers.data";
import TitlePage from "../components/title_page";
import PersonalizationMenu from "../components/personalization-menu";

import styles from "../../public/css/homePage.module.css";
import StickerContainer from "../components/stickerContainer";

// export const metadata: Metadata = {
//   title: "Our Machines",
//   description: "Augmenting the Gallery Spring 2025 Final Project",
// };

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>){

  // const [images, setImages] = useState<Array<{
  //     width: number;
  //     height: number;
  //     x: number;
  //     y: number;
  //     src: string;
  //     id: string;
  //   }>>([]);
  
    const [menu, setMenu] = useState(false);
  
    const handleOpenMenu = () => {
      setMenu(!menu);
    }
  
    // Log images whenever they change
    // useEffect(() => {
    //   console.log("Current images state:", images);
    // }, [images]);
  
    // Adds sticker to current list of things to be generated
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
    <PersProvider> 
    <html lang="en">
      <body>
       
          {/* <div style={{ position: 'relative', minHeight: '400px' }}> */}
            
            {/* ACTUAL PAGES COME IN HERE */}
            {children}

            {/* Stickers container and footer */}
            <StickerContainer />

      </body>
     </html>
     </PersProvider>
    // <html lang="en">
    //   <body>
    //   <PersProvider>
    //     {children}
    //   </PersProvider>
    //   </body>
    // </html>
  );
}
