import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const forceScrollToTop = () => {
  // Try every possible method to ensure scrolling works
  try {
    // Method 1: Using window.scrollTo
    window.scrollTo(0, 0);
    
    // Method 2: Using window.scroll with options
    if ('scrollBehavior' in document.documentElement.style) {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'auto'
      });
    }
    
    // Method 3: Scroll both html and body elements
    if (document.documentElement.scrollTop > 0) {
      document.documentElement.scrollTop = 0;
    }
    
    if (document.body.scrollTop > 0) {
      document.body.scrollTop = 0;
    }
    
    // Method 4: Set scrollTop on both html and body
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Method 5: Force layout and scroll again
    document.body.getBoundingClientRect();
    window.scrollTo(0, 0);
    
    // Method 6: Try scrolling after a short delay
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 10);
    
  } catch (error) {
    console.error('Error in forceScrollToTop:', error);
  }
};

export const useScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Scroll immediately when the component mounts or updates
    forceScrollToTop();
    
    // Scroll again after a short delay to catch any async rendering
    const timer1 = setTimeout(forceScrollToTop, 50);
    const timer2 = setTimeout(forceScrollToTop, 100);
    const timer3 = setTimeout(forceScrollToTop, 300);
    
    // Scroll when the page finishes loading
    window.addEventListener('load', forceScrollToTop);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      window.removeEventListener('load', forceScrollToTop);
    };
  }, [pathname, search]);

  return null;
};

export default useScrollToTop;
