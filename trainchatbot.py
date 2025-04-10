# -*- coding: utf-8 -*-
"""
Created on Wed Apr  9 08:36:49 2025

@author: vipul
"""

import nltk
nltk.download('punkt')
nltk.download('wordnet')
nltk.download('punkt_tab')
from nltk.stem import WordNetLemmatizer
lemmatizer = WordNetLemmatizer()
import json 
import pickle
import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense,Activation,Dropout
from tensorflow.keras.optimizers import SGD
import random

# initialize lists
words = []
classes = []
documents = []
ignore_words = ['?','!','@','$']

#use json
with open('intents.json', 'r', encoding='utf-8') as data_file: # Specify utf-8 encoding
    data = data_file.read()
intents = json.loads(data)

for intent in intents['intents']:
    for pattern in intent['patterns']:
        # take each word and tokenize it
        w = nltk.word_tokenize(pattern)
        words.extend(w)
            
        #adding documents
        documents.append((w,intent['tag']))
        
        #adding classes to our class list
        if intent['tag'] not in classes:
            classes.append(intent['tag'])
        
words = [lemmatizer.lemmatize(w.lower()) for w in words if w not in ignore_words] 
words = sorted(list(set(words)))

classes = sorted(list(set(classes)))

# print(len(documents),"documents" , documents)
# print(len(classes),"classes",classes)
# print(len(words),"unique lemmatized words",words) 

pickle.dump(words , open('words.pkl' , 'wb'))
pickle.dump(classes , open('classes.pkl' , 'wb'))
           
# intializing training data
training = []
output_empty = [0]*len(classes)

for doc in documents:
    #initialize the bag of words
    bag=[]
    #list pf tokenized word for pattern
    pattern_words = doc[0] 
    pattern_words = [lemmatizer.lemmatize(word.lower()) for word in pattern_words]       
    
    for w in words:
        bag.append(1) if w in pattern_words else bag.append(0)
    
    output_row = list(output_empty)
    output_row[classes.index(doc[1])] = 1
    
    training.append([bag,output_row])
    
random.shuffle(training)
training_data = []
for bag, output_row in training:
    bag_array = np.array(bag)
    output_row_array = np.array(output_row)
    training_data.append(np.hstack([bag_array, output_row_array]))

# Now you can convert the training_data list to a NumPy array
training = np.array(training_data)

train_x = list(training[:,:len(words)]) # Slice to get the 'bag' part
train_y = list(training[:,len(words):]) # Slice to get the 'output_row' part

print("training data created")

# creating model

model = Sequential()
model.add(Dense(128,input_shape=(len(train_x[0]),),activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(64,activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(len(train_y[0]),activation='softmax'))

sgd = SGD(learning_rate=0.01,decay=1e-6,momentum=0.9,nesterov=True)
model.compile(loss='categorical_crossentropy',optimizer=sgd,metrics=['accuracy'])

hist = model.fit(np.array(train_x),np.array(train_y),epochs=200,batch_size=5,verbose=1)
model.save('chatbot_model.h5',hist)
print("model created")            
            
            
            
            
            
            