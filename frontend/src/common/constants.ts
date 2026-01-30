import { ToastPosition } from 'react-hot-toast';

export const toasterProps = {
  containerStyle: {
    fontFamily: 'Plus Jarkata Sans, sans-serif',
  },
  toastOptions: {
    style: {
      backgroundColor: 'var(--color-purple-shade-two)',
      border: '0.5px solid #232A2B',
      color: 'var(--color-white-shade-one)',
    },
  },
  position: 'bottom-center' as ToastPosition,
};