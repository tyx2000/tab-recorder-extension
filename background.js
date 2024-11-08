let mediaRecorder;
let chunks = [];
let recording = false;

function startTabCapture() {
  chrome.tabCapture.capture({
    audio: true, // 如果需要音频
    video: true  // 如果需要视频
  }, function(stream) {
    if (stream) {
        recording = true;
        chrome.action.setBadgeText({ text: "ing" });
      // 成功获取流，可以进行录制或其他处理
      startRecording(stream);
    } else {
      // 处理错误情况
      console.error('Failed to capture tab.');
    }
  });
}

function startRecording(stream) {
  const options = { mimeType: 'video/webm' };
  mediaRecorder = new MediaRecorder(stream, options);
  mediaRecorder.ondataavailable = event => {
    if (event.data.size > 0) {
      chunks.push(event.data);
    }
  };
  mediaRecorder.onstop = () => {
    const blob = new Blob(chunks, { type: 'video/webm' });
    chunks = [];
    saveBlob(blob); // 保存录制的视频文件
  };
  mediaRecorder.start();
}

function stopRecording() {
  if (mediaRecorder) {
    mediaRecorder.stop();
    recording = false;
    chrome.action.setBadgeText({ text: "" });
  }
}

function saveBlob(blob) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'captured-tab.webm';
  a.click();
  window.URL.revokeObjectURL(url);
}


// chrome.action.onClicked.addListener(async (tab) => {
//     console.log(e);
//     const stream = await navigator.mediaDevices.getDisplayMedia({
//         video: true
//     })
//     if (recording) {
//         stopRecording();
//     } else {
//         startTabCapture();
//     }
// })