import Qs from 'qs';

// 获取植物志列表
export const getPlantLogList = (vm) => {
    let data = Qs.stringify({
        name: vm.searchValue.name,
        pageNum: vm.pageNum - 1,
        pageSize: vm.pageSize
    });
    vm.$axios.get('/plant_log?' + data)
        .then(function (rep) {
            if (rep.result) {
                vm.plantLogLoading = false;
                vm.totalElements = rep.data.totalElements;
                vm.plantLogList = rep.data.content;
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
};

// 新增植物志
export const insertPlantLogItem = ((vm) => {
    let data = vm.insertPlantLogItem;
    vm.$axios.post('/plant_log', data)
        .then((rep) => {
            if (rep.result) {
                vm.$Message.success(rep.msg);
                vm.insertModel = false;
                getPlantLogList(vm);
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
})

// 编辑植物志
export const updatePlantLogItem = ((vm) => {
    let data = vm.updatePlantLogItem;
    vm.$axios.put('/plant_log', data)
        .then((rep) => {
            if (rep.result) {
                vm.$Message.success(rep.msg);
                vm.updateModel = false;
                vm.updatePlantLogItem = {};
                getPlantLogList(vm);
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
})

// 删除植物志
export const deletePlantLogItem = (vm) => {
    vm.$axios.delete('/plant_log/' + vm.deleteId)
        .then(function (rep) {
            if (rep.result) {
                vm.$Message.success(rep.msg);
                getPlantLogList(vm);
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
};
