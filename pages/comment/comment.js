import { verifyToken } from '../../utils/util'

const app = getApp()

Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    color: '#000',
    background: '#ffffff',
    avatarWidth: app.globalData.avatarWidth,
    sheetShow: false,
    sheetActions: [
      { name: '回复' },
      { name: '转发' },
      { name: '投诉' }
    ],
    description: '',
    commentVO: null,
    commentVOList: [],
    sort: 'like_count',
    sortName: '按热度',
    count: 0,
    popupShow: false,
    commentValue: '',
    placeholder: '写评论',
    checked: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.calWidth();
    const cid = options.cid;
    const that = this;
    wx.request({
      url: app.globalData.host + '/comment/' + cid,
      header: {
        'token': app.globalData.token
      },
      success(res) {
        verifyToken(res);
        if (res.statusCode == 200) {
          that.setData({
            commentVO: res.data.data.commentVO,
            commentVOList: res.data.data.commentVO.commentVOList,
            count: res.data.data.count
          })
        }
      }
    })
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

  },

  calWidth: function () {
    const windowWidth = wx.getSystemInfoSync().windowWidth;
    const avatarWidth = windowWidth * 0.3 * 0.33;
    this.setData({
      avatarWidth: avatarWidth,
    })
  },

  sheetClose: function () {
    this.setData({
      sheetShow: false
    })
  },

  sheetOpen: function (e) {
    const name = e.currentTarget.dataset.name;
    const content = e.currentTarget.dataset.content;
    this.setData({
      sheetShow: true,
      description: name + ": " + content
    })
  },

  popupOpen: function (e) {
    this.setData({
      popupShow: true
    })
  },

  popupClose: function () {
    this.setData({
      popupShow: false
    })
  },

  checkedChange: function () {
    this.setData({
      checked: !checked
    })
  },

  getCommentVOList: function () {
    const that = this;
    wx.request({
      url: app.globalData.host + '/comment/' + this.data.commentVO.cid + "/comment?sort=" + this.data.sort,
      header: {
        'token': app.globalData.token
      },
      success(res) {
        verifyToken(res);
        if (res.statusCode == 200) {
          that.setData({
            commentVOList: that.data.commentVOList.concat(res.data.data.commentVOList),
            count: res.data.data.count
          })
        }
      }
    })
  },

  changeSort: function () {
    if (this.data.sort == 'like_count') {
      this.setData({
        sort: 'create_time',
        sortName: '按时间',
        commentVOList: []
      })
    } else {
      this.setData({
        sort: 'like_count',
        sortName: '按热度',
        commentVOList: []
      })
    }
    this.getCommentVOList();
  },

  likeChange1: function (e) {
    const cid = e.currentTarget.dataset.cid;
    const islike = e.currentTarget.dataset.is_like;
    const islikeIndex = "commentVO.isLike";
    const likeCountIndex = "commentVO.likeCount";
    if (islike) {
      this.setData({
        [islikeIndex]: false,
        [likeCountIndex]: this.data.commentVO.likeCount - 1
      })
      wx.request({
        url: app.globalData.host + '/commentLike/' + cid,
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
        [likeCountIndex]: this.data.commentVO.likeCount + 1
      })
      wx.request({
        url: app.globalData.host + '/commentLike/' + cid,
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

  likeChange2: function (e) {
    const cid = e.currentTarget.dataset.cid;
    const islike = e.currentTarget.dataset.is_like;
    const index = e.currentTarget.dataset.index;
    const islikeIndex = "commentVOList[" + index + "].isLike";
    const likeCountIndex = "commentVOList[" + index + "].likeCount";
    if (islike) {
      this.setData({
        [islikeIndex]: false,
        [likeCountIndex]: this.data.commentVOList[index].likeCount - 1
      })
      wx.request({
        url: app.globalData.host + '/commentLike/' + cid,
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
        [likeCountIndex]: this.data.commentVOList[index].likeCount + 1
      })
      wx.request({
        url: app.globalData.host + '/commentLike/' + cid,
        header: {
          'token': app.globalData.token
        },
        method: 'put',
        success(res) {
          verifyToken(res);
        }
      })
    }
  }
})