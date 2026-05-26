function showToast(message, type = "info") {
  let box = document.getElementById("toastBox");

  if (!box) {
    box = document.createElement("div");
    box.id = "toastBox";
    document.body.appendChild(box);
  }

  const toast = document.createElement("div");
  toast.className = `toast-message ${type}`;
  toast.innerText = message;

  box.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

const style = document.createElement("style");
style.innerHTML = `
#toastBox{
  position: fixed !important;
  top: 20px !important;
  left: 50% !important;
  right: auto !important;
  transform: translateX(-50%) !important;
  z-index: 99999 !important;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.toast-message{
  min-width:260px;
  margin-bottom:12px;
  padding:14px 18px;
  border-radius:12px;
  color:white;
  font-weight:600;
  box-shadow:0 10px 25px rgba(0,0,0,0.18);
  animation:slideIn .3s ease;
}
.toast-message.success{background:#16a34a;}
.toast-message.error{background:#dc2626;}
.toast-message.warning{background:#f59e0b;}
.toast-message.info{background:#0f766e;}

@keyframes slideIn{
  from{
    transform: translateY(-20px);
    opacity: 0;
  }
  to{
    transform: translateY(0);
    opacity: 1;
  }
}
`;
document.head.appendChild(style);