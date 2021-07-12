// index.js
// 获取应用实例
const app = getApp();
// 
var QQMapWX = require('../../libs/qqmap-wx-jssdk');
var qqmapsdk;

Page({
  data: {
    movies : [], // 用于保存当前正在显示的电影列表
    cid: 1,      //当前选中项的类别ID
    cityname: '未选择'
  },

  /** 点击选择城市 */
  tapChooseCity(){
    wx.navigateTo({
      url: '/pages/citylist/citylist'
    })
  },

  /** 点击导航选项时触发 */
  tapnav(event){
    let id = event.target.dataset.id; // 获取事件源对象的data-id属性值
    this.setData({
      cid: id
    });
    // 先去缓存中找找，看有没有存过当前cid的首页
    // 如果有拿来直接用，没有的话再去发请求
    wx.getStorage({
      key: id,
      success: (res)=>{   // 拿到了数据
        console.log(res);
        // 使用缓存中的数据，更新列表
        this.setData({
          movies: res.data
        })
      },
      fail: (err)=>{   // 没有拿到数据
        console.warn(err);
        // 重新发送http请求，访问cid类别的第一页
        this.loadData(id, 0).then(movielist=>{
          this.setData({
            movies: movielist
          })
          // 把当前movielist，存入storage
          wx.setStorage({
            key: id,
            data: movielist
          })
        })
      }
    })
  },

  /**
   * 加载电影列表数据
   * @param {*} cid     电影类别id
   * @param {*} offset  起始位置下标
   */
  loadData(cid, offset){
    return new Promise((resolve, reject)=>{
      // 发请求之前先弹一个等待框
      wx.showLoading({
        title: "加载中",
      })
      // 执行异步操作
      wx.request({
        url: 'https://api.tedu.cn/index.php',
        method: 'GET',
        data: {cid, offset},
        success: (res)=>{
          // 把服务端返回的列表 交给resolve进行处理
          resolve(res.data); 
          // 数据处理完毕后，关闭等待框
          wx.hideLoading()
        }
      })
    });
  },

  /** 页面加载时执行 */
  onLoad() {
    // 发送请求，访问列表数据
    this.loadData(1, 0).then(movielist=>{
      this.setData({
        movies : movielist
      })
    });

    // 初始化qqmapsdk
    qqmapsdk = new QQMapWX({
        key: 'WY2BZ-XD6CU-VVUVF-BW3YQ-TBXZQ-7KBNM'
    });
    qqmapsdk.reverseGeocoder({
      success: (res)=>{
        let c = res.result.address_component.city;
        // 把c存入data
        this.setData({
          cityname: c
        })
        // 把c存入globalData
        getApp().globalData.cityname = c;
      }
    });

    // 获取当前位置
    // wx.getLocation({
    //   type: "gcj02",
    //   success: (res)=>{
    //     console.log(res);
    //   }
    // });
  },

  /** 当第一次显示或从后台切回前台时执行 */
  onShow (){
    // 拿到globalData中的数据，更新界面
    let cityname = getApp().globalData.cityname;
    this.setData({cityname})
  },

  /** 触底事件 */
  onReachBottom(){
    console.log('到底了...');
    // 发送请求，访问下一页
    let cid = this.data.cid;
    let offset = this.data.movies.length;    // 查询起始索引
    // 发送请求
    this.loadData(cid, offset).then(movielist=>{
      // 追加到当前列表末尾
      let ms = this.data.movies.concat(movielist);
      this.setData({
        movies: ms
      })
    })
  },

  /** 下拉刷新时触发 */
  onPullDownRefresh(){
    console.log('下拉刷新..');
    // 从新加载当前类别的第一页数据 
    // 不仅需要更新movies，还需要存入缓存
    this.loadData(this.data.cid, 0).then(movielist=>{
      let cid = this.data.cid;
      this.setData({       // 更新UI
        movies: movielist
      });
      wx.setStorage({    // 更新缓存
        key: cid+"",
        data: movielist
      });
      wx.stopPullDownRefresh(); // 关闭下拉刷新效果
    })
  }
})
