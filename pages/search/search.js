Page({
    data: {
      keyword: "",
      allGoods: [],
      list: [],
      searched: false,
      scrollTop: 0,
  
      // ⭐ 与分类页统一的联想逻辑
      smartSuggestWords: [
        "葡萄糖","燕麦片","黑芝麻糊","无糖黑芝麻糊","玉米粉",
        "藕粉","果维C","固体饮料","营养麦片","核桃粉","豆奶粉","中老年豆奶粉",
        "南瓜玉米粉","滋升·礼盒装"
      ],
      placeholderText: ""
    },
  
    onLoad(options) {
      const kw = options.keyword || ""
      this.setRandomPlaceholder()
  
      this.setData({ keyword: kw })
  
      wx.cloud.callFunction({
        name: "getDetailList",
        data: { cat_id: "all" }
      }).then(res => {
        this.setData({
          allGoods: res.result.data || []
        })
  
        if (kw) {
          this.onSearch()
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
  
    /** 👉 输入框聚焦时逻辑（与分类页一致） */
    onFocus() {
      if (this.data.keyword.trim()) {
        this.setData({ showSuggest: true })
      }
    },
  
    /** 👉 输入联想逻辑（与分类页完全一致） */
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
  
      const suggest = this.data.smartSuggestWords.filter(w =>
        w.includes(kw)
      )
  
      this.setData({
        suggestList: suggest,
        showSuggest: suggest.length > 0
      })
    },
  
    /** 👉 输入框失去焦点（延迟关闭） */
    onBlur() {
      setTimeout(() => {
        this.setData({ showSuggest: false })
      }, 150)
    },
  
    /** 👉 点击联想项 */
    selectSuggest(e) {
      const word = e.currentTarget.dataset.item
  
      this.setData({
        keyword: word,
        showSuggest: false
      })
  
      this.onSearch()
    },
  
    /** 搜索按钮触发 */
    onSearch() {
      let kw = this.data.keyword.trim()
  
      // 没输入 → 用 placeholder 搜
      if (!kw) kw = this.data.placeholderText
      if (!kw) return
  
      const results = this.data.allGoods.filter(item =>
        (item.goods_name && item.goods_name.includes(kw)) ||
        (item.goods_price && item.goods_price.includes(kw))
      )
  
      this.setData({
        list: results,
        searched: true,
        showSuggest: false,
        scrollTop: this.data.scrollTop === 0 ? 1 : 0
      })
    },
  
    /** 随机挑选 n 条商品 */
    getRandomList(arr, n) {
      if (!arr || arr.length === 0) return []
      const shuffled = arr.slice().sort(() => 0.5 - Math.random())
      return shuffled.slice(0, n)
    },
  
    /** 👉 随机 placeholder（与分类页一致） */
    setRandomPlaceholder() {
      const list = this.data.smartSuggestWords
      if (!list || list.length === 0) return
  
      const word = list[Math.floor(Math.random() * list.length)]
      this.setData({
        placeholderText: word
      })
    },
  
    /** 返回上一页 */
    goBack() {
      wx.navigateBack()
    },
  
    /** 跳商品详情页 */
    goDetail(e) {
      const item = e.currentTarget.dataset.item
      wx.navigateTo({
        url: `/pages/detail/detail?goods_id=${item.goods_id}`
      })
    }
  })
  