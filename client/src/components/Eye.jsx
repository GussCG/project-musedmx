import React, { useState, useRef } from "react";
import Lottie from "react-lottie";
import eyeAnimation from "../assets/animated/eye-animated-icon.json";

function Eye() {
  const [isOpen, setIsOpen] = useState(false);
  const lottieRef = useRef(null);

  const handleClick = () => {
    setIsOpen((prevState) => !prevState);
  };

  const options = {
    animationData: eyeAnimation,
    loop: false,
    autoplay: false,
  };

  return (
    <div onClick={handleClick} className="eye-icon">
      <Lottie
        ref={lottieRef}
        options={options}
        height={30}
        width={30}
        isStopped={false}
        isPaused={false}
        direction={isOpen ? 1 : -1}
        speed={1}
        eventListeners={[
          {
            eventName: "complete",
            callback: () => {
              if (lottieRef.current) {
                lottieRef.current.goToAndStop(
                  isOpen ? lottieRef.current.getDuration(true) : 0,
                  true
                );
              }
              console.log("Animation completed");
            },
          },
        ]}
      />
    </div>
  );
}

export default Eye;
