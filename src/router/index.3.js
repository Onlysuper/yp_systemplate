import Vue from 'vue';
import Router from 'vue-router';
import store from '../vuex';
// 跟路由
import utils from "@src/common/utils";
import layout from '@src/views/layout/layout'
import login from "./login/login";
import home from "./home/home";
import customerManage from "./customer/customerManage";
import customerGoods from "./customer/customerGoods";
import customerInvoiceConfig from "./customer/customerInvoiceConfig";
import customerProduct from "./customer/customerProduct";
import customerProductConfigure from "./customer/customerProductConfigure";
import billCount from "./billmanage/billCount";
import billRecord from "./billmanage/billRecord";
import billDay from "./billmanage/billDay";
import billStandard from "./billmanage/billStandard";
import billprofit from "./billprofit/billprofit";
import product from "./product/product";
import agentManage from "./agent/agentManage";
import usermanage from "./admin/userManage";
import usermenu from "./admin/userMenu";
import userrole from "./admin/userRole";

import { MenuGet } from "@src/apis"
Vue.use(Router)
const router = new Router({
    routes: [
        login,
        {
            path: "/",
            redirect: "/home"
        }
    ]
})

const asyncRouter = [
    {
        path: '',
        component: layout,
        children: [
            home
        ],
        meta: {
            title: '',
            keepAlive: true,
            role: ['admin', 'root']
        },
    },
    customerManage,
    customerGoods,
    customerInvoiceConfig,
    customerProduct,
    customerProductConfigure,
    billprofit,// 开票查询
    billCount,// 开票统计
    billRecord,// 开票记录
    billDay,// 日开票详情
    billStandard,//达标详情
    usermanage,// 用户管理
    usermenu,// 菜单管理
    userrole,//角色管理
    product,// 产品管理
    agentManage //合伙人管理

]
// 路由过滤
function filterRouter(data, asyncRouter) {
    return new Promise((resolve) => {
        const routers = asyncRouter[0]
        const menuList = data.menuList
        menuList.forEach((item, index) => {
            // 根据路径匹配到的router对象添加到routers中即可
            // 因permission数据格式不一定相同，所以不写详细逻辑了
            for (var i = 0; i < item.child.length; i++) {
                asyncRouter.forEach(item2 => {
                    if (item2.name == item.child[i].menuCode) {
                        // meta里面的role角色访问权限
                        if (routers.children.indexOf(item2) == '-1' && item2.meta.role.indexOf(data.username) != '-1') {
                            routers.children.push(item2)
                        }
                    }
                })
            }
            if (index == menuList.length - 1) {
                resolve([routers])
            }
        });
    })
}

/**
 * 根据异步路由表中的path字段进行匹配，生成需要添加的路由对象
 * @param {array} permission 权限列表（菜单列表）
 * @param {array} asyncRouter 异步路由对象
 */
function routerMatch(permission, asyncRouter) {
    return new Promise((resolve) => {
        // 这里需要获取完整的已经编译好的router对象，不可为空数组，也不能用类router的对象。因为当程序运行到这里时，vue-router已经解析完毕
        // 创建路由
        function createRouter(permission) {
            var menuList = permission;
            filterRouter(menuList, asyncRouter).then(routers => {
                resolve(routers)
            })
        }
        var rou = createRouter(permission)

    })
}
store.dispatch('UserMenulistFetch').then(resmenuList => {
    // 从后台获取菜单列表
    routerMatch(resmenuList, asyncRouter).then(res => {
        // 将匹配到的新路由添加到现在的router对象中
        router.addRoutes(res)
        // // 跳转到对应页面
    })
});

// function filterRouter(data, asyncRouter, to) {
//     return new Promise((resolve) => {
//         const routers = asyncRouter[0]
//         const menuList = data.menuList
//         menuList.forEach((item, index) => {
//             // 根据路径匹配到的router对象添加到routers中即可
//             // 因permission数据格式不一定相同，所以不写详细逻辑了
//             for (var i = 0; i < item.child.length; i++) {
//                 asyncRouter.forEach(item2 => {
//                     if (item2.name == item.child[i].menuCode) {
//                         // meta里面的role角色访问权限
//                         if (routers.children.indexOf(item2) == '-1' && item2.meta.role.indexOf(data.username) != '-1') {
//                             if (to.path == item2.path) {
//                                 routers.children.push(item2)
//                             }

//                         }
//                     }
//                 })
//             }
//             if (index == menuList.length - 1) {
//                 resolve([routers])
//             }
//         });
//     })
// }

// function routerMatch(permission, asyncRouter, to) {
//     return new Promise((resolve) => {
//         // 这里需要获取完整的已经编译好的router对象，不可为空数组，也不能用类router的对象。因为当程序运行到这里时，vue-router已经解析完毕
//         // 创建路由
//         function createRouter(permission) {
//             var menuList = permission;
//             filterRouter(menuList, asyncRouter, to).then(routers => {
//                 resolve(routers)
//             })
//         }
//         var rou = createRouter(permission)

//     })
// }
// router.beforeEach((to, from, next) => {
//     if (to.matched.some(record => record.meta.requiresAuth) || to.matched.length == 0) {
//         if (to.name != 'login') {
//             store.dispatch('UserMenulistFetch').then(resmenuList => {
//                 // 从后台获取菜单列表
//                 routerMatch(resmenuList, asyncRouter, to).then(res => {
//                     // 将匹配到的新路由添加到现在的router对象中
//                     router.addRoutes(res)
//                     // // 跳转到对应页面
//                 })
//             });
//             next();
//         } else {
//             next();
//         }
//     } else {
//         next() // 确保一定要调用 next()
//     }
// })
export default router;
