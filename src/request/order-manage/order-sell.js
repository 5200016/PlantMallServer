import Qs from 'qs';

// 获取商品订单列表
export const getOrderSellList = (vm) => {
    let data = Qs.stringify({
        tradeNo: vm.searchValue.tradeNo,
        type: 0,
        value: vm.searchValue.value,
        status: vm.searchValue.status,
        pageNum: vm.pageNum - 1,
        pageSize: vm.pageSize
    });
    vm.$axios.get('/order?' + data)
        .then(function (rep) {
            if (rep.result) {
                vm.orderSellLoading = false;
                vm.totalElements = rep.data.totalElements;
                vm.orderSellList = rep.data.content;
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

// 批量发货
export const shipmentsBatch = ((vm) => {
    let data = vm.orderShipmentsBatch;
    vm.$axios.put('/order/shipments', data)
        .then((rep) => {
            if (rep.result) {
                vm.$Message.success(rep.msg);
                vm.orderShipmentsBatch = [];
                getOrderSellList(vm);
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
})
