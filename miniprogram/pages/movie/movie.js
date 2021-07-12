// pages/movie/movie.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: {},     // 保存当前电影信息
    isOpen: false,  // 用于保存当前简介是否为展开状态
    movieid: '',
    comments: []
  },

  /** 点击详情，切换展开与收起的状态isOpen */
  tapIntro(){
    this.setData({
      isOpen: !this.data.isOpen
    })
  },

  /** 点击剧照图片后执行 */
  tapPhoto(event){
    // 获取当前选中项的索引
    let index = event.currentTarget.dataset.index;
    console.log(event);
    // 对url进行处理，去掉@后的内容
    let urls = [];
    this.data.movie.thumb.forEach(item=>{
      let url = 
        item.substring(0, item.lastIndexOf('@'))
      urls.push(url);
    });
    wx.previewImage({
      current: urls[index],
      urls:urls
    })
  },
  
  /** 加载所有评论 */
  loadComments(){
    // 查询云数据库，加载评论列表  在app.js中需要初始化云环境
    let db = wx.cloud.database();
    console.log('loadComments. movieid:' + this.data.movieid);
    db.collection('comments').where({
      movieid: this.data.movieid
    })
    .skip(0)   // 跳过前0条记录
    .limit(4)  // 向后查询4条记录
    .get().then(res=>{
      console.log(res);
      // 把res.data 这些查到的评论信息，存入data，在页面中完成评论列表渲染
      this.setData({
        comments: res.data
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id;
    console.log(id);
    // 把id存入data中
    this.data.movieid = id;
    // 通过id，查询电影详细信息
    wx.request({
      url: 'https://api.tedu.cn/detail.php',
      data: {id: id},
      success: (res)=>{
        console.log(res);
        // 把电影详情信息，存入data中，渲染页面
        this.setData({
          movie: res.data
        })
        // 加载所有评论数据
        this.loadComments();
      }
    });


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