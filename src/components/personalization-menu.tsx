import * as React from "react";
import { SketchPicker } from 'react-color';

import { usePersContext } from '../app/contexts/usePersContext';

import styles from "../../public/css/pers-menu.module.css";
 
export default function PersonalizationMenu({handleOpenStickers}: any) {

    const {features, changeFeature}  = usePersContext();

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
                    <SketchPicker color={ features.backgroundColor } onChange={ (e: any) => changeFeature("backgroundColor", e) } />
                </div>
            ) : null }
        </div>
        <div className={styles.hl}> </div>
        <div className={styles.menuitem}>
            {/* TODO */}
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
