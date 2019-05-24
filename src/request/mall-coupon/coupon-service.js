import Qs from 'qs';

// 获取优惠券列表
export const getCouponList = (vm) => {
    let data = Qs.stringify({
        name: vm.searchValue.name,
        type: vm.searchValue.type,
        pageNum: vm.pageNum - 1,
        pageSize: vm.pageSize
    });
    vm.$axios.get('/coupon?' + data)
        .then(function (rep) {
            if (rep.result) {
                vm.couponLoading = false;
                vm.totalElements = rep.data.totalElements;
                vm.couponList = rep.data.content;
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
};

// 获取商品列表
export const getProductList = (vm) => {
    let data = Qs.stringify({
        name: vm.productSearchValue.name,
        pageNum: vm.pageNumProduct - 1,
        pageSize: vm.pageSizeProduct
    });
    vm.$axios.get('/product/brief/page?' + data)
        .then(function (rep) {
            if (rep.result) {
                vm.productLoading = false;
                vm.totalElementsProduct = rep.data.totalElements;
                vm.productList = rep.data.content;
                vm.productList.forEach(item => {
                    vm.productSubmitList.forEach(itemChild => {
                        if(item.id === itemChild.id){
                            item._checked = true;
                        }
                    })
                })
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
};

// 获取商品分类列表
export const getClassifyList = (vm) => {
    let data = Qs.stringify({
        name: vm.classifySearchValue.name,
        type: vm.classifySearchValue.type,
        pageNum: vm.pageNumClassify - 1,
        pageSize: vm.pageSizeClassify
    });
    vm.$axios.get('/classify/brief/page?' + data)
        .then(function (rep) {
            if (rep.result) {
                vm.classifyLoading = false;
                vm.totalElementsClassify = rep.data.totalElements;
                vm.classifyList = rep.data.content;
                vm.classifyList.forEach(item => {
                    vm.classifySubmitList.forEach(itemChild => {
                        if(item.id === itemChild.id){
                            item._checked = true;
                        }
                    })
                })
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
};

// 获取商品分类列表
export const getProductAndClassifyList = (vm) => {
    let data = Qs.stringify({
        id: vm.couponId,
    });
    vm.$axios.get('/coupon/product_classify?' + data)
        .then(function (rep) {
            if (rep.result) {
                vm.productChooseList = rep.data.product;
                vm.productChooseLoading = false;
                vm.classifyChooseList = rep.data.classify;
                vm.classifyChooseLoading = false;
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
};

// 新增优惠券
export const insertCoupon = ((vm) => {
    let data = vm.insertCouponItem;
    vm.$axios.post('/coupon', data)
        .then((rep) => {
            if (rep.result) {
                vm.$Message.success(rep.msg);
                vm.insertModel = false;
                getCouponList(vm);
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
});

// 编辑优惠券
export const updateCoupon = ((vm) => {
    let data = vm.updateCouponItem;
    vm.$axios.put('/coupon', data)
        .then((rep) => {
            if (rep.result) {
                vm.$Message.success(rep.msg);
                vm.updateModel = false;
                vm.updateCouponItem = {};
                getCouponList(vm);
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
});

// 删除优惠券
export const deleteCoupon = (vm) => {
    vm.$axios.delete('/coupon/' + vm.deleteId)
        .then(function (rep) {
            if (rep.result) {
                vm.$Message.success(rep.msg);
                getCouponList(vm);
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
};

