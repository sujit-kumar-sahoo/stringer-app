import Swal from "sweetalert2";
import "@/css/sweetalert.css";


export const showAlert = (
  title: string,
  text: string,
  icon: "success" | "error" | "warning" | "info" | "question",
  confirmButtonText: string = "OK"
) => {
  return Swal.fire({
    title,
    text,
    icon,
    confirmButtonText,
    customClass: {
        confirmButton: "custom-confirm-button",
      },
  });
};

export const showConfirmation = async (
  title: string,
  text: string,
  confirmButtonText: string = "Yes",
  cancelButtonText: string = "No"
) => {
  const result = await Swal.fire({
    title,
    text,
    icon: "question",
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
  });
  return result.isConfirmed;
};

export const toastAlert = ({
  html,
  icon = "info",
  position = "top-end",
  showCloseButton = true,
  customClass = "custom-toast",
}: {
  html: string;
  icon?: "success" | "error" | "warning" | "info";
  position?: "top-end" | "top-start" | "bottom-end" | "bottom-start" | "top" | "center" | "bottom";
  showCloseButton?: boolean;
  customClass?: string;
}) => {
  return Swal.fire({
    toast: true,
    position,
    icon,
    html,
    showCloseButton,
    showConfirmButton: false,
    timer: undefined, // ❌ no auto-dismiss
    timerProgressBar: false,
    customClass: {
      popup: customClass,
    },
    backdrop: false, // ✅ does NOT block other modals
  });
};


