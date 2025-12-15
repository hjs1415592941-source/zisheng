Page({
    data: {
      categoryList: [],
      activeIndex: 0,
      goods: [],
      keyword: "",
      rawGoods: [],
      allGoods: [],
      scrollTop: 0,
  
      suggestList: [],      // 联想列表
      showSuggest: false,   // 联想浮层是否显示
  
      smartSuggestWords: [
        "葡萄糖","燕麦片","黑芝麻糊","无糖黑芝麻糊","玉米粉",
        "藕粉","果维C","固体饮料","营养麦片","核桃粉","豆奶粉","中老年豆奶粉",
        "南瓜玉米粉","滋升·礼盒装"
      ],
      placeholderText: ""
    },
  
    onLoad() {
      // 随机 placeholder
      this.setRandomPlaceholder()
  
      // 全部商品（搜索用）
      wx.cloud.callFunction({
        name: "getDetailList",
        data: { cat_id: "all" }
      }).then(res => {
        this.setData({
          allGoods: res.result.data || []
        })
      })
  
      // 分类
      wx.cloud.callFunction({
        name: "getCategory"
      }).then(res => {
        const list = res.result.data || []
        this.setData({ categoryList: list })
  
        if (list.length > 0) {
          this.fetchGoods(list[0].cat_id)
        }
      })
    },
  
    onShow() {
      this.setRandomPlaceholder()
      this.setData({
        suggestList: [],
        showSuggest: false
      })
    },
  
    /** 用户聚焦输入框 */
    onFocus() {
      if (this.data.keyword.trim()) {
        this.setData({ showSuggest: true })
      }
    },
  
    /** 输入联想 */
    onInput(e) {
      const kw = e.detail.value.trim()
      this.setData({ keyword: kw })
  
      if (!kw) {
        this.setData({
          suggestList: [],
          showSuggest: false
        })
        return
      }
  
      // 显示联想（中文或拼音后续可扩展）
      const suggest = this.data.smartSuggestWords.filter(w =>
        w.includes(kw)
      )
  
      this.setData({
        suggestList: suggest,
        showSuggest: true
      })
    },
  
    /** 输入框失去焦点 */
    onBlur() {
      // 延迟关闭，避免点联想项被 blur 吃掉
      setTimeout(() => {
        this.setData({ showSuggest: false })
      }, 150)
    },
  
    /** 清空 */
    clearSearch() {
      this.setData({
        keyword: "",
        goods: this.data.rawGoods,
        suggestList: [],
        showSuggest: false
      })
    },
  
    /** 搜索 */
    onSearch() {
      let kw = this.data.keyword.trim()
  
      if (!kw) kw = this.data.placeholderText
      if (!kw) return
  
      wx.hideKeyboard()
      wx.showLoading({ title: "搜索中…" })
  
      setTimeout(() => {
        wx.hideLoading()
        wx.navigateTo({
          url: `/pages/search/search?keyword=${kw}`
        })
      }, 150)
    },
  
    /** 点击联想 */
    selectSuggest(e) {
      const item = e.currentTarget.dataset.item
  
      this.setData({
        keyword: item,
        showSuggest: false
      })
  
      wx.hideKeyboard()
      wx.showLoading({ title: "搜索中…" })
  
      setTimeout(() => {
        wx.hideLoading()
        wx.navigateTo({
          url: `/pages/search/search?keyword=${item}`
        })
      }, 150)
    },
  
    /** 返回 */
    goBack() {
      wx.navigateBack()
    },
  
    /** 拉取某分类商品 */
    fetchGoods(cat_id) {
      wx.cloud.callFunction({
        name: "getDetailList",
        data: { cat_id }
      }).then(res => {
        this.setData({
          goods: res.result.data,
          rawGoods: res.result.data
        })
      })
    },
  
    /** 切换分类 */
    changeCategory(e) {
        const idx = e.currentTarget.dataset.index
        const cat_id = this.data.categoryList[idx].cat_id
      
        this.setData({
          activeIndex: idx,
          keyword: "",
          suggestList: [],
          showSuggest: false,
      
          // 关键：scrollTop 跳变触发滚动
          scrollTop: this.data.scrollTop === 0 ? 1 : 0
        })
      
        this.fetchGoods(cat_id)
      },
  
    /** 跳转详情 */
    goDetail(e) {
      const item = e.currentTarget.dataset.item
      wx.navigateTo({
        url: `/pages/detail/detail?goods_id=${item.goods_id}`
      })
    },
  
    /** 随机 placeholder */
    setRandomPlaceholder() {
      const list = this.data.smartSuggestWords
      if (!list || list.length === 0) return
  
      const word = list[Math.floor(Math.random() * list.length)]
      this.setData({
        placeholderText: word
      })
    }
  })
  