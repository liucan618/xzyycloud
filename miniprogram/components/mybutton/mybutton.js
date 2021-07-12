// components/mybutton/mybutton.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: String,
      value: 'rect'
    },
    color: {
      type: String,
      value: '#36D'
    },
    text: {
      type: String,
      value: '我是按钮'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    count: 0
  },
  /** 组件的方法列表 */
  methods: {
    tapEvent(){
      this.data.count++;
      console.log('点击了子组件'+this.data.count);
      // 当连续点了3次  
      if(this.data.count%3 == 0){
        // 主动触发父组件中绑定的事件，执行相关处理代码
        this.triggerEvent('tap3times')
      }
    }
  }
})
