import { Fab } from "@material-ui/core";
import { motion } from "framer-motion";

const TOKEN_SIZE = 48;
const TOKEN_MIDPOINT = TOKEN_SIZE / 2;

export function ArcFab({ children, angle, onClick = () => {} }) {
    const startDistance = 0;
    const endDistance = TOKEN_SIZE * 1.5;
  
    const startX = Math.cos(angle) * startDistance;
    const startY = Math.sin(angle) * startDistance;
  
    const endX = Math.cos(angle) * endDistance;
    const endY = Math.sin(angle) * endDistance;
    const delay = 0.3;
  
    const variants = {
      hidden: { opacity: 0, left: TOKEN_MIDPOINT + startX, top: TOKEN_MIDPOINT - startY, transition: { delay }, pointerEvents: 'none' },
      visible: { opacity: 1, left: TOKEN_MIDPOINT + endX, top: TOKEN_MIDPOINT - endY, transition: { delay }, pointerEvents: 'all' },
    };
  
    return (
      <motion.div
        variants={variants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        style={{ transform: 'translate(-50%, -50%)', position: 'absolute', zIndex: 100 }}
      >
        <Fab
          color="primary"
          size="small"
          onClick={onClick}
          onMouseDown={(event) => event.stopPropagation()}
          onMouseUp={(event) => event.stopPropagation()}
        >
          {children}
        </Fab>
      </motion.div>
    );
  }
  