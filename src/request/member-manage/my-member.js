import Qs from 'qs';
import {getMemberSetting} from './member-setting';

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

// 修改用户信息
export const updateUser = ((vm) => {
    let data = vm.updateUserItem;
    vm.$axios.put('/user', data)
        .then((rep) => {
            if (rep.result) {
                vm.$Message.success(rep.msg);
                vm.updateUserModel = false;
                getUserList(vm);
            } else {
                vm.$Message.error(rep.msg);
            }
        })
})
