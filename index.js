const youtubeSource = document.querySelector("video");
const youtubeControl = document.querySelector(".ytp-right-controls");
const toggleBtn = document.createElement("button");
toggleBtn.classList = "ytp-button ytp-hd-quality-badge";
toggleBtn.title = "Visualize"
toggleBtn.innerHTML = `<svg height="36px" width="36px" style="transform: scale(0.5, 0.5);" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#ffffff" d="M224 96l16-32 32-16-32-16-16-32-16 32-32 16 32 16 16 32zM80 160l26.66-53.33L160 80l-53.34-26.67L80 0 53.34 53.33 0 80l53.34 26.67L80 160zm352 128l-26.66 53.33L352 368l53.34 26.67L432 448l26.66-53.33L512 368l-53.34-26.67L432 288zm70.62-193.77L417.77 9.38C411.53 3.12 403.34 0 395.15 0c-8.19 0-16.38 3.12-22.63 9.38L9.38 372.52c-12.5 12.5-12.5 32.76 0 45.25l84.85 84.85c6.25 6.25 14.44 9.37 22.62 9.37 8.19 0 16.38-3.12 22.63-9.37l363.14-363.15c12.5-12.48 12.5-32.75 0-45.24zM359.45 203.46l-50.91-50.91 86.6-86.6 50.91 50.91-86.6 86.6z" class=""></path></svg>`;
youtubeControl.insertBefore(toggleBtn, youtubeControl.children[0]);

let enableVisualize = true;

toggleBtn.addEventListener("click", () => {
  if (enableVisualize) {
    canvas.style.display = "none";
  } else {
    canvas.style.display = "block";
  }
  enableVisualize = !enableVisualize;
})

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

const dpr = 2;

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