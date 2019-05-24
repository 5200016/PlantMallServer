import Cookies from 'js-cookie';

/* 管理员登陆 */
export const login = (vm) => {
    vm.$axios.post('/login', {
        username: vm.form.username,
        password: vm.form.password
    }).then(function (rep) {
        if (rep.result) {
            Cookies.set('username', vm.form.username);
            Cookies.set('password', vm.form.password);
            vm.$router.push({
                name: 'member-manage'
            });
        } else {
            // 登陆失败
            vm.$Message.error(rep.msg)
        }
    }).catch(function (rep) {
        vm.$Message.error('异常情况')
    })
}
