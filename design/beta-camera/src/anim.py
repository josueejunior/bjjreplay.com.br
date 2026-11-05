"""Gera src/anim.html: cena 1280x720, loop de 4 s, com as fotos de fotos.py.
0–1,4 s: o atleta no tatame, a câmera preta em primeiro plano (aproxima devagar); 1,4–1,8 s: corta para o que a câmera vê;
1,9–2,9 s: o quadro de reconhecimento fecha no rosto e a barra conta os 2 segundos; 3,0 s: fica verde e aparece o ✓.
setT(t) é puro (sem estado), então o render por frames é exato."""
import fotos as F

# Rosto na visão da câmera (pov.jpg 16:9 escalado para 1280x720)
RX, RY, RW, RH = 440, 70, 420, 570


def gerar(saida):
    cena = f"""<!doctype html><meta charset="utf-8"><title>aviso câmera preta</title>
<style>html,body{{margin:0;background:{F.PRETO};overflow:hidden}}#v{{position:relative;width:1280px;height:720px;overflow:hidden}}
#v img{{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}} svg{{position:absolute;inset:0}}</style>
<div id="v">
<img id="cena" src="_fotos/cena.jpg" style="transform-origin:39% 32%">
<img id="pov" src="_fotos/pov.jpg" style="opacity:0;transform-origin:52% 45%">
<svg viewBox="0 0 1280 720" width="1280" height="720">
  <g id="ui" opacity="0">
    <g stroke="#fff" stroke-opacity=".75" stroke-width="4" fill="none">
      <path d="M40 90 V40 H90"/><path d="M1190 40 H1240 V90"/><path d="M40 630 V680 H90"/><path d="M1190 680 H1240 V630"/></g>
    <circle id="rec" cx="76" cy="76" r="9" fill="{F.VERM}"/>
  </g>
  <g id="mira" fill="none" stroke-width="7" stroke-linecap="round" opacity="0"></g>
  <rect id="barra0" x="{RX}" y="{RY+RH+22}" width="{RW}" height="8" rx="4" fill="#fff" fill-opacity=".25" opacity="0"/>
  <rect id="barra" x="{RX}" y="{RY+RH+22}" width="0" height="8" rx="4" fill="#fff" opacity="0"/>
  <g id="check" opacity="0"><circle r="46" fill="{F.OK}" stroke="#fff" stroke-width="5"/>
    <path d="M-20 3 L-6 18 L22 -16" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>
  <rect id="preto" width="1280" height="720" fill="{F.PRETO}" opacity="0"/>
</svg></div>
<script>
const ease=x=>1-Math.pow(1-x,3), cl=(x,a=0,b=1)=>Math.min(b,Math.max(a,x)), seg=(t,a,b)=>cl((t-a)/(b-a)), lerp=(a,b,k)=>a+(b-a)*k;
const $=id=>document.getElementById(id), RX={RX}, RY={RY}, RW={RW}, RH={RH};
function cantos(x,y,w,h,l){{return `M${{x}} ${{y+l}}V${{y}}H${{x+l}} M${{x+w-l}} ${{y}}H${{x+w}}V${{y+l}} M${{x}} ${{y+h-l}}V${{y+h}}H${{x+l}} M${{x+w-l}} ${{y+h}}H${{x+w}}V${{y+h-l}}`}}
function setT(t){{
  t=((t%4)+4)%4;
  $('cena').style.transform=`scale(${{1+0.10*ease(seg(t,0,1.7))}})`;
  const corte=seg(t,1.4,1.75);
  $('pov').style.opacity=corte; $('pov').style.transform=`scale(${{1.06-0.06*ease(seg(t,1.4,3.2))}})`;
  $('ui').setAttribute('opacity',corte);
  $('rec').setAttribute('opacity',Math.floor(t*2.5)%2?0.35:1);
  const k=ease(seg(t,1.85,2.35)), ok=t>=3.0, m=$('mira');
  const x=lerp(RX-150,RX,k), y=lerp(RY-90,RY,k), w=lerp(RW+300,RW,k), h=lerp(RH+180,RH,k);
  m.setAttribute('opacity',t>=1.85?Math.min(1,k*1.5):0);
  m.setAttribute('stroke',ok?'{F.OK}':'#fff');
  m.innerHTML=`<path d="${{cantos(x,y,w,h,56)}}"/>`;
  const run=seg(t,2.0,3.0), vis=t>=1.95&&t<3.75?1:0;
  $('barra0').setAttribute('opacity',vis); $('barra').setAttribute('opacity',vis);
  $('barra').setAttribute('width',RW*run); $('barra').setAttribute('fill',ok?'{F.OK}':'#fff');
  const pop=seg(t,3.0,3.3);
  $('check').setAttribute('transform',`translate(${{RX+RW}} ${{RY}}) scale(${{pop<1?ease(pop)*1.2:1.2-0.2*seg(t,3.3,3.5)}})`);
  $('check').setAttribute('opacity',pop>0?1:0);
  $('preto').setAttribute('opacity',t>3.75?seg(t,3.75,4):(t<0.25?1-seg(t,0,0.25):0));
}}
const q=new URLSearchParams(location.search).get('t');
if(q!==null) setT(parseFloat(q)); else {{ const t0=performance.now(); (function f(n){{setT((n-t0)/1000);requestAnimationFrame(f)}})(t0); }}
</script>"""
    open(saida, 'w').write(cena)


if __name__ == '__main__':
    gerar(F.AQUI / 'src/anim.html')
