"""Gera anim.html: cena 1280x720, loop de 4 s. O atleta chega, para, olha para a câmera preta e aparece o ✓.
Quadro a quadro: setT(t) é puro (sem estado), então o render por frames é exato."""
import partes as P

def gerar(saida):
    cena = f"""<!doctype html><meta charset="utf-8"><title>aviso câmera preta</title>
<style>html,body{{margin:0;background:{P.PRETO}}}svg{{display:block;width:100vw;height:100vh}}</style>
<svg id="s" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720">
{P.defs('a')}
<rect width="1280" height="720" fill="url(#fundoa)"/>

<g id="cam" transform="translate(800 0)">
  <g transform="translate(0 190) scale(1.9)">{P.camera('a', brilho=True, x=0, y=0)}</g>
  <g id="rings"><circle class="ring" cx="0" cy="175" r="40" fill="none" stroke="#7FB0FF" stroke-width="4" opacity="0"/><circle class="ring" cx="0" cy="175" r="40" fill="none" stroke="#7FB0FF" stroke-width="4" opacity="0"/></g>
  <circle id="prog" cx="0" cy="175" r="68" fill="none" stroke="{P.OK}" stroke-width="9" stroke-linecap="round" stroke-dasharray="0 400" transform="rotate(-90 0 175)" opacity="0"/>
</g>
<g id="check" transform="translate(950 130)" opacity="0"><circle r="46" fill="{P.OK}" stroke="{P.BRANCO}" stroke-width="5"/><path d="M-20 3 L-6 18 L22 -16" stroke="{P.BRANCO}" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>
<g id="atl" transform="translate(0 0)"><g transform="translate(240 150) scale(1.5)">
  <g id="corpo">{P.corpo()}</g>
  <g id="cab" style="transform-origin:200px 262px">{P.cabeca('serio', (0, 0))}</g>
</g></g>
<script>
const ease=x=>1-Math.pow(1-x,3), cl=(x,a=0,b=1)=>Math.min(b,Math.max(a,x)), seg=(t,a,b)=>cl((t-a)/(b-a));
function setT(t){{
  t=((t%4)+4)%4;
  const w=ease(seg(t,0,1.5)), x=-900*(1-w);
  const bob=(t<1.5?Math.abs(Math.sin(t*9))*14*(1-w):0);
  document.getElementById('atl').setAttribute('transform',`translate(${{x}} ${{-bob}})`);
  const turn=ease(seg(t,1.9,2.5));
  const cab=document.getElementById('cab');
  cab.style.transform=`rotate(${{9*(1-turn)}}deg)`;
  document.querySelectorAll('.pu').forEach(e=>e.setAttribute('transform',`translate(${{-5*(1-turn)+4*turn}} ${{3*(1-turn)-6*turn}})`));
  const run=seg(t,2.0,3.0), ring=document.getElementById('prog');
  ring.setAttribute('opacity',run>0&&t<3.7?1:0);
  ring.setAttribute('stroke-dasharray',`${{run*390}} 400`);
  document.querySelectorAll('.ring').forEach((r,i)=>{{const k=seg(t,2.0+i*.45,2.9+i*.45);r.setAttribute('r',40+k*70);r.setAttribute('opacity',k>0&&k<1?(1-k)*.7:0);}});
  const pop=seg(t,3.0,3.3), sc=pop<1?(ease(pop)*1.15):1+0.0, fade=t>3.75?1-seg(t,3.75,4):1;
  const ck=document.getElementById('check');
  ck.setAttribute('transform',`translate(950 130) scale(${{pop<1?ease(pop)*1.2:1.2-0.2*seg(t,3.3,3.5)}})`);
  ck.setAttribute('opacity',pop>0?fade:0);
}}
const q=new URLSearchParams(location.search).get('t');
if(q!==null) setT(parseFloat(q)); else {{ const t0=performance.now(); (function f(n){{setT((n-t0)/1000);requestAnimationFrame(f)}})(t0); }}
</script>"""
    open(saida, 'w').write(cena)

if __name__ == '__main__':
    gerar('../anim.html')
