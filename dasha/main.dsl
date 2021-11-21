context 
{
    // declare input variables here. phone must always be declared. name is optional 
    input phone: string;
    speech: string = "";
    firstLaunch: boolean = true;

}

// declare external functions here 
external function askQuestion(msg: string): string;

// lines 28-42 start node 
start node root 
{
    do //actions executed in this node 
    {
        #connectSafe($phone); // connecting to the phone number which is specified in index.js that it can also be in-terminal text chat
        #sayText("Hello!");
        goto listen;
    }

    transitions {
        listen: goto listen;
    }
}

node listen 
{
    do
    {
        //Parse User Input here
        if(!$firstLaunch) {
            set $speech = external askQuestion(#getMessageText());
        }

        set $firstLaunch = false;
        if($speech != "") {
            #sayText($speech);
        }
        wait *; 

    }
    transitions {
        //If no input, exit call after 10k ms
        dc: goto dc on timeout 10000;
        //Loop back to listen
        listen: goto listen on true;
    }
}

node dc
{
    do 
    {
        #disconnect();
    }
}

digression user_hangup
{
   conditions
   {
     on true tags: onclosed;
   }
   do
   { 
      exit;
   }
}