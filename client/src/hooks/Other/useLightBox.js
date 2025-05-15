import { useState } from "react";

export default function useLightBox(images = []) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightBox = (index = 0) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeLightBox = () => {
    setIsOpen(false);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return {
    isOpen,
    currentIndex,
    openLightBox,
    closeLightBox,
    goToNext,
    goToPrev,
  };
}
