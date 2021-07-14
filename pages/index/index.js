Page({
  data: {
    image1: '../../images/img/play.png',
    image2: '../../images/img/shopping.png',
    image3: '../../images/img/study.png',
    image4: '../../images/img/car.png',
    image5: '../../images/img/roommates.png',
    image6: '../../images/img/foods.png',
    image7: '../../images/img/call.png',
    image8: '../../images/img/others.png',
    image9: '../../images/img/lift.png',
    image10: '../../images/img/jiangxue.png',
    image11: '../../images/img/zuxue.png',
    image12: '../../images/img/parttime.png',
    image13: '../../images/img/yiwai.png',
    image14: '../../images/img/othersin.png', 
    image15: '../../images/img/licai.png'

  },
  gotopay: function(event) {
    var mydate = new Date();
    var date1 = mydate.getFullYear() + '-' + (mydate.getMonth() + 1) + '-' + mydate.getDate();
    var time1 = mydate.getHours() + ':' + mydate.getMinutes();
    var id = event.currentTarget.id;
    var pay = true;
    if (event.currentTarget.id == 1) {
      wx.navigateTo({
        url: '../pay/pay?play=' + id + '&date1=' + date1 + '&time1=' + time1 + '&pay=' + pay,
      })
    }
    if (event.currentTarget.id == 2) {
      wx.navigateTo({
        url: '../pay/pay?play=' + id + '&date1=' + date1 + '&time1=' + time1 + '&pay=' + pay,
      })
    }
    if (event.currentTarget.id == 3) {
      wx.navigateTo({
        url: '../pay/pay?play=' + id + '&date1=' + date1 + '&time1=' + time1 + '&pay=' + pay,
      })
    }
    if (event.currentTarget.id == 4) {
      wx.navigateTo({
        url: '../pay/pay?play=' + id + '&date1=' + date1 + '&time1=' + time1 + '&pay=' + pay,
      })
    }
    if (event.currentTarget.id == 5) {
      wx.navigateTo({
        url: '../pay/pay?play=' + id + '&date1=' + date1 + '&time1=' + time1 + '&pay=' + pay,
      })
    }
    if (event.currentTarget.id == 6) {
      wx.navigateTo({
        url: '../pay/pay?play=' + id + '&date1=' + date1 + '&time1=' + time1 + '&pay=' + pay,
      })
    }
    if (event.currentTarget.id == 7) {
      wx.navigateTo({
        url: '../pay/pay?play=' + id + '&date1=' + date1 + '&time1=' + time1 + '&pay=' + pay,
      })
    }
    if (event.currentTarget.id == 8) {
      wx.navigateTo({
        url: '../pay/pay?play=' + id + '&date1=' + date1 + '&time1=' + time1 + '&pay=' + pay,
      })
    }
  },
  gotoin: function(event) {
    var num = ['1', '2', '3', '4', '5', '6','7'];
    var mydate = new Date();
    var date1 = mydate.getFullYear() + '-' + (mydate.getMonth() + 1) + '-' + mydate.getDate();
    var time1 = mydate.getHours() + ':' + mydate.getMinutes();
    var comein = true;
    if (event.currentTarget.id == 9) {
      wx.navigateTo({
        url: '../in/in?play=' + num[0] + '&date1=' + date1 + '&time1=' + time1 + '&comein=' + comein,
      })
    }
    if (event.currentTarget.id == 10) {
      wx.navigateTo({
        url: '../in/in?play=' + num[1] + '&date1=' + date1 + '&time1=' + time1 + '&comein=' + comein,
      })
    }
    if (event.currentTarget.id == 11) {
      wx.navigateTo({
        url: '../in/in?play=' + num[2] + '&date1=' + date1 + '&time1=' + time1 + '&comein=' + comein,
      })
    }
    if (event.currentTarget.id == 12) {
      wx.navigateTo({
        url: '../in/in?play=' + num[3] + '&date1=' + date1 + '&time1=' + time1 + '&comein=' + comein,
      })
    }
    if (event.currentTarget.id == 13) {
      wx.navigateTo({
        url: '../in/in?play=' + num[4] + '&date1=' + date1 + '&time1=' + time1 + '&comein=' + comein,
      })
    }
    if (event.currentTarget.id == 14) {
      wx.navigateTo({
        url: '../in/in?play=' + num[5] + '&date1=' + date1 + '&time1=' + time1 + '&comein=' + comein,
      })
    }
    if (event.currentTarget.id == 15) {
      wx.navigateTo({
        url: '../in/in?play=' + num[6] + '&date1=' + date1 + '&time1=' + time1 + '&comein=' + comein,
      })
    }
  }
})