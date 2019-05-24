import Qs from 'qs';

// 获取预约记录列表
export const getAppointmentList = (vm) => {
    let data = Qs.stringify({
        value: vm.searchValue.value,
        status: vm.searchValue.status,
        pageNum: vm.pageNum - 1,
        pageSize: vm.pageSize
    });
    vm.$axios.get('/appointment?' + data)
        .then(function (rep) {
            if (rep.result) {
                vm.appointmentLoading = false;
                vm.totalElements = rep.data.totalElements;
                vm.appointmentList = rep.data.content;
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
};

// 批量处理
export const disposeBatch = ((vm) => {
    let data = vm.disposeBatchList;
    vm.$axios.put('/appointment/status', data)
        .then((rep) => {
            if (rep.result) {
                vm.$Message.success(rep.msg);
                vm.disposeBatchList = [];
                getAppointmentList(vm);
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
})
