import { motion } from 'framer-motion';

/**
 * ScrollReveal — Animate components smoothly as they enter the viewport.
 */
const ScrollReveal = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.65,
  distance = 30,
  style = {},
  ...props
}) => {
  const getDirections = () => {
    switch (direction) {
      case 'up': return { y: distance };
      case 'down': return { y: -distance };
      case 'left': return { x: distance };
      case 'right': return { x: -distance };
      default: return { y: distance };
    }
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...getDirections(),
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier for a premium, snappy feeling
      }}
      style={{ ...style }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
