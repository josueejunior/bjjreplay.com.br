"""Remendo (já aplicado, uma vez) da manga esquerda em fotos/cena.jpg: o delogo deixou um borrão onde havia letras falsas no patch.
Uso: uv run --with numpy --with pillow python src/remendo_manga.py <entrada> <saida>"""
import sys, numpy as np
from PIL import Image, ImageFilter
src, dst = sys.argv[1], sys.argv[2]
im=np.asarray(Image.open(src).convert('RGB')).astype(float)
y0,y1=762,885
ys=[762,800,840,885,1100]; xs=[796,784,768,752,750]   # borda da manga (medida fora do borrão)
E=lambda y: float(np.interp(y,ys,xs))
out=im.copy(); x0,x1=738,845
for y in range(y0,y1):
    ei=int(round(E(y))); k=(y-y0)/(y1-y0)
    for x in range(x0,x1):
        if x<ei-1:   # fundo desfocado: interpola entre a linha acima e a abaixo
            a=im[y0-3,min(x,int(E(y0-3))-4)]; b=im[y1+3,min(x,int(E(y1+3))-4)]
            out[y,x]=a*(1-k)+b*k
        else:        # tecido: mesma distância da borda, 125 px abaixo
            yy=y+125; out[y,x]=im[yy,int(round(E(yy)))+(x-ei)+4]
m=np.zeros(im.shape[:2]); m[y0:y1,x0:x1]=255
m=(np.asarray(Image.fromarray(m.astype('uint8')).filter(ImageFilter.GaussianBlur(6)))/255.0)[...,None]
Image.fromarray((im*(1-m)+out*m).clip(0,255).astype('uint8')).save(dst,quality=93)
