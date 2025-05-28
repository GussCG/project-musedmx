import { useState, useEffect } from "react";
import placeholder from "../../assets/images/placeholders/user_placeholder.png";

function UserImage({ src, alt, ...props }) {
  const [cacheBuster, setCacheBuster] = useState(Date.now());

  useEffect(() => {
    if (src && !src.startsWith("blob:")) {
      setCacheBuster(Date.now());
    }
  }, [src]);

  let imgSrc;
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
