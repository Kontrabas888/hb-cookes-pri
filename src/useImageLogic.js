import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "images";

const getDefaultImage = () => ({
  src: null,
  showBorders: true,
  // size.width будем использовать как "масштаб в процентах" (100 = 100%)
  size: { width: 100, height: 100 },
  // позиция сдвига фона
  position: { x: 0, y: 0 },
  // флип по горизонтали
  flipped: false,
});

const createEmptyImages = (count) =>
  Array.from({ length: count }, () => getDefaultImage());

const useImageLogic = () => {
  const [images, setImages] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((data) => ({
            ...getDefaultImage(),
            ...data, // showBorders, size, position, flipped
          }));
        }
      } catch (err) {
        console.error("Ошибка чтения из localStorage:", err);
      }
    }
    // по умолчанию 6 слотов
    return createEmptyImages(6);
  });

  const [activeIndex, setActiveIndex] = useState(null);

  // сохраняем настройки (без src) в localStorage
  useEffect(() => {
    const dataToSave = images.map(({ showBorders, size, position, flipped }) => ({
      showBorders,
      size,
      position,
      flipped,
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [images]);

  const handleToggleBorders = useCallback(() => {
    setImages((prevImages) => {
      const anyVisible = prevImages.some((img) => img.showBorders);
      // если хоть одна рамка включена → выключаем все
      // если все выключены → включаем все
      const nextValue = !anyVisible;
      return prevImages.map((img) => ({
        ...img,
        showBorders: nextValue,
      }));
    });
  }, []);

  const handleFileChange = useCallback(
    (event, index) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        alert("Пожалуйста, выберите файл изображения (JPEG, PNG, WebP и т.п.)");
        event.target.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => {
          const updated = [...prev];
          if (!updated[index]) return updated;
          updated[index] = {
            ...updated[index],
            src: reader.result,
          };
          return updated;
        });
      };
      reader.readAsDataURL(file);
      event.target.value = "";
    },
    [setImages]
  );

  const handleDuplicateImage = useCallback(() => {
  setImages((prev) => {
    // 1. пытаемся использовать активный слот
    let sourceIndex = activeIndex;

    // 2. если активного нет — ищем первый слот с загруженной картинкой
    if (sourceIndex === null) {
      sourceIndex = prev.findIndex((img) => !!img.src);
    }

    // если так и не нашли — выходим
    if (sourceIndex === null || sourceIndex === -1) return prev;

    const img = prev[sourceIndex];
    if (!img) return prev;

    // размножаем выбранное изображение и его настройки на все слоты
    return prev.map(() => ({
      src: img.src || null,
      showBorders: img.showBorders ?? true,
      size: { ...(img.size || { width: 100, height: 100 }) },
      position: { ...(img.position || { x: 0, y: 0 }) },
      flipped: !!img.flipped,
    }));
  });
}, [activeIndex, setImages]);

  const handleClearLocalStorage = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setImages((prev) => createEmptyImages(prev.length)); // сохраняем количество слотов
    setActiveIndex(null);
  }, []);

  const handleFlip = useCallback(
    (index) => {
      setImages((prev) => {
        const updated = [...prev];
        if (!updated[index]) return updated;
        updated[index] = {
          ...updated[index],
          flipped: !updated[index].flipped,
        };
        return updated;
      });
    },
    [setImages]
  );

  return {
    images,
    activeIndex,
    setActiveIndex,
    setImages,
    handleToggleBorders,
    handleFileChange,
    handleDuplicateImage,
    handleClearLocalStorage,
    handleFlip,
  };
};

export default useImageLogic;
