'use client';

import { usePersContext } from '../app/contexts/usePersContext';

/*
set of all SVGs formatted with relavent props
*/

export const Back = ({fillColor}: {fillColor: string}) => {
    const {features}  = usePersContext();
    console.log("fill color in back: ", fillColor);
    return (
        <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512.000000 512.000000"
            preserveAspectRatio="xMidYMid meet">
                <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                fill={features.fontColor} stroke="none">
                    <path d="M1492 3628 l3 -213 805 -3 805 -2 -915 -915 -915 -915 153 -152 152
                    -153 915 915 915 915 2 -805 3 -805 213 -3 212 -2 0 1175 0 1175 -1175 0
                    -1175 0 2 -212z"/>
                </g>
        </svg>
    );
}

// SVG for the menu dropdown icon so can change fill color
export const MenuIcon = (props: any) =>(
    <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512.000000 512.000000"
      preserveAspectRatio="xMidYMid meet">
          <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
          fill={props.fill} stroke="none">
              <path d="M702 3557 l-142 -142 998 -998 997 -997 1003 1002 1002 1003 -140
          140 -140 140 -860 -860 -860 -860 -858 858 -857 857 -143 -143z"/>
          </g>
    </svg>
);

export const PlusIcon = (props: any) => {
    return (
        <svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.000000 512.000000"
         preserveAspectRatio="xMidYMid meet" width={props.size} height={props.size}>
            <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
            fill={props.fill} stroke="none">
                <path d="M2240 4000 l0 -1120 -1120 0 -1120 0 0 -320 0 -320 1120 0 1120 0 0
                -1120 0 -1120 320 0 320 0 0 1120 0 1120 1120 0 1120 0 0 320 0 320 -1120 0
                -1120 0 0 1120 0 1120 -320 0 -320 0 0 -1120z"/>
            </g>
        </svg>
    );
}
