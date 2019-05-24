import Qs from 'qs';

// 获取模块列表
export const getModuleList = (vm) => {
    vm.$axios.get('/module')
        .then(function (rep) {
            if (rep.result) {
                vm.moduleLoading = false;
                vm.moduleList = rep.data;
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
};

// 获取商品分类级联
export const getClassifyCascade = (vm) => {
    vm.$axios.get('/classify/cascade')
        .then(function (rep) {
            if (rep.result) {
                vm.moduleTypeCascade[0].children = rep.data;
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
};

// 新增轮播图
export const insertModuleItem = ((vm) => {
    let data = vm.insertModuleItem;
    vm.$axios.post('/module', data)
        .then((rep) => {
            if (rep.result) {
                vm.$Message.success(rep.msg);
                vm.insertModuleModel = false;
                getModuleList(vm);
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
})

// 编辑轮播图
export const updateModuleItem = ((vm) => {
    let data = vm.updateModuleItem;
    vm.$axios.put('/module', data)
        .then((rep) => {
            if (rep.result) {
                vm.$Message.success(rep.msg);
                vm.updateModuleModel = false;
                vm.updateModuleItem = {};
                getModuleList(vm);
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
})

// 删除轮播图
export const deleteModuleItem = (vm) => {
    vm.$axios.delete('/module/' + vm.deleteId)
        .then(function (rep) {
            if (rep.result) {
                vm.$Message.success(rep.msg);
                getModuleList(vm);
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
};
