/* CWS Motion Queue V7 — scroll-tied 3D motion, no scroll interception */
(()=>{const root=document.querySelector('#portfolio .cwsq');if(!root)return;
const cards=[...root.querySelectorAll('.cwsq-card')],count=cards.length,output=root.querySelector('[data-cwsq-count]'),bar=root.querySelector('.cwsq-line i'),head=root.querySelector('.cwsq-head');
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n)),ease=t=>{t=clamp(t);return t*t*(3-2*t)},mix=(a,b,t)=>a+(b-a)*t;
let raf=0;
function render(){raf=0;if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
const rect=root.getBoundingClientRect(),p=clamp(-rect.top/Math.max(1,root.offsetHeight-innerHeight)),mobile=innerWidth<700;
const n=p*count,active=Math.min(count-1,Math.floor(n));cards.forEach((el,i)=>{
const phase=n-i,gap=mobile?45:82;let y,z,rx,scale,op=1;
if(phase<0){y=(i-n+1)*gap+45;z=-i*(mobile?70:115);rx=mobile?63:70;scale=.9}
else if(phase<.52){const t=ease(phase/.52);y=mix(gap+45,0,t);z=mix(-i*115,165,t);rx=mix(mobile?63:70,0,t);scale=mix(.9,1.05,t)}
else if(phase<.72){y=0;z=165;rx=0;scale=1.05}
else{const t=ease((phase-.72)/.28);y=mix(0,-innerHeight*1.5,t);z=mix(165,500,t);rx=mix(0,-14,t);scale=mix(1.05,1.35,t);op=1-clamp((t-.7)/.3)}
el.style.transform='translate3d(-50%,calc(-50% + '+y.toFixed(2)+'px),'+z.toFixed(2)+'px) rotateX('+rx.toFixed(2)+'deg) scale('+scale.toFixed(3)+')';
el.style.opacity=op;el.style.visibility=op<.01?'hidden':'visible';el.style.zIndex=count-i;el.style.pointerEvents=i===active&&op>.4?'auto':'none';
});output.textContent=String(active+1).padStart(2,'0')+' / '+String(count).padStart(2,'0');bar.style.width=p*100+'%';head.style.opacity=1-clamp(p/.08);}
function request(){if(!raf)raf=requestAnimationFrame(render)}addEventListener('scroll',request,{passive:true});addEventListener('resize',request,{passive:true});render();
const observer=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{if(isIntersecting){target.play().catch(()=>{});}else target.pause()}),{rootMargin:'150px 0px',threshold:.01});
root.querySelectorAll('video').forEach(v=>{observer.observe(v);v.addEventListener('error',()=>{v.style.display='none'})});
document.addEventListener('visibilitychange',()=>{if(document.hidden)root.querySelectorAll('video').forEach(v=>v.pause())});
})();