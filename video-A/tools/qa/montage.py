import sys,glob
from PIL import Image,ImageDraw
out=sys.argv[1];cols=int(sys.argv[2]);files=sys.argv[3:]
ims=[Image.open(f) for f in files]
w,h=ims[0].size;rows=(len(ims)+cols-1)//cols
m=Image.new('RGB',(cols*w,rows*h))
d=ImageDraw.Draw(m)
for i,(im,f) in enumerate(zip(ims,files)):
    x=(i%cols)*w;y=(i//cols)*h;m.paste(im,(x,y));d.rectangle([x,y,x+150,y+20],fill=(0,0,0));d.text((x+4,y+4),f.split('/')[-1][-14:],fill=(255,220,0))
m.save(out)
