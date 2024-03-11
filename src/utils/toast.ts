export const toast = (options: {
  message: string;
  duration?: number;
}) => {
  const { message, duration = 3000 } = options;

  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.position = 'fixed';
  toast.style.top = '20px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.padding = '10px 20px';
  toast.style.borderRadius = '5px';
  toast.style.color = '#fff';
  toast.style.fontSize = '16px';
  toast.style.zIndex = '9999';
  toast.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
  toast.style.transition = 'all 0.3s';
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, duration);
}