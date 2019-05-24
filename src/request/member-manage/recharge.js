import Qs from 'qs';

// 获取充值项目列表
export const getRechargeList = (vm) => {

    vm.$axios.get('/recharge_list')
        .then(function (rep) {
            if (rep.result) {
                vm.rechargeLoading = false;
                vm.rechargeList = rep.data;
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
};

// 新增充值项目
export const insertRechargeItem = ((vm) => {
    let data = vm.insertRechargeItem;
    vm.$axios.post('/recharge', data)
        .then((rep) => {
            if (rep.result) {
                vm.$Message.success(rep.msg);
                vm.insertRechargeModel = false;
                getRechargeList(vm);
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
})

// 编辑充值项目
export const updateRechargeItem = ((vm) => {
    let data = vm.updateRechargeItem;
    vm.$axios.put('/recharge', data)
        .then((rep) => {
            if (rep.result) {
                vm.$Message.success(rep.msg);
                vm.updateRechargeModel = false;
                vm.updateRechargeItem = {};
                getRechargeList(vm);
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
})

// 删除充值项目
export const deleteRechargeItem = (vm) => {
    vm.$axios.delete('/recharge/' + vm.deleteId)
        .then(function (rep) {
            if (rep.result) {
                vm.$Message.success(rep.msg);
                getRechargeList(vm);
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
};
