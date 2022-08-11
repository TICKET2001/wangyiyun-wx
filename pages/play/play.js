// pages/play/play.js
const innerAudioContext = wx.createInnerAudioContext()
innerAudioContext.autoplay = true
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //歌曲列表
    musicList:[],
    //当前歌曲下标
    nowIndex:[],
    //当前整个歌曲数据
    music:{},
    //歌词
    lyrics:[],
    //控制播放暂停
    flag:"true",
    //暂停播放按钮图片路径
    imgUrl:'/image/zantin.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //获取传过来的歌曲数据
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', data=> {
      // console.log(data)
      const musicList=data.data.musiclist
      const nowIndex=data.data.nowIndex
      //当前播放歌曲
      const music=musicList[nowIndex]
      console.log(music)
      //赋值
      this.setData({
        nowIndex:nowIndex,
        musicList:musicList,
        music:music
      })
    })
    this.getLyrics()
  },
  
  //歌词获取
  getLyrics:function(){
    //获取id
    const id=this.data.music.id
    console.log(id)
    innerAudioContext.src = 'https://music.163.com/song/media/outer/url?id='+this.data.music.id+'.mp3'
    //通过id做数据请求
    wx.request({
      url: 'http://localhost:3000/lyric?id='+id,
      success: (result) => {
        //获取歌词
        var lrcStr=result.data.lrc.lyric
        /**处理歌词字符串*/
        //一句一句拆分存储成数据
        var lyricList=lrcStr.split("\n")
        // console.log(lyricList)
        //存储最终处理后的结果
        var lrctimeList=[]
        //设置正则表达式
        var re=/\[\d{2}:\d{2}\.\d{2,3}\]/
        for(var i=0;i<lyricList.length;i++){
          //进行时间和歌词的拆分
          var date=lyricList[i].match(re)
          //判断时间数组不能为空
          if(date!=null){
            //替换时间字符串，拿到歌词
            var lrc=lyricList[i].replace(re,"")
            //拿到时间字符串
            var timestr=date[0]
            //判断时间字符串是否为空
            if(timestr!==null){
              /**处理时间 要把分钟拿到变成以秒为单位然后加上后面的秒数*/
              //去除大括号
              var timerstr_slice=timestr.slice(1,-1)
              //时间和秒数拆分
              var splitList=timerstr_slice.split(":")
              var f=splitList[0]
              var m=splitList[1]
              //计算秒数
              var time=parseFloat(f)*60+parseFloat(m)
              //最终结果列表添加数据
              lrctimeList.push([time,lrc])
            }
          }
        }
        //存储数据到data中
        this.setData({
          lyrics:lrctimeList
        })
      },
    })
  },
  //控制播放和暂停
  play:function(){
    if(this.data.flag==false){
      this.setData({
        flag:true,
        imgUrl:'/image/zantin.png'
      })
      innerAudioContext.play()
      console.log('播放')
    }else{
      this.setData({
        flag:false,
        imgUrl:'/image/bofan2.png'
      })
      innerAudioContext.pause()
      console.log('暂停')
    }
    // console.log(innerAudioContext.currentTime)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})