// pages/success/success.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showne: false,
    contant: [],
    Imaurl1: '',
    Imaurl: '../../images/down.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    var data = {
      "datas": [{
          id: 1,
          display: "支出"
        },
        {
          id: 2,
          display: "收入"
        }
      ]
    }
    this.setData({
      contant: data.datas
    })
    this.setData({
      Imaurl1: '../../images/complete.png'
    })
  },

  changebiaozhi: function(e) {
    console.log(e)
    if (this.data.showne) {
      this.setData({
        showne: false,
        Imaurl: '../../images/down.png'
      })
    } else {
      this.setData({
        showne: true,
        Imaurl: '../../images/up.png'
      })
    }
  },
  tiaozhuan: function(e) {
    if (e.target.id == 0) {
      wx.redirectTo({
        url: '../pay/pay',
      })
    }
    if (e.target.id == 1) {
      wx.redirectTo({
        url: '../in/in',
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  Checkdetail: function() {
    wx.switchTab({
      url: '../diaplay/diaplay'
    })
  },
  Comebackindex: function() {
    wx.switchTab({
      url: '../indexlast/indexlast'
    })
  }

})