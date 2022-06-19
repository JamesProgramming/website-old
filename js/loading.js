export const canvas = document.createElement("canvas");
//document.body.insertAdjacentElement("afterbegin", canvas);
canvas.style.top = 0;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.position = "fixed";
canvas.style.backgroundColor = "#fefefeaa";
canvas.style.backdropFilter = "blur(2px)";
canvas.style.zIndex = "1000000";
const ctx = canvas.getContext("2d");

const arcCreator = function (obj) {
  ctx.fillStyle = obj.fill;
  ctx.strokeStyle = obj.lineFill;
  if (obj.gradient) {
    let grd = ctx.createLinearGradient(...obj.gradient);
    grd.addColorStop(...obj.gradientStart);
    grd.addColorStop(...obj.gradientStop);
    ctx.strokeStyle = grd;
  }
  ctx.lineWidth = obj.lineWidth;
  ctx.shadowColor = obj.shadowColor;
  ctx.shadowBlur = obj.shadowBlur;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(obj.x, obj.y, obj.radius, obj.startA, obj.stopA);
  if (!obj.lineWidth) ctx.fill();
  else ctx.stroke();
};

const animationArr = {
  spinner: {
    lineFill: "#0A4BFF",
    lineWidth: 18,
    gradient: [0 - 70, 0 - 70, 0 + 70, 0 + 70],
    gradientStart: [0, "#1d59fd"],
    gradientStop: [1, "#0B0EDF"],
    x: 0,
    y: 0,
    radius: 70,
    startA: Math.PI / 2,
    stopA: Math.PI,
    shadowColor: "rgba(0,0,0, 0.1)",
    shadowBlur: "20",
  },
  spinnerBackground: {
    lineFill: "#E9E9E9",
    lineWidth: 18,
    x: 0,
    y: 0,
    radius: 70,
    startA: 0,
    stopA: Math.PI * 2,
    shadowColor: "rgba(0,0,0, 0.1)",
    shadowBlur: "20",
  },
  spinnerOffset: function () {
    if (this.spinnerIncrease) {
      this.spinner.startA = this.spinner.startA + 0.02 * this.acceleration;
      this.spinner.stopA = this.spinner.stopA + 0.1 * this.deceleration;
      if (this.spinner.stopA - this.spinner.startA > Math.PI)
        this.spinnerIncrease = false;
    } else {
      this.spinner.startA = this.spinner.startA + 0.1 * this.deceleration;
      this.spinner.stopA = this.spinner.stopA + 0.02 * this.acceleration;
      if (this.spinner.stopA - this.spinner.startA < Math.PI / 3)
        this.spinnerIncrease = true;
    }
  },
  clientUpdateSize: function (x, y) {
    radius = this.spinner.radius;
    this.spinner.gradient = [x - radius, y - radius, x + radius, y + radius];
    this.spinnerBackground.x = this.spinner.x = x;
    this.spinnerBackground.y = this.spinner.y = y;
  },
  spinnerIncrease: false,
  acceleration: 1.5,
  deceleration: 0.5,
};

const redraw = function (obj) {
  arcCreator(obj.spinnerBackground);
  obj.spinnerOffset();
  arcCreator(obj.spinner);
};

const animate = function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  redraw(animationArr);
  requestAnimationFrame(animate);
};

window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  animationArr.clientUpdateSize(canvas.width / 2, canvas.height / 2);
});

animationArr.clientUpdateSize(canvas.width / 2, canvas.height / 2);
animate();
