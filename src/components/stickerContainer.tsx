'use client';

import { usePersContext } from "../app/contexts/usePersContext";
import { usePathname } from 'next/navigation'
import Switch from '@mui/material/Switch';
import { alpha, styled } from '@mui/material/styles';


import React, { useState, useRef } from "react";
import { IndividualSticker } from "../components/individual-sticker";
import { origStickers } from "../app/stickers.data";
import PersonalizationMenu from "../components/personalization-menu";

import {FileUploader } from "../components/fileUploader";
import CustomizePrompt from "../components/customizePrompt";

import {Back} from "./icons";

import styles from "../../public/css/homePage.module.css";

import { createTheme } from '@mui/material/styles';

/*
Container that includes sticker overlay over all pages, and personalization menu along the 
bottom of the page
*/

export default function StickerContainer(){
    // console.log("ORIG STICKERS: ", origStickers);
    
    // colors/features are handled directly in PersonalizationMenu
    const {features, stickers, addSticker, deleteSticker, handleDragEnd} = usePersContext();

    // for switch button color
    const theme = createTheme({
        palette: {
        primary: {
            main: features.fontColor,
        },
        secondary: {
            main: '#f44336',
        },
        },
    });

    const [menu, setMenu] = useState(false);
    const [openStickers, setOpenStickers] = useState(false);

    const [hide, setHide] = useState(false);

    // refs used to close menu on body click
    const menuRef = useRef<HTMLDivElement>(null);
    const menuButtonRef = useRef<HTMLDivElement>(null);

    // handle outside click to close menu
    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            // If the click is outside the menu AND outside the menu button
            if (menu && menuRef.current && !menuRef.current.contains(event.target as Node) &&
                menuButtonRef.current && !menuButtonRef.current.contains(event.target as Node)) {
                    setMenu(false);
                    setOpenStickers(false);
            }
        }
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menu, openStickers]);


    // used to get current pathname to assign stickers to pages
    //TODO: do i need to update this? seems like it happens automatically
    const pathname = usePathname()

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
        if(!hide && sticker.page == pathname){
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

    const handleSelectSticker = (sticker: any) => {

        console.log("adding sticker from click");
        console.log("window.scrollY: ", window.scrollY);
        addSticker({
            src: sticker.url,
            page: pathname,
            width: sticker.width,
            height: sticker.height,
            x: 100,
            y: window.scrollY + 100 // to ensure it's always placed within the viewport
        });
    }

    // all of the infra for drag and drop is based on dragging to relocate existing stickers in individual-sticker

    // used to track dif between cursor and top-left corner of sticker
    const dragOffRef = useRef({ x: 0, y: 0 });

    // reps the sticker object of the current sticker
    const curStickerRef = useRef<any>(null);
    // for the sticker preview on drag
    const previewSticker = useRef<HTMLDivElement>(null);

    // tells us if we've clicked or dragged to avoid double-application of sticker on click
    const isClicked = useRef(true);

    // Used to show preview or not 
    const [isDragging, setIsDragging] = useState(false);

    // for drag and drop sticker!!
    const handleSelectDown = (e: MouseEvent, sticker: any, i: number) => {

        isClicked.current = true;

        console.log("sticker: ", sticker);
        //setCurSticker(sticker);
        curStickerRef.current = sticker;

        console.log("reaching select down");
        const newStick = e.currentTarget as HTMLElement;

        // to avoid float back thing before changing position
        e.preventDefault();
        // to avoid other things on top being clicked/dragged
        e.stopPropagation();

        setIsDragging(true);

        // getting cur location of the element
        const coords = newStick?.getBoundingClientRect();
        
        // setting drag offset (top-left corner of image -> location of cursor)
        if(coords && coords.left && coords.right){
            dragOffRef.current = {
                x: e.clientX - coords.left,
                y: e.clientY - coords.top
            };
        } else {
            // ig just assume we're at the top-left of the image
            dragOffRef.current = {
                x: 0,
                y: 0
            };
        }

        document.addEventListener('mousemove', handleSelectMove);
        document.addEventListener('mouseup', handleSelectUp);
    }

    const handleSelectMove = (e: MouseEvent) => {

        // so if we click but don't move only the click behavior is activated
        isClicked.current = false;
        console.log("reaching select move");
        e.preventDefault();
        e.stopPropagation();

        const newX = e.clientX - dragOffRef.current.x;
        const newY = e.clientY - dragOffRef.current.y;

        if (previewSticker.current) {
            console.log("moving preview sticker!", previewSticker.current);
            previewSticker.current.style.left = `${newX}px`;
            previewSticker.current.style.top = `${newY}px`;
        }
    }

    const handleSelectUp = (e: MouseEvent) => {
        console.log("reaching select up");
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        
        // stops mousemove
        document.removeEventListener('mousemove', handleSelectMove);
        document.removeEventListener('mouseup', handleSelectUp);

        const newX = e.clientX - dragOffRef.current.x;
        const newY = e.clientY - dragOffRef.current.y;
        
        // finally actually adding the sticker after it is released!
        console.log("cur sticker: ", curStickerRef.current);
        if( !isClicked.current && curStickerRef.current){
            console.log("reaching cur sticker");
            console.log("window scroll: ", window.scrollY);
            addSticker({
                src: curStickerRef.current.url,
                page: pathname,
                width: curStickerRef.current.width,
                height: curStickerRef.current.height,
                x: newX,
                y: window.scrollY + newY // to account for ptentially not being at the top of the window
            });
        }

        // just resetting this to baseline
        isClicked.current = true;
    
        //setCurSticker(null);
    }
    
    //////////

    // for touch on mobile

     // for drag and drop sticker!!
     const handleSelectTouchDown = (e: React.TouchEvent, sticker: any, i: number) => {

        const touch = e.touches[0];

        isClicked.current = true;

        console.log("sticker: ", sticker);
        //setCurSticker(sticker);
        curStickerRef.current = sticker;

        console.log("reaching select touch down");
        const newStick = e.currentTarget as HTMLElement;

        // to avoid float back thing before changing position
        //e.preventDefault();
        // to avoid other things on top being clicked/dragged
        e.stopPropagation();

        setIsDragging(true);

        // getting cur location of the element
        const coords = newStick?.getBoundingClientRect();
        
        // setting drag offset (top-left corner of image -> location of cursor)
        if(coords && coords.left && coords.right){
            dragOffRef.current = {
                x: touch.clientX - coords.left,
                y: touch.clientY - coords.top
            };
        } else {
            // ig just assume we're at the top-left of the image
            dragOffRef.current = {
                x: 0,
                y: 0
            };
        }

        document.addEventListener('touchmove', handleSelectTouchMove, {passive: false});
        document.addEventListener('touchend', handleSelectTouchUp, {passive: false});
    }

    const handleSelectTouchMove = (e: React.TouchEvent) => {

        const touch = e.touches[0];

        // so if we click but don't move only the click behavior is activated
        isClicked.current = false;
        console.log("reaching select touch move");
        //();
        e.stopPropagation();

        const newX = touch.clientX - dragOffRef.current.x;
        const newY = touch.clientY - dragOffRef.current.y;

        if (previewSticker.current) {
            console.log("moving preview sticker!", previewSticker.current);
            previewSticker.current.style.left = `${newX}px`;
            previewSticker.current.style.top = `${newY}px`;
        }
    }

    const handleSelectTouchUp = (e: React.TouchEvent) => {

        const touch = e.changedTouches[0];

        console.log("reaching select touch up");
        //e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        
        // stops mousemove
        document.removeEventListener('touchmove', handleSelectTouchMove);
        document.removeEventListener('touchend', handleSelectTouchUp);

        const newX = touch.clientX - dragOffRef.current.x;
        const newY = touch.clientY - dragOffRef.current.y;
        
        // finally actually adding the sticker after it is released!
        console.log("cur sticker: ", curStickerRef.current);
        if( !isClicked.current && curStickerRef.current){
            console.log("reaching cur sticker");
            addSticker({
                src: curStickerRef.current.url,
                page: pathname,
                width: curStickerRef.current.width,
                height: curStickerRef.current.height,
                x: newX,
                y: window.scrollY + newY
            });
        }

        // just resetting this to baseline
        isClicked.current = true;
    }    

    //////////

    const handleHide = () => {
        setHide(!hide);
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
            //console.log("LIST OF STICKERS: ", Array(stickersData));
        }

        updateStickers(); //setting initial conditions
        
        window.addEventListener('stickers-updated', updateStickers);

        return () => {
            window.removeEventListener('stickers-updated', updateStickers);
        };
    }, []);

    // uploads sticker to localStorage (passed into FileUploader)
    const uploadSticker = (fileInfo: any) => {
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
        const fullFile = {...fileInfo, alt: fileInfo.name, width: 100}; //height: 100 CUTTING THIS OUT to try and get proportions right


        //const new_files = JSON.stringify({...cur_files, str_file});
        // unshift instead of push to add it to the beginning of the list --> better ui
        cur_files.unshift(fullFile);
        console.log("cur files after loading most recent sticker: ", cur_files);

        // common error -- certain encoded images are too large for char limit in localStorage
        try{
            localStorage.setItem('stickers', JSON.stringify(cur_files));
        } catch{
            alert("It looks like that image is too large! Please compress it or submit a smaller image.");
        }
        
        // triggering useEffect in sticker component
        window.dispatchEvent(new Event('stickers-updated'));

        console.log("Finished setting new sticker in storage!");
    }

    // actual display of how users can select stickers
    const stickerSelector = stickersData ? (<div className="personalize-menu" id="menu-deep">
            <div className={styles.stickersPalette}>
                <div className={styles.stickerOptionsPanel}>
                    <div className={styles.stickerOptions}>
                        <div onClick={() => handleOpenStickers()} style={{width: '35px', transform: 'rotate(270deg)', cursor: 'pointer'}}>
                            <Back fillColor={features.fontColor}/>
                        </div>
                        {/* <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '30%'}}> */}
                            
                        <div style={{width: '35px', cursor: 'pointer'}}>
                            <FileUploader onUpload={uploadSticker}/>
                        </div>
                        
                    </div>
                    {/* <div style={{width: '98%', fontSize: '0.7rem', fontStyle: 'italic', textAlign: 'right'}}>
                            SVGs only!
                        </div> */}
                    <div className={styles.stickerOptions} onClick={() => handleHide()}>
                        <div style={{textAlign: 'center'}}> Hide All </div>
                        {/* <MySwitch /> */}
                        <Switch color='primary' />
                    </div>
                </div>
                
                <div className={styles.stickerButtons}>
                    {Array(stickersData)[0].map((sticker, index) => {
                        return (
                        <div
                        key={`palette-${index}`}
                        //ref={stickerRef}
                        id={`sticker-${index}`}
                        className={styles.stickerButton}
                        onClick={() => {handleSelectSticker(sticker)}}
                        onMouseDown={(e) => {handleSelectDown(e, sticker, index)}}
                        onTouchStart={(e) => {handleSelectTouchDown(e, sticker, index)}}
                        //onMouseMove = {(e) => {handleSelectMove(e, sticker)}}
                        //onMouseUp = {(e) => {handleSelectUp(e, sticker)}}
                        style={{touchAction: 'none'}}
                        >
                            <img 
                                alt={sticker.alt} 
                                src={sticker.url} 
                                width={sticker.width} 
                                // height={sticker.height} 
                                style={{zIndex: '10000000'}}
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
    <div className={styles.allContainer}>
        {/* preview if on drag */}
        {isDragging && (
        <div ref={previewSticker} className={styles.stickerButton} style={{ position: 'fixed' }}>
            {/* height={curStickerRef.current?.height} */}
            <img src={curStickerRef.current?.url} width={curStickerRef.current?.width}  />
        </div>
        )}


        {/* overarching div that applies stickers anywhere on the page */}
        <div className={styles.stickersContainer}>
                {stickers.map((sticker, i) => (
                    checkSticker(sticker)
                ))}
        </div>

        {/* Personalization menu, with a feature selection page, a sticker selection page, and a closed version */}
        <div className={styles.personalizemenubox} id="menu">

            <div ref={menuRef}>
                {menuSelector()}
            </div>
            
            <div className={styles.personalizemenubutton} onClick={handleOpenMenu} id="menu-button" ref={menuButtonRef} >
                Customize Page
            </div>
        </div>
        <CustomizePrompt onClose={() => {console.log("close")}} />
    </div>
    );
}