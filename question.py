#remove human action, color
#pick highest word that is a noun
import os
import sys
import subprocess

##with open('image.json') as jfile:
##    inp = json.load(jfile)
##
##nounfile = open('nouns.txt','r')
##nouns = map(lambda s: s.strip(), nounfile.readlines())
##
##labels = inp['labelAnnotations']
##
##word = ""
##
##for l in labels:
##    desc = l['description']
##    if (desc == "Color" or desc == "Human Action"):
##        continue
##    else:
##        if (desc in nouns):
##            word = desc
##        elif (word == ""):
##            word = desc

word = sys.argv[1]

##flagf = open('flag.txt','r')
##word = flagf.readline().strip("\n")

question = "That is a " + word + ". What are you doing with that " + word + "?"
#supposed to be + word +
#print(question)

numf = open('questionnum.txt','r')
fnum = int(numf.readline())
numf.close()

FNULL = open(os.devnull, 'w')
subprocess.call(['rm','question'+str(fnum-1)+'.wav'])

numf = open('questionnum.txt','w')
numf.write(str(fnum+1))
numf.close()

op_filename = 'question'+str(fnum)+'.wav'

command = ['curl', '-X', 'POST', '-u', '773f9f5b-6452-4d6e-9aa3-17a0c2674eed:5uDZ7hPl43y4', '--header', 'Content-Type: application/json', '--header', 'Accept: audio/wav', 'https://stream.watsonplatform.net/text-to-speech/api/v1/synthesize', '--data', '{\"text\":\"' + question + '\"}', '--output', op_filename, 'https://stream.watsonplatform.net/text-to-speech/api/v1/synthesize']

subprocess.call(command,stdout=FNULL,stderr=subprocess.STDOUT)
