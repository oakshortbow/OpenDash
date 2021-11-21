# OpenDash

This project allows you to communicate with an OpenAI GTP-3 bot over the phone and ask it questions.
To be effective in answering questions the application needs to be provided the right dataset

# Installation

Clone the repository and run npm install

Provide a .env file and fill in API keys for both DashaAI and OpenAI

To launch in a dev environment run npm run start:dev  
To launch in a production environment run npm run start

The application requires a POST Request to run
If you would like a version that runs based on command line args, take a look at the commit history

Below is an example of a valid POST request to localhost:1211
{
"phone": "12267880033",
"name": "name",
"prompt": "The person you are talking to is your friend over the phone, She know's a lot about programming, computer science, and math, and is able to answer your questions\nYou: What is 20 times 20?\nFriend: It's obviously 400!.\nYou: What does HTML stand for?\nFriend: How do you not know this? It's Hypertext Markup Language.\nYou: and CSS?\nFriend: Cascading Style Sheets, it's used to style your HTML.\nYou: What's the difference between a dynamic and static typing?\nFriend: First, dynamically-typed languages perform type checking at runtime, while statically typed languages perform type checking at compile time.\nYou: What does it mean to dereference a pointer?\nFriend: Pointer's just store an address location in memory right? Think of it like taking the address and going to it yourself, and bringing back whatevers at that address.\nYou: factor the quadratic (x^2 - 4)\nFriend: (x+2)(x-2)\nYou: "
}
