Page({
    data: {
      product: {},
      loading: true,
      hotList: [],
      placeholder: "https://via.placeholder.com/800x800.png?text=No+Image"
    },
  
    onLoad(options) {
      const goods_id = Number(options.goods_id || 0);
  
      if (!goods_id) {
        wx.showToast({ title: "商品不存在", icon: "none" });
        this.setData({ loading: false });
        return;
      }
  
      // 获取当前商品详情
      wx.cloud.callFunction({
        name: "getDetailList",
        data: { goods_id }
      }).then(res => {
        const list = res.result.data || [];
        if (list.length > 0) {
          this.setData({ product: list[0] });
        }
      });
  
      // 猜你喜欢
      wx.cloud.callFunction({
        name: "getHotlist",
        data: { limit: 20 }
      }).then(res => {
        const arr = res.result.data || [];
        const filtered = arr.filter(v => v.goods_id != goods_id);
        this.setData({
          hotList: filtered.slice(0, 4)
        });
      });
  
      this.setData({ loading: false });
    },
  
    // 兜底图片
    onImgError() {
      this.setData({
        "product.image_src": this.data.placeholder
      });
    },
  
    // 返回
    goBack() {
      wx.navigateBack();
    },
  
    // 跳详情（用于猜你喜欢）
    goDetail(e) {
      const item = e.currentTarget.dataset.item;
      wx.navigateTo({
        url: `/pages/detail/detail?goods_id=${item.goods_id}`
      });
    }
  });
  