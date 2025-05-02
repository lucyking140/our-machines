'use client';

import { useState, useEffect } from 'react';

import styles from "../../public/css/customizePrompt.module.css";

import {PointerArrow, PlusIcon} from "../components/icons";

import { usePersContext } from '../app/contexts/usePersContext';


export default function CustomizePrompt({onClose}: {onClose: () => void}) {

    console.log('reaching cp');

    const {features} = usePersContext();
  
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const hasSeenPrompt = localStorage.getItem('seenPrompt');

            console.log("hasSeenPrompt: ", hasSeenPrompt);
            
            if (hasSeenPrompt === null) {
                // If first visit, show the prompt and set the flag
                setIsVisible(true);
                localStorage.setItem('seenPrompt', 'true');
                console.log("setting visible!");
            } else {
                console.log("has already seen prompt");
            }

            //auto-close after 2 seconds
            const timer = setTimeout(() => {
                setIsVisible(false);
                if (onClose) onClose();
            }, 2000);

            return () => clearTimeout(timer);
        } else {
            console.log("win not defined");
        }

    }, []);

    const handleClose = () => {
        setIsVisible(false);
        if (onClose) onClose();
    };

    if (!isVisible) return null;

    return (
    <div className={styles.allContainer} onClick={() => {handleClose()}}>
        <div className={styles.content}>
            <div className={styles.close} onClick={onClose}>
                <PlusIcon fill={features.fontColor} size='15px' />
            </div>
            Customize this site and add stickers of your choice here!
            
        </div>
        <div className={styles.icon}>
            <PointerArrow className={styles.icon} fill={features.fontColor} width='70px' height='50px'/>
        </div>
        
    </div>
    );
};