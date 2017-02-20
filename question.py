#remove human action, color
#pick highest word that is a noun
import os
import sys
import subprocess
import random

if (__name__ == '__main__'):
    word = sys.argv[1]
    adds = ["What are you doing with that " + word + "?", "Why is there that " + word + "?", "How do you feel about that " + word + "?", "What color is that " + word + "?"]
##    index = random.randint(0,len(adds))
##    while (word == "Person" and index == 3):
##        index = random.randint(0,len(add))
    question = "That is a " + word + ". " + adds[random.randint(0,len(adds))]

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

    print(op_filename)
