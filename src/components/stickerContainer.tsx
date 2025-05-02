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
    // from https://mui.com/material-ui/react-switch/
    // const MySwitch = styled(Switch)(({ theme }) => ({
    //     '& .MuiSwitch-switchBase.Mui-checked': {
    //         color: theme.palette.primary,
    //     '&:hover': {
    //         backgroundColor: theme.palette.primary,
    //     },
    //     },
    //     '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    //         backgroundColor: theme.palette.primary,
    //     },
    // }));

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
        addSticker({
            src: sticker.url,
            page: pathname,
            width: sticker.width,
            height: sticker.height,
            x: 100,
            y: 100
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
            addSticker({
                src: curStickerRef.current.url,
                page: pathname,
                width: curStickerRef.current.width,
                height: curStickerRef.current.height,
                x: newX,
                y: newY
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
        e.preventDefault();
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

        document.addEventListener('touchmove', handleSelectTouchMove, {passive: 'false'});
        document.addEventListener('touchend', handleSelectTouchUp, {passive: 'false'});
    }

    const handleSelectTouchMove = (e: React.TouchEvent) => {

        const touch = e.touches[0];

        // so if we click but don't move only the click behavior is activated
        isClicked.current = false;
        console.log("reaching select touch move");
        e.preventDefault();
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
        e.preventDefault();
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
                y: newY
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
                <div className={styles.stickerOptionsPanel}>
                    <div className={styles.stickerOptions}>
                        <div onClick={() => handleOpenStickers()} style={{width: '35px', transform: 'rotate(270deg)', cursor: 'pointer'}}>
                            <Back fillColor={features.fontColor}/>
                        </div>
                        <div style={{width: '35px', cursor: 'pointer'}}>
                            <FileUploader />
                        </div>
                    </div>
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
    <div className={styles.allContainer}>
        {/* preview if on drag */}
        {isDragging && (
        <div ref={previewSticker} className={styles.stickerButton} style={{ position: 'absolute' }}>
            <img src={curStickerRef.current?.url} width={curStickerRef.current?.width} height={curStickerRef.current?.height} />
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
        <CustomizePrompt onClose={() => {console.log("closing")}} />
    </div>
    );
}