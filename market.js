// ===== API =====

const cryptoAPI =
"https://api.binance.com/api/v3/ticker/24hr";

const goldAPI =
"https://api.gold-api.com/price/XAU";

// ===== HTML =====

const btcPrice=document.getElementById("btc-price");
const btcChange=document.getElementById("btc-change");

const ethPrice=document.getElementById("eth-price");
const ethChange=document.getElementById("eth-change");

const xrpPrice=document.getElementById("xrp-price");
const xrpChange=document.getElementById("xrp-change");

const goldPrice=document.getElementById("gold-price");
const goldChange=document.getElementById("gold-change");

const eurPrice=document.getElementById("eur-price");
const eurChange=document.getElementById("eur-change");

// ===== Charts =====

let btcChart;

// ===== Helper =====

function percentClass(element,value){

element.classList.remove("up");
element.classList.remove("down");

if(value>=0){

element.classList.add("up");
element.innerHTML="▲ "+value.toFixed(2)+"%";

}else{

element.classList.add("down");
element.innerHTML="▼ "+Math.abs(value).toFixed(2)+"%";

}

}
async function drawBTCChart(){

try{

const res=await fetch(
"https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1"
);

const data=await res.json();

const prices=data.prices.map(item=>item[1]);

const ctx=document.getElementById("btcChart");

if(btcChart){

btcChart.destroy();

}

btcChart=new Chart(ctx,{

type:"line",

data:{

labels:prices.map(()=>""),

datasets:[{

data:prices,

borderColor:"#22c55e",

borderWidth:2,

pointRadius:0,

fill:false,

tension:.35

}]

},

options:{

responsive:false,

plugins:{

legend:{
display:false
}

},

scales:{

x:{
display:false
},

y:{
display:false
}

}

}

});

}catch(err){

console.log(err);

}

}


// ===== Crypto =====

async function loadCrypto(){

try{

const res = await fetch(cryptoAPI);

const data = await res.json();

const btc = data.find(item => item.symbol === "BTCUSDT");
const eth = data.find(item => item.symbol === "ETHUSDT");
const xrp = data.find(item => item.symbol === "XRPUSDT");

btcPrice.innerHTML = "$" + Number(btc.lastPrice).toLocaleString();
pushData(charts.btc,Number(btc.lastPrice));

drawChart(

"btcChart",

charts.btc,

Number(btc.priceChangePercent)>=0

?

"#22c55e"

:

"#ef4444"

);
ethPrice.innerHTML = "$" + Number(eth.lastPrice).toLocaleString();
pushData(charts.eth,Number(eth.lastPrice));

drawChart(

"ethChart",

charts.eth,

Number(eth.priceChangePercent)>=0

?

"#22c55e"

:

"#ef4444"

);
xrpPrice.innerHTML = "$" + Number(xrp.lastPrice).toFixed(4);
pushData(charts.xrp,Number(xrp.lastPrice));

drawChart(

"xrpChart",

charts.xrp,

Number(xrp.priceChangePercent)>=0

?

"#22c55e"

:

"#ef4444"

);

percentClass(btcChange, Number(btc.priceChangePercent));
percentClass(ethChange, Number(eth.priceChangePercent));
percentClass(xrpChange, Number(xrp.priceChangePercent));

}catch(err){

console.error(err);

}

}
// ===== Gold =====

async function loadGold(){

try{

const res=await fetch(goldAPI);

const data=await res.json();

goldPrice.innerHTML="$"+Number(data.price).toFixed(2);
pushData(charts.gold,Number(data.price));

drawChart("goldChart",charts.gold,"#facc15");

// API رایگان تغییر 24 ساعته نمی‌دهد
goldChange.innerHTML="LIVE";
goldChange.classList.remove("down");
goldChange.classList.add("up");

}catch(err){

console.log(err);

goldPrice.innerHTML="Error";

}

}



// ===== Forex =====

async function loadForex(){

try{

const res=await fetch("https://open.er-api.com/v6/latest/USD");

const data=await res.json();

const eur=data.rates.EUR;

eurPrice.innerHTML=eur.toFixed(4);
pushData(charts.eur,eur);

drawChart("eurChart",charts.eur,"#38bdf8");

eurChange.innerHTML="LIVE";
eurChange.classList.remove("down");
eurChange.classList.add("up");

}catch(err){

console.log(err);

eurPrice.innerHTML="Error";

}

}
function updateTime(){

const now=new Date();

update.innerHTML=
"Last Update : "+
now.toLocaleTimeString("en-GB",{

hour:"2-digit",
minute:"2-digit",
second:"2-digit"

});

}
loadCrypto();
loadGold();
loadForex();
drawBTCChart();
updateTime();

setInterval(()=>{

loadCrypto();
loadGold();
loadForex();
drawBTCChart();
updateTime();

},5000);
// ===== Mini Charts =====

const charts = {

btc: [],
eth: [],
xrp: [],
gold: [],
eur: []

};

function pushData(array,value){

array.push(value);

if(array.length>60){

array.shift();

}

}

function drawChart(canvasId,data,color){

const canvas=document.getElementById(canvasId);

if(!canvas) return;

const ctx=canvas.getContext("2d");

ctx.clearRect(0,0,canvas.width,canvas.height);

if(data.length<2) return;

const min=Math.min(...data);

const max=Math.max(...data);

const range=(max-min)||1;

ctx.beginPath();

ctx.lineWidth=3;

ctx.lineCap="round";

ctx.lineJoin="round";

ctx.strokeStyle=color;

for(let i=0;i<data.length;i++){

const x=(i/(data.length-1))*canvas.width;

const y=canvas.height-((data[i]-min)/range)*canvas.height;

if(i===0){

ctx.moveTo(x,y);

}else{

const prevX=((i-1)/(data.length-1))*canvas.width;

const prevY=canvas.height-((data[i-1]-min)/range)*canvas.height;

const cx=(prevX+x)/2;

ctx.quadraticCurveTo(prevX,prevY,cx,(prevY+y)/2);

}

}

ctx.stroke();
ctx.lineTo(canvas.width,canvas.height);

ctx.lineTo(0,canvas.height);

ctx.closePath();

ctx.globalAlpha=0.08;

ctx.fillStyle=color;

ctx.fill();

ctx.globalAlpha=1;

}