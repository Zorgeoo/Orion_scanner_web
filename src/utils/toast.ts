import { toast, ToastOptions, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showToast = {
  success: (message: string, options?: ToastOptions) =>
    toast.success(message, { ...options }),

  error: (message: string, options?: ToastOptions) =>
    toast.error(message, { ...options }),
};
