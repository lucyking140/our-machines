import React, { useState, useEffect, useRef } from "react";

export const IndividualSticker = ({ image, onDelete, onDragEnd }: any) => {
    const [showDeleteButton, setShowDeleteButton] = useState(false);

    // used to track dif between cursor and top-left corner of sticker
    const dragOffRef = useRef({ x: 0, y: 0 });

    // actual html element of the sticker -- used to avoid rerendering on drag
    const stickerRef = useRef<HTMLDivElement>(null);

    // Used ONLY for UI (cursor icon and showing delete button)
    const [isDragging, setIsDragging] = useState(false);

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
            }, 1000);
        }
    };

    // drag STARTS
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
                    y: () => newY
                }
            });
        }
    };

    // final cleanup
    useEffect(() => {
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

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
            style={{ userSelect: 'none', pointerEvents: 'auto', zIndex: 500 }}
        />

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
                        style={{ pointerEvents: 'auto' }}
                    />
                </button>
            )}
    </div>
  );
};