const { desktopCapturer, remote } = require('electron');
const { dialog, Menu } = remote;
const { writeFile } = require('fs');

let mediaRecorder; // MediaRecorder instance to capture footage
const recordedChunks = [];

const videoElement = document.querySelector('video');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const videoSelectBtn = document.getElementById('videoSelectBtn');
const playBtn = document.getElementById('playBtn');
const saveBtn = document.getElementById('saveBtn');

// Вибір джерела відео
videoSelectBtn.onclick = getVideoSources;

// Запуск запису
startBtn.onclick = e => {
  mediaRecorder.start();
  startBtn.classList.add('is-danger');
  startBtn.innerText = 'Recording';
};

// Зупинка запису
stopBtn.onclick = e => {
  mediaRecorder.stop();
  startBtn.classList.remove('is-danger');
  startBtn.innerText = 'Start';
};

// Відтворення записаного відео
playBtn.onclick = async e => {
  const blob = new Blob(recordedChunks, {
    type: 'video/webm; codecs=vp9'
  });
  const url = URL.createObjectURL(blob);
  videoElement.src = url;
  videoElement.play();
};

// Збереження відео
saveBtn.onclick = async e => {
  const blob = new Blob(recordedChunks, {
    type: 'video/webm; codecs=vp9'
  });
  const buffer = Buffer.from(await blob.arrayBuffer());
  const { filePath } = await dialog.showSaveDialog({
    buttonLabel: 'Save video',
    defaultPath: `vid-${Date.now()}.webm`
  });

  if (filePath) {
    writeFile(filePath, buffer, () => console.log('Video saved successfully!'));
  }
};


// Функція для отримання доступних джерел для запису відео
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

// Функція для вибору джерела відео
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

  // Отримання потоку відео
  const stream = await navigator.mediaDevices.getUserMedia(constraints);

  // Попередній перегляд відео
  videoElement.srcObject = stream;
  videoElement.play();

  // Налаштування MediaRecorder
  const options = { mimeType: 'video/webm; codecs=vp9' };
  mediaRecorder = new MediaRecorder(stream, options);

  // Обробники подій для MediaRecorder
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.onstop = handleStop;

  // Запис фрагментів відео
  mediaRecorder.start();
}

// Функція для обробки доступних даних відео
function handleDataAvailable(e) {
  recordedChunks.push(e.data);
}

// Функція для зупинки запису та збереження відеофайлу
async function handleStop(e) {
  const blob = new Blob(recordedChunks, {
    type: 'video/webm; codecs=vp9'
  });

  const buffer = Buffer.from(await blob.arrayBuffer());

  // Збереження файлу за допомогою dialog.showSaveDialog
  const { filePath } = await dialog.showSaveDialog({
    buttonLabel: 'Save video',
    defaultPath: `vid-${Date.now()}.webm`
  });

  if (filePath) {
    writeFile(filePath, buffer, () => console.log('Video saved successfully!'));
  }
}