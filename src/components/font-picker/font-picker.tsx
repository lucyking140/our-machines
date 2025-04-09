'use client';

import { useEffect, useState } from 'react';
import Select, { components, DropdownIndicatorProps } from 'react-select';

import { addAllFonts } from "./utils";

import { usePersContext } from '../../app/contexts/usePersContext';

import styles from "../../../public/css/font-picker.module.css";

export default function FontsList() {

  const [fonts, setFonts] = useState([]);
  const [loading, setLoading] = useState(true);

  const {features, changeFeature}  = usePersContext();

  const curFont = { value: features.font, label: features.font };

  // TODO: figure out why this works for async stuff
  useEffect(() => {
        const func = async () => {
            const fontNames = await addAllFonts();
            setFonts(fontNames);
        };
        func();
        setLoading(false); 
    }, []);

    if (loading) return <div>Loading fonts...</div>;

    // formats each individual option in the dropdown
    const formatOptionLabel = ({ value, label }: any) => (
        <div style={{ fontFamily: value }}>
            <div>{label}</div>
        </div>
    );

    const fontOptions = fonts.map((font: any) => ({value: font, label: font}));
    // const fontOptions = fonts.map((font: any, i: number) => (i < 200 ? {value: font, label: font} : {}));

    // from https://react-select.com/components#replaceable-components
    // const DropdownIndicator = (
    //     props: DropdownIndicatorProps<true>
    //   ) => {
    //     return (
    //       <components.DropdownIndicator {...props}>
    //         <EmojiIcon label="Emoji" primaryColor={colourOptions[2].color} />
    //       </components.DropdownIndicator>
    //     );
    //   };

    return (
    <div className={styles.pickerBox}>
        <Select 
            options={fontOptions} 
            defaultValue={curFont}
            formatOptionLabel={formatOptionLabel}
            styles={{
                control: (baseStyles, props) => ({
                  ...baseStyles,
                  width: '100%',
                  padding: 'none',
                  borderColor: features.fontColor || undefined,
                }),
                
              }}
            onChange={(choice) => changeFeature("font", choice?.value)} // from https://stackoverflow.com/questions/71094599/how-to-get-value-from-react-select-form
            // components={{ DropdownIndicator }}
        />
    </div>
    );
}