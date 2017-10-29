const AWS = require('aws-sdk')
const AMA = require('aws-sdk-mobile-analytics')
const DeviceInfo = require('react-native-device-info')
import settings from '../config/settings'

AWS.config.region = settings.awsRegion
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: settings.awsIdentityPoolId,
})
const mobileAnalyticsClient = new AMA.Manager({
  appId: settings.awsAppId,
  appTitle: settings.awsTitle,
  appVersionName: DeviceInfo.getReadableVersion(),
  make: DeviceInfo.getManufacturer(),
  model: DeviceInfo.getModel(),
  platform: convertPlatformName(DeviceInfo.getSystemName()),
  platformVersion: DeviceInfo.getSystemVersion()
})

function initAwsMobileAnalytics() {
  AWS.config.credentials.get((err) => {
    if (!err) {
      console.log('Cognito Identity ID: ' + AWS.config.credentials.identityId)
      recordDynamicCustomEvent('APP_STARTED')
    }
  })
}

function recordDynamicCustomEvent(type) {
  mobileAnalyticsClient.recordEvent(type)
}

function convertPlatformName (platformName) {
  if (platformName === 'iPhone OS') {
    return 'iPhoneOS'
  } else if (platformName === 'Android') {
    return 'Android'
  } else {
    return ''
  }
}

module.exports = {
  initAwsMobileAnalytics,
  recordDynamicCustomEvent
}
