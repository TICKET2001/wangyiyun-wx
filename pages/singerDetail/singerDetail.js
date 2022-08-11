// pages/singerDetail/singerDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //当前歌手数据
    singerData:[],
    //歌手详情
    singerDetail:[],
    //歌手热门单曲
    hotMusicList:[]
  },
 //点击跳转play页面
 playLink:function(e){
  //拿到当前下标
  // console.log(e.currentTarget.dataset.index)
  const index=e.currentTarget.dataset.index
  //拿到播放列表数据
  const musicdata=this.data.hotMusicList.data.songs
  //获取歌曲id
  let mid=musicdata[index].id
  wx.request({
    url: 'http://localhost:3000/check/music?id='+mid,
    success:(result) => {
      if(result.data.message=="ok"){
        console.log('可以播放')
        //定义数据对象
        const objdata={}
        //存储列表数据
        objdata.musiclist=musicdata
        //存储当前播放的歌曲下标
        objdata.nowIndex=index
        console.log(objdata)
        wx.navigateTo({
          url: '/pages/play/play',
          success: (result) => {
            result.eventChannel.emit('acceptDataFromOpenerPage', { data: objdata })
          },
        })
      }else{
        console.log('不能播放')
        //弹框提示
        wx.showModal({
          content:'歌曲没有版权请选择其他歌曲进行播放'
        })
      }
    }
  })


},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //获取页面传输过来的歌手基本数据，并进行了存储
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', data=> {
      console.log(data)
      this.setData({
        singerData:data
      })
    })
    //调用渲染页面的方法
    this.getDetail()
    //调用热门单曲
    this.gethotMusic()
  },
  //页面详情数据获取
  getDetail:function(){
    //获取id
    const id=this.data.singerData.data.id
    console.log(id)
    //通过id做数据请求
    wx.request({
      url: 'http://localhost:3000/artist/detail?id='+id,
      success: (result) => {
        console.log(result)
        this.setData({
          singerDetail:result
        })
      },
    })
  },
  //热门单曲
  gethotMusic:function(){
    //获取id
    const id=this.data.singerData.data.id
    console.log(id)
    //通过id做数据请求
    wx.request({
      url: 'http://localhost:3000/artist/top/song?id='+id,
      success: (result) => {
        console.log(result)
        this.setData({
          hotMusicList:result
        })
      },
    })
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