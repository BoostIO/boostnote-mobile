const AWS = require('aws-sdk/dist/aws-sdk-react-native')
const AMA = require('react-native-aws-mobile-analytics')
const DeviceInfo = require('react-native-device-info')
import settings from '../config/settings'

AWS.config.region = settings.awsRegion
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  region: settings.awsRegion,
  IdentityPoolId: settings.awsIdentityPoolId
})
const mobileAnalyticsClient = new AMA.default.Manager({
  appId: settings.awsAppId,
  appTitle: settings.awsTitle,
  appVersionName: DeviceInfo.getReadableVersion(),
  make: DeviceInfo.getManufacturer(),
  model: DeviceInfo.getModel(),
  platform: convertPlatformName(DeviceInfo.getSystemName()),
  platformVersion: DeviceInfo.getSystemVersion()
})

function initAwsMobileAnalytics () {
  mobileAnalyticsClient.initialize(() => {
    console.log('Cognito Identity ID: ' + AWS.config.credentials.params.IdentityPoolId)
    recordDynamicCustomEvent('APP_STARTED')
  })
}

function recordDynamicCustomEvent (type) {
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
