import { useState, useEffect, useRef } from "react";
import placeholder from "../../assets/images/placeholders/user_placeholder.png";

function UserImage({ src, alt, ...props }) {
  const [cacheBuster, setCacheBuster] = useState("");
  const prevSrc = useRef(null);

  useEffect(() => {
    const cleanSrc = src || "";
    if (!cleanSrc.startsWith("blob:") && cleanSrc !== prevSrc.current) {
      setCacheBuster(Date.now());
      prevSrc.current = cleanSrc;
    }
  }, [src]);

  let imgSrc = src || placeholder;
  if (!src) {
    imgSrc = placeholder;
  } else if (src.startsWith("blob:")) {
    imgSrc = src;
  } else {
    imgSrc = `${src}?_=${cacheBuster}`;
  }

  return <img src={imgSrc} alt={alt} {...props} />;
}

export default UserImage;
