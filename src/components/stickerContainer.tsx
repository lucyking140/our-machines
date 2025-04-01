import { usePersContext } from "../app/contexts/usePersContext";

import React, { createRef, useState, useCallback, useEffect } from "react";
import { IndividualSticker } from "../components/individual-sticker";
import { stickersData } from "../app/stickers.data";
import PersonalizationMenu from "../components/personalization-menu";

import styles from "../../public/css/homePage.module.css";

export default function StickerContainer(){
    
    const {features, stickers, changeFeature, addSticker, deleteSticker, handleDragEnd} = usePersContext();

    const [menu, setMenu] = useState(false);
    const [openStickers, setOpenStickers] = useState(false);
  
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

    useEffect(() => {
        console.log("reaching use effect");
        // finalElement = menuSelector();
    },[openStickers]);

    const stickerSelector = (<div className="personalize-menu">
            <div className="stickers-palette">
                <div onClick={() => handleOpenStickers()}>
                    Back
                </div>
                <h4 className="heading">Click/Tap to add sticker to photo!</h4>
                <div className="stickers-buttons">
                {stickersData.map((sticker, index) => (
                    <button
                    key={`palette-${index}`}
                    className="button"
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
                    </button>
                ))}
                
            </div>  
            </div>
        </div>)

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

    // gets current version of the personalization menu
    // var finalElement = menuSelector();

    

    return(
    <div>
        {/* overarching div that applies stickers anywhere on the page */}
        <div className={styles.stickersContainer}>
                {stickers.map((sticker, i) => (
                <IndividualSticker
                    key={`sticker-${i}-${sticker.src}`}
                    // key = {i}
                    image={sticker}
                    onDelete={() => {
                    console.log("Delete callback triggered for index", i);
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