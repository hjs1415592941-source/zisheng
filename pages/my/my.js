Page({
    data: {
      userAvatar: "",
      username: "",
      menuList: [
        { icon: "📞", text: "联系客服" },
        { icon: "💬", text: "对话客服" },
        { icon: "✉️", text: "意见反馈" },
        { icon: "🔗", text: "推荐给他人" },
        { icon: "ℹ️", text: "关于我们" }
      ]
    },
   
  
    // 拨打电话（联系客服）
    callPhone() {
      wx.makePhoneCall({
        phoneNumber: "13980512566"
      })
    },
  
    // 关于我们
    openAbout() {
      wx.showToast({
        title: "滋升健康食品 · 用心做好营养",
        icon: "none"
      })
    },
  
    // 分享（推荐给他人）
    onShareAppMessage() {
      return {
        title: "我在用的滋升健康食品，营养又好喝！",
        path: "/pages/home/home",
        imageUrl: "/static/share.jpg"   // 可换成你的展示图
      }
    }
  })
  