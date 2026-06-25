import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * ThreeDTiltCard — A component that applies a 3D tilt effect on hover,
 * complete with smooth spring dynamics and a mouse-tracking glare shine.
 */
const ThreeDTiltCard = ({ children, style = {}, disabled = false, ...props }) => {
  const ref = useRef(null);
  const [hovering, setHovering] = useState(false);

  // Motion values to track normalized pointer coordinates [0, 1]
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // Custom springs for responsiveness and premium feeling
  const springConfig = { damping: 22, stiffness: 180, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [0, 1], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(x, [0, 1], [-15, 15]), springConfig);

  // Position glare layer centered on the cursor
  const glareLeft = useTransform(x, [0, 1], ['-20%', '120%']);
  const glareTop = useTransform(y, [0, 1], ['-20%', '120%']);
  const glareOpacity = useSpring(useTransform(x, [0, 0.5, 1], [0.35, 0.05, 0.35]), springConfig);

  const handleMouseMove = (e) => {
    if (disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseEnter = () => {
    if (disabled) return;
    setHovering(true);
  };

  const handleMouseLeave = () => {
    setHovering(false);
    // Reset spring to center
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000,
        rotateX: disabled ? 0 : rotateX,
        rotateY: disabled ? 0 : rotateY,
        position: 'relative',
        ...style,
      }}
      {...props}
    >
      {/* Glare Shine Layer */}
      {!disabled && hovering && (
        <motion.div
          style={{
            position: 'absolute',
            left: glareLeft,
            top: glareTop,
            width: '60%',
            height: '60%',
            transform: 'translate(-50%, -50%) translateZ(1px)',
            borderRadius: '50%',
            pointerEvents: 'none',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 70%)',
            opacity: glareOpacity,
            zIndex: 99,
          }}
        />
      )}
      
      {/* Content wrapper with pop-out depth */}
      <div style={{ transform: 'translateZ(15px)', transformStyle: 'preserve-3d', height: '100%' }}>
        {children}
      </div>
    </motion.div>
  );
};

export default ThreeDTiltCard;
