const { google } = require('googleapis');
const {CLIENT_ID,CLIENT_SECRET,REDIRECT_URI,REFRESH_TOKEN} = require('./src/config');

const app = () =>{
    const OAuth2Cient = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    OAuth2Cient.setCredentials({refresh_token: REFRESH_TOKEN })

}

app();