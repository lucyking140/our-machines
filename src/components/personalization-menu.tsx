import * as React from "react";
import Link from 'next/link';
import { BlockPicker,SketchPicker } from 'react-color';

import { usePersContext } from '../app/contexts/usePersContext';


 import styles from "../../public/css/pers-menu.module.css";
 
 export default function PersonalizationMenu({handleOpenStickers}: any) {
    // console.log("COLOR: ", colors.primary);
    const root = document.documentElement;    
    // const [features, setFeatures] = React.useState({
    //     backgroundColor: root?.style.getPropertyValue("--background-color"),
    //     // idk for some reason this isn't always initialized properly so this fixes it
    //     fontColor: root?.style.getPropertyValue("--font-color") ? root?.style.getPropertyValue("--font-color") : "#000000",
    //     font: root?.style.getPropertyValue("--font-family") 
    // });

    const {features, changeFeature}  = usePersContext();

    // same here, idk why this helps but it helps set font/bg color in the palette initially
    // React.useEffect(() => {
    //     setFeatures(features);
    // }, [])

    // console.log("Root: ", root);
    // console.log("Color: ", root?.style.getPropertyValue("--font-color"));
    // console.log("Font color on init: ", features.fontColor);

    const [pickerOpen, setPickerOpen] = React.useState({
        backgroundColor: false,
        fontColor: false,
        font: false
    });

    const togglePickerOpen = (type: string) => {
        switch(type){
            case "fontColor":
                setPickerOpen({...pickerOpen, fontColor: !pickerOpen.fontColor });
                break;
            case "backgroundColor":
                setPickerOpen({...pickerOpen, backgroundColor: !pickerOpen.backgroundColor });
                break;       
            case "font":
                setPickerOpen({...pickerOpen, font: !pickerOpen.font }); //TODO: figure out format for this -- is it a string??
                break;
        }
    };

    // const handleFeatureChange = (type: string, newFeature: any) => {
    //     const root = document.documentElement;    
    //     switch(type){
    //         case "fontColor":
    //             console.log("setting font color");
    //             root?.style.setProperty(
    //                 "--font-color",
    //                 newFeature.hex
    //             );
    //             setFeatures({...features, fontColor: newFeature.hex });
    //             break;
    //         case "backgroundColor":
    //             console.log("setting background color");
    //             root?.style.setProperty(
    //                 "--background-color",
    //                 newFeature.hex
    //             );
    //             setFeatures({...features, backgroundColor: newFeature.hex });
    //             break;
    //         case "font":
    //             setFeatures({...features, font: newFeature }); //TODO: figure out format for this -- is it a string??
    //             break;
    //     } 
    // };

  return (
    <div className={styles.personalizemenu}> 
        <div className={styles.menuitem}>
            <div>
                Background Color
            </div>
            {/* show entire picker if picker is open, else show current swatch */}
            <div className={ styles.swatch } style={{ backgroundColor: features.backgroundColor }} onClick={ () => togglePickerOpen("backgroundColor") }> </div>
            
            { pickerOpen.backgroundColor ? (
                <div className={ styles.popover }>
                    <div className={ styles.cover } onClick={ () => togglePickerOpen("backgroundColor") }/>
                    {/* <SketchPicker color={ features.backgroundColor } onChange={ (e: any) => handleFeatureChange("backgroundColor", e) } /> */}
                    <SketchPicker color={ features.backgroundColor } onChange={ (e: any) => changeFeature("backgroundColor", e) } />
                </div>
            ) : null }
        </div>
        <div className={styles.hl}> </div>
        <div className={styles.menuitem}>
            Font
        </div>
        <div className={styles.hl}> </div>
        <div className={styles.menuitem}>
            <div>
                Accent Color
            </div>
            {/* show entire picker if picker is open, else show current swatch */}
            <div className={ styles.swatch } style={{ backgroundColor: features.fontColor }} onClick={ () => togglePickerOpen("fontColor") }> </div>
            
            { pickerOpen.fontColor ? (
                <div className={ styles.popover }>
                    <div className={ styles.cover } onClick={ () => togglePickerOpen("fontColor") }/>
                    {/* <SketchPicker color={ features.fontColor } onChange = {(e: any) => handleFeatureChange("fontColor", e)} /> */}
                    <SketchPicker color={ features.fontColor } onChange = {(e: any) => changeFeature("fontColor", e)} />
                </div>
            ) : null }
        </div>
        <div className={styles.hl}> </div>
        <div className={styles.menuitem} onClick={handleOpenStickers}>
            Add Stickers
        </div>
        <div className={styles.hl}> </div>
    </div>
  );
}
