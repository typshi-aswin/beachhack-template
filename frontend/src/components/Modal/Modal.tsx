import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactDOM from 'react-dom';
import styles from './Modal.module.css';
import { IoClose } from 'react-icons/io5';

const Modal = ({
  onClose,
  title,
  children,
  style,
  position = 'center',
  zIndex = 1001,
  isOpen = true,
}: {
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  position?: 'center' | 'right';
  zIndex?: number;
  isOpen?: boolean | { visible: boolean; [key: string]: unknown };
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, [onClose, title, children, style, position, zIndex]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  if (!isOpen) return null;

  const portalTarget = document.body;

  return ReactDOM.createPortal(
    <AnimatePresence mode='wait'>
      {isVisible && (
        <motion.div
          className={`${styles.modalOverlay} ${styles[`position-${position}`]}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleClose}
          style={{ zIndex }}
        >
          <motion.div
            className={`${styles.modalContent} ${styles[`position-${position}`]}`}
            style={style}
            initial={
              position === 'center' ? { opacity: 0, scale: 0.95, y: 20 } : { opacity: 0, x: '50%' }
            }
            animate={position === 'center' ? { opacity: 1, scale: 1, y: 0 } : { opacity: 1, x: 0 }}
            exit={
              position === 'center' ? { opacity: 0, scale: 0.95, y: 20 } : { opacity: 0, x: '50%' }
            }
            transition={{ duration: 0.25, ease: 'easeOut', type: 'tween' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderLeft}>
                {/* <FiChevronsRight /> */}
                <IoClose onClick={onClose} style={{ cursor: "pointer" }} />
              </div>
              {/* <div className={styles.modalHeaderRight}>
                <div className={styles.upButton}>
                  <FiChevronUp />
                </div>
                <div className={styles.downButton}>
                  <FiChevronDown />
                </div>
              </div> */}
            </div>

            <motion.div
              className={styles.modalBody}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2, delay: 0.05, ease: 'easeOut', type: 'tween' }}
            >
              {children}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    portalTarget,
  );
};

export default Modal;