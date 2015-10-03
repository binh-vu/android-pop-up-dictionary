# Overview

This application is implemented as a chatbot, whenever you send a new word to this chatbot, it will reply with the definition.

Currently, I provide the online cambridge dictionary.

# How to use

Copy config.json.example to config.json and change the botEmail and botPassword to fb email & password.

Then start the chatbot by run ```npm run start```.

After this chatbot is connected to facebook. You need to verify yourself by send the secret password (which are configured in ```config.json``` file) to this chatbot, otherwise you will receive the denied message, which also is configurable in ```config.json```.

After that you can send the command to this chatbot. Currently, it supports 3 type of command:

1. Change chatbot behaviour: <method>:<param>. Available methods are:
    - dict:<dict_name>: change dictionary
2. Ask chatbot to suggest the correct word: <query>?
3. Lookup for the definition: <word>

# Thanks
    * Avery Morin for create [facebook-chat-api](https://github.com/Schmavery/facebook-chat-api)



