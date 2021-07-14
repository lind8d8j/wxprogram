import * as echarts from '../../ec-canvas/echarts.js'

function setOption(chart, name, num) {
  const option = {
    title: {
      text: '收入',
      x: 'center'
    },
    tooltip: {
      trigger: 'item',
      position: ['50%', '50%'], //提示框的位置
      formatter: "{b} : {c} ({d}%)" //回调函数，回调提示框中的信息
    },
    legend: { //说明
      orient: 'vertical', //图例列表的布局朝向。
      left: 'left', //图例位置
      textStyle: {
        fontSize: 14
      },
      data: ['生活费', '奖学金', '助学金', '兼职收入', '意外收入', '其他收入']
    },
    series: [{
      type: 'pie',
      radius: '55%',
      center: ['50%', '50%'],
      data: [{
          name: '生活费',
          value: num[0]
        },
        {
          name: '奖学金',
          value: num[1]
        },
        {
          name: '助学金',
          value: num[2]
        },
        {
          name: '兼职收入',
          value: num[3]
        },
        {
          name: '意外收入',
          value: num[4]
        },
        {
          name: '其他收入',
          value: num[5]
        }
      ],
      symbol: 'none',
      lineStyle: {
        width: 1
      },
      label: {
        fontSize: 14
      }
    }]
  };
  chart.setOption(option)
}
Page({
  data: {
    ecOne: {
      lazyLoad: true
    },
    timer: '' //因为我要实时刷新，所以设置了个定时器
  },
  onLoad: function(options) {
    var _this = this;
    wx.showLoading({
      title: '加载中...',
    })
    this.getOneOption();
    this.setData({ //每隔一分钟刷新一次
      timer: setInterval(function() {
        _this.getOneOption();
      }, 60000)
    })
  },
  onReady: function() { //这一步是一定要注意的
    this.oneComponent = this.selectComponent('#mychart-one');
  },
  onUnload: function() {
    clearInterval(this.data.timer)
  },
  init_one: function(name, num) { //初始化第一个图表
    this.oneComponent.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      setOption(chart, name, num)
      this.chart = chart;
      return chart;
    });
  },


  getOneOption: function(event) {
    wx.cloud.callFunction({
      name: 'getUserinfo',
      success: res => {
        // console.log('云函数获取到的openid: ', res.result)
        var openid = res.result.openId;
        const db = wx.cloud.database();
        const zhangben = db.collection('zhangben');
        db.collection('zhangben').where({
          _openid: openid
        }).get({
          success: res => {
            // res.data 是包含以上定义的两条记录的数组
            // console.log(res.data)
            var name = [];
            var num = [];
            var sum = 0,
              sum1 = 0,
              sum2 = 0,
              sum3 = 0,
              sum4 = 0,
              sum5 = 0
            for (var i = 0; i < res.data.length; i++) {
              if (res.data[i].range == '生活费') {
                sum += res.data[i].rmb
              }
              if (res.data[i].range == '奖学金') {
                sum1 += res.data[i].rmb
              }
              if (res.data[i].range == '助学金') {
                sum2 += res.data[i].rmb
              }
              if (res.data[i].range == '兼职收入') {
                sum3 += res.data[i].rmb
              }
              if (res.data[i].range == '意外收入') {
                sum4 += res.data[i].rmb
              }
              if (res.data[i].range == '其他收入') {
                sum5 += res.data[i].rmb
              }
            }
            console.log(sum, sum1, sum2, sum3, sum4, sum5)
            num.push(sum, sum1, sum2, sum3, sum4, sum5)
            name.push('生活费', '奖学金', '助学金', '兼职收入', '意外收入', '其他收入')
            console.log(num)
            console.log(name)
            this.init_one(name, num)
            wx.hideLoading();
          },
          fail: res => {
            wx.showToast({
              title: '网络出问题了哦',
            })
          }
        })
      }
    })
  }

})