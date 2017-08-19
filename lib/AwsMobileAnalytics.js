const AWS = require('aws-sdk')
const AMA = require('aws-sdk-mobile-analytics')

AWS.config.region = 'us-east-1'
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: 'us-east-1:bdc301f5-2d90-4255-827d-233e30ad7987'
})
const mobileAnalyticsClient = new AMA.Manager({
  appId: '1844cce2cb104bf9b064059b97488636',
  appTitle: 'boostnote-mobile'
})

function recordDynamitCustomEvent (type) {
  mobileAnalyticsClient.recordEvent(type)
}

module.exports = {
  recordDynamitCustomEvent
}
