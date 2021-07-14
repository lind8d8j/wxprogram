// const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    zichan: 0,
    cash: 0,
    business: 0,
    banking_card: 0,
    credit_card: 0,
    alipay: 0,
    weixinzhifu: 0,
    yuerbao: 0,
    huabei: 0,
    jingdong: 0,
    others: 0,
    nickName: '未授权',
    avatarUrl: '../../images/userinit.png',
    cash_image: 'cloud://cloudtest-07050820.636c-cloudtest-07050820/image/现金.png',
    business_card_image: 'cloud://cloudtest-07050820.636c-cloudtest-07050820/image/信用卡.png',
    banking_card_image: 'cloud://cloudtest-07050820.636c-cloudtest-07050820/image/银行卡.png',
    credit_card_image: 'cloud://cloudtest-07050820.636c-cloudtest-07050820/image/卡片.png',
    alipay_iamge: 'cloud://cloudtest-07050820.636c-cloudtest-07050820/image/支付宝.png',
    weixinzhifu_image: 'cloud://cloudtest-07050820.636c-cloudtest-07050820/image/微信支付.png',
    yuerbao_image: 'cloud://cloudtest-07050820.636c-cloudtest-07050820/image/余额宝.png',
    huabei_image: 'cloud://cloudtest-07050820.636c-cloudtest-07050820/image/花呗账单.png',
    jingdong_image: 'cloud://cloudtest-07050820.636c-cloudtest-07050820/image/白条.png',
    others_image: 'cloud://cloudtest-07050820.636c-cloudtest-07050820/image/其他账户.png',
    explain_image: 'cloud://cloudtest-07050820.636c-cloudtest-07050820/image/explain.png',
    about_image: 'cloud://cloudtest-07050820.636c-cloudtest-07050820/image/about.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中...',
    })
    this.getUserinfo();
    this.getRmb();
  },
  ZHtiaozhuan: function(e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '../ZHtiaozhuan/ZHtiaozhuan?id=' + id,
    })
  },

  getUserinfo: function() {
    wx.cloud.callFunction({
      name: 'getUserinfo',
      success: res => {
        var openid = res.result.openId;
        const db = wx.cloud.database();
        db.collection('Userinfo').where({
          _openid: openid
        }).get({
          success: res => {
            console.log(res.data[0].data)
            this.setData({
              nickName: res.data[0].data.nickName,
              avatarUrl: res.data[0].data.avatarUrl
            })
          }
        })
      }
    })
  },
  getUserInfoi:function(){
    wx.showLoading({
      title: '加载中...',
    })
    wx.cloud.callFunction({
      name: 'getUserinfo',
      success: res => {
        var openId = res.result.openId;
        console.log(openId)
        wx.cloud.callFunction({
          name: 'checkUserinfo',
          data: {
            openid: openId
          },
          success: res => {
            console.log(res.result.data)
            if (res.result.data == '') {
              wx.navigateTo({
                url: '../login/login',
              })
              wx.hideLoading();
            }
            if (res.result.data[0]._openid == openId) {
              wx.switchTab({
                url: '../user/user',
              })
              wx.hideLoading();
              wx.showModal({
                title: '系统提示',
                content: '您已授权。',
              })
            } 
            
          }
        })
      },
      fail: res => {
        console.log(res)
      },
    })
  },
  getRmb: function() {
    var that = this;
    wx.showLoading({
      title: '加载中....',
    })
    wx.cloud.callFunction({
      name: 'getUserinfo',
      success: res => {
        // console.log('云函数获取到的openid: ', res.result)
        var openid = res.result.openId;
        const db = wx.cloud.database();
        db.collection('zhangben').where({
            _openid: openid
          })
          .count({ //获取该数据库有多少组数据
            success: res => {
              console.log(res.total);
              that.data.totalCount = res.total;
              this.setData({
                totalCount: that.data.totalCount
              })
            }
          })
        wx.cloud.callFunction({
          name: 'getMoreRmb',
          data: {
            openId: openid
          }
        }).then(res => {
          // res.data 是包含以上定义的两条记录的数组
          // console.log(res.data[0].account);
          console.log(res.result.data)
          wx.hideLoading();
          console.log(that.data.totalCount);
          that.data.zichan = 0;
          that.data.cash = 0;

          if (that.data.totalCount >= 0) {
            var zichan = 0;
            var cash = 0;
            var business = 0;
            var banking_card = 0;
            var credit_card = 0;
            var alipay = 0;
            var weixinzhifu = 0;
            var yuerbao = 0;
            var huabei = 0;
            var jingdong = 0;
            var others = 0;
            for (var i = 0; i < that.data.totalCount; i++) { //注意范围啊，被坑死了！！！
              zichan += res.result.data[i].rmb; //求总资产
              if (res.result.data[i].account == '现金') {
                cash += res.result.data[i].rmb //求现金
              }
              if (res.result.data[i].account == '信用卡') {
                business += res.result.data[i].rmb //求信用卡
              }
              if (res.result.data[i].account == '银行卡') {
                banking_card += res.result.data[i].rmb //求银行卡
              }
              if (res.result.data[i].account == '校园卡') {
                credit_card += res.result.data[i].rmb //求校园卡
              }
              if (res.result.data[i].account == '支付宝') {
                alipay += res.result.data[i].rmb //求支付宝
              }
              if (res.result.data[i].account == '微信') {
                weixinzhifu += res.result.data[i].rmb //求微信钱包
              }
              if (res.result.data[i].account == '余额宝') {
                yuerbao += res.result.data[i].rmb //求余额宝
              }
              if (res.result.data[i].account == '花呗') {
                huabei += res.result.data[i].rmb //求花呗
              }
              if (res.result.data[i].account == '京东白条') {
                jingdong += res.result.data[i].rmb //求京东白条
              }
              if (res.result.data[i].account == '其他') {
                others += res.result.data[i].rmb //求其他
              }
            }
            that.setData({ //设置资产总值
              zichan: (zichan).toFixed(2),
            })
            // console.log(that.data.cash);
            that.setData({ //设置现金总值
              cash: (cash).toFixed(2)
            })
            that.setData({ //设置信用卡总值
              business: (business).toFixed(2)
            })
            that.setData({ //设置银行卡总值
              banking_card: (banking_card).toFixed(2)
            })
            that.setData({ //设置校园卡总值
              credit_card: (credit_card).toFixed(2)
            })
            that.setData({ //设置支付宝总值
              alipay: (alipay).toFixed(2)
            })
            that.setData({ //设置微信钱包总值
              weixinzhifu: (weixinzhifu).toFixed(2)
            })
            that.setData({ //设置余额宝总值
              yuerbao: (yuerbao).toFixed(2)
            })
            that.setData({ //设置花呗总值
              huabei: (huabei).toFixed(2)
            })
            that.setData({ //设置京东白条总值
              jingdong: (jingdong).toFixed(2)
            })
            that.setData({ //设置其他总值
              others: (others).toFixed(2)
            })
          } else {
            console.log(error);
          }
        })
      },
      fail: res => {
        console.log(res.errMsg);
      }
    })
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
    wx.showLoading({
      title: '加载中....',
    })
    this.getRmb();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '我发现了一个很棒的记账小程序，墙裂推荐 ！',
      path: '/pages/indexlast/indexlast',
      imageUrl: '../../images/jizhang.png',
    }
  },
  explain: function() {
    wx.navigateTo({
      url: '../explain/explain',
    })
  },
  about: function() {
    wx.navigateTo({
      url: '../about/about',
    })
  }

})