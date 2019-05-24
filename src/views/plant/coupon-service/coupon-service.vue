<style lang="less">
    @import "coupon-service";
</style>

<template>
    <div class="coupon-service">
        <!-- 优惠券名称 -->
        <Input v-model="searchValue.name" placeholder="优惠券名称" class="coupon-name"/>
        <!-- 优惠券类型 -->
        <Select v-model="searchValue.type" style="width:100px" placeholder="优惠券类型">
            <Option v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <!-- 查询按钮 -->
        <Button class="queryButton" type="primary" @click="initCouponList">查询</Button>
        <!-- 新增优惠券 -->
        <Button class="add-button" type="primary" @click="insertCoupon">新增优惠券</Button>

        <!-- 优惠券列表 -->
        <div class="coupon-list">
            <Table :columns="couponListColumns"
                   border
                   :data="couponList"
                   :loading="couponLoading"></Table>
        </div>

        <!-- 分页器 -->
        <div class="page-div">
            <Page class="page"
                  :current="pageNum"
                  :page-size="pageSize"
                  :total="totalElements"
                  placement="top"
                  show-sizer
                  show-elevator
                  show-total
                  @on-change="changePage"
                  @on-page-size-change="changePageSize"></Page>
        </div>

        <!-- 新增优惠券模态框 -->
        <Modal
                v-model="insertModel"
                title="新增优惠券"
                width="660px"
                @on-ok="insertModelOk"
                @on-cancel="insertModelCancel"
                :mask-closable="false"
                :loading="insertModelLoading">
            <div>
                <Form :model="insertCouponItem" :label-width="100" inline>
                    <FormItem label="优惠券类型：">
                        <Select v-model="insertCouponItem.type" style="width:200px" placeholder="优惠券类型">
                            <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}
                            </Option>
                        </Select>
                    </FormItem>

                    <FormItem label="名称：">
                        <Input v-model="insertCouponItem.name" placeholder="请输入"
                               style="width: 200px"></Input>
                    </FormItem>

                    <FormItem label="面值：">
                        <Input v-model="insertCouponItem.value" placeholder="请输入"
                               style="width: 200px"></Input>
                    </FormItem>

                    <FormItem label="发放数量：">
                        <Input v-model="insertCouponItem.quantity" placeholder="请输入"
                               style="width: 200px"></Input>
                    </FormItem>

                    <FormItem label="限领数量：">
                        <Input v-model="insertCouponItem.limit" placeholder="每人限领张数，0表示无限制"
                               style="width: 200px"></Input>
                    </FormItem>

                    <FormItem label="满减限制：">
                        <Input v-model="insertCouponItem.moneyOff" placeholder="0表示无限制"
                               style="width: 200px"></Input>
                    </FormItem>

                    <FormItem label="开始时间：">
                        <DatePicker v-model="insertCouponItem.startTime" format="yyyy年MM月dd日" type="date" placeholder="优惠券有效期（开始时间）" style="width: 200px"></DatePicker>
                    </FormItem>

                    <FormItem label="截止时间：">
                        <DatePicker v-model="insertCouponItem.endTime" format="yyyy年MM月dd日" type="date" placeholder="优惠券有效期（截止时间）" style="width: 200px"></DatePicker>
                    </FormItem>

                    <FormItem label="适用范围：" v-if="insertCouponItem.type === 0 && insertCouponItem.type !== null">
                        <RadioGroup v-model="insertCouponItem.range" @on-change="radioChange">
                            <Radio :label="0">
                                <span>指定商品</span>
                            </Radio>
                            <Radio :label="1">
                                <span>分类商品</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    <Row v-if="insertCouponItem.range === 0 && insertCouponItem.type !== null && insertCouponItem.type === 0">
                        <Col span="12">
                            <div style="text-align: center">
                                <!-- 商品名称 -->
                                <Input v-model="productSearchValue.name" placeholder="商品名称" style="width: 200px"/>
                                <!-- 查询按钮 -->
                                <Button style="margin-right: 5px;" type="primary" @click="selectProductList">查询</Button>
                            </div>

                            <!-- 商品列表 -->
                            <div style="margin-top: 8px;">
                                <Table :columns="productListColumns"
                                       border
                                       height="521"
                                       @on-select="selectProduct"
                                       @on-select-cancel="cancelProduct"
                                       @on-select-all="selectAllProduct"
                                       @on-select-all-cancel="cancelAllProduct"
                                       ref="selection"
                                       :data="productList"
                                       :loading="productLoading"></Table>
                            </div>

                            <!-- 商品列表分页器 -->
                            <div class="product-page-div">
                                <Page class="page"
                                      :current="pageNumProduct"
                                      :page-size="pageSizeProduct"
                                      :total="totalElementsProduct"
                                      @on-change="changePageProduct"
                                      @on-page-size-change="changePageSizeProduct"></Page>
                            </div>
                        </Col>
                        <Col span="10" offset="2">
                            <div style="text-align: center">
                                <p style="margin: 10px 0px; font-size: 14px">已选商品</p>
                            </div>

                            <!-- 商品提交列表 -->
                            <div style="margin-top: 8px;">
                                <Table :columns="productSubmitListColumns"
                                       border
                                       height="521"
                                       :data="productSubmitList"></Table>
                            </div>
                        </Col>
                    </Row>
                    <Row v-if="insertCouponItem.range === 1 && insertCouponItem.type !== null && insertCouponItem.type === 0">
                        <Col span="12">
                            <div style="text-align: center">
                                <!-- 分类名称 -->
                                <Input v-model="classifySearchValue.name" placeholder="分类名称" style="width: 200px"/>
                                <!-- 查询按钮 -->
                                <Button style="margin-right: 5px;" type="primary" @click="selectClassifyList">查询</Button>
                            </div>

                            <!-- 分类列表 -->
                            <div style="margin-top: 8px;">
                                <Table :columns="classifyListColumns"
                                       border
                                       height="521"
                                       @on-select="selectClassify"
                                       @on-select-cancel="cancelClassify"
                                       @on-select-all="selectAllClassify"
                                       @on-select-all-cancel="cancelAllClassify"
                                       ref="selection"
                                       :data="classifyList"
                                       :loading="classifyLoading"></Table>
                            </div>

                            <!-- 商品列表分页器 -->
                            <div class="classify-page-div">
                                <Page class="page"
                                      :current="pageNumClassify"
                                      :page-size="pageSizeClassify"
                                      :total="totalElementsClassify"
                                      @on-change="changePageClassify"
                                      @on-page-size-change="changePageSizeClassify"></Page>
                            </div>
                        </Col>
                        <Col span="10" offset="2">
                            <div style="text-align: center">
                                <p style="margin: 10px 0px; font-size: 14px">已选商品分类</p>
                            </div>

                            <!-- 商品提交列表 -->
                            <div style="margin-top: 8px;">
                                <Table :columns="classifySubmitListColumns"
                                       border
                                       height="521"
                                       :data="classifySubmitList"></Table>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </div>
        </Modal>

        <!-- 编辑优惠券模态框 -->
        <Modal
                v-model="updateModel"
                title="编辑优惠券"
                width="660px"
                @on-ok="updateModelOk"
                @on-cancel="updateModelCancel"
                :mask-closable="false"
                :loading="updateModelLoading">
            <div>
                <Form :model="updateCouponItem" :label-width="100" inline>
                    <FormItem label="优惠券类型：">
                        <Select disabled v-model="updateCouponItem.type" style="width:200px" placeholder="优惠券类型">
                            <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}
                            </Option>
                        </Select>
                    </FormItem>

                    <FormItem label="名称：">
                        <Input v-model="updateCouponItem.name" placeholder="请输入"
                               style="width: 200px"></Input>
                    </FormItem>

                    <FormItem label="面值：">
                        <Input disabled v-model="updateCouponItem.value" placeholder="请输入"
                               style="width: 200px"></Input>
                    </FormItem>

                    <FormItem label="发放数量：">
                        <Input v-model="updateCouponItem.quantity" placeholder="请输入"
                               style="width: 200px"></Input>
                    </FormItem>

                    <FormItem label="限领数量：">
                        <Input v-model="updateCouponItem.limit" placeholder="每人限领张数，0表示无限制"
                               style="width: 200px"></Input>
                    </FormItem>

                    <FormItem label="满减限制：">
                        <Input disabled v-model="updateCouponItem.moneyOff" placeholder="0表示无限制"
                               style="width: 200px"></Input>
                    </FormItem>

                    <FormItem label="开始时间：">
                        <DatePicker disabled v-model="updateCouponItem.startTime" format="yyyy年MM月dd日" type="date" placeholder="优惠券有效期（开始时间）" style="width: 200px"></DatePicker>
                    </FormItem>

                    <FormItem label="截止时间：">
                        <DatePicker disabled v-model="updateCouponItem.endTime" format="yyyy年MM月dd日" type="date" placeholder="优惠券有效期（截止时间）" style="width: 200px"></DatePicker>
                    </FormItem>

                    <FormItem label="适用范围：" v-if="updateCouponItem.type === 0 && updateCouponItem.type !== null">
                        <RadioGroup v-model="updateCouponItem.range" @on-change="radioChange">
                            <Radio disabled :label="0">
                                <span>指定商品</span>
                            </Radio>
                            <Radio disabled :label="1">
                                <span>分类商品</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    <Row v-if="updateCouponItem.range === 0 && updateCouponItem.type !== null && updateCouponItem.type === 0">
                        <Col span="22" offset="1">
                            <!-- 已选商品列表 -->
                            <div style="margin-top: 8px;">
                                <Table :columns="productCheckListColumns"
                                       border
                                       height="521"
                                       :data="productChooseList"
                                       :loading="productChooseLoading"></Table>
                            </div>
                        </Col>
                    </Row>
                    <Row v-if="updateCouponItem.range === 1 && updateCouponItem.type !== null && updateCouponItem.type === 0">
                        <Col span="22" offset="1">
                            <!-- 已选商品分类列表 -->
                            <div style="margin-top: 8px;">
                                <Table :columns="classifyCheckListColumns"
                                       border
                                       height="521"
                                       :data="classifyChooseList"
                                       :loading="classifyChooseLoading"></Table>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </div>
        </Modal>
    </div>
</template>

<script>
    import {isEmpty} from '../../../libs/ObjFun';
    import {formatDate} from '../../../libs/Date';
    import * as couponRequest from '../../../request/mall-coupon/coupon-service';

    export default {
        name: 'coupon-service',
        data () {
            return {

                // 优惠券删除id
                deleteId: 0,
                // 优惠券id
                couponId: 0,

                // 查询条件
                searchValue: {
                    name: '',
                    type: ''
                },
                // 商品查询条件
                productSearchValue: {
                    name: '',
                },
                // 分类查询条件
                classifySearchValue: {
                    name: '',
                    type: 0
                },

                // 选择器参数（优惠券类型）
                selectList: [
                    {
                        value: -1,
                        label: '全部'
                    },
                    {
                        value: 0,
                        label: '出售优惠券'
                    },
                    {
                        value: 1,
                        label: '出售通用券'
                    },
                    {
                        value: 2,
                        label: '租赁优惠券'
                    }
                ],
                // 优惠券类型
                typeList: [
                    {
                        value: 0,
                        label: '出售优惠券'
                    },
                    {
                        value: 1,
                        label: '出售通用券'
                    },
                    {
                        value: 2,
                        label: '租赁优惠券'
                    }
                ],

                // 分页参数
                pageNum: 1,
                pageSize: 10,
                totalElements: 0,
                // 商品
                pageNumProduct: 1,
                pageSizeProduct: 10,
                totalElementsProduct: 0,
                // 分类
                pageNumClassify: 1,
                pageSizeClassify: 10,
                totalElementsClassify: 0,

                // 优惠券列表
                couponList: [],
                couponLoading: true,
                // 商品列表
                productList: [],
                productLoading: true,
                // 商品提交列表
                productSubmitList: [],
                // 分类列表
                classifyList: [],
                classifyLoading: true,
                // 分类提交列表
                classifySubmitList: [],

                // 优惠券表格参数
                couponListColumns: [
                    {
                        type: 'index',
                        align: 'center',
                        width: 70,
                        title: '序号',
                        render: (h, params) => {
                            return h('span', {}, params.index);
                        }
                    },
                    {
                        title: '名称',
                        align: 'center',
                        key: 'name'
                    },
                    {
                        title: '类型',
                        align: 'center',
                        width: 100,
                        key: 'type',
                        render: (h, params) => {
                            let type = '';
                            switch (params.row.type) {
                                case 0 :
                                    type = '出售优惠券';
                                    break;
                                case 1 :
                                    type = '出售通用券';
                                    break;
                                case 2 :
                                    type = '租赁优惠券';
                                    break;
                            }
                            return h('span', {}, type);
                        }
                    },
                    {
                        title: '面值',
                        align: 'center',
                        width: 100,
                        key: 'value'
                    },
                    {
                        title: '发放 / 领取',
                        align: 'center',
                        width: 130,
                        key: 'value',
                        render: (h, params) => {
                            return h('span', {}, params.row.quantity + '张  /  ' + params.row.getNumber + '张');
                        }
                    },
                    {
                        title: '限领数量',
                        align: 'center',
                        key: 'limit',
                        render: (h, params) => {
                            let limit = params.row.limit;
                            let data = '';
                            if (isEmpty(limit) || limit === 0) {
                                data = '无限制';
                            } else {
                                data = '每人限领' + limit + '张';
                            }
                            return h('span', {}, data);
                        }
                    },
                    {
                        title: '有效期',
                        align: 'center',
                        key: 'time',
                        render: (h, params) => {
                            return h('div', [
                                h('div', {}, '开始日期：' + formatDate(new Date(params.row.startTime), 'yyyy-MM-dd')),
                                h('div', {}, '截止日期：' + formatDate(new Date(params.row.endTime), 'yyyy-MM-dd')),
                            ]);
                        }
                    },
                    {
                        title: '满减',
                        align: 'center',
                        width: 120,
                        key: 'moneyOff',
                        render: (h, params) => {
                            let moneyOff = params.row.moneyOff;
                            let data = '';
                            if (isEmpty(moneyOff) || moneyOff === 0) {
                                data = '无限制';
                            } else {
                                data = '满' + moneyOff + '元减';
                            }
                            return h('span', {}, data);
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        width: '55px'
                                    },
                                    on: {
                                        click: () => {
                                            this.updateCoupon(params);
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        width: '55px',
                                        marginLeft: '10px'
                                    },
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                title: '删除提醒',
                                                content: '<p>您确定删除此条记录吗?</p>',
                                                onOk: () => {
                                                    this.deleteId = params.row.id;
                                                    couponRequest.deleteCoupon(this);
                                                }
                                            });
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                // 商品表格参数
                productListColumns: [
                    {
                        type: 'selection',
                        align: 'center',
                        key: 'name'
                    },
                    {
                        type: 'index',
                        align: 'center',
                        width: 70,
                        title: '序号',
                        render: (h, params) => {
                            return h('span', {}, params.index);
                        }
                    },
                    {
                        title: '商品名称',
                        align: 'center',
                        key: 'name'
                    }
                ],
                // 商品提交表格参数
                productSubmitListColumns: [
                    {
                        type: 'index',
                        align: 'center',
                        width: 70,
                        title: '序号',
                        render: (h, params) => {
                            return h('span', {}, params.index);
                        }
                    },
                    {
                        title: '商品名称',
                        align: 'center',
                        key: 'name'
                    }
                ],
                // 分类表格参数
                classifyListColumns: [
                    {
                        type: 'selection',
                        align: 'center',
                        key: 'name'
                    },
                    {
                        type: 'index',
                        align: 'center',
                        width: 70,
                        title: '序号',
                        render: (h, params) => {
                            return h('span', {}, params.index);
                        }
                    },
                    {
                        title: '分类名称',
                        align: 'center',
                        key: 'name'
                    }
                ],
                // 分类提交表格参数
                classifySubmitListColumns: [
                    {
                        type: 'index',
                        align: 'center',
                        width: 70,
                        title: '序号',
                        render: (h, params) => {
                            return h('span', {}, params.index);
                        }
                    },
                    {
                        title: '分类名称',
                        align: 'center',
                        key: 'name'
                    }
                ],

                // 新增优惠券模态框参数
                insertModel: false,
                insertModelLoading: false,
                insertCouponItem: {},

                // 编辑优惠券模态框参数
                updateModel: false,
                updateModelLoading: false,
                updateCouponItem: {},

                // 商品查询表格参数（编辑模态框）
                productCheckListColumns: [
                    {
                        type: 'index',
                        align: 'center',
                        title: '序号',
                        render: (h, params) => {
                            return h('span', {}, params.index);
                        }
                    },
                    {
                        title: '已选商品名称',
                        align: 'center',
                        key: 'name'
                    }
                ],
                // 商品分类查询表格参数（编辑模态框）
                classifyCheckListColumns: [
                    {
                        type: 'index',
                        align: 'center',
                        title: '序号',
                        render: (h, params) => {
                            return h('span', {}, params.index);
                        }
                    },
                    {
                        title: '已选商品分类名称',
                        align: 'center',
                        key: 'name'
                    }
                ],

                // 已选商品列表（编辑模态框）
                productChooseList: [],
                productChooseLoading: true,
                // 已选商品分类列表（编辑模态框）
                classifyChooseList: [],
                classifyChooseLoading: true,
            };
        },
        methods: {

            // 初始化优惠券列表
            initCouponList () {
                couponRequest.getCouponList(this);
            },
            // 初始化商品列表
            initProductList () {
                couponRequest.getProductList(this);
            },
            // 初始化分类列表
            initClassifyList () {
                couponRequest.getClassifyList(this);
            },

            // 查询按钮（分页查询商品列表）
            selectProductList () {
                this.pageNumProduct = 1;
                this.pageSizeProduct = 10;
                this.totalElementsProduct = 0;
                this.initProductList();
            },
            // 查询按钮（分页查询商品分类列表）
            selectClassifyList () {
                this.pageNumClassify = 1;
                this.pageSizeClassify = 10;
                this.totalElementsClassify = 0;
                this.initClassifyList();
            },

            // 分页事件
            changePage (index) {
                this.pageNum = index;
                this.initCouponList();
            },
            changePageSize (val) {
                this.pageSize = val;
                this.pageNum = 1;
                this.initCouponList();
            },
            changePageProduct (index) {
                this.pageNumProduct = index;
                this.initProductList();
            },
            changePageSizeProduct (val) {
                this.pageSizeProduct = val;
                this.pageNumProduct = 1;
                this.initProductList();
            },
            changePageClassify (index) {
                this.pageNumClassify = index;
                this.initClassifyList();
            },
            changePageSizeClassify (val) {
                this.pageSizeClassify = val;
                this.pageNumClassify = 1;
                this.initClassifyList();
            },

            // 表格多选事件
            selectProduct (selection, row) {
                if (this.getArrayIndex(row, this.productSubmitList) === -1) {
                    this.productSubmitList.push(row);
                }
            },
            cancelProduct (selection, row) {
                let index = 0;
                this.productSubmitList.forEach((item) => {
                    if (item.id === row.id) {
                        this.productSubmitList.splice(index, 1);
                        return false;
                    }
                    index++;
                });
            },
            selectAllProduct (selection) {
                selection.forEach(item => {
                    if (this.getArrayIndex(item, this.productSubmitList) === -1) {
                        this.productSubmitList.push(item);

                    }
                });
            },
            cancelAllProduct () {
                this.productList.forEach(item => {
                    let index = this.getArrayIndex(item, this.productSubmitList);
                    if (index !== -1) {
                        this.productSubmitList.splice(index, 1);
                    }
                });
            },
            selectClassify (selection, row) {
                if (this.getArrayIndex(row, this.classifySubmitList) === -1) {
                    this.classifySubmitList.push(row);
                }
            },
            cancelClassify (selection, row) {
                let index = 0;
                this.classifySubmitList.forEach((item) => {
                    if (item.id === row.id) {
                        this.classifySubmitList.splice(index, 1);
                        return false;
                    }
                    index++;
                });
            },
            selectAllClassify (selection) {
                selection.forEach(item => {
                    if (this.getArrayIndex(item, this.classifySubmitList) === -1) {
                        this.classifySubmitList.push(item);

                    }
                });
            },
            cancelAllClassify () {
                this.classifyList.forEach(item => {
                    let index = this.getArrayIndex(item, this.classifySubmitList);
                    if (index !== -1) {
                        this.classifySubmitList.splice(index, 1);
                    }
                });
            },

            // 获取数组索引
            getArrayIndex (item, array) {
                let index = -1;
                array.forEach((itemChild, i) => {
                    if (item.id == itemChild.id) {
                        index = i;
                        return false;
                    }
                });
                return index;
            },

            // 单选框监听事件
            radioChange (event) {
            },

            // 新增优惠券
            insertCoupon () {
                this.initInsertModel();
                this.insertModel = true;
            },

            // 初始化新增模态框数据
            initInsertModel () {
                this.productSubmitList = [];
                this.classifySubmitList = [];
                this.insertCouponItem = {
                    name: '',
                    type: null,
                    value: 0,
                    quantity: 0,
                    limit: null,
                    startTime: null,
                    endTime: null,
                    description: '',
                    moneyOff: null,
                    range: null,
                    product: this.productSubmitList,
                    classify: this.classifySubmitList
                };
            },

            // 新增模态框确认操作
            insertModelOk () {
                couponRequest.insertCoupon(this);
            },

            // 新增模态框取消操作
            insertModelCancel () {
                this.insertModel = false;
            },

            // 编辑优惠券
            updateCoupon (params) {
                this.couponId = params.row.id;
                couponRequest.getProductAndClassifyList(this);
                this.updateCouponItem = params.row;
                this.updateModel = true;
            },

            // 编辑模态框确认操作
            updateModelOk () {
                couponRequest.updateCoupon(this);
            },

            // 编辑模态框取消操作
            updateModelCancel () {
                this.updateModel = false;
            },
        },
        created () {
            this.initCouponList();
            this.initClassifyList();
            this.initProductList();
        }
    };
</script>

