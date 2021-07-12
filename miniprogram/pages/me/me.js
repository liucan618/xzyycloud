// pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: 'cloud://cloud-2102-6g5ztvkz5507bbea.636c-cloud-2102-6g5ztvkz5507bbea-1305113212/01c7fa5de71119a801209568398d87.jpg',
    nickName: '点击登录',
    islogin: false
  },

  /** 选择头像 */
  tapChooseAvatar(){
    if(!this.data.islogin){
      return;
    }
    wx.chooseImage({
      count: 1,
      success: (res)=>{
        console.log(res);
        // 把返回的头像临时路径，赋值给avatarUrl
        this.setData({
          avatarUrl: res.tempFilePaths[0]
        })
        // 把选择的图片文件上传至云存储空间
        this.uploadFile(res.tempFilePaths[0]);
      }
    })
  },

  /** 上传文件  filepath：本地文件路径 */
  uploadFile(filepath){
    // 从filepath中获取后缀名 ： .jpg  .png
    // 生成一个随机的文件名，作为cloudpath，存入云存储
    let ext = filepath.substr(
                  filepath.lastIndexOf('.'));
    let cloudpath = 'a'+Math.random()+ext;
    console.log(cloudpath);
    wx.cloud.uploadFile({
      filePath: filepath,  //本地文件路径
      cloudPath: cloudpath, //云存储空间的存储路径
      config: {
        env: 'cloud-2102-6g5ztvkz5507bbea'
      },
      success: (res=>{
        console.log(res);
        // 获取上传成功后，该图片的访问地址fileID
        let fileID = res.fileID;
        // 把fileID更新掉数据库中用户的头像字段
        let db = wx.cloud.database();
        db.collection('users').where({
          _openid : this.data.openid
        }).update({
          data: {
            avatar: fileID
          }
        }).then(updateRes=>{
          console.log(updateRes)
        })
      }),
      fail: (err)=>{   // 上传失败
        console.warn(err);
      }
    })
  },


  /** 点击登录 */
  tapLogin() {
    if(this.data.islogin){ // 如果已经登录
      return;
    }
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res)=>{
        console.log(res);
        this.setData({
          avatarUrl: res.userInfo.avatarUrl,
          nickName: res.userInfo.nickName,
          islogin: true
        })
        // 执行自定义的登录业务
        this.login();
      }
    })
  },

  /** 登录 */
  login(){
    // 调用云函数：login，获得返回结果
    wx.cloud.callFunction({
      name: 'login'
    }).then(res=>{
      // res.result.openid 就是当前用户的唯一标识符
      let openid = res.result.openid;
      this.data.openid = openid;

      // 通过openid查询云数据库，看一下有没有用户
      let db = wx.cloud.database();
      db.collection('users').where({
        '_openid': openid
      }).get().then(queryRes=>{
        console.log(queryRes);
        if(queryRes.data.length==0){
          // 如果没有，则属于第一次登录，执行注册业务
          this.register();
        }else{
          // TODO 如果有，则登录成功
          // 把数据库返回的nikename avatar更新到界面中
          let user = queryRes.data[0];
          this.setData({
            avatarUrl: user.avatar,
            nickName: user.nickname
          })
        }
      })

    })
  },

  /** 注册 将当前用户的信息id openid avatar nickname
   *  存入云数据库 */
  register(){
    let db = wx.cloud.database();
    db.collection('users').add({
      data: {
        avatar: this.data.avatarUrl,
        nickname: this.data.nickName
      },
      success: (res)=>{
        console.log(res);
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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