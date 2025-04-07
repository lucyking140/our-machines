'use client';

import { TypeAnimation } from 'react-type-animation';
import * as React from "react";
import Link from 'next/link';

import { usePersContext } from '../app/contexts/usePersContext';

import styles from "../../public/css/back-button.module.css";

export default function BackButton({destination, color} ) {

    const {features} = usePersContext(); 
    // TODO: do something like checking if browser is null to handle server stuff
    const fillColor = features.fontColor ? features.fontColor : "#000000";
    // const fillColor = color ? color: "#000000";

    return (
        <Link href={destination} className={styles.back}>
            Back
            <div className="icon">
                <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
               viewBox="0 0 512.000000 512.000000"
                preserveAspectRatio="xMidYMid meet">

                    <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                    fill={fillColor} stroke="none">
                        <path d="M1492 3628 l3 -213 805 -3 805 -2 -915 -915 -915 -915 153 -152 152
                        -153 915 915 915 915 2 -805 3 -805 213 -3 212 -2 0 1175 0 1175 -1175 0
                        -1175 0 2 -212z"/>
                    </g>
                </svg>
            </div>
        </Link>
    );
}
