import { TypeAnimation } from 'react-type-animation';
import * as React from "react";
import Link from 'next/link';

// import { ReactComponent as MenuIcon} from "/icons/down.svg";

import { usePersContext } from '../app/contexts/usePersContext';

import styles from "../../public/css/title-page.module.css";

const MenuIcon = (props: any) =>(
  <div className={props.class}>
    <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512.000000 512.000000"
      preserveAspectRatio="xMidYMid meet">
          <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
          fill={props.fill} stroke="none">
              <path d="M702 3557 l-142 -142 998 -998 997 -997 1003 1002 1002 1003 -140
          140 -140 140 -860 -860 -860 -860 -858 858 -857 857 -143 -143z"/>
          </g>
    </svg>
  </div>
);

export default function TitlePage() {

  // for font color, used to set color of svg menu icon
  const {features, changeFeature} = usePersContext();   

  //dropdown for project info
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
              'OUR MACHINES',
              3000, // wait 1s before replacing "Mice" with "Hamsters"
              'MY DEVICES',
              3000,
              'THEIR COMPUTERS',
              3000,
              'YOUR TECHNOLOGY',
              3000
            ]}
            wrapper="div"
            speed={20}
            style={{width: 'inherit'}}
            repeat={Infinity}
            preRenderFirstString={true}
            cursor={false}
            className={styles.animatedtitle}
          />
        </div>
        <div className={styles.menu} onClick={handleOpen}>
          <div>
            {/* <img className={open ? styles.menuiconopen : styles.menuicon } src="/icons/down.svg"/> */}
            <MenuIcon fill={features.fontColor} class={open ? styles.menuiconopen : styles.menuicon }/>
          </div>
          {open ? (
                <ul className="proj-drop-menu">
                  <li className="menu-item">
                    <Link key={"archive"} href={`/catalogue`}> Archive </Link>
                  </li>
                  <li className="menu-item">
                    <Link key={"case-studies"} href={`/case_studies`}> Case Studies </Link>
                  </li>
                  <li className="menu-item">
                    <Link key={"gallery"} href={`/gallery`}> Gallery </Link>
                  </li>
                </ul>
              ) : null}

        </div>
      </div> 
    </div>
  );
}
