const { desktopCapturer, remote } = require('electron');
const { dialog } = remote;
const { writeFile } = require('fs');

const videoElement = document.querySelector('video');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const openBtn = document.getElementById('openBtn');
const videoSelectBtn = document.getElementById('videoSelectBtn');

let mediaRecorder; // MediaRecorder instance to capture footage
const recordedChunks = [];

videoSelectBtn.onclick = getVideoSources;

startBtn.onclick = e => {
  mediaRecorder.start();
  startBtn.classList.add('is-danger');
  startBtn.innerText = 'Recording';
};

stopBtn.onclick = e => {
  mediaRecorder.stop();
  startBtn.classList.remove('is-danger');
  startBtn.innerText = 'Start';
};

openBtn.onclick = e => {
  const { filePaths } = dialog.showOpenDialog({
    buttonLabel: 'Open video',
    properties: ['openFile'],
    filters: [{ name: 'Videos', extensions: ['webm'] }]
  });

  if (!filePaths.length) return;
  videoElement.src = URL.createObjectURL(new Blob([fs.readFileSync(filePaths[0])]));
  videoElement.play();
};

async function getVideoSources() {
  const inputSources = await desktopCapturer.getSources({
    types: ['window', 'screen']
  });

  const videoOptionsMenu = Menu.buildFromTemplate(
    inputSources.map(source => {
      return {
        label: source.name,
        click: () => selectSource(source)
      };
    })
  );

  videoOptionsMenu.popup();
}

async function selectSource(source) {
  videoSelectBtn.innerText = source.name;

  const constraints = {
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: source.id
      }
    }
  };

  const stream = await navigator.mediaDevices.getUserMedia(constraints);

  videoElement.srcObject = stream;
  videoElement.play();

  const options = { mimeType: 'video/webm; codecs=vp9' };
  mediaRecorder = new MediaRecorder(stream, options);

  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.onstop = handleStop;
}

function handleDataAvailable(e) {
  console.log('video data available');
  recordedChunks.push(e.data);
}

async function handleStop(e) {
  const blob = new Blob(recordedChunks, {
    type: 'video/webm; codecs=vp9'
  });

  const buffer = Buffer.from(await blob.arrayBuffer());
  const { filePath } = await dialog.showSaveDialog({
    buttonLabel: 'Save video',
    defaultPath: `vid-${Date.now()}.webm`
  });

  writeFile(filePath, buffer, () => console.log('video saved successfully!'));
}
