import sys,glob
from PIL import Image, ImageDraw
d=sys.argv[1]; fs=sorted(glob.glob(d+'/*.jpg')); ims=[Image.open(f) for f in fs]; w,h=ims[0].size; s=.5
ims=[i.resize((int(w*s),int(h*s))) for i in ims]; w,h=ims[0].size; cols=3; rows=(len(ims)+cols-1)//cols
o=Image.new('RGB',(w*cols,h*rows))
for i,(im,f) in enumerate(zip(ims,fs)):
    o.paste(im,((i%cols)*w,(i//cols)*h)); ImageDraw.Draw(o).text(((i%cols)*w+6,(i//cols)*h+4),f.split('_t')[-1],fill=(255,80,80))
o.save(d+'/sheet.jpg',quality=80)
