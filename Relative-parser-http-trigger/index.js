function base64ToObj (base64) {
  return JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'))
}

function parseMinElevData (data) {
  var jsonData = base64ToObj(data)
  try {
    var recipientsMail = jsonData.kontaktpersonData
      .map(contactPerson => contactPerson.epost)
      .filter(mail => !(mail === ''))
  } catch (error) {
    console.error('Error in parsing of data. Message: \n', error)
    return
  }

  return {
    sender: jsonData.userMail,
    recipients: recipientsMail
  }
}

module.exports = async function (context, req) {
  if (req.body && req.body.ContentData) {
    var response = parseMinElevData(req.body.ContentData)
  }

  if (response) {
    // Return senders mail and recipients mail
    context.res = {
      status: 200,
      body: response
    }
    // Send request body forward
    context.respipe = {
      status: 200,
      body: base64ToObj(req.body.ContentData)
    }
  } else {
    context.res = {
      status: 400,
      body: 'Received unexpected data'
    }
  }
}
