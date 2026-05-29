function showToast(message, type = 'success') {

  Swal.fire({
    toast: true,

    position: 'top',

    icon: type,

    title: message,

    showConfirmButton: false,

    timer: 3000,

    timerProgressBar: true
  });
}

const style = document.createElement("style");
style.innerHTML = `
#toastBox {
  position: fixed !important;
top: 24px !important;
left: 50% !important;
transform: translateX(-50%) !important;
  z-index: 999999 !important;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.toast-message {
  min-width: 280px;
  max-width: 360px;
  padding: 14px 18px;
  border-radius: 14px;
  color: #ffffff !important;
  font-size: 15px !important;
  font-weight: 700 !important;
  line-height: 1.4 !important;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.22);
  animation: toastSlide 0.25s ease;
}

.toast-success {
  background: #16a34a !important;
}

.toast-error {
  background: #ef4444 !important;
}

.toast-warning {
  background: #f59e0b !important;
}

.toast-info {
  background: #0f766e !important;
}

@keyframes toastSlide {
  from {
    transform: translateX(30px);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}
`;
document.head.appendChild(style);