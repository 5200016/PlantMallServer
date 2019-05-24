import Qs from 'qs';

// 获取商品分类列表
export const getClassifyList = (vm) => {
    let data = Qs.stringify({
        name: vm.searchValue.name,
        type: vm.searchValue.type,
        pageNum: vm.pageNum - 1,
        pageSize: vm.pageSize
    });
    vm.$axios.get('/classify?' + data)
        .then(function (rep) {
            if (rep.result) {
                vm.classifyLoading = false;
                vm.totalElements = rep.data.totalElements;
                vm.classifyList = rep.data.content;
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
};

// 新增商品分类
export const insertClassifyItem = ((vm) => {
    let data = vm.insertClassifyItem;
    vm.$axios.post('/classify', data)
        .then((rep) => {
            if (rep.result) {
                vm.$Message.success(rep.msg);
                vm.insertModel = false;
                getClassifyList(vm);
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
})

// 编辑商品分类
export const updateClassifyItem = ((vm) => {
    let data = vm.updateClassifyItem;
    vm.$axios.put('/classify', data)
        .then((rep) => {
            if (rep.result) {
                vm.$Message.success(rep.msg);
                vm.updateModel = false;
                vm.updateClassifyItem = {};
                getClassifyList(vm);
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
})

// 删除商品分类
export const deleteClassifyItem = (vm) => {
    vm.$axios.delete('/classify/' + vm.deleteId)
        .then(function (rep) {
            if (rep.result) {
                vm.$Message.success(rep.msg);
                getClassifyList(vm);
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
};

// 获取商品分类级联信息
export const getClassifyProductCascade = (vm) => {

    vm.$axios.get('/classify/product')
        .then(function (rep) {
            if (rep.result) {
                vm.classifyProductCascade = rep.data;
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
};
