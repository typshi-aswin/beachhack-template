import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import { router } from './router.tsx';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { toasterProps } from './common/constants.ts';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster {...toasterProps} />
  </StrictMode>,
)