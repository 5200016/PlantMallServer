// 获取会员体系设置
export const getMemberSetting = (vm) => {
    vm.$axios.get('/member_setting', {})
        .then(function (rep) {
            if (rep.result) {
                vm.memberSetting = rep.data;
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
};

// 获取会员等级列表
export const getMemberLevelList = (vm) => {
    vm.$axios.get('/member_level', {})
        .then(function (rep) {
            if (rep.result) {
                vm.memberLevelList = rep.data;
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
};

// 修改会员体系设置
export const updateMemberSetting = ((vm) => {
    let data = vm.memberSetting;
    vm.$axios.put('/member_setting', data)
        .then((rep) => {
            if (rep.result) {
                vm.$Message.success(rep.msg);
                getMemberSetting(vm);
            } else {
                vm.$Message.error(rep.msg);
            }
        })
});

// 修改会员等级
export const updateMemberLevel = ((vm) => {
    let data = vm.memberLevel;
    vm.$axios.put('/member_level', data)
        .then((rep) => {
            if (rep.result) {
                vm.memberLevelModel = false;
                vm.$Message.success(rep.msg);
                getMemberLevelList(vm);
            } else {
                vm.$Message.error(rep.msg);
            }
        })
});
