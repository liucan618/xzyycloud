// pages/citylist/citylist.js
const citymap = require('../../libs/map');
Page({
  /** 页面的初始数据 */
  data: {
    citylist : citymap,
    currentLetter : 'A',
    currentLocCity : '定位中...'
  },

  /** 点击当前城市时触发 */
  tapCurrentCity(){
    let clc = this.data.currentLocCity;
    if (clc=='定位失败，点击重试'){
      this.loadCity();
    } else if(clc=='定位中...'){
    } else{ // 点击的是城市名称
      getApp().globalData.cityname = clc;
      wx.navigateBack();
    }
  },

  /** 点击某个城市列表项后执行 */
  tapCityItem(e){
    let cityname = e.currentTarget.dataset.cityname;
    console.log(cityname);
    // 存入globalData  getApp() 将返回全局唯一的App对象
    getApp().globalData.cityname = cityname;
    wx.navigateBack();
  },

  /** 选择右侧字母后 */
  tapLetter(e){
    let letter = e.currentTarget.dataset.letter;
    this.setData({
      currentLetter : letter
    })
  },

  /** 加载当前城市 */
  loadCity(){
    this.setData({
      currentLocCity: '定位中...'
    })
    // 去globalData中获取qqmapsdk
    let qqmapsdk = getApp().globalData.qqmapsdk;
    qqmapsdk.reverseGeocoder({
      success: (res)=>{
        let c = res.result.address_component.city;
        // 把c存入data
        this.setData({
          currentLocCity: c
        })
      },
      fail: (err)=>{
        console.log(err);
        // 如果当前应用没有定位权限，
        if (err.status==1000){ // 1000代表未授权
          // 则弹出对话框，让用户去设置页面赋予权限
          wx.showModal({
            title: '提示',
            content: '是否跳转到设置页开放定位权限？',
            success: (res)=>{ 
              if(res.confirm){ // 点击确定
                console.log('点击了确定...')
                // 跳转到设置页，进行授权
                wx.openSetting().then(openSettingRes=>{
                  // 如果用户重新赋予了权限
                  if(openSettingRes
                      .authSetting['scope.userLocation']){
                    this.loadCity();
                  }
                })
              }
            }
          })
        }

        // 更新界面内容，提示：定位失败，点击重试
        this.setData({
          currentLocCity: '定位失败，点击重试'
        })
      }
    });
  },

  /** 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    console.log(citymap);
    // 重新加载当前城市
    this.loadCity();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})