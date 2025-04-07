'use client';

import { usePersContext } from "../app/contexts/usePersContext";

import React, { useState } from "react";
import { IndividualSticker } from "../components/individual-sticker";
import { stickersData } from "../app/stickers.data";
import PersonalizationMenu from "../components/personalization-menu";

import styles from "../../public/css/homePage.module.css";

/*
Container that includes sticker overlay over all pages, and personalization menu along the 
bottom of the page
*/

export default function StickerContainer(){
    
    // colors/features are handled directly in PersonalizationMenu
    const {stickers, addSticker, deleteSticker, handleDragEnd} = usePersContext();

    const [menu, setMenu] = useState(false);
    const [openStickers, setOpenStickers] = useState(false);
  
    // both handle functions are used to open the menu and stickers page, respectively
    const handleOpenMenu = () => {
        // in the case we're turning the menu off completely, i want to reopen it with the main page, not the sticker selector
        if(menu){
            setOpenStickers(false);
        }
        setMenu(!menu);
    }

    const handleOpenStickers = () => {
        console.log("Opening stickers!");
        setOpenStickers(!openStickers);
    }

    // actual display of how users can select stickers
    const stickerSelector = (<div className="personalize-menu">
            <div className="stickers-palette">
                <div onClick={() => handleOpenStickers()}>
                    Back
                </div>
                <div className="sticker-buttons">
                    {stickersData.map((sticker, index) => (
                        <div
                        key={`palette-${index}`}
                        className="sticker-button"
                        onClick={() => {
                            console.log("Adding new sticker");
                            addSticker({
                            src: sticker.url,
                            page: "test",
                            width: sticker.width,
                            height: sticker.height,
                            x: 100,
                            y: 100
                            });
                            console.log("done adding sticker!");
                        }}
                        >
                            <img 
                                alt={sticker.alt} 
                                src={sticker.url} 
                                width={sticker.width} 
                                height={sticker.height} 
                            />
                        </div>
                    ))}
                
            </div>  
            </div>
        </div>)

    // shows either regular personalization menu OR sticker page
    function menuSelector(){
        if(menu){ // the menu is opened
            if(openStickers){
                return stickerSelector;
            } else {
                return <PersonalizationMenu handleOpenStickers = {handleOpenStickers} />;
            }
        } else {
            return null;
        }
    }

    return(
    <div>
        {/* overarching div that applies stickers anywhere on the page */}
        <div className={styles.stickersContainer}>
                {stickers.map((sticker, i) => (
                <IndividualSticker
                    key={sticker.id}
                    image={sticker}
                    onDelete={() => {
                    // console.log("Delete callback triggered for index", i);
                    deleteSticker(sticker.id);
                    }}
                    onDragEnd={(event: any) => handleDragEnd(sticker.id, event)}
                />
                ))}
        </div>

        {/* Personalization menu, with a feature selection page, a sticker selection page, and a closed version */}
        <div className={styles.personalizemenubox}>

                {menuSelector()}
                
                <div className={styles.personalizemenubutton} onClick={handleOpenMenu}>
                    Add Personalization
                </div>
            </div>
        </div>
    );
}