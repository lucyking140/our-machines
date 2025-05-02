'use client';

import { TypeAnimation } from 'react-type-animation';
import * as React from "react";
import Link from 'next/link';

import { usePersContext } from '../app/contexts/usePersContext';
import {MenuIcon} from "../components/icons";

import styles from "../../public/css/title-page.module.css";

export default function Home() {

  // for font color, used to set color of svg menu icon
  const {features} = usePersContext();   

  //open/close dropdown for project info
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    console.log("reaching open");
    setOpen(!open);
  };

  return (
    <div className={styles.homecontainer}> 
      <div className={styles.titlebox}>
        <div className={styles.title}>
          <TypeAnimation
            sequence={[
              // Same substring at the start will only be typed out once, initially
              'OUR_MACHINES',
              3000, // wait 1s before replacing "Mice" with "Hamsters"
              'MY_DEVICES',
              3000,
              'THEIR_COMPUTERS',
              3000,
              'YOUR_TECHNOLOGY',
              3000
            ]}
            wrapper="div"
            speed={3}
            //style={{width: 'inherit', wordBreak: 'break-all', hyphens: 'auto'}}
            repeat={Infinity}
            preRenderFirstString={true}
            cursor={false}
            className={styles.animatedtitle}
          />
        </div>
        {/* subtitle  */}
        <div className={styles.subtitle}>
            {/* How do we express ourselves at the border between physical and digital realms, in our digital spaces and devices we use to access them? */}
            {/* Personal identity, expressed at the bridge between our digital spaces and devices we use to access them */}
            Exploring our reflections in our digital spaces and the devices we use to access them
        </div>
        {/* Menu with links to other pages */}
        <div className={styles.menu} onClick={handleOpen}>
          <div className={open ? styles.menuiconopen : styles.menuicon }>
            <MenuIcon fill={features.fontColor} />
          </div>
          {open ? (
                <div className={styles.projDropMenu}>
                  
                  <div className={styles.menuItem}>
                    <Link key={"intro"}
                    href={{
                      pathname: '/intro',
                    }} > <div className={styles.menuHeader}>EDITOR'S NOTE</div> digital manifestations of the physical ; physical manifestations of the digital </Link>
                  </div>
                  <div className={styles.menuItem}>
                    <Link key={"case-studies"} href={`/case-studies`}> <div className={styles.menuHeader}>STATEMENT PIECES</div> a showroom for particularly descriptive devices </Link>
                  </div>
                  <div className={styles.menuItem}>
                    <Link key={"gallery"} href={`/gallery`}> <div className={styles.menuHeader}>OTHER PEOPLES’ THINGS</div> an exposition of objects that have influenced others and an opportunity submit your own </Link>
                  </div>
                </div>
              ) : null}

        </div>
      </div> 
    </div>
  );
}
