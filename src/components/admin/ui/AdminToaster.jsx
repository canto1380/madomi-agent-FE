import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../styles/admin-toast.css';

export function AdminToaster() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={4500}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable={false}
      theme="colored"
      limit={4}
      aria-label="Notificaciones"
    />
  );
}
