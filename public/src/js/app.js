let deferredPrompt;

if("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").then(function() {
    console.log("Service worker зареєстровано!");
  });
}

window.addEventListener("beforeinstallprompt", function(event) {
  console.log("beforeinstallprompt скасовано");
  event.preventDefault();
  deferredPrompt = event;
  return false;
});
