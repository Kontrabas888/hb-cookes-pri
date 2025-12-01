import React, { useState, useEffect, useCallback } from "react";
import useImageLogic from "./useImageLogic";
import { FcAddImage, FcRemoveImage } from "react-icons/fc";
import { ImCopy } from "react-icons/im";
import { BsPhoneFlip } from "react-icons/bs";
import "./App.css";

const LAYOUTS = [
  {
    id: "rect1",
    className: "rectangle-style1",
    count: 2,
    label: "Большие Круглые_x11",
  },
  {
    id: "rect2",
    className: "rectangle-style2",
    count: 6,
    label: "Маленькие Круглые_x9",
  },
  {
    id: "rect3",
    className: "rectangle-style3",
    count: 4,
    label: "Рамка Большие_14x10",
  },
  {
    id: "rect4",
    className: "rectangle-style4",
    count: 4,
    label: "Прямоугольник_13x9",
  },
  {
    id: "rect5",
    className: "rectangle-style5",
    count: 6,
    label: "Круглые х7",
  },
  {
    id: "rect6",
    className: "rectangle-style6",
    count: 9,
    label: "Logo_5.7x8",
  },
  {
    id: "rect7",
    className: "rectangle-style7",
    count: 12,
    label: "Круглые х6",
  },
  {
    id: "pasha1",
    className: "rectangle-pasha",
    count: 4,
    label: "Пасха",
  },
  {
    id: "pasha2",
    className: "rectangle-pasha2",
    count: 20,
    label: "Пасха-маленька 5,4x4,1",
  },
  {
    id: "a5",
    className: "rectangle-style8",
    count: 1,
    label: "А5_145x225",
  },
];

const App = () => {
  const {
    images,
    handleToggleBorders,
    handleFileChange,
    activeIndex,
    setActiveIndex,
    handleDuplicateImage,
    handleClearLocalStorage,
    handleFlip,
    setImages,
  } = useImageLogic();

  const [rectangleClass, setRectangleClass] = useState("rectangle-style1");

  // смена раскладки: класс + количество прямоугольников
  const handleSetStyleAndNumber = (style, number) => {
    setRectangleClass(style);

    setImages((prevImages) =>
      Array.from({ length: number }, (_, index) => ({
        // сохраняем то, что было, если слот существовал
        ...prevImages[index],
        src: prevImages[index]?.src || null,
        showBorders:
          prevImages[index]?.showBorders !== undefined
            ? prevImages[index].showBorders
            : true,
        size: prevImages[index]?.size || { width: 100, height: 100 },
        position: prevImages[index]?.position || { x: 0, y: 0 },
        flipped: prevImages[index]?.flipped ?? false,
      }))
    );
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => {
      const next = [...prevImages];
      if (!next[index]) return next;
      next[index] = {
        ...next[index],
        src: null,
      };
      return next;
    });
  };

  const handleResize = useCallback(
    (action, isShiftPressed) => {
      if (activeIndex === null) return;

      setImages((prevImages) => {
        const next = [...prevImages];
        const current = next[activeIndex];
        if (!current) return next;

        const scaleFactor =
          action === "increase"
            ? isShiftPressed
              ? 1.05
              : 1.01
            : isShiftPressed
            ? 0.95
            : 0.99;

        const currentScale = current.size?.width ?? 100;
        const newScale = Math.min(
          400,
          Math.max(10, currentScale * scaleFactor)
        ); // ограничим масштаб 10–400%

        next[activeIndex] = {
          ...current,
          size: {
            ...current.size,
            width: newScale,
          },
        };
        return next;
      });
    },
    [activeIndex, setImages]
  );

  const handleMove = useCallback(
    (direction, isShiftPressed) => {
      if (activeIndex === null) return;

      setImages((prevImages) => {
        const next = [...prevImages];
        const current = next[activeIndex];
        if (!current) return next;

        const moveStep = isShiftPressed ? 10 : 1;
        const currentPosition = current.position || { x: 0, y: 0 };

        let { x, y } = currentPosition;

        switch (direction) {
          case "left":
            x -= moveStep;
            break;
          case "right":
            x += moveStep;
            break;
          case "up":
            y -= moveStep;
            break;
          case "down":
            y += moveStep;
            break;
          default:
            break;
        }

        next[activeIndex] = {
          ...current,
          position: { x, y },
        };

        return next;
      });
    },
    [activeIndex, setImages]
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (activeIndex === null) return;

      // не мешаем, если пользователь печатает в input/textarea
      const tag = event.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (["ArrowUp", "ArrowDown"].includes(event.key)) {
        event.preventDefault();
      }

      const isShiftPressed = event.shiftKey;

      switch (event.key) {
        case "+":
        case "=":
          handleResize("increase", isShiftPressed);
          break;
        case "-":
        case "_":
          handleResize("decrease", isShiftPressed);
          break;
        case "ArrowLeft":
          handleMove("left", isShiftPressed);
          break;
        case "ArrowRight":
          handleMove("right", isShiftPressed);
          break;
        case "ArrowUp":
          handleMove("up", isShiftPressed);
          break;
        case "ArrowDown":
          handleMove("down", isShiftPressed);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, handleMove, handleResize]);

  const anyBordersVisible = images.some((img) => img.showBorders);

  return (
    <div className="page">
      <div className="container">
        {images.map((image, index) => (
          <div
            key={index}
            className={`rectangle ${rectangleClass} ${
              image.showBorders ? "" : "hide-borders"
            }`}
          >
            {/* Слой с фоном вместо <img> */}
            <div
              className={`image-layer ${image.flipped ? "image-flipped" : ""}`}
              style={{
                backgroundImage: image.src ? `url(${image.src})` : "none",
                backgroundRepeat: "no-repeat",
                backgroundPosition: `${image.position?.x || 0}px ${
                  image.position?.y || 0
                }px`,
                // масштаб по ширине: 100% = заполняет базовый размер
                backgroundSize: `${image.size?.width || 100}% auto`,
              }}
            />

            <button
              className="choice-button printable"
              onClick={() => setActiveIndex(index)}
            >
              <FcAddImage />
            </button>

            <button
              className="remove-button printable"
              onClick={() => handleRemoveImage(index)}
            >
              <FcRemoveImage />
            </button>

            <button
              className="flip-button printable"
              onClick={() => handleFlip(index)}
            >
              <BsPhoneFlip />
            </button>
          </div>
        ))}
      </div>

      <div className="buttons printable">
        {LAYOUTS.map((layout) => (
          <button
            key={layout.id}
            className="button-change"
            onClick={() =>
              handleSetStyleAndNumber(layout.className, layout.count)
            }
          >
            {layout.label}
          </button>
        ))}

        <button
          className="toggle-borders-button printable"
          onClick={handleToggleBorders}
        >
          {anyBordersVisible ? "Отключить границы?" : "Включить границы?"}
        </button>

        <button className="button-change" onClick={handleDuplicateImage}>
          Размножить <ImCopy />
        </button>

        {images.map((_, index) => (
          <div key={index}>
            <input
              className="input-img-button printable"
              type="file"
              accept="image/*"
              onChange={(event) => handleFileChange(event, index)}
            />
          </div>
        ))}

        <button className="all-remove" onClick={handleClearLocalStorage}>
          Очистить приложения!!!
        </button>
      </div>
    </div>
  );
};

export default App;
