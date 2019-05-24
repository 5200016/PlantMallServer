// 获取商城客服设置
export const getServiceSetting = (vm) => {
    vm.$axios.get('/customer_service', {})
        .then(function (rep) {
            if (rep.result) {
                vm.serviceSetting = rep.data;
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
};

// 修改会员体系设置
export const updateServiceSetting = ((vm) => {
    let data = vm.serviceSetting;
    vm.$axios.put('/customer_service', data)
        .then((rep) => {
            if (rep.result) {
                vm.$Message.success(rep.msg);
                getServiceSetting(vm);
            } else {
                vm.$Message.error(rep.msg);
            }
        })
})
