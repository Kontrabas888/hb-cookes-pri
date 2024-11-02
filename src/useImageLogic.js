import { useState, useEffect } from 'react';

const useImageLogic = () => {
  const [images, setImages] = useState(() => {
    const storedImages = localStorage.getItem('images');
    return storedImages
      ? JSON.parse(storedImages)
      : Array.from({ length: 6 }, () => ({ src: null, showBorders: true, size: { width: 100, height: 100 }, position: { x: 0, y: 0 } }));
  });
  const [activeIndex, setActiveIndex] = useState(null);
  const [numberOfRectangles, setNumberOfRectangles] = useState(6);

  useEffect(() => {
    localStorage.setItem('images', JSON.stringify(images));
  }, [images]);

  const handleToggleBorders = () => {
  setImages((prevImages) => 
    prevImages.map(image => ({
      ...image,
      showBorders: !image.showBorders, // Переключаем showBorders для всех изображений
    }))
  );
};

  const handleFileChange = (event, index) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onloadend = () => {
      setImages((prevImages) => {
        const newImages = [...prevImages];
        newImages[index].src = reader.result;
        return newImages;
      });
    };
    reader.readAsDataURL(file);

    // Сброс значения input для повторного выбора того же файла
    event.target.value = '';
  }
};

  const handleDuplicateImage = () => {
    if (activeIndex !== null) {
      const activeImage = images[activeIndex];
      setImages(images.map(() => ({ ...activeImage })));
    }
  };

  const handleClearLocalStorage = () => {
    localStorage.removeItem('images');
    setImages(Array.from({ length: numberOfRectangles }, () => ({ src: null, showBorders: true, size: { width: 100, height: 100 }, position: { x: 0, y: 0 } })));
    setActiveIndex(null);
  };

  return {
    images,
    activeIndex,
    handleToggleBorders,
    handleFileChange,
    setActiveIndex,
    handleDuplicateImage,
    handleClearLocalStorage,
    setImages, // Экспортируем setImages
    handleSetNumberOfRectangles: setNumberOfRectangles,
  };
};

export default useImageLogic;
