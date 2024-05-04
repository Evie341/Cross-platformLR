const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

ipcRenderer.on("cpu", (event, data) => {
  document.getElementById("cpu").innerHTML = data.toFixed(2);
});

ipcRenderer.on("mem", (event, data) => {
  document.getElementById("mem").innerHTML = data.toFixed(2);
});

ipcRenderer.on("total-mem", (event, data) => {
  document.getElementById("total-mem").innerHTML = data.toFixed(2);
});
