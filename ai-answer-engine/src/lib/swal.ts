import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

// Base configuration for dark/glassmorphic theme
const swalConfig = {
  background: '#1a1a1a', // Dark background
  color: '#ffffff', // White text
  confirmButtonColor: '#3b82f6', // Primary blue
  cancelButtonColor: '#ef4444', // Destructive red
  customClass: {
    popup: 'glass-card border border-border/50 rounded-xl shadow-2xl backdrop-blur-xl',
    title: 'text-xl font-bold tracking-tight text-foreground',
    htmlContainer: 'text-muted-foreground',
    confirmButton: 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2',
    cancelButton: 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2 mr-2',
    input: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
  },
  buttonsStyling: false // Disable default SweetAlert2 styling to use our Tailwind classes
};

export const showAlert = (options: Record<string, unknown>) => {
  return MySwal.fire({
    ...swalConfig,
    ...options
  });
};

export const showConfirm = async (title: string, text: string, confirmText = 'Yes, delete it!') => {
  const result = await MySwal.fire({
    ...swalConfig,
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancel',
    reverseButtons: true
  });
  
  return result.isConfirmed;
};

export const showToast = (title: string, icon: 'success' | 'error' | 'warning' | 'info' = 'success') => {
  const Toast = MySwal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
    ...swalConfig,
    customClass: {
      popup: 'glass-card border border-border/50 rounded-xl shadow-lg backdrop-blur-xl flex items-center p-4',
      title: 'text-sm font-medium text-foreground ml-2',
      timerProgressBar: 'bg-primary'
    }
  });

  return Toast.fire({
    icon,
    title
  });
};

export default MySwal;
