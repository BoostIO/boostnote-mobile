const AWS = require('aws-sdk')
const AMA = require('aws-sdk-mobile-analytics')

import settings from '../config/settings'

AWS.config.region = settings.awsRegion
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: settings.awsIdentityPoolId,
})
const mobileAnalyticsClient = new AMA.Manager({
    appId: settings.awsAppId,
    appTitle: settings.awsTitle
})

function recordDynamitCustomEvent (type) {
    mobileAnalyticsClient.recordEvent(type)
}

module.exports = {
    recordDynamitCustomEvent
}
