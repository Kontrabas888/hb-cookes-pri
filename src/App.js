import React, { useState, useEffect, useCallback } from 'react';
import useImageLogic from './useImageLogic';
import { FcAddImage, FcRemoveImage } from "react-icons/fc";
import './App.css';



const App = () => {
  const {
    images,
    handleToggleBorders,
    handleFileChange,
    activeIndex,
    setActiveIndex,
    handleDuplicateImage,
    handleClearLocalStorage,
    handleSetNumberOfRectangles,
    setImages,
  } = useImageLogic();

  const [rectangleClass, setRectangleClass] = useState('rectangle-style1');

  const handleSetStyleAndNumber = (style, number) => {
    setRectangleClass(style);
    handleSetNumberOfRectangles(number);

    setImages((prevImages) =>
      Array.from({ length: number }, (_, index) => ({
        ...prevImages[index],
        src: prevImages[index]?.src || null,
        showBorders: prevImages[index]?.showBorders ?? true,
        size: prevImages[index]?.size || { width: 100, height: 100 },
        position: prevImages[index]?.position || { x: 0, y: 0 },
      }))
    );
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => {
      const newImages = [...prevImages];
      newImages[index].src = null; // Удаляем изображение, сбрасывая его src
      return newImages;
    });
  };

  const handleResize = useCallback((action, isShiftPressed) => {
  if (activeIndex === null) return;

  setImages((prevImages) => {
    const newImages = [...prevImages];
    const scaleFactor = action === 'increase' 
      ? (isShiftPressed ? 1.05 : 1.005) // Более крупный шаг при нажатии Shift
      : (isShiftPressed ? 0.95 : 0.995);
    const currentSize = newImages[activeIndex].size || { width: 100, height: 100 };
    newImages[activeIndex].size = {
      width: currentSize.width * scaleFactor,
      height: currentSize.height * scaleFactor,
    };
    return newImages;
  });
}, [activeIndex, setImages]);

  const handleMove = useCallback((direction, isShiftPressed) => {
  if (activeIndex === null) return;

  setImages((prevImages) => {
    const newImages = [...prevImages];
    const moveStep = isShiftPressed ? 10 : 1; // Большой шаг при нажатии Shift
    const currentPosition = newImages[activeIndex].position || { x: 0, y: 0 };

    switch (direction) {
      case 'left':
        newImages[activeIndex].position = { ...currentPosition, x: currentPosition.x - moveStep };
        break;
      case 'right':
        newImages[activeIndex].position = { ...currentPosition, x: currentPosition.x + moveStep };
        break;
      case 'up':
        newImages[activeIndex].position = { ...currentPosition, y: currentPosition.y - moveStep };
        break;
      case 'down':
        newImages[activeIndex].position = { ...currentPosition, y: currentPosition.y + moveStep };
        break;
      default:
        break;
    }

    return newImages;
  });
}, [activeIndex, setImages]);

  useEffect(() => {
  const handleKeyDown = (event) => {
    if (activeIndex === null) return;

    if (['ArrowUp', 'ArrowDown'].includes(event.key)) {
      event.preventDefault();
    }

    const isShiftPressed = event.shiftKey;

    switch (event.key) {
      case '+':
      case '=': // Обработка + и =
        handleResize('increase', isShiftPressed);
        break;
      case '-':
      case '_': // Обработка - и _
        handleResize('decrease', isShiftPressed);
        break;
      case 'ArrowLeft':
        handleMove('left', isShiftPressed);
        break;
      case 'ArrowRight':
        handleMove('right', isShiftPressed);
        break;
      case 'ArrowUp':
        handleMove('up', isShiftPressed);
        break;
      case 'ArrowDown':
        handleMove('down', isShiftPressed);
        break;
      default:
        break;
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}, [activeIndex, handleMove, handleResize]);

  return (
    <div className='page'>
      <div className='container'>
        {images.map((image, index) => (
          <div
            key={index}
            className={`rectangle ${rectangleClass} ${image.showBorders ? '' : 'hide-borders'}`}
          >
            <img
              src={image.src}
              alt=""
              className="image-inside-rectangle"
              style={{
                width: image.size?.width,
                transform: `translate(${image.position?.x || 0}px, ${image.position?.y || 0}px)`,
              }}
            />
            <button className="choice-button printable" onClick={() => setActiveIndex(index)}><FcAddImage /></button>
            <button className="remove-button printable" onClick={() => handleRemoveImage(index)}><FcRemoveImage /></button>
          </div>
        ))}
      </div>
      <div className='buttons printable'>
        <button className='button-change' onClick={() => handleSetStyleAndNumber('rectangle-style1', 2)}>Большие Круглые</button>
        <button className='button-change' onClick={() => handleSetStyleAndNumber('rectangle-style2', 6)}>Маленькие Круглые</button>
        <button className='button-change' onClick={() => handleSetStyleAndNumber('rectangle-style3', 4)}>Рамка Большие</button>
        <button className='button-change' onClick={() => handleSetStyleAndNumber('rectangle-style4', 4)}>Прямоугольник</button>
        <button className='button-change' onClick={() => handleSetStyleAndNumber('rectangle-style5', 4)}>Рамка Маленькие</button>
        <button className='button-change' onClick={() => handleSetStyleAndNumber('rectangle-style6', 2)}>BadaBig=14,2x10.7</button>
        <button className='button-change' onClick={() => handleSetStyleAndNumber('rectangle-pasha', 4)}>Пасха</button>
        
        <button className='toggle-borders-button printable' onClick={handleToggleBorders}>
          {images[activeIndex]?.showBorders ? 'Отключить границы?' : 'Границы отключены'}
        </button>

                <button className='button-change' onClick={handleDuplicateImage}>Размножить</button>
        
        {images.map((_, index) => (
          <div key={index}>
            <input className='input-img-button printable' type="file" onChange={(event) => handleFileChange(event, index)} />
          </div>
        ))}
        
        <button className='all-remove' onClick={handleClearLocalStorage}>Очистить приложения!!!</button>
      </div>
    </div>
  );
};

export default App;
