'use client';

import { TypeAnimation } from 'react-type-animation';
import * as React from "react";
import Link from 'next/link';

import { usePersContext } from '../app/contexts/usePersContext';
import { Back } from "./icons";

import styles from "../../public/css/back-button.module.css";

export default function BackButton({destination}: {destination: string}) {

    console.log("reaching back button");

    const {features} = usePersContext(); 
    const fillColor = features.fontColor ? features.fontColor : "#000000";

    return (
            <Link href={destination} className={styles.back}>
                <div className={styles.icon}>
                    <Back fillColor={fillColor} />
                </div>
            </Link>
    );
}
