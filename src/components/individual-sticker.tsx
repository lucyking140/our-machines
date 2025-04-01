import React, { useState, useEffect, useRef } from "react";
import {useHover} from 'react-use';

export const IndividualSticker = ({ image, onDelete, onDragEnd }: any) => {
    const [deleteImage] = "/cancel.svg";
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const [position, setPosition] = useState({ x: image.x, y: image.y });
    const stickerRef = useRef<HTMLDivElement>(null);
    const startPosRef = useRef({ x: 0, y: 0, mouseX: 0, mouseY: 0 });

    const [isDragging, setIsDragging] = useState(false);

    // Update position if props change
    useEffect(() => {
        setPosition({ x: image.x, y: image.y });
    }, [image.x, image.y]);

    const stickerWidth = image.width;
    const stickerHeight = image
    ? (image.width * image.height) / image.width
    : 0;

    // handling hovering -- showing delete button on hover
    const handleMouseEnter = () => {
        setShowDeleteButton(true);
    };

    const handleMouseLeave = () => {
        if (!isDragging) {
            setTimeout(() => {
                setShowDeleteButton(false);
            }, 2000);
        }
    };

    // // handling drag events to change location
    // const handleDragStart = (e: React.DragEvent) => {
    //     setIsDragging(true);
    //     // Set the drag image offset (optional)
    //     if (e.dataTransfer) {
    //         e.dataTransfer.setData('text/plain', ''); // Required for Firefox
    //     }
    // };

    // const handleDragEnd = (e: React.DragEvent) => {
    //     setIsDragging(false);
    //     if (onDragEnd) {
    //         // Get the final position
    //         const rect = e.currentTarget.getBoundingClientRect();
    //         const newX = e.clientX - rect.width / 2;
    //         const newY = e.clientY - rect.height / 2;
            
    //         // Call the parent's onDragEnd with position info
    //         onDragEnd({
    //             target: {
    //                 x: () => newX,
    //                 y: () => newY
    //             }
    //         });
    //     }
    // };

    // Custom drag implementation
    const handleMouseDown = (e: React.MouseEvent) => {

        // Skip if clicking the delete button
        if ((e.target as HTMLElement).closest('.delete-button')) {
            return;
        }

        e.preventDefault();
        setIsDragging(true);
        
        // Store starting positions
        startPosRef.current = {
            x: position.x,
            y: position.y,
            mouseX: e.clientX,
            mouseY: e.clientY
        };
        
        // Add window event listeners
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isDragging) {
            // Calculate new position
            const dx = e.clientX - startPosRef.current.mouseX;
            const dy = e.clientY - startPosRef.current.mouseY;
            
            const newX = startPosRef.current.x + dx;
            const newY = startPosRef.current.y + dy;
            
            // Update position state (this will cause component to re-render with new position)
            setPosition({ x: newX, y: newY });
        }
    };

    const handleMouseUp = (e: MouseEvent) => {
        if (isDragging) {
            setIsDragging(false);
            
            // Remove window event listeners
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            
            // Call parent's onDragEnd with the new position
            if (onDragEnd) {
                onDragEnd({
                    target: {
                        x: () => position.x,
                        y: () => position.y
                    }
                });
            }
        }
    };

    // Cleanup event listeners on unmount
    useEffect(() => {
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent event from bubbling up
        console.log("Delete button clicked");
        if (onDelete) onDelete();
    }

  return (
    <div 
        ref={stickerRef}
        className="sticker-container" 
        style={{
            position: 'absolute',
            top: `${position.y}px`, 
            left: `${position.x}px`,
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
            touchAction: 'none'
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        
    >
        <img 
            src={image.src} 
            width={stickerWidth} 
            height={stickerHeight} 
            draggable="false"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
            // onDragStart={handleDragStart}
            // onDragEnd={handleDragEnd}
            style={{ userSelect: 'none', pointerEvents: 'none', zIndex: 50 }}
        />
        {/* <img src={image.src} width={stickerWidth} height={stickerHeight} draggable="true"
      style={{top:`{image.y}`, left:`{image.x}` }}
      onDragStart={() => { setIsDragging(true); console.log("Start dragging")} }
      onDragEnd={(event) => {
        setIsDragging(false);
        onDragEnd(event);
      }} /> */}

        {showDeleteButton && !isDragging && (
                <button
                    className="delete-button"
                    onClick={handleDelete}
                    style={{
                        position: 'absolute',
                        top: '-10px',
                        right: '-10px',
                        background: 'none',
                        // borderRadius: '50%',
                        width: '25px',
                        height: '25px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        // border: '1px solid #ccc',
                        border: 'none',
                        cursor: 'pointer',
                        zIndex: 100,
                        pointerEvents: 'auto'
                    }}
                >
                    <img 
                        src="/cancel.svg" 
                        width={25} 
                        height={25} 
                        alt="Delete"
                        style={{ pointerEvents: 'none' }}
                    />
                </button>
            )}
    </div>
  );
};