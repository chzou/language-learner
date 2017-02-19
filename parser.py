f = open('part-of-speech.txt','r')
op = open('nouns.txt','w')

for l in f.readlines():
    parts = l.split("\t")
    if ("N" in parts[1] or "P" in parts[1] or "h" in parts[1]):
        op.write(parts[0]+"\n")

f.close()
op.close()
