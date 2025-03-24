import { useEffect, useRef } from 'react';

const HexagonBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let hexagons = [];

    // Set canvas dimensions
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initHexagons();
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Hexagon properties
    function initHexagons() {
      hexagons = [];
      const hexSize = 30;
      const horizontalSpacing = hexSize * 1.7;
      const verticalSpacing = hexSize * 1.5;
      
      const columns = Math.ceil(canvas.width / horizontalSpacing) + 1;
      const rows = Math.ceil(canvas.height / verticalSpacing) + 1;
      
      for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * horizontalSpacing + (j % 2 === 0 ? 0 : horizontalSpacing / 2);
          const y = j * verticalSpacing;
          
          hexagons.push({
            x,
            y,
            size: hexSize,
            opacity: Math.random() * 0.2 + 0.1,
            pulse: Math.random() * 2 * Math.PI,
            pulseSpeed: 0.01 + Math.random() * 0.02
          });
        }
      }
    }

    // Draw a hexagon
    function drawHexagon(x, y, size, opacity) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const xPos = x + size * Math.cos(angle);
        const yPos = y + size * Math.sin(angle);
        
        if (i === 0) {
          ctx.moveTo(xPos, yPos);
        } else {
          ctx.lineTo(xPos, yPos);
        }
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(8, 145, 178, ${opacity})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      hexagons.forEach(hex => {
        hex.pulse += hex.pulseSpeed;
        const pulseOpacity = hex.opacity + Math.sin(hex.pulse) * 0.1;
        drawHexagon(hex.x, hex.y, hex.size, pulseOpacity);
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-0 opacity-50"
    />
  );
};

export default HexagonBackground;
