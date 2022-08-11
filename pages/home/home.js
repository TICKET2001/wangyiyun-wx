// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    background:[1,2,3,4,5],
    swiperList:[],
    singer:[],
    newMusic:[]
  },
  //点击热门歌手
  hotLink:function(e){
    //获取当前下标
    const index=e.currentTarget.dataset.index
    //拿到当前数据
    const singer= this.data.singer
    // console.log(singer[index])
    //跳转页面和数据传递
    wx.navigateTo({
      url: '/pages/singerDetail/singerDetail',
      success:function(res){
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: singer[index] })
      }
    })
  },
  //点击跳转play页面
  playLink:function(e){
    //拿到当前下标
    // console.log(e.currentTarget.dataset.index)
    const index=e.currentTarget.dataset.index
    //拿到列表数据
    const musicdata=this.data.newMusic
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
    //轮播图
    this.getSwiperList()
    //歌手
    this.getSinger()
    //最新音乐
    this.getnewMusic()
  },
  //获取轮播图
  getSwiperList(){
    wx.request({
      url: 'http://localhost:3000/banner?type=2',
      method:'GET',
      success:res=>{
        // console.log(res.data.banners)
        this.setData({
          swiperList:res.data.banners
        })
      }
    })
  },
  //获取歌手
  getSinger(){
    wx.request({
      url: 'http://localhost:3000/top/artists?offset=0&limit=30',
      method:'GET',
      success:res=>{
        // console.log(res.data.artists)
        this.setData({
          singer:res.data.artists.slice(0,10)
        })
      }
    })
  },
  //获取新音乐
  getnewMusic(){
    wx.request({
      url: 'http://localhost:3000/personalized/newsong',
      method:'GET',
      success:res=>{
        // console.log(res.data.result)
        this.setData({
          newMusic:res.data.result
        })
      }
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