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

export const UploadIcon = (props: any) => {
    //style="enable-background:new 0 0 725.334 725.334;"
    //viewBox="0 0 725.334 725.334"
    //x="0px" y="0px"
    return(
        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" 
            width={props.size} height={props.size} fill={props.fill} viewBox="0 0 725.334 725.334" >
            <g>
                <g id="Out">
                    <g>
                        <path d="M249.333,181.333c9.384,0,17.884-3.808,24.049-9.973l55.284-55.284v371.258c0,18.768,15.209,34,34,34
                            c18.791,0,34-15.232,34-34V116.076l55.307,55.284c6.143,6.166,14.643,9.973,24.026,9.973c18.791,0,34-15.232,34-34
                            c0-9.384-3.808-17.884-9.95-24.049L386.717,9.951C380.551,3.808,372.051,0,362.667,0s-17.884,3.808-24.027,9.973L225.307,123.307
                            c-6.166,6.143-9.974,14.643-9.974,24.026C215.333,166.101,230.543,181.333,249.333,181.333z M623.334,226.667H498.667
                            c-18.791,0-34,15.232-34,34s15.209,34,34,34h102v362.667h-476V294.667h102c18.791,0,34-15.232,34-34s-15.209-34-34-34H102
                            c-25.001,0-45.333,20.354-45.333,45.333v408c0,24.979,20.332,45.334,45.333,45.334h521.333c25.001,0,45.333-20.355,45.333-45.334
                            V272C668.667,247.021,648.335,226.667,623.334,226.667z"/>
                    </g>
                </g>
            </g>
        </svg>
    )
}

export const PointerArrow = (props: any) => {

    return (
        // <svg xmlns="http://www.w3.org/2000/svg" 
        //     // shape-rendering="geometricPrecision" 
        //     // text-rendering="geometricPrecision" 
        //     // image-rendering="optimizeQuality" 
        //     // fill-rule="evenodd" 
        //     // clip-rule="evenodd" 
        //     viewBox="0 0 512 243.58"
            // width={props.size}
            // height={props.size}
            // fill={props.fill}
        // >
        //     {/* fill-rule="nonzero" */}
        //     <path  d="M373.57 0 512 120.75 371.53 243.58l-20.92-23.91 94.93-83L0 137.09v-31.75l445.55-.41-92.89-81.02z"/>
        // </svg>
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
            viewBox="0 0 40 16.5" width={props.width}
            // height={props.height}
            fill={props.fill}>
        <g>
            <polygon points="31,0 39.6,7.9 40,8.3 39.6,8.6 31,16.5 30.5,16 38.5,8.6 0,8.6 0,7.9 38.5,7.9 30.5,0.5 	"/>
        </g>
        </svg>

    );
}

export const ResizeArrow = (props: any) => {
    return(
        <svg fill={props.fill} height={props.size} width={props.size} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512.04 512.04">
        <g>
            <g>
                <path d="M508.933,248.353L402.267,141.687c-4.267-4.053-10.987-3.947-15.04,0.213c-3.947,4.16-3.947,10.667,0,14.827
                    l88.427,88.427H36.4l88.427-88.427c4.053-4.267,3.947-10.987-0.213-15.04c-4.16-3.947-10.667-3.947-14.827,0L3.12,248.353
                    c-4.16,4.16-4.16,10.88,0,15.04L109.787,370.06c4.267,4.053,10.987,3.947,15.04-0.213c3.947-4.16,3.947-10.667,0-14.827
                    L36.4,266.593h439.147L387.12,355.02c-4.267,4.053-4.373,10.88-0.213,15.04c4.053,4.267,10.88,4.373,15.04,0.213
                    c0.107-0.107,0.213-0.213,0.213-0.213l106.667-106.667C513.093,259.34,513.093,252.513,508.933,248.353z"/>
            </g>
        </g>
        </svg>
    );
}

export const CancelIcon = (props: any) => {
    return(
        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512.001 512.001" width={props.size} height={props.size} fill={props.fill}>
            <g>
                <g>
                    <path d="M284.286,256.002L506.143,34.144c7.811-7.811,7.811-20.475,0-28.285c-7.811-7.81-20.475-7.811-28.285,0L256,227.717
                        L34.143,5.859c-7.811-7.811-20.475-7.811-28.285,0c-7.81,7.811-7.811,20.475,0,28.285l221.857,221.857L5.858,477.859
                        c-7.811,7.811-7.811,20.475,0,28.285c3.905,3.905,9.024,5.857,14.143,5.857c5.119,0,10.237-1.952,14.143-5.857L256,284.287
                        l221.857,221.857c3.905,3.905,9.024,5.857,14.143,5.857s10.237-1.952,14.143-5.857c7.811-7.811,7.811-20.475,0-28.285
                        L284.286,256.002z"/>
                </g>
            </g>
        </svg>
    );
}

