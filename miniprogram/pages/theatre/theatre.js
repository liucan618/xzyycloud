// pages/theatre/theatre.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    kw: '',
    theatreList: [],
    cityname: '未选择'
  },

  /** 搜索影院信息 */
  search(){
    let cityname = getApp().globalData.cityname;
    let kw = this.data.kw;
    let qqmapsdk = getApp().globalData.qqmapsdk;
    qqmapsdk.search({
      keyword: '影院  '+kw,
      region: cityname,
      page_size: 20,
      success: (res)=>{
        console.log(res)
        // 把res.data中的m转为km
        res.data.forEach(item=>{
          let disstr = (item._distance/1000).toFixed(2)+" km";
          item._distance_str = disstr;
        })
        // 把返回的列表数据存入data，渲染页面
        this.setData({
          theatreList : res.data
        })
      }
    })
  },

  /** 当点击某个列表项时，跳转到地图界面 */
  tapTheatre(e){
    let i = e.currentTarget.dataset.index;
    let t = this.data.theatreList[i];
    wx.openLocation({
      name: t.title,
      address: t.address,
      latitude: t.location.lat,
      longitude: t.location.lng
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 加载当前位置周边的影院列表
    let qqmapsdk = getApp().globalData.qqmapsdk;
    qqmapsdk.search({
      keyword: '影院',
      page_size: 20,
      success: (res)=>{
        console.log(res)
        // 把res.data中的m转为km
        res.data.forEach(item=>{
          let disstr = (item._distance/1000).toFixed(2)+" km";
          item._distance_str = disstr;
        })
        // 把返回的列表数据存入data，渲染页面
        this.setData({
          theatreList : res.data
        })
      }
    })
  },

  onShow(){
    // 从globalData中获取数据
    let cityname = getApp().globalData.cityname;
    this.setData({ cityname })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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