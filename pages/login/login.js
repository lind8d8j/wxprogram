Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    this.Jianquan();
  },
  Jianquan: function(){
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo);

              wx.cloud.callFunction({
                name: 'getUserinfo',
                success: res => {
                  var openid = res.result.openId;
                  console.log(openid)
                  wx.cloud.callFunction({
                    name: 'checkUserinfo',
                    data: {
                      openid: openid
                    },
                    success: res => {
                      console.log(res.result.data)
                      if (res.result.data[0]._openid == openid) {
                        wx.switchTab({
                          url: '../user/user',
                        })
                        wx.hideLoading();
                      }
                    }
                  })
                },
                fail: res => {
                  console.log(res)
                }
              })

              //用户已经授权过
              // wx.switchTab({
              //   url: '../indexlast/indexlast'
              // })
            }
          });
        }
      }
    })
  },

  bindGetUserInfo: function (e) {
    console.log(e.detail.userInfo);
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      //存用户信息到本地存储
      const db = wx.cloud.database();
      const Userinfo = db.collection('Userinfo')
      db.collection('Userinfo').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          data: e.detail.userInfo
        }
      })
        .then(res => {
          console.log(res)
        })
      //授权成功后，跳转进入个人中心
     wx.switchTab({
       url: '/pages/user/user',
     })
      wx.hideLoading();
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '系统提示',
        content: '您点击了拒绝授权，将无法获取您的头像及微信名称',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  }
})