(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))d(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const l of r.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&d(l)}).observe(document,{childList:!0,subtree:!0});function i(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerpolicy&&(r.referrerPolicy=a.referrerpolicy),a.crossorigin==="use-credentials"?r.credentials="include":a.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function d(a){if(a.ep)return;a.ep=!0;const r=i(a);fetch(a.href,r)}})();document.addEventListener("DOMContentLoaded",function(){document.querySelectorAll("div.locationTarget").forEach(n=>{m(n)})},!1);function m(n){n.addEventListener("click",t=>{t.preventDefault();let i=document.getElementById("weeklyinfo");i.innerHTML="";let d=document.getElementById("dailyinfo");d.innerHTML="";let a,r;for(r=document.getElementsByClassName("locationTarget"),a=0;a<r.length;a++)r[a].className=r[a].className.replace(" active","");t.currentTarget.className+=" active";const l="https://api.open-meteo.com/v1/forecast?latitude="+t.currentTarget.dataset.lat+"&longitude="+t.currentTarget.dataset.lon+"&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,rain_sum,precipitation_hours&timezone="+t.currentTarget.dataset.time;fetch(l).then(o=>o.json()).then(o=>{let e=o;console.log(e),i.innerHTML=`
        <div class="dayTarget" data-json=`+JSON.stringify(e)+'> <div class="dayTarget__data">'+s(e.daily.time[0])+'</div><div class="dayTarget__data">🌡 '+parseFloat((e.daily.apparent_temperature_max[0]+e.daily.apparent_temperature_min[0])/2).toFixed(2)+`°C
        </div></div>
        <div class="dayTarget" data-json=`+JSON.stringify(e)+'> <div class="dayTarget__data">'+s(e.daily.time[1])+'</div><div class="dayTarget__data">🌡 '+parseFloat((e.daily.apparent_temperature_max[1]+e.daily.apparent_temperature_min[1])/2).toFixed(2)+`°C
        </div></div>
        <div class="dayTarget" data-json=`+JSON.stringify(e)+'> <div class="dayTarget__data">'+s(e.daily.time[2])+'</div><div class="dayTarget__data">🌡 '+parseFloat((e.daily.apparent_temperature_max[2]+e.daily.apparent_temperature_min[2])/2).toFixed(2)+`°C
        </div></div>
        <div class="dayTarget" data-json=`+JSON.stringify(e)+'> <div class="dayTarget__data">'+s(e.daily.time[3])+'</div><div class="dayTarget__data">🌡 '+parseFloat((e.daily.apparent_temperature_max[3]+e.daily.apparent_temperature_min[3])/2).toFixed(2)+`°C
        </div></div>
        <div class="dayTarget" data-json=`+JSON.stringify(e)+'> <div class="dayTarget__data">'+s(e.daily.time[4])+'</div><div class="dayTarget__data">🌡 '+parseFloat((e.daily.apparent_temperature_max[4]+e.daily.apparent_temperature_min[4])/2).toFixed(2)+`°C
        </div></div>
        <div class="dayTarget" data-json=`+JSON.stringify(e)+'> <div class="dayTarget__data">'+s(e.daily.time[5])+'</div><div class="dayTarget__data">🌡 '+parseFloat((e.daily.apparent_temperature_max[5]+e.daily.apparent_temperature_min[5])/2).toFixed(2)+`°C
        </div></div>
        <div class="dayTarget" data-json=`+JSON.stringify(e)+'> <div class="dayTarget__data">'+s(e.daily.time[6])+'</div><div class="dayTarget__data">🌡 '+parseFloat((e.daily.apparent_temperature_max[6]+e.daily.apparent_temperature_min[6])/2).toFixed(2)+`°C
        </div></div>`,document.querySelectorAll("div.dayTarget").forEach(c=>{p(c)})}).catch(o=>{console.error("Falha na chamada da API!"),console.error(o)})})}function s(n){let t=n.split("-"),i=t[1],d=t[2];var a=["JAN","FEV","MAR","ABR","MAI","JUN","JUL","AGO","SET","OUT","NOV","DEZ"][parseInt(i)-1];return d+" "+a}function p(n){n.addEventListener("click",t=>{t.preventDefault();let i,d;for(d=document.getElementsByClassName("dayTarget"),i=0;i<d.length;i++)d[i].className=d[i].className.replace(" active","");t.currentTarget.className+=" active",JSON.parse(t.currentTarget.dataset.json);let a=document.getElementById("dailyinfo");a.innerHTML=t.currentTarget.dataset.json})}
