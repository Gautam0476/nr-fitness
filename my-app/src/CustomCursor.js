import React, { useState, useEffect } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updatePosition);
    
    return () => {
      window.removeEventListener('mousemove', updatePosition);
    };
  }, []);

  return (
    <div
      className="fixed pointer-events-none z-[9999] transition-transform duration-75 ease-out"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)', // Star ko mouse ke ekdum center me rakhne ke liye
      }}
    >
      {/* Orange Star SVG with Premium Glow */}
      <svg 
        width="28" 
        height="28" 
        viewBox="0 0 24 24" 
        fill="#f97316" /* Tailwind orange-500 */
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0px 0px 8px rgba(249, 115, 22, 0.8))' }}
      >
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
    </div>
  );
};

export default CustomCursor;