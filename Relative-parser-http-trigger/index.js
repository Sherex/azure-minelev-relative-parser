function base64ToObj (base64) {
  return JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'))
}

function parseMinElevData (context, data) {
  try {
    var recipientsMail = data.kontaktpersonData
      .map(contactPerson => contactPerson.epost)
      .filter(mail => !(mail === ''))
  } catch (error) {
    context.log('Error in parsing of data. Message: \n', error)
    return
  }

  return {
    teacher: data.userName,
    sender: data.userMail,
    recipients: recipientsMail,
    document: data.document
  }
}

module.exports = async function (context, req) {
  var response
  if (req.body && req.body.ContentData) {
    response = parseMinElevData(context, base64ToObj(req.body.ContentData))
  } else {
    response = parseMinElevData(context, req.body)
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
