// app.js
const QQMapWX = require('./libs/qqmap-wx-jssdk');
App({
  onLaunch() {
    // 初始化云环境
    wx.cloud.init({
      env: 'cloud-2102-6g5ztvkz5507bbea'
    });
    // 初始化qqmapsdk
    let qqmapsdk = new QQMapWX({
        key: 'WY2BZ-XD6CU-VVUVF-BW3YQ-TBXZQ-7KBNM'
    });
    this.globalData.qqmapsdk = qqmapsdk;
  },

  globalData: {
    userInfo: null,
    cityname: '未选择',
    qqmapsdk: {}
  }
})
