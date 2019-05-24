import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: () => import('@/views/login/login.vue')
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: () => import('@/views/error-page/404.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@//views/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () => import('@/views/error-page/500.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        {path: 'home', title: {i18n: 'home'}, name: 'home_index', component: () => import('@/views/home/home.vue')}
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/home-manage',
        icon: 'md-home',
        title: '首页管理',
        role: 'admin',
        name: 'home-manage',
        component: Main,
        children: [
            {
                path: 'module-manage',
                title: '模块管理',
                name: 'module-manage',
                component: () => import('@/views/plant/home-manage/module-manage/module-manage.vue')
            },
            {
                path: 'banner-manage',
                title: '轮播管理',
                name: 'banner-manage',
                component: () => import('@/views/plant/home-manage/banner-manage/banner-manage.vue')
            },
            {
                path: 'image-manage',
                title: '图文管理',
                name: 'image-manage',
                component: () => import('@/views/plant/home-manage/image-text-manage/image-text-manage.vue')
            }
        ]
    },
    {
        path: '/product-manage',
        icon: 'logo-dropbox',
        title: '商品管理',
        role: 'admin',
        name: 'product-manage',
        component: Main,
        children: [
            {
                path: 'product-classify',
                title: '商品分类',
                name: 'product-classify',
                component: () => import('@/views/plant/product-manage/product-classify/product-classify.vue')
            },
            {
                path: 'product-add',
                title: '商品添加',
                name: 'product-add',
                component: () => import('@/views/plant/product-manage/product-add/product-add.vue')
            },
            {
                path: 'plant-log',
                title: '植物志',
                name: 'plant-log',
                component: () => import('@/views/plant/product-manage/plant-log/plant-log.vue')
            }
        ]
    },
    {
        path: '/order-manage',
        icon: 'md-clipboard',
        title: '订单管理',
        role: 'admin',
        name: 'order-manage',
        component: Main,
        children: [
            {
                path: 'order-sell',
                title: '商品订单',
                name: 'order-sell',
                component: () => import('@/views/plant/order-manage/order-sell/order-sell.vue')
            },
            {
                path: 'order-lease',
                title: '租赁订单',
                name: 'order-lease',
                component: () => import('@/views/plant/order-manage/order-lease/order-lease.vue')
            }
        ]
    },
    {
        path: '/appointment-manage',
        icon: 'ios-document',
        title: '预约管理',
        role: 'admin',
        name: 'appointment-manage',
        component: Main,
        children: [
            {
                path: 'appointment',
                title: '预约管理',
                name: 'appointment',
                component: () => import('@/views/plant/appointment-manage/appointment.vue')
            }
        ]
    },
    {
        path: '/member-manage',
        icon: 'md-person',
        title: '会员管理',
        role: 'admin',
        name: 'member-manage',
        component: Main,
        children: [
            {
                path: 'my-member',
                title: '用户管理',
                name: 'my-member',
                component: () => import('@/views/plant/member-manage/my-member/my-member.vue')
            },
            {
                path: 'member-setting',
                title: '会员体系设置',
                name: 'member-setting',
                component: () => import('@/views/plant/member-manage/member-setting/member-setting.vue')
            },
            {
                path: 'recharge',
                title: '充值项目管理',
                name: 'recharge',
                component: () => import('@/views/plant/member-manage/recharge/recharge.vue')
            }
        ]
    },
    {
        path: '/mall-coupon',
        icon: 'ios-barcode',
        title: '商城优惠券',
        role: 'admin',
        name: 'mall-coupon',
        component: Main,
        children: [
            {
                path: 'coupon-service',
                title: '商城优惠券',
                name: 'coupon-service',
                component: () => import('@/views/plant/coupon-service/coupon-service.vue')
            },
        ]
    },
    {
        path: '/mall-manage',
        icon: 'md-contacts',
        title: '商城客服',
        role: 'admin',
        name: 'mall-manage',
        component: Main,
        children: [
            {
                path: 'mall-service',
                title: '商城客服',
                name: 'mall-service',
                component: () => import('@/views/plant/mall-manage/mall-service/mall-service.vue')
            },
        ]
    }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    ...appRouter,
    page500,
    page403,
    page404
];
