import { useState, useEffect } from "react";

export const useScrollTop = (threshold = 10) => {

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {

    // 如果垂直滚动超过10单位，则更改 scrolled 变量状态
    const handleScroll = () => {
      if (window.scrollY > threshold) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    }

  }, [threshold])


  return scrolled;
}