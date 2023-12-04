
// callback function to create custom reply for each email

const customReply = async (receiver,sender, subject)=> {

    // Email content
    const emailContent = `From : ${sender}\nTo:${receiver}\nSubject: ${subject}\n\n Thank you for your message. I am on vacation, will respond soon...`;
    const base64EncodedEmail = Buffer.from(emailContent).toString('base64').replace(/\+/g,'-').replace(/\//g,'_');
    return base64EncodedEmail;
}

module.exports = customReply;