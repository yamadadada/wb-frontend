import { verifyToken } from '../../utils/util'
import Toast from '../../vant/toast/toast';

const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    weiboList: {
      type: Array,
      value: []
    },
    showOperation: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imageWidth: 0,
    boardWidth: 0,
    likeColor: '#A7A7A7'
  },

  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      this.calWidth();
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    calWidth: function () {
      const windowWidth = wx.getSystemInfoSync().windowWidth;
      const boardWidth = windowWidth * 0.0125;
      const imageWidth = windowWidth * 0.3;
      this.setData({
        imageWidth: imageWidth,
        boardWidth: boardWidth
      })
    },

    showGallery: function (e) {
      wx.previewImage({
        current: e.currentTarget.dataset.current,
        urls: e.currentTarget.dataset.urls,
      })
    },

    toWeiboDetail: function (e) {
      wx.navigateTo({
        url: '/pages/wb-detail/wb-detail?wid=' + e.currentTarget.dataset.wid
      })
    },

    likeChange: function (e) {
      const wid = e.currentTarget.dataset.wid;
      const islike = e.currentTarget.dataset.islike;
      const index = e.currentTarget.dataset.index;
      const islikeIndex = "weiboList[" + index + "].isLike";
      const likeCountIndex = "weiboList[" + index + "].likeCount";
      if (islike) {
        this.setData({
          [islikeIndex]: false,
          [likeCountIndex]: this.data.weiboList[index].likeCount - 1
        })
        wx.request({
          url: app.globalData.host + '/weiboLike/' + wid,
          header: {
            'token': app.globalData.token
          },
          method: 'delete',
          success(res) {
            verifyToken(res);
          }
        })
      } else {
        this.setData({
          [islikeIndex]: true,
          [likeCountIndex]: this.data.weiboList[index].likeCount + 1
        })
        wx.request({
          url: app.globalData.host + '/weiboLike/' + wid,
          header: {
            'token': app.globalData.token
          },
          method: 'put',
          success(res) {
            verifyToken(res);
          }
        })
      }
    },

    toAddForward: function (e) {
      wx.navigateTo({
        url: '/pages/forward/forward?wid=' + e.currentTarget.dataset.wid + "&attach=" + e.currentTarget.dataset.attach
      })
    },

    toUser: function (e) {
      const uid = e.currentTarget.dataset.uid;
      wx.navigateTo({
        url: '/pages/user/user?uid=' + uid
      })
    },

    favoriteChange: function (e) {
      const wid = e.currentTarget.dataset.wid;
      const isFavorite = e.currentTarget.dataset.is_favorite;
      const index = e.currentTarget.dataset.index;
      const favoriteIndex = "weiboList[" + index + "].isFavorite";
      const that = this;
      if (isFavorite) {
        wx.request({
          url: app.globalData.host + '/favorite/' + wid,
          header: {
            'token': app.globalData.token
          },
          method: 'DELETE',
          success(res) {
            verifyToken(res);
            if (res.statusCode === 200) {
              Toast.success('取消收藏成功');
              that.setData({
                [favoriteIndex]: false
              });
            } else {
              Toast.fail('取消收藏失败，请稍后再试');
            }
          }
        })
      } else {
        wx.request({
          url: app.globalData.host + '/favorite/' + wid,
          header: {
            'token': app.globalData.token
          },
          method: 'POST',
          success(res) {
            verifyToken(res);
            if (res.statusCode === 200) {
              Toast.success('收藏成功');
              that.setData({
                [favoriteIndex]: true
              });
            } else {
              Toast.fail('收藏失败，请稍后再试');
            }
          }
        })
      }
    },

    toUserByName: function (e) {
      const name = e.currentTarget.dataset.name;
      wx.navigateTo({
        url: '/pages/user/user?name=' + name
      })
    }
  }
})
