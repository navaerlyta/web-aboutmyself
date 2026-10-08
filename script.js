// efek mengetik
const words=[
  "Cooking enthusiast",
  "Baking enthusiast",
  "Music lover",
  "Movie buff"
];
let w=0,c=0,del=false;
function type(){
  const t=words[w];
  document.getElementById('typed').textContent=t.slice(0,c);
  if(!del&&c<t.length){c++;setTimeout(type,90)}
  else if(!del){del=true;setTimeout(type,1400)}
  else if(c>0){c--;setTimeout(type,45)}
  else{del=false;w=(w+1)%words.length;setTimeout(type,300)}
}
type();

const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;

// animasi muncul saat scroll
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){e.target.classList.add('show');io.unobserve(e.target)}
}),{threshold:.15});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// ===== teks profil: muncul kata per kata =====
const wordBlocks=[...document.querySelectorAll('.words')];
function splitWords(root){
  let n=0;
  (function walk(node){
    [...node.childNodes].forEach(ch=>{
      if(ch.nodeType===3){
        const frag=document.createDocumentFragment();
        ch.textContent.split(/(\s+)/).forEach(p=>{
          if(!p) return;
          if(/^\s+$/.test(p)){
            frag.appendChild(document.createTextNode(' '));
          }else{
            const s=document.createElement('span');
            s.className='wd';
            s.style.setProperty('--i',n++);
            s.textContent=p;
            frag.appendChild(s);
          }
        });
        ch.replaceWith(frag);
      }else if(ch.nodeType===1&&ch.tagName!=='BR'){
        // sorotan peach muncul setelah kata pertamanya tampil
        if(ch.classList.contains('hl')) ch.style.setProperty('--hd',(n*38+650)+'ms');
        walk(ch);
      }
    });
  })(root);
}
if(reduceMotion){
  wordBlocks.forEach(p=>p.classList.add('in'));
}else{
  const ioW=new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add('in');ioW.unobserve(e.target)}
  }),{threshold:.3});
  wordBlocks.forEach(p=>{splitWords(p);ioW.observe(p)});
}

// tombol ke atas
const nav=document.getElementById('nav'),topBtn=document.getElementById('top');
topBtn.onclick=()=>scrollTo({top:0,behavior:'smooth'});

// ===== lightbox foto galeri =====
const lb=document.getElementById('lb'),lbimg=document.getElementById('lbimg');
const pitems=[...document.querySelectorAll('.pitem')];
pitems.forEach(el=>el.onclick=()=>{
  lbimg.src=el.querySelector('img').src;
  lb.classList.add('open');
});
lb.onclick=()=>lb.classList.remove('open');

// ===== parallax: hero + galeri (foto & koin) =====
const heroIn=document.querySelector('.hero-inner');
const gal=document.getElementById('galeri');
const coins=[...document.querySelectorAll('.coin')];

function heroUpdate(){
  const y=scrollY,h=innerHeight;
  if(y>h*1.1) return;                       // hero sudah tidak terlihat
  const k=innerWidth<=768?0.25:0.4;         // teks bergerak lebih lambat dari scroll
  heroIn.style.transform='translate3d(0,'+(y*k).toFixed(1)+'px,0)';
  heroIn.style.opacity=Math.max(0,1-y/(h*0.75)).toFixed(2);
}

function galUpdate(){
  const small=innerWidth<=600,mid=innerWidth<=900;

  // foto galeri
  const k=small?0.35:(mid?0.6:1);
  const max=small?30:(mid?50:120);
  pitems.forEach(el=>{
    const r=el.parentElement.getBoundingClientRect();
    const p=(r.top+r.height/2)-innerHeight/2;
    let y=p*parseFloat(el.dataset.speed)*k;
    y=Math.max(-max,Math.min(max,y));
    el.style.setProperty('--y',y.toFixed(1)+'px');
  });

  // koin melayang (geser lebih jauh, berhenti halus)
  if(coins.length){
    const r=gal.getBoundingClientRect();
    const p=(r.top+r.height/2)-innerHeight/2;
    const kc=small?0.6:1;
    const mc=small?110:(mid?170:260);
    coins.forEach(el=>{
      const raw=p*parseFloat(el.dataset.speed)*kc;
      const y=mc*Math.tanh(raw/mc);
      el.style.setProperty('--y',y.toFixed(1)+'px');
    });
  }
}

let tick=false;
function onScroll(){
  nav.classList.toggle('scrolled',scrollY>60);
  topBtn.classList.toggle('show',scrollY>500);
  if(!reduceMotion){heroUpdate();galUpdate()}
  tick=false;
}
addEventListener('scroll',()=>{
  if(!tick){tick=true;requestAnimationFrame(onScroll)}
},{passive:true});
addEventListener('resize',onScroll);
onScroll();