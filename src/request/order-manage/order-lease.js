import Qs from 'qs';

// 新增订单
export const insertOrder = ((vm) => {
    let data = vm.insertOrderItem;
    vm.$axios.post('/order', data)
        .then((rep) => {
            if (rep.result) {
                vm.$Message.success(rep.msg);
                vm.insertModel = false;
                getOrderLeaseList(vm);
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
});

// 获取租赁订单列表
export const getOrderLeaseList = (vm) => {
    let data = Qs.stringify({
        tradeNo: vm.searchValue.tradeNo,
        type: 1,
        value: vm.searchValue.value,
        status: vm.searchValue.status,
        pageNum: vm.pageNum - 1,
        pageSize: vm.pageSize
    });
    vm.$axios.get('/order?' + data)
        .then(function (rep) {
            if (rep.result) {
                vm.orderLeaseLoading = false;
                vm.totalElements = rep.data.totalElements;
                vm.orderLeaseList = rep.data.content;
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
};

// 根据订单列表获取订单商品
export const getOrderProductByOrderId = (vm) => {
    let data = Qs.stringify({
        orderId: vm.orderProduct.orderId,
    });
    vm.$axios.get('/order/products?' + data)
        .then(function (rep) {
            if (rep.result) {
                vm.orderProductLoading = false;
                vm.orderProductList = rep.data;
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
};

// 根据订单列表id获取养护记录
export const getMaintenanceByOrderId = (vm) => {
    let data = Qs.stringify({
        orderId: vm.orderProduct.orderId,
    });
    vm.$axios.get('/maintenance/order_id?' + data)
        .then(function (rep) {
            if (rep.result) {
                vm.maintenanceFinishLoading = false;
                vm.maintenanceFinishList = rep.data;
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
};

// 获取商品列表（简略信息）
export const getProductListBrief = (vm) => {
    vm.$axios.get('/product/brief')
        .then(function (rep) {
            if (rep.result) {
                vm.productList = rep.data;
            } else {
                vm.$Message.error(rep.msg);
            }
        })
};

// 获取用户列表（简略信息）
export const getUserListBrief = (vm) => {
    vm.$axios.get('/users/brief')
        .then(function (rep) {
            if (rep.result) {
                vm.userList = rep.data;
            } else {
                vm.$Message.error(rep.msg);
            }
        })
};

// 获取养护人员列表
export const getMaintenancePersonnelList = (vm) => {
    vm.$axios.get('/maintenance')
        .then(function (rep) {
            if (rep.result) {
                vm.maintenanceList = rep.data;
            } else {
                vm.$Message.error(rep.msg);
            }
        })
};

// 批量发货
export const shipmentsBatch = ((vm) => {
    let data = vm.orderShipmentsBatch;
    vm.$axios.put('/order/shipments', data)
        .then((rep) => {
            if (rep.result) {
                vm.$Message.success(rep.msg);
                vm.orderShipmentsBatch = [];
                getOrderLeaseList(vm);
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
});

// 批量删除订单商品
export const deleteOrderProductBatch = ((vm) => {
    let data = vm.orderProductBatch;
    vm.$axios.put('/order/products', data)
        .then((rep) => {
            if (rep.result) {
                vm.$Message.success(rep.msg);
                getOrderProductByOrderId(vm);
                getProductListBrief(vm);
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
});

// 补发商品
export const reissueProduct = ((vm) => {
    let data = vm.orderProduct;
    vm.$axios.post('/order/reissue', data)
        .then((rep) => {
            if (rep.result) {
                vm.$Message.success(rep.msg);
                getOrderProductByOrderId(vm);
                getProductListBrief(vm);
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
});

// 设置养护计划
export const setMaintenancePlan = ((vm) => {
    let data = vm.maintenancePlaneItem;
    vm.$axios.put('/order/maintenance', data)
        .then((rep) => {
            if (rep.result) {
                vm.$Message.success(rep.msg);
                vm.maintenancePlanModel = false;
                getOrderLeaseList(vm);
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
});
