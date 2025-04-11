import nltk
nltk.download('punkt')
nltk.download('wordnet')
nltk.download('omw-1.4')
from nltk.stem import WordNetLemmatizer
lemmatizer = WordNetLemmatizer()
import pickle
import numpy as np
from flask_cors import CORS

from tensorflow.keras.models import load_model
model = load_model('chatbot_model.h5')
import json
import random
intents = json.loads(open('intents.json' ,encoding='utf-8').read())
words = pickle.load(open('words.pkl' , 'rb'))
classes = pickle.load(open('classes.pkl' , 'rb'))


from flask_ngrok import run_with_ngrok
from flask import Flask, request, jsonify

app = Flask(__name__)

CORS(app, resources={r"/query/*": {"origins": "http://localhost:5173"}})

# run_with_ngrok(app)  # Start ngrok when app is run

@app.route('/' , methods=['GET'])
def hello():
    # return jsonify({'message': 'Hello, this is a chatbot API! , Server running sucessfully'})
    return "Hello World"

def decrypt_message(message):
    #input: "Hello+how+are+you?"
    #output: "Hello how are you?"
    # replcae + with space
    message = message.replace('+', ' ')
    return message

def cleanup_sentence(sentence):
    # tokenize the pattern
    sentence_words = nltk.word_tokenize(sentence)
    # stem and lower each word and remove duplicates
    sentence_words = [lemmatizer.lemmatize(word.lower()) for word in sentence_words]
    return sentence_words

def bow(sentence , words , show_details = True):
    # clean up the sentence
    sentence_words = cleanup_sentence(sentence)
    # bag of words
    bag = [0]*len(words) 
    for s in sentence_words:
        for i , w in enumerate(words):
            if w == s:
                bag[i] = 1
                if show_details:
                    print("sentence:", sentence , "\n found in bag:" , bag)
    
    print(f"Bag of Words for sentence '{sentence}': {bag}")
    return(np.array(bag))

def predict_class(sentence , model):
    p = bow(sentence , words , show_details=False)
    res = model.predict(np.array([p]))[0]
    print(f"Model prediction raw result: {res}")
    ERROR_THRESHOLD = 0.25
    results = [[i , r] for i , r in enumerate(res) if r > ERROR_THRESHOLD]
    print(f"Filtered results (above threshold): {results}")

    # sort by strength of probability
    results.sort(key=lambda x: x[1] , reverse=True)
    return_list = []
    for r in results:
        return_list.append({"intent": classes[r[0]] , "probability": str(r[1])})
    
    print(f"Predicted intents: {return_list}")
    return return_list

def get_response(intents_list , intents_json):
    tag = intents_list[0]['intent']
    list_of_intents = intents_json['intents']
    for i in list_of_intents:
        if i['tag'] == tag:
            response = random.choice(i['responses'])
            break
    return response 

def chatbot_response(msg):
    ints = predict_class(msg , model)
    try:
        response = get_response(ints,intents)
    except:
        print("Error in getting response , exception occured")
        response = "Sorry, I didn't understand that. I am really sorry this is out of my limitations."
    print("chatbot response: ", response)
    return response

@app.route('/query/<sentence>')
def query_chatbot(sentence):
    #decrypt message
    dec_msg = decrypt_message(sentence)
    response = chatbot_response(dec_msg)

    json_res = jsonify({'top' : { 'response': response}}) 

    return json_res
app.run()       

