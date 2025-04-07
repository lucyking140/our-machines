import type { Metadata } from "next";
import '../../public/css/global.css';

import { Providers } from './contexts/providers';

import React from "react";
import StickerContainer from "../components/stickerContainer";

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
        </Providers>
      </body>
     </html>
  );
}
