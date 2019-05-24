import Qs from 'qs';

// 获取商品列表
export const getProductList = (vm) => {
    let data = Qs.stringify({
        name: vm.searchValue.name,
        pageNum: vm.pageNum - 1,
        pageSize: vm.pageSize
    });
    vm.$axios.get('/product?' + data)
        .then(function (rep) {
            if (rep.result) {
                vm.productLoading = false;
                vm.totalElements = rep.data.totalElements;
                vm.productList = rep.data.content;
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
};

// 获取商品评论列表
export const getProductReviewList = (vm) => {
    let data = Qs.stringify({
        id: vm.reviewSearch.productId,
        nickname: vm.reviewSearch.nickname,
        pageNum: vm.pageNumReview - 1,
        pageSize: vm.pageSizeReview
    });
    vm.$axios.get('/product/review?' + data)
        .then(function (rep) {
            if (rep.result) {
                vm.productReviewLoading = false;
                vm.totalElementsReview = rep.data.totalElements;
                vm.productReviewList = rep.data.content;
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
};

// 获取商品分类
export const getClassifyGroup = (vm) => {
    vm.$axios.get('/classify/group')
        .then(function (rep) {
            if (rep.result) {
                vm.classifyGroup = rep.data;
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
};


// 新增商品
export const insertProductItem = ((vm) => {
    let data = vm.insertProductItem;
    vm.$axios.post('/product', data)
        .then((rep) => {
            if (rep.result) {
                vm.$Message.success(rep.msg);
                vm.insertModel = false;
                vm.initImage();
                getProductList(vm);
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
});

// 编辑商品
export const updateProductItem = ((vm) => {
    let data = vm.updateProductItem;
    vm.$axios.put('/product', data)
        .then((rep) => {
            if (rep.result) {
                vm.$Message.success(rep.msg);
                vm.updateModel = false;
                vm.updateProductItem = {};
                vm.initImage();
                getProductList(vm);
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
});

// 删除商品
export const deleteProductItem = (vm) => {
    vm.$axios.delete('/product/' + vm.deleteId)
        .then(function (rep) {
            if (rep.result) {
                vm.$Message.success(rep.msg);
                getProductList(vm);
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
};

// 根据id删除商品评论
export const deleteProductReview = (vm) => {
    vm.$axios.delete('/product/review/' + vm.deleteReviewId)
        .then(function (rep) {
            if (rep.result) {
                vm.$Message.success(rep.msg);
                getProductReviewList(vm, vm.productId);
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
};

// 批量删除商品评论
export const deleteBatchProductReview = (vm) => {
    console.log("data", vm.deleteReviewIdBatch);
    vm.$axios.delete('/product/review' , {data: vm.deleteReviewIdBatch})
        .then(function (rep) {
            if (rep.result) {
                vm.$Message.success(rep.msg);
                getProductReviewList(vm, vm.productId);
            } else {
                vm.$Message.error(rep.msg);
            }
        })
        .catch(function (error) {
            vm.$Message.error('异常情况');
        });
};
