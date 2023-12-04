const createCustomReply = require('./createCustomReply');
const createLabel = require('./createLabel');

// callback function to send reply to email with no replies
const sendReply = async (gmail, e, sender, receiver, subject) => {
    console.log("Begin to sending reply");

    // gets the thread(detailed information) using Gmail API
    const thread = await gmail.users.threads.get({ userId: 'me', id: e.threadId});


    //getting values from thread array, starting from second element(index 1) onwards
    const replies = thread.data.messages.slice(1);

    
    // send replies to emails with no prior replies
    // by checking if the replies array is empty or not
    if(replies.length === 0){
        await gmail.users.messages.send({
            userId: 'me',
            requestBody:{
                raw: await createCustomReply(receiver, sender, subject)
            }
        })
    } 


    // creating a label and move the email to the label
    const labelName = 'vacationMail';


    // creating label using createLabel function which is expected to return a promise
    const labelId = await createLabel(gmail, labelName);

    console.log("Label Created Successfully");
    console.log(`labelName: ${labelName} and labelID: ${labelId}`);

    // adding Label to email using modify method
    await gmail.users.messages.modify({
        userId: 'me',
        id: e.id,
        requestBody: {addLabelIds: [labelId]},
    })
}

module.exports = sendReply;