
import { postAddCustomerGood, postEditCustomerGood, postDeleteCustomerGood, postDefaultCustomerGood, postCancelDefaultCustomerGood } from "@src/apis";
import { Toast } from "mint-ui";
export default {
  state: {
    list: [],
    searchQuery: {}, //搜索条件
    isSearch: false,//是否搜索操作，便于刷新
    isAdd: false,//是否添加操作，便于刷新
  },
  getters: {
  },
  mutations: {
    //初始化store
    ["INIT_GOODS_STORE"](state) {
      state.list = [];
      state.isSearch = false;
      state.isAdd = false;
      state.searchQuery = {};
      console.info("初始化商品管理数据完成");
    },
    //设置商品列表
    ["SET_GOODS"](state, goods) {
      state.list = goods || [];
    },
    //更新商品
    ["UPDATA_GOOD"](state, good) {
      state.list = state.list.map(item => {
        if (good.goodsNo == item.goodsNo) return good;
        else return item;
      })
    },

    //设置搜索条件
    ["SEARCH_GOOD"](state, searchObj) {
      state.searchQuery = Object.assign(state.searchQuery, searchObj)
    },
    //是否开始搜索
    ["IS_SEARCH_GOOD"](state, flag) {
      state.isSearch = flag;
    },
    //是否添加
    ["IS_RELOAD_GOOD"](state, flag) {
      state.isAdd = flag;
    },

  },
  actions: {
    getGood({ commit, dispatch, getters, rootGetters, rootState, state }, goodsNo) {
      return state.list.find(item => item.goodsNo == goodsNo);
    },
    updataGood({ commit, dispatch, getters, rootGetters, rootState, state }, good) {
      return postEditCustomerGood()({
        unionNo: good.unionNo,
        goodsNo: good.goodsNo,
        customerNo: good.customerNo,
        goodsName: good.goodsName,
        model: good.model,
        unit: good.unit,
        unitPrice: good.unitPrice,
        taxRate: good.taxRate,
        enjoyDiscount: good.enjoyDiscount,
        discountType: good.discountType,
      }).then(data => {
        if (data.code == "00") {
          Toast("修改成功");

          commit("UPDATA_GOOD", good);
          return true;
        } else {
          Toast(data.msg);
          return false;
        }
      })
    },
    addGood({ commit, dispatch, getters, rootGetters, rootState, state }, good) {
      return postAddCustomerGood()({
        unionNo: good.unionNo,
        goodsNo: good.goodsNo,
        customerNo: good.customerNo,
        goodsName: good.goodsName,
        model: good.model,
        unit: good.unit,
        unitPrice: good.unitPrice,
        taxRate: good.taxRate,
        enjoyDiscount: good.enjoyDiscount,
        discountType: good.discountType,
      }).then(data => {
        if (data.code == "00") {
          Toast("添加成功");

          commit("ADD_GOOD", good);
          return true;
        } else {
          Toast(data.msg);
          return false;
        }
      })
    },
    deleteGood({ commit, dispatch, getters, rootGetters, rootState, state }, good) {
      postDeleteCustomerGood(good.goodsNo)({ customerNo: good.customerNo }).then(data => {
        if (data.code == "00") {
          Toast("删除成功");

          commit("DELETE_GOOD", good);
        } else {
          Toast(data.msg);
        }
      })
    },
    setDefaultGood({ commit, dispatch, getters, rootGetters, rootState, state }, good) {
      postDefaultCustomerGood(good.goodsNo)(good).then(data => {
        if (data.code == "00") {
          Toast("操作成功");

          commit("SET_DEFAULT_GOOD", good);
        } else {
          Toast(data.msg);
        }
      })
    },
    cancelDefaultGood({ commit, dispatch, getters, rootGetters, rootState, state }, good) {
      postCancelDefaultCustomerGood(good.goodsNo)(good).then(data => {
        if (data.code == "00") {
          Toast("操作成功");

          commit("CANCEL_DEFAULT_GOOD", good);
        } else {
          Toast(data.msg);
        }
      })
    }
  }
};