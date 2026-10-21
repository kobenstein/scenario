import re,json
P='/mnt/project-files/scenario/'
SRT={'f1':'/tmp/claude-0/-home-user-scenario/a9801995-bb78-58ae-89a8-1dd2ed9942f3/scratchpad/wt-yj91c5/episodes/01-superintelligence-rising/mix/subs.srt',
'f2':P+'film-02-exponential/v2/render/AI Progress Is Going Vertical.srt',
'f3':P+'film-03-geniuses/render/final/1000000_geniuses_in_a_data_center.en.srt',
'f5':P+'film-05-share/render/AI Giants Just Promised to Share.srt'}
def ts(x):
    m=re.match(r'(\d+):(\d+):(\d+),(\d+)',x);return int(m[1])*3600+int(m[2])*60+int(m[3])+int(m[4])/1000
def cues(f):
    out=[]
    for b in open(f).read().strip().split('\n\n'):
        l=b.split('\n')
        if len(l)<3: continue
        a,b2=l[1].split(' --> ');out.append((ts(a),ts(b2),' '.join(l[2:])))
    return out
# id, film, approx start, approx end (start of first cue, start of last cue)
SEL=[('f1a','f1',0.6,19.2),('f1b','f1',145.1,179.1),('f1c','f1',348.3,368.9),
('f2a','f2',72.7,109.0),('f2b','f2',270.3,292.3),('f2c','f2',112.3,135.9),
('f3a','f3',1.4,31.5),('f3b','f3',190.3,207.2),('f3c','f3',142.1,162.6),
('f5a','f5',1.4,27.22),('f5b','f5',72.42,100.66),('f5c','f5',235.88,266.6)]
res=[]
for i,f,a,b in SEL:
    c=cues(SRT[f]); sel=[x for x in c if a-0.05<=x[0]<=b+0.05]
    st=max(0,sel[0][0]-0.25); en=sel[-1][1]+0.8
    res.append(dict(id=i,film=f,start=round(st,2),end=round(en,2),cues=[[round(x[0]-st,3),round(x[1]-st,3),x[2]] for x in sel]))
    print(i,f,round(st,2),round(en,2),round(en-st,1),'|',sel[0][2],'...',sel[-1][2])
json.dump(res,open('/tmp/claude-0/-home-user-scenario/a9801995-bb78-58ae-89a8-1dd2ed9942f3/scratchpad/shorts/ranges.json','w'),indent=1)
