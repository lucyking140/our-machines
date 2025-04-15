'use client';

import { usePersContext } from "../app/contexts/usePersContext";
import { usePathname } from 'next/navigation'

import React, { useState } from "react";
import { IndividualSticker } from "../components/individual-sticker";
import { origStickers } from "../app/stickers.data";
import PersonalizationMenu from "../components/personalization-menu";

import {FileUploader } from "../components/fileUploader";

import {Back} from "./icons";

import styles from "../../public/css/homePage.module.css";

/*
Container that includes sticker overlay over all pages, and personalization menu along the 
bottom of the page
*/

export default function StickerContainer(){
    
    // colors/features are handled directly in PersonalizationMenu
    const {features, stickers, addSticker, deleteSticker, handleDragEnd} = usePersContext();

    const [menu, setMenu] = useState(false);
    const [openStickers, setOpenStickers] = useState(false);

    // used to get current pathname to assign stickers to pages
    //TODO: do i need to update this? seems like it happens automatically
    const pathname = usePathname()

    ///////

    // from https://stackoverflow.com/questions/33657212/javascript-click-anywhere-in-body-except-the-one-element-inside-it

    // if (typeof document !== 'undefined') {
    //     var body = document.body; //document.getElementById('all');
    //     var except = document.getElementById('menu-deep');
    //     // pers menu cover (covers entire page)
    //     var cover = document.getElementsByClassName('pers-menu_cover__IYxXi')[0];
    //     var menu_button = document.getElementById('menu-button');

    //     // if(menu_button){
    //     //     menu_button.addEventListener("click", function (ev) {
    //     //         console.log("reaching menu button click!");
    //     //         handleOpenMenu();
    //     //         ev.stopPropagation();
    //     //     }, false);
    //     // }
        
    //     if(body && except){
    //         console.log("body and except");
    //         except.addEventListener("click", function (ev) {
    //             console.log("raeching menu click!");
    //             ev.stopPropagation(); //this is important! If removed, you'll get both alerts
    //         }, false);
    
    //         body.addEventListener("click", function () {
    //             console.log("reaching body click!");
    //             setMenu(false);
    //         }, false);

    //         if(cover){
    //             cover.addEventListener("click", function (ev) {
    //                 console.log("reaching cover click!");
    //                 setMenu(false);
    //                 ev.stopPropagation();
    //             }, false);
    //         }
    //     }
       
    // }
    ////////
  
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

    // checking if a sticker belongs on a given page
    const checkSticker = (sticker: any) => {
        if(sticker.page == pathname){
            return (
                <IndividualSticker
                    key={sticker.id}
                    image={sticker}
                    onDelete={() => {
                    // console.log("Delete callback triggered for index", i);
                    deleteSticker(sticker.id);
                    }}
                    onDragEnd={(event: any) => handleDragEnd(sticker.id, event)}
                />
            );
        } else {
            return null;
        }
    }

    // effect that refreshes stickersData when localStorage changes
    const [stickersData, setStickersData] = useState<any>(origStickers);
    
    React.useEffect(() => {
        const updateStickers = () => {
            const curStickers = localStorage.getItem("stickers");
            // need to set first batch of stickers
            if(!curStickers){
                localStorage.setItem("stickers", JSON.stringify(origStickers));
                setStickersData(origStickers);
            } else {
                console.log("current stickers: ", curStickers);
                setStickersData(JSON.parse(curStickers));
            }
            // console.log("LIST OF STICKERS: ", Array(stickersData));
        }

        updateStickers(); //setting initial conditions
        
        window.addEventListener('stickers-updated', updateStickers);

        return () => {
            window.removeEventListener('stickers-updated', updateStickers);
        };
    }, []);

    

    // actual display of how users can select stickers
    const stickerSelector = stickersData ? (<div className="personalize-menu" id="menu-deep">
            <div className={styles.stickersPalette}>
                <div className={styles.stickerOptions}>
                    <div onClick={() => handleOpenStickers()} style={{width: '35px', transform: 'rotate(270deg)', cursor: 'pointer'}}>
                        <Back fillColor={features.fontColor}/>
                    </div>
                    <div style={{width: '35px'}}>
                        <FileUploader />
                    </div>
                </div>
                
                <div className={styles.stickerButtons}>
                    {Array(stickersData)[0].map((sticker, index) => {
                        return (
                        <div
                        key={`palette-${index}`}
                        className={styles.stickerButton}
                        onClick={() => {
                            console.log("Adding new sticker");
                            console.log("current pathname in add sticker: ", pathname);
                            addSticker({
                                src: sticker.url,
                                page: pathname,
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
                       
                        )})}
                
            </div>  
            </div>
        </div>) : null;

    // shows either regular personalization menu OR sticker page
    function menuSelector(){
        if(menu){ // the menu is opened
            if(openStickers){
                return stickerSelector;
            } else {
                return <div id="menu-deep"> <PersonalizationMenu handleOpenStickers = {handleOpenStickers} /> </div>;
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
                    checkSticker(sticker)
                ))}
        </div>

        {/* Personalization menu, with a feature selection page, a sticker selection page, and a closed version */}
        <div className={styles.personalizemenubox} id="menu">

            {menuSelector()}
            
            <div className={styles.personalizemenubutton} onClick={handleOpenMenu} id="menu-button" >
                Add Personalization
            </div>
        </div>
    </div>
    );
}