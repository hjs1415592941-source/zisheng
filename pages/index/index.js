Page({
    data: {
      swiperList: [],
      hotList: [],
      recommendList: [],
      loading: true
    },
  
    onLoad() {
      console.log("🔥 Home onLoad")
  
      // 获取 Swiper
      wx.cloud.callFunction({
        name: "getSwiper"
      }).then(res => {
        this.setData({
          swiperList: res.result.data || []
        })
      })
  
      // 热门
      wx.cloud.callFunction({
        name: "getHotlist"
      }).then(res => {
        this.setData({
          hotList: res.result.data || []
        })
      })
  
      // 精品推荐
      wx.cloud.callFunction({
        name: "getRecommendList"
      }).then(res => {
        console.log("✅ 推荐数据", res.result.data)
        this.setData({
          recommendList: res.result.data || [],
          loading: false
        })
      }).catch(err => {
        console.error("❌ 获取推荐失败", err)
        this.setData({ loading: false })
      })
    },
  
    // 跳详情
    goDetail(e) {
      const item = e.currentTarget.dataset.item
      if (!item || !item.goods_id) {
        console.error("❌ goods_id 不存在：", item)
        return
      }
      wx.navigateTo({
        url: `/pages/detail/detail?goods_id=${item.goods_id}`
      })
    },
  
    // 查找经销门店
    goSearch() {
        wx.navigateTo({
          url: '/pages/search/search'   // 你的搜索页路径
        })
      }
      
  })
  