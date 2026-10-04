import sys,subprocess,os
from PIL import Image,ImageDraw,ImageFont
# usage: sheet.py video out_prefix start step count per_sheet cols tilew
v,pre,start,step,count,per,cols,tw=sys.argv[1],sys.argv[2],float(sys.argv[3]),float(sys.argv[4]),int(sys.argv[5]),int(sys.argv[6]),int(sys.argv[7]),int(sys.argv[8])
th=tw*9//16
font=ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf',max(18,tw//16))
tmp='/tmp/qa_tile.png'
n=0;sheet=0
while n<count:
    k=min(per,count-n);rows=(k+cols-1)//cols
    im=Image.new('RGB',(cols*tw,rows*th),'black');d=ImageDraw.Draw(im)
    for i in range(k):
        t=start+(n+i)*step
        subprocess.run(['ffmpeg','-v','error','-y','-ss',str(t),'-i',v,'-frames:v','1','-vf',f'scale={tw}:{th}',tmp],check=True)
        x=(i%cols)*tw;y=(i//cols)*th
        im.paste(Image.open(tmp),(x,y))
        m=int(t//60);s=t-60*m
        d.rectangle([x,y,x+tw//4,y+font.size+8],fill=(0,0,0));d.text((x+6,y+3),f'{m}:{s:04.1f}',fill=(255,220,0),font=font)
    sheet+=1;im.save(f'{pre}{sheet}.png');n+=k
