# Language Learner

It has been proven that children who know English are more likely to perform better in school as they grow up because they'll be better able to communicate with their peers and teachers, but there are often households where English is not spoken at all. We made an application that engages children in English while helping them learn about their surroundings and how to respond to certain questions in conversation.

We used the Google Cloud Vision API to analyze an image captured from a constant video stream and return the major object in the scene. We then used IBM Watson Text-to-Speech to tell the child what the object is and to ask an associated question about the object. Our application would listen for the child's response and then use IBM Watson Speech-to-Text to get a written form of what the child has just said. Finally, we use a trained IBM Watson Conversation service to take the child's speech and provide an appropriate response about what the child has just said about the object in question.

### Setup
1. `npm install`
2. `pip install --upgrade watson-developer-cloud`

### Run
1. `npm start` to start the server
2. Navigate to `localhost:3000` to run the application!
