// callback function to create label for email
const createLabel = async (gmail, labelName) => {
    
    const res = await gmail.users.labels.list({ userId : 'me'});

    console.log("creating label");
    const labels = res.data.labels;

    // finding existing label with same name
    //  if found return the id of existing label id;
    const existingLabel = labels.find(label => label.name === labelName);
    
    if( existingLabel ){
        return existingLabel.id;
    }

    // if not found any existing label with same name 
    // creating new label

    const newLabel = await gmail.users.labels.create({
        userId: 'me',
        requestBody:{
            name: labelName,
            labelListVisibility: 'labelShow',
            messageListVisibility: 'show',
        }
    })
    return newLabel.data.id; 
}

module.exports = createLabel;