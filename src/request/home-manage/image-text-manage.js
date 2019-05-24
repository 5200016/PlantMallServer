import Qs from 'qs';

// 获取图文列表
export const getBannerList = (vm) => {
    let data = Qs.stringify({
        type: 1,
    });
    vm.$axios.get('/banner?' + data)
        .then(function (rep) {
            if (rep.result) {
                vm.bannerLoading = false;
                vm.bannerList = rep.data;
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
};

// 新增图文
export const insertBannerItem = ((vm) => {
    let data = vm.insertBannerItem;
    vm.$axios.post('/banner', data)
        .then((rep) => {
            if (rep.result) {
                vm.$Message.success(rep.msg);
                vm.insertBannerModel = false;
                getBannerList(vm);
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
})

// 编辑图文
export const updateBannerItem = ((vm) => {
    let data = vm.updateBannerItem;
    vm.$axios.put('/banner', data)
        .then((rep) => {
            if (rep.result) {
                vm.$Message.success(rep.msg);
                vm.updateBannerModel = false;
                vm.updateBannerItem = {};
                getBannerList(vm);
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
})

// 删除图文
export const deleteBannerItem = (vm) => {
    vm.$axios.delete('/banner/' + vm.deleteId)
        .then(function (rep) {
            if (rep.result) {
                vm.$Message.success(rep.msg);
                getBannerList(vm);
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
};
