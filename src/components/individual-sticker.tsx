import React, { useState, useEffect, useRef } from "react";
import { RectAreaLight } from "three";

export const IndividualSticker = ({ image, onDelete, onDragEnd }: any) => {
    const [showDeleteButton, setShowDeleteButton] = useState(false);

    // used to track dif between cursor and top-left corner of sticker
    const dragOffRef = useRef({ x: 0, y: 0 });

    // actual html element of the sticker -- used to avoid rerendering on drag
    const stickerRef = useRef<HTMLDivElement>(null);

    // Used ONLY for UI (cursor icon and showing delete button)
    const [isDragging, setIsDragging] = useState(false);
    

    const [showResizeButton, setShowResizeButton] = useState(false)
    // ref for the resize button, used to identify when it is clicked/dragged
    const resizeRef = useRef<HTMLDivElement>(null);
    // just used to get previous position of the cursor for change in x/y
    const widthHeightRef = useRef({x: 0, y: 0});

    const [width, setWidth] = useState(image.width);
    const [height, setHeight] = useState(image.height);
    // const stickerHeight = image.height;

    // handling hovering -- showing delete button on hover
    const handleMouseEnter = () => {
        setShowDeleteButton(true);
        setShowDeleteButton(true);
    };

    const handleMouseLeave = () => {
        if (!isDragging) {
            setTimeout(() => {
                setShowDeleteButton(false);
                setShowResizeButton(false);
            }, 1000);
        }
    };

    // drag STARTS

    // for mobile

    // https://phuoc.ng/collection/react-drag-drop/make-an-element-draggable-on-touchscreen-devices/ 
    const handleTouchDown = (e: React.TouchEvent) => {

        setIsDragging(true);

        const touch = e.touches[0];

        // no drag if clicking the delete button
        if ((e.target as HTMLElement).closest('.delete-button')) {
            return;
        }

        // to avoid float back thing before changing position
        e.preventDefault();
        // to avoid other things on top being clicked/dragged
        e.stopPropagation();
        
        // setting drag offset (top-left corner of image -> location of cursor)
        dragOffRef.current = {
            x: touch.clientX - image.x,
            y: touch.clientY - image.y
        };

        // resize case
        // console.log("e.target: ", e.target);
        // if ((e.target as HTMLElement).closest('.resize-button')) {
        //     console.log("reaching resize button in touch");

        //     widthHeightRef.current = {
        //         x: touch.clientX,
        //         y: touch.clientY
        //     };

        //     // setting current width and height, not sure if this is totally necessary
        //     setWidth(image.width);
        //     setHeight(image.height);

        //     // document.addEventListener('mousemove', handleResizeMove);
        //     // document.addEventListener('mouseup', handleResizeUp);
        //     document.addEventListener('touchmove', handleResizeTouchMove, { passive: false });
        //     document.addEventListener('touchend', handleResizeTouchUp, { passive: false });

        //     return;
        // }
        
        // document.addEventListener('mousemove', handleMouseMove);
        // document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchUp);
    }

    // idk but for some reason combining these does't work on touch
    const handleResizeTouchDown = (e: React.TouchEvent) => {
        console.log("reaching handleResizeTouchDown");

        setIsDragging(true);

        const touch = e.touches[0];

        // no drag if clicking the delete button
        if ((e.target as HTMLElement).closest('.delete-button')) {
            return;
        }

        // to avoid float back thing before changing position
        e.preventDefault();
        // to avoid other things on top being clicked/dragged
        e.stopPropagation();
        
        // setting drag offset (top-left corner of image -> location of cursor)
        dragOffRef.current = {
            x: touch.clientX - image.x,
            y: touch.clientY - image.y
        };

        // resize case
        console.log("e.target: ", e.target);
        console.log("reaching resize button in touch");

        widthHeightRef.current = {
            x: touch.clientX,
            y: touch.clientY
        };

        // setting current width and height, not sure if this is totally necessary
        setWidth(image.width);
        setHeight(image.height);

        // document.addEventListener('mousemove', handleResizeMove);
        // document.addEventListener('mouseup', handleResizeUp);
        document.addEventListener('touchmove', handleResizeTouchMove);
        document.addEventListener('touchend', handleResizeTouchUp);
    }

    // for drag on touch screen
    const handleTouchMove = (e: React.TouchEvent) => {
        const touch = e.touches[0];

        e.preventDefault();
        e.stopPropagation();

        const newX = touch.clientX - dragOffRef.current.x;
        const newY = touch.clientY - dragOffRef.current.y;

        // handling resize case, taking quantity that has been dragged 
        //if (resizeRef.current && resizeRef.current.contains(e.target as Node)){
        // console.log(e.target as HTMLElement);
        // if (resizeRef && (e.target as HTMLElement).closest('.resize-button')) {

        // } else 
        if (stickerRef.current) {
            console.log("reaching MOVE case of mousemove for TOUCH");
            stickerRef.current.style.left = `${newX}px`;
            stickerRef.current.style.top = `${newY}px`;
        }
    }

    const handleTouchUp = (e: React.TouchEvent) => {
        
        // changedTouches is list of touches taht are no longer on the screen (aka the one we're looking for)
        // https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/changedTouches
        const touch = e.changedTouches[0];
        console.log("TOUCH IN TOUCH UP: ", touch, e);

        e.preventDefault();
        e.stopPropagation();

        
        // bc no hover equiv for the stickers
        setShowDeleteButton(true);
        setShowDeleteButton(true);

        setTimeout(() => {
            setShowDeleteButton(false);
            setShowResizeButton(false);
        }, 1000);
        
        
        // stops mousemove
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchUp);
        
        if (onDragEnd) {

            const newX = touch.clientX - dragOffRef.current.x;
            const newY = touch.clientY - dragOffRef.current.y;
            
            onDragEnd({
                target: {
                    x: () => newX,
                    y: () => newY,
                    width: () => image.width, // original set on init bc we aren't resizing here
                    height: () => image.height,
                }
            });
        }
        setIsDragging(false);
    }

    /////////////  drag on desktop
   
    const handleMouseDown = (e: React.MouseEvent) => {

        // no drag if clicking the delete button
        if ((e.target as HTMLElement).closest('.delete-button')) {
            return;
        }

        // to avoid float back thing before changing position
        e.preventDefault();
        // to avoid other things on top being clicked/dragged
        e.stopPropagation();

        setIsDragging(true);
        
        // setting drag offset (top-left corner of image -> location of cursor)
        dragOffRef.current = {
            x: e.clientX - image.x,
            y: e.clientY - image.y
        };

        // resize case
        if ((e.target as HTMLElement).closest('.resize-button')) {
            console.log("reaching resize button");

            widthHeightRef.current = {
                x: e.clientX,
                y: e.clientY
            };

            // setting current width and height, not sure if this is totally necessary
            setWidth(image.width);
            setHeight(image.height);

            document.addEventListener('mousemove', handleResizeMove);
            document.addEventListener('mouseup', handleResizeUp);

            return;
        }
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    // while dragging --> only called between mouse down and mouse up
    const handleMouseMove = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const newX = e.clientX - dragOffRef.current.x;
        const newY = e.clientY - dragOffRef.current.y;

        if (stickerRef.current) {
            console.log("reaching MOVE case of mousemove");
            stickerRef.current.style.left = `${newX}px`;
            stickerRef.current.style.top = `${newY}px`;
        }
    };

    // end drag
    const handleMouseUp = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        
        // stops mousemove
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        
        if (onDragEnd) {

            const newX = e.clientX - dragOffRef.current.x;
            const newY = e.clientY - dragOffRef.current.y;
            
            onDragEnd({
                target: {
                    x: () => newX,
                    y: () => newY,
                    width: () => image.width, // original set on init bc we aren't resizing here
                    height: () => image.height,
                }
            });
        }
    };

    // final cleanup
    useEffect(() => {
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);

            document.removeEventListener('mousemove', handleResizeMove);
            document.removeEventListener('mouseup', handleResizeUp);

            // for mobile
            document.removeEventListener('touchmove', handleResizeTouchMove);
            document.removeEventListener('touchend', handleResizeTouchUp);

            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchUp); 
        };
    }, []);

    //////////////
    // resizing

    const handleResizeMove = (e: MouseEvent) =>{
        console.log("reaching resize case of mousemove");

        const newW = width + (e.clientX - widthHeightRef.current.x); // e.clientX;
        // const newH= height + (e.clientY - widthHeightRef.current.y); // e.clientY;

        if(resizeRef.current){
            // OR could try += here
            resizeRef.current.style.width = `${newW}px`;
            resizeRef.current.style.height = `${newW}px`;
        }

        // setting values now -- THIS MIGHT BE AN ISSUE
        setWidth(newW);
        setHeight(newW);
    };

    const handleResizeUp = (e: MouseEvent) =>{
        console.log("reaching resize up");

        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        
        // stops mousemove
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeUp);

        if (onDragEnd) {
            const newW = width + e.clientX - widthHeightRef.current.x;
            //const newH = height + e.clientY - widthHeightRef.current.y;
            onDragEnd({
                target: {
                    x: () => image.x,
                    y: () => image.y,
                    width: () => newW, // original set on init bc we aren't resizing here
                    height: () => newW,
                }
            });
        }
    };

    // for resizing on touch screen
    const handleResizeTouchMove = (e: React.TouchEvent) => {

        console.log("reaching resize case of mousemove in TOUCH");

        const touch = e.touches[0];

        const newW = width + (touch.clientX - widthHeightRef.current.x); // e.clientX;
        // const newH= height + (e.clientY - widthHeightRef.current.y); // e.clientY;

        if(resizeRef.current){
            console.log("resize ref is current");
            // OR could try += here
            resizeRef.current.style.width = `${newW}px`;
            resizeRef.current.style.height = `${newW}px`;
        }

        // setting values now -- THIS MIGHT BE AN ISSUE
        setWidth(newW);
        setHeight(newW);
    }

    const handleResizeTouchUp = (e: React.TouchEvent) => {

        const touch = e.changedTouches[0];

        console.log("reaching resize up");

        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        
        // stops mousemove
        document.removeEventListener('touchmove', handleResizeTouchMove);
        document.removeEventListener('touchend', handleResizeTouchUp);

        if (onDragEnd) {
            const newW = width + touch.clientX - widthHeightRef.current.x;
            //const newH = height + e.clientY - widthHeightRef.current.y;
            onDragEnd({
                target: {
                    x: () => image.x,
                    y: () => image.y,
                    width: () => newW, // original set on init bc we aren't resizing here
                    height: () => newW,
                }
            });
        }
    }


    ////////////

    // deleting a sticker
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete) onDelete();
    }

  return (
    <div 
        ref={stickerRef}
        className="sticker-container" 
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
        onMouseDown={handleMouseDown}
    >
        <img 
            src={image.src} 
            width={width} 
            height={height} 
            draggable="false"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchDown}
            //onTouchEnd={handleTouchUp}
            style={{ userSelect: 'none', pointerEvents: 'auto', zIndex: 500, touchAction: 'none'}}
        />

        {/* delete button */}
        {showDeleteButton && !isDragging && (
                <button
                    className="delete-button"
                    onClick={handleDelete}
                    style={{
                        position: 'absolute',
                        top: '-10px',
                        left: '-10px',
                        background: 'none',
                        // borderRadius: '50%',
                        width: '45px',
                        height: '45px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        // border: '1px solid #ccc',
                        border: 'none',
                        cursor: 'pointer',
                        zIndex: 100,
                        pointerEvents: 'auto',
                        // backgroundColor: 'lightpink'
                    }}
                >
                    <img 
                        src="/cancel.svg" 
                        width={45} 
                        height={45} 
                        alt="Delete"
                        style={{ pointerEvents: 'auto' }}
                    />
                </button>
            )}

        {/* resize button */}
        { showDeleteButton && !isDragging && (
            <button
            className="resize-button"
            id="resize-button"
            style={{
                position: 'absolute',
                bottom: '-10px',
                right: '-10px',
                background: 'none',
                // borderRadius: '50%',
                width: '45px',
                height: '45px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                // border: '1px solid #ccc',
                border: 'none',
                cursor: 'pointer',
                zIndex: 100,
                pointerEvents: 'auto',
                touchAction: 'none'
                // backgroundColor: 'lightpink'
            }}
            onTouchStart={handleResizeTouchDown}
            //onTouchEnd={handleResizeTouchUp}
        >
            {/* // <div ref={resizeRef} className="resize-button" style={{backgroundColor: 'lightgreen', display: '100%'}}> */}
                <img 
                    src="/bow.svg" 
                    width={45} 
                    height={45} 
                    alt="Resize"
                    style={{ pointerEvents: 'auto'}}
                />
            </button>) }
    </div>
  );
};