# OpenDash

This project allows you to communicate with an OpenAI GTP-3 bot over the phone and ask it questions.
To be effective in answering questions the application needs to be provided the right dataset

# Installation

Clone the repository and run npm install

Provide a .env file and fill in API keys for both DashaAI and OpenAI

To launch in a dev environment run npm run start:dev  
To launch in a production environment run npm run start

This application uses command line arguments  
Provide your phone number as the first argument  
Provide your dataset as the second argument (put it in resources folder)
Example:

npm run start 19999999999 prompt.txt
