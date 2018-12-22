const youtubeSource = document.querySelector("video");
const audioCtx = new window.AudioContext();

const gainNode = audioCtx.createGain();

const analyser = audioCtx.createAnalyser();
analyser.fftSize = 2048;

let dataArray = new Uint8Array(analyser.frequencyBinCount);

const youtubeSound = audioCtx.createMediaElementSource(youtubeSource);

youtubeSound.connect(gainNode);
youtubeSound.connect(analyser);
analyser.connect(audioCtx.destination);
gainNode.connect(audioCtx.destination);

const dpr = window.devicePixelRatio || 1;

const canvas = document.createElement("canvas");
youtubeSource.parentElement.appendChild(canvas);
canvas.height = youtubeSource.clientHeight;
canvas.width = youtubeSource.clientWidth;
canvas.style.zIndex = 9999;
canvas.style.top = youtubeSource.style.top || 0;
canvas.style.left = youtubeSource.style.left || 0;
canvas.style.position = "absolute";
canvas.style.background = "linear-gradient(rgba(0, 0, 0, 0) 80%, rgba(0, 0, 0, .7) 85%, rgba(0, 0, 0, 1) 87%)";

document.addEventListener("DOMSubtreeModified", () => {
  canvas.style.top = youtubeSource.style.top || 0;
  canvas.style.left = youtubeSource.style.left || 0;
  canvas.height = youtubeSource.clientHeight;
  canvas.width = youtubeSource.clientWidth;
})

const ctx = canvas.getContext("2d");

const draw = () => {
  window.requestAnimationFrame(draw);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  analyser.getByteTimeDomainData(dataArray);
  dataArray.forEach((ele, index) => {
    if (index % 8 === 0) {
      drawVolume(
        ctx,
        ((canvas.width * dpr) / analyser.fftSize) * (index + 3),
        canvas.height * 0.9,
        ((canvas.width * dpr) / analyser.fftSize) * 2.5,
        -Math.pow(Math.abs(ele - 128), 1.5) * 0.1
      );
    }
  });
};

const drawVolume = (ctx, startX, startY, width, height) => {
  ctx.fillStyle = "white";
  ctx.fillRect(startX, startY, width, height);
};

draw();