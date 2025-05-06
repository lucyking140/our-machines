'use client'

import React, { useState, useEffect, useRef } from "react";
import { usePersContext } from "../app/contexts/usePersContext";

import { ResizeArrow, CancelIcon } from "./icons";

import styles from "../../public/css/homePage.module.css";


export const IndividualSticker = ({ image, onDelete, onDragEnd }: any) => {

    const {features} = usePersContext();

    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const [showResizeButton, setShowResizeButton] = useState(false);

    // used to track difference between cursor and top-left corner of sticker
    const dragOffRef = useRef({ x: 0, y: 0 });

    // actual HTML element of the sticker -- used to avoid rerendering on drag
    const stickerRef = useRef<HTMLDivElement>(null);

    // Used ONLY for UI (cursor icon and showing delete button)
    const [isDragging, setIsDragging] = useState(false);
    // actually used elsewhere
    const isDraggingRef = useRef(false);
    
    const [isResizing, setIsResizing] = useState(false);
    const isResizingRef = useRef(false);

    // Just used to get previous position of the cursor for change in x/y
    const pointerPositionRef = useRef({ x: 0, y: 0 });

    const [width, setWidth] = useState(image.width);

    // currently not using this for anything, but keep the infra updating it in case it's needed
    // not using it so height auto-sets to proportional to width
    const [height, setHeight] = useState(image.height);

    // showing buttons on hover
    const handleMouseEnter = () => {
        setShowDeleteButton(true);
        setShowResizeButton(true);
    };

    const handleMouseLeave = () => {
        if (!isDragging && !isResizing) {
            setTimeout(() => {
                setShowDeleteButton(false);
                setShowResizeButton(false);
            }, 1000);
        }
    };

    // DRAGGING FUNCTIONALITY
    const handlePointerDown = (e: React.PointerEvent) => {
        console.log("reaching drag down");
        // No drag if clicking the delete button
        if ((e.target as HTMLElement).closest('.delete-button')) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();
        
        // resize case
        if ((e.target as HTMLElement).closest('.resize-button')) {
            startResize(e);
            return;
        }

        // Otherwise initiate dragging
        startDrag(e);
    };

    const startDrag = (e: React.PointerEvent) => {
        //console.log("reaching start drag");

        setIsDragging(true);
        isDraggingRef.current = true;
        
        // offset between pointer and sticker corner
        dragOffRef.current = {
            x: e.clientX - image.x,
            y: e.clientY - image.y
        };
        
        document.addEventListener('pointermove', handlePointerMove);
        document.addEventListener('pointerup', handlePointerUp);
        document.addEventListener('pointercancel', handlePointerCancel);
    };

    const handlePointerMove = (e: PointerEvent) => {
        console.log("reaching pointer move");
        e.preventDefault();
        
        if (isResizingRef.current) {
            const deltaX = e.clientX - pointerPositionRef.current.x;
            const deltaY = e.clientY - pointerPositionRef.current.y;
            
            // min width just so it doesn't totally disappear
            const newW = Math.max(50, width + (deltaX));
            //const newH = Math.max(50, height + (deltaY));
            // resizing so that width and height always stay proportional!!
            const scalefactor = newW/width;
            // console.log("scale factor in resize: ", scalefactor);
            //const newH = Math.max(50, height * scalefactor);
            
            if (stickerRef.current) {
                const img = stickerRef.current.querySelector('img');
                if (img) {
                    img.style.width = `${newW}px`;
                    //img.style.height = `${newH}px`;
                }
            }
        } else if (isDraggingRef.current) {
            const newX = e.clientX - dragOffRef.current.x;
            const newY = e.clientY - dragOffRef.current.y;
            
            if (stickerRef.current) {
                stickerRef.current.style.left = `${newX}px`;
                stickerRef.current.style.top = `${newY}px`;
            }
        }
    };

    const handlePointerUp = (e: PointerEvent) => {
        console.log("reaching pointer up");
        e.preventDefault();
        
        document.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerup', handlePointerUp);
        document.removeEventListener('pointercancel', handlePointerCancel);
        
        // Show buttons briefly after interaction ends
        setShowDeleteButton(true);
        setShowResizeButton(true);
        
        setTimeout(() => {
            setShowDeleteButton(false);
            setShowResizeButton(false);
        }, 1000);
        
        if (isResizingRef.current) {
            const deltaX = e.clientX - pointerPositionRef.current.x;
            const newW = Math.max(50, width + (deltaX));
            const scalefactor = newW/width;
            const newH = Math.max(50, height * scalefactor);
            console.log("Setting new height: ", newH);
            
            if (onDragEnd) {
                onDragEnd({
                    target: {
                        x: () => image.x,
                        y: () => image.y,
                        width: () => newW,
                        height: () => newH,
                    }
                });
            }
            
            setWidth(newW);
            setHeight(newH);
            setIsResizing(false);
            isResizingRef.current = false;
        }
        else if (isDraggingRef.current) {
            const newX = e.clientX - dragOffRef.current.x;
            const newY = e.clientY - dragOffRef.current.y;
            
            if (onDragEnd) {
                onDragEnd({
                    target: {
                        x: () => newX,
                        y: () => newY,
                        width: () => width, 
                        height: () => height, 
                    }
                });
            }
            
            setIsDragging(false);
            isDraggingRef.current = false;
        }
    };

    // idk exactly when this fires but some ppl said it can happen w touch?
    const handlePointerCancel = (e: PointerEvent) => {
        document.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerup', handlePointerUp);
        document.removeEventListener('pointercancel', handlePointerCancel);
        
        setIsDragging(false);
        isDraggingRef.current = false;
        setIsResizing(false);
        isResizingRef.current = false;
    };

    // RESIZING FUNCTIONALITY
    const startResize = (e: React.PointerEvent) => {
        console.log("reaching start resize");

        setIsResizing(true);
        isResizingRef.current = true;
        
        pointerPositionRef.current = {
            x: e.clientX,
            y: e.clientY
        };
        
        setWidth(image.width);
        setHeight(image.height);
        
        document.addEventListener('pointermove', handlePointerMove);
        document.addEventListener('pointerup', handlePointerUp);
        document.addEventListener('pointercancel', handlePointerCancel);
    };


    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete) onDelete();
    };

    useEffect(() => {
        return () => {
            document.removeEventListener('pointermove', handlePointerMove);
            document.removeEventListener('pointerup', handlePointerUp);
            document.removeEventListener('pointercancel', handlePointerCancel);
        };
    }, []);

    return (
        <div 
            ref={stickerRef}
            className={styles.sticker}
            style={{
                position: 'absolute',
                top: `${image.y}px`, 
                left: `${image.x}px`,
                cursor: isDragging ? 'grabbing' : 'grab',
                userSelect: 'none',
                touchAction: 'none',
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onPointerDown={handlePointerDown}
        >
            <img 
                src={image.src} 
                width={width} 
                // height={height} // don't need this, so it's always same as width
                draggable="false"
                style={{ 
                    userSelect: 'none', 
                    pointerEvents: 'auto', 
                    // zIndex: 500, 
                    touchAction: "none"
                }}
            />

            {/* delete button */}
            {showDeleteButton && !isDragging && !isResizing && (
                <button
                    className="delete-button"
                    onClick={handleDelete}
                    style={{
                        position: 'absolute',
                        top: '-10px',
                        left: '-10px',
                        background: 'none',
                        width: '30px',
                        height: '30px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        border: 'none',
                        cursor: 'pointer',
                        zIndex: 100,
                        pointerEvents: 'auto',
                    }}
                >
                    {/* <img 
                        src="/cancel.svg" 
                        width={30} 
                        height={30} 
                        alt="Delete"
                        style={{ pointerEvents: 'auto' }}
                    /> */}
                    <div style={{ pointerEvents: 'auto' }}>
                        <CancelIcon size='30' fill={features.fontColor}/>
                    </div>
                </button>
            )}

            {/* resize button */}
            {showResizeButton && !isDragging && !isResizing && (
                <button
                    className="resize-button"
                    id="resize-button"
                    style={{
                        position: 'absolute',
                        bottom: '-10px',
                        right: '-10px',
                        background: 'none',
                        width: '30px',
                        height: '30px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        border: 'none',
                        cursor: 'pointer',
                        zIndex: 100,
                        pointerEvents: 'auto',
                        touchAction: 'none'
                    }}
                >
                    {/* <img 
                        src="/bow.svg" 
                        width={45} 
                        height={45} 
                        alt="Resize"
                        style={{ pointerEvents: 'auto', touchAction: 'none' }}
                    /> */}
                    <div style={{transform: 'rotate(45deg)'}}>
                        <ResizeArrow size='30' fill={features.fontColor}/>
                    </div>
                </button>
            )}
        </div>
    );
};

// import React, { useState, useEffect, useRef } from "react";

// export const IndividualSticker = ({ image, onDelete, onDragEnd }: any) => {
//     const [showDeleteButton, setShowDeleteButton] = useState(false);

//     // used to track dif between cursor and top-left corner of sticker
//     const dragOffRef = useRef({ x: 0, y: 0 });

//     // actual html element of the sticker -- used to avoid rerendering on drag
//     const stickerRef = useRef<HTMLDivElement>(null);

//     // Used ONLY for UI (cursor icon and showing delete button)
//     const [isDragging, setIsDragging] = useState(false);

//     const [showResizeButton, setShowResizeButton] = useState(false)
//     // ref for the resize button, used to identify when it is clicked/dragged
//     const resizeRef = useRef<HTMLDivElement>(null);

//     const [isResizing, setIsResizing] = useState(false);
//     const isResizingRef = useRef(false);

//     // just used to get previous position of the cursor for change in x/y
//     const widthHeightRef = useRef({x: 0, y: 0});

//     const [width, setWidth] = useState(image.width);
//     const [height, setHeight] = useState(image.height);
//     // const stickerHeight = image.height;

//     // handling hovering -- showing delete button on hover
//     const handleMouseEnter = () => {
//         setShowDeleteButton(true);
//         setShowDeleteButton(true);
//     };

//     const handleMouseLeave = () => {
//         if (!isDragging) {
//             setTimeout(() => {
//                 setShowDeleteButton(false);
//                 setShowResizeButton(false);
//             }, 1000);
//         }
//     };
//     // drag STARTS

//     // for mobile

//     // https://phuoc.ng/collection/react-drag-drop/make-an-element-draggable-on-touchscreen-devices/ 
//     const handleTouchDown = (e: TouchEvent) => {

//         console.log("reaching handleTouchDown");

//         // no drag if clicking the delete button
//         if ((e.target as HTMLElement).closest('.delete-button')) {
//             return;
//         }

//         // no drag, reaching resize button
//         if ((e.target as HTMLElement).closest('.resize-button')) {
//             console.log("reaching resize in handleTouchdown");

//             handleResizeTouchDown(e);
//             return;
//         }

//         setIsDragging(true);

//         const touch = e.touches[0];

//         // to avoid float back thing before changing position
//         e.preventDefault();
//         // to avoid other things on top being clicked/dragged
//         e.stopPropagation();
        
//         // setting drag offset (top-left corner of image -> location of cursor)
//         dragOffRef.current = {
//             x: touch.clientX - image.x,
//             y: touch.clientY - image.y
//         };

//         // resize case
//         // console.log("e.target: ", e.target);
//         // if ((e.target as HTMLElement).closest('.resize-button')) {
//         //     console.log("reaching resize button in touch");

//         //     widthHeightRef.current = {
//         //         x: touch.clientX,
//         //         y: touch.clientY
//         //     };

//         //     // setting current width and height, not sure if this is totally necessary
//         //     setWidth(image.width);
//         //     setHeight(image.height);

//         //     // document.addEventListener('mousemove', handleResizeMove);
//         //     // document.addEventListener('mouseup', handleResizeUp);
//         //     document.addEventListener('touchmove', handleResizeTouchMove, { passive: false });
//         //     document.addEventListener('touchend', handleResizeTouchUp, { passive: false });

//         //     return;
//         // }
        
//         // document.addEventListener('mousemove', handleMouseMove);
//         // document.addEventListener('mouseup', handleMouseUp);
//         // console.log("closest: ", e.target);
//         // if ((e.target as HTMLElement).closest('.resize-button')) {
//         //     console.log("closest is resize button");
//         //     return;
//         // } else {

//         // trying to manually enforce this only activating on NOT resize
//         // if (!(e.target as HTMLElement).closest('.resize-button')) {
//             document.addEventListener('touchmove', handleTouchMove, { passive: false });
//             document.addEventListener('touchend', handleTouchUp, { passive: false });
//         // }
//     }    

//     useEffect(() => {
//         // adding event listeners on start
//         console.log("adding resize event listeners");
//         document.addEventListener('touchmove', handleResizeTouchMove, { passive: false });
//         document.addEventListener('touchend', handleResizeTouchUp, { passive: false });
//     }, []);

//     const handleResizeTouchDown = (e: TouchEvent) => {
//         console.log("handle resizeTouchDown");

//         setIsResizing(true);
//         isResizingRef.current = true;

//         e.preventDefault();
//         //e.stopPropagation();
        
//         const touch = e.touches[0];
        
//         widthHeightRef.current = {
//             x: touch.clientX,
//             y: touch.clientY
//         };
        
//         setWidth(image.width);
//         setHeight(image.height);
        
//         //document.addEventListener('touchmove', handleResizeTouchMove, { passive: true });
//         //document.addEventListener('touchend', handleResizeTouchUp, { passive: true });

//     }

//     // for drag on touch screen
//     const handleTouchMove = (e: TouchEvent) => {
//         console.log("reaching handle touch move");
//         const touch = e.touches[0];

//         e.preventDefault();
//         e.stopPropagation();

//         const newX = touch.clientX - dragOffRef.current.x;
//         const newY = touch.clientY - dragOffRef.current.y;

//         // handling resize case, taking quantity that has been dragged 
//         //if (resizeRef.current && resizeRef.current.contains(e.target as Node)){
//         // console.log(e.target as HTMLElement);
//         // if (resizeRef && (e.target as HTMLElement).closest('.resize-button')) {

//         // } else 
//         if (stickerRef.current) {
//             //console.log("reaching MOVE case of mousemove for TOUCH");
//             stickerRef.current.style.left = `${newX}px`;
//             stickerRef.current.style.top = `${newY}px`;
//         }
//     }

//     const handleResizeTouchMove = (e: TouchEvent ) => {
//         console.log("handleResizeTouchMove");


//         e.preventDefault();
//         e.stopPropagation();
        
//         if(isResizingRef.current){
//             console.log('reaching is resizing in handleResizeTouchMove');

//             //console.log("event: ", e);
            
//             const touch = e.touches[0];
        
//             const newW = width + (touch.clientX - widthHeightRef.current.x);
            
//             // i thought this was necessary but commenting it out actually didnt' change anything??
//             //  if (stickerRef.current) {
//             //     //console.log("img selector: ", stickerRef.current.querySelector('img'));
//             //     stickerRef.current.querySelector('img').style.width = `${newW}px`;
//             //     stickerRef.current.querySelector('img').style.height = `${newW}px`;
//             // }

//             // added from handleResizeMove
//             if(resizeRef.current){
//                 // OR could try += here
//                 resizeRef.current.style.width = `${newW}px`;
//                 resizeRef.current.style.height = `${newW}px`;
//             }
            
//             setWidth(newW);
//             setHeight(newW);
//         }
        
//     }

//     const handleTouchUp = (e: TouchEvent) => {
//         console.log("reaching handle touch up");
        
//         // changedTouches is list of touches taht are no longer on the screen (aka the one we're looking for)
//         // https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/changedTouches
//         const touch = e.changedTouches[0];
//         console.log("TOUCH IN TOUCH UP: ", touch, e);

//         e.preventDefault();
//         //e.stopPropagation();

        
//         // bc no hover equiv for the stickers
//         setShowDeleteButton(true);
//         setShowDeleteButton(true);

//         setTimeout(() => {
//             setShowDeleteButton(false);
//             setShowResizeButton(false);
//         }, 1000);
        
        
//         // stops mousemove
//         console.log("REmoving touchMove and TouchUp");
//         document.removeEventListener('touchmove', handleTouchMove, {passive: false});
//         document.removeEventListener('touchend', handleTouchUp, {passive: false});

//         // idk attempt to avoid calling resize on touch, didn't work
//         //document.removeEventListener('touchmove', handleResizeTouchMove);
//         //document.removeEventListener('touchend', handleResizeTouchUp);
//         //document.removeEventListener('touchmove', handleResizeTouchMove, { passive: false });
//         //document.removeEventListener('touchend', handleResizeTouchUp, { passive: false });
        
//         if (onDragEnd) {

//             const newX = touch.clientX - dragOffRef.current.x;
//             const newY = touch.clientY - dragOffRef.current.y;
            

//             onDragEnd({
//                 target: {
//                     x: () => newX,
//                     y: () => newY,
//                     width: () => image.width, // original set on init bc we aren't resizing here
//                     height: () => image.height,
//                 }
//             });
//         }
//         setIsDragging(false);
//     }

//     const handleResizeTouchUp = (e: TouchEvent) => {
//         console.log("resize touch up");

//         if(isResizingRef.current){
//             console.log('reaching is resizing in handleResizeTouchUp');

//             const touch = e.changedTouches[0];

//             const newW = width + (touch.clientX - widthHeightRef.current.x);
            
//             e.preventDefault();
//             e.stopPropagation();
            
//             //console.log("removing resizeTouchUp and resizeTouchMove");
//             //document.removeEventListener('touchmove', handleResizeTouchMove);
//             //document.removeEventListener('touchend', handleResizeTouchUp);
            
//             if (onDragEnd) {
//                 onDragEnd({
//                     target: {
//                         x: () => image.x,
//                         y: () => image.y,
//                         width: () => newW,
//                         height: () => newW,
//                     }
//                 });
//             }
            
//             setIsResizing(false);
//             isResizingRef.current = false;
//         }
//     }

//     /////////////  drag on desktop
   
//     const handleMouseDown = (e: React.MouseEvent) => {

//         // no drag if clicking the delete button
//         if ((e.target as HTMLElement).closest('.delete-button')) {
//             return;
//         }

//         // to avoid float back thing before changing position
//         e.preventDefault();
//         // to avoid other things on top being clicked/dragged
//         e.stopPropagation();

//         setIsDragging(true);
        
//         // setting drag offset (top-left corner of image -> location of cursor)
//         dragOffRef.current = {
//             x: e.clientX - image.x,
//             y: e.clientY - image.y
//         };

//         // resize case
//         if ((e.target as HTMLElement).closest('.resize-button')) {
//             console.log("reaching resize button");

//             widthHeightRef.current = {
//                 x: e.clientX,
//                 y: e.clientY
//             };

//             // setting current width and height, not sure if this is totally necessary
//             setWidth(image.width);
//             setHeight(image.height);

//             document.addEventListener('mousemove', handleResizeMove);
//             document.addEventListener('mouseup', handleResizeUp);

//             return;
//         }
        
//         document.addEventListener('mousemove', handleMouseMove);
//         document.addEventListener('mouseup', handleMouseUp);
//     };

//     // while dragging --> only called between mouse down and mouse up
//     const handleMouseMove = (e: MouseEvent) => {
//         e.preventDefault();
//         e.stopPropagation();

//         const newX = e.clientX - dragOffRef.current.x;
//         const newY = e.clientY - dragOffRef.current.y;

//         if (stickerRef.current) {
//             console.log("reaching MOVE case of mousemove");
//             stickerRef.current.style.left = `${newX}px`;
//             stickerRef.current.style.top = `${newY}px`;
//         }
//     };

//     // end drag
//     const handleMouseUp = (e: MouseEvent) => {
//         e.preventDefault();
//         e.stopPropagation();
//         setIsDragging(false);
        
//         // stops mousemove
//         document.removeEventListener('mousemove', handleMouseMove);
//         document.removeEventListener('mouseup', handleMouseUp);
        
//         if (onDragEnd) {

//             const newX = e.clientX - dragOffRef.current.x;
//             const newY = e.clientY - dragOffRef.current.y;
            
//             onDragEnd({
//                 target: {
//                     x: () => newX,
//                     y: () => newY,
//                     width: () => image.width, // original set on init bc we aren't resizing here
//                     height: () => image.height,
//                 }
//             });
//         }
//     };

//     // final cleanup
//     useEffect(() => {
//         return () => {
//             document.removeEventListener('mousemove', handleMouseMove);
//             document.removeEventListener('mouseup', handleMouseUp);

//             document.removeEventListener('mousemove', handleResizeMove);
//             document.removeEventListener('mouseup', handleResizeUp);

//             // for mobile
//             console.log("removing touch handlers");
//             //document.removeEventListener('touchmove', handleResizeTouchMove);
//             //document.removeEventListener('touchend', handleResizeTouchUp);

//             document.removeEventListener('touchmove', handleTouchMove, {passive: false});
//             document.removeEventListener('touchend', handleTouchUp, {passive: false}); 
//         };
//     }, []);

//     //////////////
//     // resizing

//     const handleResizeMove = (e: MouseEvent) =>{
//         console.log("reaching resize case of mousemove");

//         const newW = width + (e.clientX - widthHeightRef.current.x); // e.clientX;
//         // const newH= height + (e.clientY - widthHeightRef.current.y); // e.clientY;

//         if(resizeRef.current){
//             // OR could try += here
//             resizeRef.current.style.width = `${newW}px`;
//             resizeRef.current.style.height = `${newW}px`;
//         }

//         // setting values now -- THIS MIGHT BE AN ISSUE
//         setWidth(newW);
//         setHeight(newW);
//     };

//     const handleResizeUp = (e: MouseEvent) =>{
//         console.log("reaching resize up");

//         e.preventDefault();
//         e.stopPropagation();
//         setIsDragging(false);
        
//         // stops mousemove
//         document.removeEventListener('mousemove', handleResizeMove);
//         document.removeEventListener('mouseup', handleResizeUp);

//         if (onDragEnd) {
//             const newW = width + e.clientX - widthHeightRef.current.x;
//             //const newH = height + e.clientY - widthHeightRef.current.y;
//             onDragEnd({
//                 target: {
//                     x: () => image.x,
//                     y: () => image.y,
//                     width: () => newW, // original set on init bc we aren't resizing here
//                     height: () => newW,
//                 }
//             });
//         }
//     };


//     ////////////

//     // deleting a sticker
//     const handleDelete = (e: React.MouseEvent) => {
//         e.stopPropagation();
//         if (onDelete) onDelete();
//     }

//   return (
//     <div 
//         ref={stickerRef}
//         className="sticker-container" 
//         style={{
//             position: 'absolute',
//             top: `${image.y}px`, 
//             left: `${image.x}px`,
//             cursor: isDragging ? 'grabbing' : 'grab',
//             userSelect: 'none',
//             touchAction: 'none',
//         }}
//         onMouseEnter={handleMouseEnter}
//         onMouseLeave={handleMouseLeave}
//         onMouseDown={handleMouseDown}
//         onTouchStart={handleTouchDown}
//         onTouchMove={handleResizeTouchMove}
//         onTouchEnd={handleResizeTouchUp}
//     >
//         <img 
//             src={image.src} 
//             width={width} 
//             height={height} 
//             draggable="false"
//             onMouseEnter={handleMouseEnter}
//             onMouseLeave={handleMouseLeave}
//             onMouseDown={handleMouseDown}
            
//             //onTouchEnd={handleTouchUp}
//             style={{ userSelect: 'none', pointerEvents: 'auto', zIndex: 500,  touchAction: "none"}}
//         />

//         {/* delete button */}
//         {showDeleteButton && !isDragging && (
//                 <button
//                     className="delete-button"
//                     onClick={handleDelete}
//                     style={{
//                         position: 'absolute',
//                         top: '-10px',
//                         left: '-10px',
//                         background: 'none',
//                         // borderRadius: '50%',
//                         width: '45px',
//                         height: '45px',
//                         display: 'flex',
//                         justifyContent: 'center',
//                         alignItems: 'center',
//                         // border: '1px solid #ccc',
//                         border: 'none',
//                         cursor: 'pointer',
//                         zIndex: 100,
//                         pointerEvents: 'auto',
//                         // backgroundColor: 'lightpink'
//                     }}
//                 >
//                     <img 
//                         src="/cancel.svg" 
//                         width={45} 
//                         height={45} 
//                         alt="Delete"
//                         style={{ pointerEvents: 'auto' }}
//                     />
//                 </button>
//             )}

//         {/* resize button */}
//         { showDeleteButton && !isDragging && (
//             <button
//             className="resize-button"
//             id="resize-button"
//             style={{
//                 position: 'absolute',
//                 bottom: '-10px',
//                 right: '-10px',
//                 background: 'none',
//                 // borderRadius: '50%',
//                 width: '45px',
//                 height: '45px',
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 // border: '1px solid #ccc',
//                 border: 'none',
//                 cursor: 'pointer',
//                 zIndex: 100,
//                 pointerEvents: 'auto',
//                 touchAction: 'none'
//                 // backgroundColor: 'lightpink'
//             }}
//             onMouseDown={handleMouseDown}
//             onTouchStart={handleTouchDown}
//         >
//             {/* // <div ref={resizeRef} className="resize-button" style={{backgroundColor: 'lightgreen', display: '100%'}}> */}
//                 <img 
//                     src="/bow.svg" 
//                     width={45} 
//                     height={45} 
//                     alt="Resize"
//                     style={{ pointerEvents: 'auto', touchAction: 'none'}}
//                 />
//             </button>) }
//     </div>
//   );
// };