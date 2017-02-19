#pip install --upgrade watson-developer-cloud
import json
import subprocess
from watson_developer_cloud import ConversationV1
import os

if (__name__ == '__main__'):
    conversation = ConversationV1(
      username='ce4eba02-fafe-4f63-8073-0887a6e5e266',
      password='4lgo82PjXrCV',
      version='2017-02-03'
    )

    # Replace with the context obtained from the initial request
    context = {}

    workspace_id = 'b0906674-2c80-4064-8927-e879df1b68a8'

    inp = 'I am drinking water.'

    response = conversation.message(
      workspace_id=workspace_id,
      message_input={'text': inp},
      context=context
    )

    #print(json.dumps(response, indent=2))

    text = response['output']['text']

    numf = open('responsenum.txt','r')
    fnum = int(numf.readline())
    numf.close()

    FNULL = open(os.devnull, 'w')
    subprocess.call(['rm','response'+str(fnum-1)+'.wav'])

    numf = open('responsenum.txt','w')
    numf.write(str(fnum+1))
    numf.close()

    op_filename = 'response'+str(fnum)+'.wav'

    command = ['curl', '-X', 'POST', '-u', '773f9f5b-6452-4d6e-9aa3-17a0c2674eed:5uDZ7hPl43y4', '--header', 'Content-Type: application/json', '--header', 'Accept: audio/wav', 'https://stream.watsonplatform.net/text-to-speech/api/v1/synthesize', '--data', '{\"text\":\"' + ' '.join(text) + '\"}', '--output', op_filename, 'https://stream.watsonplatform.net/text-to-speech/api/v1/synthesize']
    subprocess.call(command,stdout=FNULL,stderr=subprocess.STDOUT)

    print(op_filename)
