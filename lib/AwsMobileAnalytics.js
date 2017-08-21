const AWS = require('aws-sdk')
const AMA = require('aws-sdk-mobile-analytics')

AWS.config.region = 'us-east-1'
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: 'us-east-1:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
})
const mobileAnalyticsClient = new AMA.Manager({
  appId: 'xxxxxxxxxxxxxxxxxx',
  appTitle: 'xxxxxxxxxxxxx'
})

function recordDynamitCustomEvent (type) {
  mobileAnalyticsClient.recordEvent(type)
}

module.exports = {
  recordDynamitCustomEvent
}
