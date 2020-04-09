// components/weibo-text/weibo-text.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    textList: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    toUser: function (e) {
      const uid = e.currentTarget.dataset.uid;
      wx.navigateTo({
        url: '/pages/user/user?uid=' + uid
      })
    },

    toTopic: function (e) {
      const content = e.currentTarget.dataset.topic;
      wx.navigateTo({
        url: '/pages/search/search?content=' + content,
      })
    }
  }
})
