import type { Metadata } from "next";
import '../../public/css/global.css';
import Link from 'next/link';

import { Providers } from './contexts/providers';

import React from "react";
import StickerContainer from "../components/stickerContainer";

import styles from "../../public/css/homePage.module.css";

export const metadata: Metadata = {
  title: "Our Machines",
  description: "Augmenting the Gallery Spring 2025 Final Project",
};

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>){

  return (
    
    <html lang="en">
      <body>
      <Providers>             
            {/* ACTUAL PAGES COME IN HERE */}
            {children}

            {/* Stickers container and footer */}
            <StickerContainer />
            {/* <form name="designs" netlify data-netlify="true" method="POST" hidden>
              <input type="text" name="name" />
              <input type="file" name="dev_img" />
            </form> */}
            {/* title footer in lower right-hand corner */}
            <div className={styles.footerTitle}>
              <Link href="/" className={styles.link}>
                OUR_MACHINES
              </Link>
            </div>
        </Providers>
      </body>
     </html>
  );
}
