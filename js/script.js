document.addEventListener("DOMContentLoaded", () => {

const colorBox = document.getElementById("colorBox");
const colorCode = document.getElementById("colorCode");
const historyList = document.getElementById("historyList");
const customInput = document.getElementById("customInput");

let autoInterval;
let history = JSON.parse(localStorage.getItem("colorHistory")) || [];

/* Generate Random HEX */

function randomHex() {
  return "#" + Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0");
}

function setColor(color) {
  colorBox.style.background = color;
  colorCode.textContent = color;
  saveHistory(color);
}

function generateColor() {
  setColor(randomHex());
}

function generateGradient() {
  const c1 = randomHex();
  const c2 = randomHex();
  setColor(`linear-gradient(45deg, ${c1}, ${c2})`);
}

function toggleAuto() {
  if (autoInterval) {
    clearInterval(autoInterval);
    autoInterval = null;
  } else {
    autoInterval = setInterval(generateColor, 1000);
  }
}

function copyColor() {
  navigator.clipboard.writeText(colorCode.textContent);
}

/* Ripple */

document.querySelectorAll("button").forEach(button=>{
  button.addEventListener("click",function(e){
    const circle=document.createElement("span");
    circle.classList.add("ripple");
    const rect=this.getBoundingClientRect();
    const size=Math.max(rect.width,rect.height);
    circle.style.width=circle.style.height=size+"px";
    circle.style.left=e.clientX-rect.left-size/2+"px";
    circle.style.top=e.clientY-rect.top-size/2+"px";
    this.appendChild(circle);
    setTimeout(()=>circle.remove(),600);
  });
});

/* History */

function saveHistory(color) {
  if (!history.includes(color)) {
    history.unshift(color);
    if (history.length > 10) history.pop();
    localStorage.setItem("colorHistory", JSON.stringify(history));
    renderHistory();
  }
}

function renderHistory() {
  historyList.innerHTML = "";
  history.forEach(color => {
    const div = document.createElement("div");
    div.className = "history-item";
    div.style.background = color;
    div.onclick = () => setColor(color);
    historyList.appendChild(div);
  });
}

/* Custom */

function applyCustom() {
  const val = customInput.value;
  if (/^#([0-9A-F]{3}){1,2}$/i.test(val)) {
    setColor(val);
  }
}

/* Download */

function downloadImage() {
  const canvas = document.createElement("canvas");
  canvas.width = 500;
  canvas.height = 500;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = colorBox.style.background;
  ctx.fillRect(0,0,500,500);
  const link = document.createElement("a");
  link.download = "color.png";
  link.href = canvas.toDataURL();
  link.click();
}

/* Export */

function exportPalette(){
  const dataStr="data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(history));
  const dl=document.createElement("a");
  dl.setAttribute("href",dataStr);
  dl.setAttribute("download","palette.json");
  dl.click();
}

/* Cursor Trail */

document.addEventListener("mousemove", e=>{
  const dot=document.createElement("div");
  dot.className="cursor-dot";
  dot.style.left=e.clientX+"px";
  dot.style.top=e.clientY+"px";
  document.body.appendChild(dot);
  setTimeout(()=>dot.remove(),600);
});

/* Theme */

document.getElementById("themeToggle").onclick=()=>{
  document.body.classList.toggle("light");
};

/* Events */

document.getElementById("generateBtn").onclick=generateColor;
document.getElementById("gradientBtn").onclick=generateGradient;
document.getElementById("autoBtn").onclick=toggleAuto;
document.getElementById("copyBtn").onclick=copyColor;
document.getElementById("applyCustom").onclick=applyCustom;
document.getElementById("exportPalette").onclick=exportPalette;
document.getElementById("downloadImage").onclick=downloadImage;

renderHistory();
generateColor();

});