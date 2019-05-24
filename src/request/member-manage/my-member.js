import Qs from 'qs';

// 获取会员列表
export const getUserList = (vm) => {
    let data = Qs.stringify({
        phone: vm.phone,
        pageNum: vm.pageNum - 1,
        pageSize: vm.pageSize
    });
    vm.$axios.get('/users?'+ data)
        .then(function (rep) {
            if (rep.result) {
                vm.userListLoading = false;
                vm.totalElements = rep.data.totalElements;
                vm.userList = rep.data.content;
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
};
