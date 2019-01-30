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
    recipients: recipientsMail,
    document: jsonData.document
  }
}

module.exports = async function (context, req) {
  var response
  if (req.body && req.body.ContentData) {
    response = parseMinElevData(req.body.ContentData)
  } else {
    response = parseMinElevData(req.body)
  }

  if (response) {
    // Return sender's and recipients' mail
    context.res = {
      status: 200,
      body: response
    }
  } else {
    context.res = {
      status: 400,
      body: 'Received unexpected data'
    }
  }
}
