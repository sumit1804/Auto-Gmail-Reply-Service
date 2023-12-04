// imported required libraries
const {google} = require('googleapis')
const sendReply = require('./sendReply')
const {CLIENT_ID,CLIENT_SECRET,REDIRECT_URI,REFRESH_TOKEN} = require('./config.js')

// Setting up authentication using OAuth2  
// for accessing Google Services , Gmail API

const OAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
OAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN })

// AlreadyReplied is set to keep track of already replied users
// This ensure no mutliple replies send to any mail

const AlreadyReplied = new Set();

/* 
    1. Making connection to Gmail service using Google API client Library
    2. Getting data like all mails recieved respective sender_ID( From ), 
       receiver_ID( To ), subject(Subject)
*/
const checkEmail = async () => {
    try {
        console.log("checking emails")
        // console.log(process.env)
        
        // configuring API version("v1") and 
        // oAuth2Client authentication credentials
        const gmail = google.gmail({version:"v1", auth: OAuth2Client})

        // await console.log(gmail.users.messages.list({userId: 'sumit2002yadav2002@gmail.com', q: 'is:unread'}));

        // response from the service containing the list of messages
        const res = await gmail.users.messages.list({ userId: 'me', q: 'is:unread'});
        console.log(res.data.messages);

        // extracts messages from response (res)  and assign to 'emails' list
        const emails = res.data.messages;

        
        // traverse through each email one by one using for loop
        for(let e of emails){

            // storing each email data in email
            const email = await gmail.users.messages.get({ userId: 'me', id: e.id});

            // retrieving data like sender, receiver, subject information
            // from the header part email
            const fromHeader = email.data.payload.headers.find( header => header.name === 'From')
            const toHeader = email.data.payload.headers.find( header => header.name === 'To');
            const subjectHeader = email.data.payload.headers.find( header => header.name === 'Subject');

            // getting the values from the fromHeader, toHeader, subjectHeader
            const  sender = fromHeader.value;
            const receiver = toHeader.value; 
            const subject = subjectHeader.value;

            console.log("Email came from:", sender);
            console.log("To Email:", receiver);

            // checks if the users already replied then skips
            if( AlreadyReplied.has(sender)){  
                console.log("Already replied to: ", sender);
                continue; 
            }
            console.log("No reply has been send");
            // if no reply sent to email then send reply
            await sendReply(gmail,e,sender,receiver,subject);

            console.log('Sent reply to email: ', sender);
            AlreadyReplied.add(sender);
        }

    } catch (error) {
        console.log(error);
    }
}

const getRandomInterval =(min,max) => {
    return Math.floor(Math.random()* (max-min+1) + min);
}



module.exports = { checkEmail, getRandomInterval};