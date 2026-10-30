(function(){
'use strict';
const key='cws-privacy-choice';
function get(){try{return localStorage.getItem(key)}catch(e){return null}}
function set(value){try{localStorage.setItem(key,value)}catch(e){} window.dispatchEvent(new CustomEvent('cws:privacychange',{detail:{choice:value}}))}
function openPreferences(){
document.getElementById('cws-privacy-panel')?.remove();
const dialog=document.createElement('section');dialog.id='cws-privacy-panel';dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-label','Privacy preferences');
dialog.style.cssText='position:fixed;z-index:2147483647;bottom:14px;left:14px;right:14px;max-width:550px;margin:auto;background:#15241f;color:#fff;border:1px solid #8fae9d;border-radius:12px;padding:22px;box-shadow:0 12px 50px #0008;font:15px/1.55 system-ui,sans-serif';
dialog.innerHTML='<h2 style="font-size:20px;margin:0 0 10px">Your privacy choices</h2><p style="margin:0 0 12px">Essential features such as language preference remain available. No optional analytics or advertising scripts are currently activated by this website. Choose a preference for any future optional scripts; new categories will require an updated notice.</p><p style="margin:0 0 16px"><a href="/privacy.html" style="color:#b4eed4">Read privacy policy</a></p><div style="display:flex;flex-wrap:wrap;gap:10px"><button data-choice="essential">Essential only</button><button data-choice="all">Allow optional cookies</button><button data-choice="close">Close</button></div>';
dialog.querySelectorAll('button').forEach(b=>{b.style.cssText='border:1px solid #a6d1bf;background:#d8f3e6;color:#10251b;padding:10px 12px;border-radius:5px;cursor:pointer';b.addEventListener('click',()=>{if(b.dataset.choice!=='close')set(b.dataset.choice);dialog.remove();document.querySelector('[id="cws-privacy-settings"]')?.focus()})});
document.body.append(dialog);dialog.querySelector('button').focus();
dialog.addEventListener('keydown',e=>{if(e.key==='Escape'){dialog.remove();document.querySelector('[id="cws-privacy-settings"]')?.focus()}});
}
document.addEventListener('click',e=>{if(e.target.closest('#cws-privacy-settings'))openPreferences()});
if(!get()){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',openPreferences,{once:true});else openPreferences()}
})();