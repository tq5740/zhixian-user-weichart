export default {
    setConfigData(state, payload) {
        state.configData = payload;
    },
    setScrollPos(state, payload) {
        state.scrollPos = Object.assign({}, state.scrollPos, payload);
    },
    setMenu(state, payload) {
        state.active = payload;
    },
    setUserInfo(state, payload) {
        state.userInfo = payload;
    },
    setTitle(state, payload) {
        wx.setNavigationBarTitle({ title: payload });
        state.title = payload;
    },
    setLngLat(state, payload) {
        setTimeout(() => {
            state.pos = payload;
        }, 1000);
    }
    // setNewsListArr(state, payload["newsListArr"]) {
    //   state.newsListArr.push(payload);
    // },
    // setNewsListUserIdArr(
    //   state,
    //   payload["newsListUserIdArr"]
    // ) {
    //   state.newsListUserIdArr.push(payload);
    // }
    // setPos(state, payload["pos"]) {
    //   state.pos = payload;
    // }
};