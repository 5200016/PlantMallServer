<style lang="less">
    @import "order-sell";
</style>

<template>
    <div class="order-sell">
        <!-- 商品订单号 -->
        <Input v-model="searchValue.tradeNo" placeholder="订单号" class="order-trade-no"/>

        <!-- 用户昵称、姓名、手机号 -->
        <Input v-model="searchValue.value" placeholder="用户昵称、姓名、手机号" class="order-value"/>
        <!-- 商品订单状态 -->
        <Select v-model="searchValue.status" style="width:100px" placeholder="订单状态">
            <Option v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <!-- 查询按钮 -->
        <Button class="queryButton" type="primary" @click="initOrderSellList">查询</Button>

        <!-- 发货 -->
        <Button class="shipmentsBatch-button" type="primary" @click="shipmentsBatch">批量发货</Button>

        <!-- 商品订单列表 -->
        <div class="order-sell-list">
            <Table :columns="orderSellListColumns"
                   border
                   ref="selection"
                   @on-selection-change="selectOrder"
                   :data="orderSellList"
                   :loading="orderSellLoading"></Table>
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

        <!-- 查看详情模态框 -->
        <Modal
                v-model="detailModel"
                title="详情"
                width="50%"
                @on-ok="detailModelOk"
                @on-cancel="detailModelCancel"
                :mask-closable="false"
                :scrollable="false"
                slot="footer">
            <div>
                <Tabs value="order">
                    <TabPane label="订单详情" name="order">
                        <Form :model="orderSellItem" :label-width="110" inline>

                            <FormItem label="订单号：">
                                <Input v-model="orderSellItem.tradeNo" readonly
                                       style="width: 200px"></Input>
                            </FormItem>

                            <FormItem label="订单状态：">
                                <Select v-model="orderSellItem.status" style="width:200px;" disabled>
                                    <Option v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </FormItem>

                            <FormItem label="支付单号：">
                                <Input v-model="orderSellItem.payNo" readonly
                                       style="width: 200px"></Input>
                            </FormItem>

                            <FormItem label="支付类型：">
                                <Select v-model="orderSellItem.payType" style="width:200px;" disabled>
                                    <Option v-for="item in selectList1" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </FormItem>

                            <FormItem label="实付金额：">
                                <Input v-model="orderSellItem.price" readonly
                                       style="width: 200px"></Input>
                            </FormItem>

                            <FormItem label="购买数量：">
                                <Input v-model="orderSellItem.number" readonly
                                       style="width: 200px"></Input>
                            </FormItem>

                        </Form>
                    </TabPane>
                    <TabPane label="商品详情" name="product">
                        <div class="order-sell-list">
                            <Table :columns="orderProductColumns"
                                   border
                                   :data="orderProductList"
                                   :loading="orderProductLoading"></Table>
                        </div>
                    </TabPane>
                    <TabPane label="用户详情" name="user">
                        <Form :model="orderSellItem" :label-width="110" inline>

                            <FormItem label="微信用户昵称：">
                                <Input v-model="orderSellItem.user.nickname" readonly
                                       style="width: 200px"></Input>
                            </FormItem>

                            <FormItem label="微信用户电话：">
                                <Input v-model="orderSellItem.user.phone" readonly
                                       style="width: 200px"></Input>
                            </FormItem>

                            <FormItem label="收货人姓名：">
                                <Input v-model="orderSellItem.receiverAddress.name" readonly
                                       style="width: 200px"></Input>
                            </FormItem>

                            <FormItem label="收货人电话：">
                                <Input v-model="orderSellItem.receiverAddress.phone" readonly
                                       style="width: 200px"></Input>
                            </FormItem>

                            <FormItem label="收货地区：">
                                <Input v-model="orderSellItem.receiverAddress.area" readonly
                                       style="width: 200px"></Input>
                            </FormItem>

                            <FormItem label="收货详细地址：">
                                <Input v-model="orderSellItem.receiverAddress.address"
                                       readonly
                                       :autosize="true"
                                       type="textarea"
                                       style="width: 523px"></Input>
                            </FormItem>
                        </Form>
                    </TabPane>
                </Tabs>
            </div>
        </Modal>
    </div>
</template>

<script>
    import * as orderSellRequest from '../../../../request/order-manage/order-sell';
    import {formatDate} from '../../../../libs/Date';

    export default {
        name: 'order-sell',
        data () {
            return {

                // 订单商品
                orderProduct: {
                    productId: null,
                    orderId: null,
                },

                // 查询条件
                searchValue: {
                    tradeNo: '',
                    value: '',
                    status: '',
                },

                // 选择器参数（订单状态）
                selectList: [
                    {
                        value: -1,
                        label: '全部订单'
                    },
                    {
                        value: 0,
                        label: '待付款'
                    },
                    {
                        value: 1,
                        label: '待发货'
                    },
                    {
                        value: 2,
                        label: '待收货'
                    },
                    {
                        value: 3,
                        label: '待评价'
                    },
                    {
                        value: 4,
                        label: '售后'
                    },
                    {
                        value: 5,
                        label: '已评价'
                    }
                ],
                // 选择器参数（支付类型）
                selectList1: [
                    {
                        value: 0,
                        label: '微信支付'
                    },
                    {
                        value: 1,
                        label: '余额支付'
                    }
                ],

                // 分页参数
                pageNum: 1,
                pageSize: 10,
                totalElements: 0,

                // 商品订单列表
                orderSellList: [],
                orderSellLoading: true,

                // 订单商品列表
                orderProductList: [],
                orderProductLoading: true,

                // 批量发货订单
                orderShipmentsBatch:[],

                // 商品订单表格参数
                orderSellListColumns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
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
                        title: '订单号',
                        align: 'center',
                        key: 'tradeNo'
                    },
                    {
                        title: '订单状态',
                        align: 'center',
                        key: 'status',
                        render: (h, params) => {
                            let status = '';
                            switch (params.row.status) {
                                case 0 :
                                    status = '待付款';
                                    break;
                                case 1 :
                                    status = '待发货';
                                    break;
                                case 2 :
                                    status = '待收货';
                                    break;
                                case 3 :
                                    status = '待评价';
                                    break;
                                case 4 :
                                    status = '售后';
                                    break;
                                case 5 :
                                    status = '已评价';
                                    break;
                            }
                            return h('div', {}, status);
                        }
                    },
                    {
                        title: '支付类型',
                        align: 'center',
                        key: 'payType',
                        render: (h, params) => {
                            return h('div', {}, params.row.payType === 0 ? '微信支付' : '余额支付');
                        }
                    },
                    {
                        title: '实付金额',
                        align: 'center',
                        key: 'price'
                    },
                    {
                        title: '收货人',
                        align: 'center',
                        key: 'username',
                        render: (h, params) => {
                            return h('div', {}, params.row.receiverAddress.name);
                        }
                    },
                    {
                        title: '电话',
                        align: 'center',
                        key: 'phone',
                        render: (h, params) => {
                            return h('div', {}, params.row.receiverAddress.phone);
                        }
                    },
                    {
                        title: '下单时间',
                        align: 'center',
                        width: 165,
                        key: 'createTime',
                        render: (h, params) => {
                            return h('span', {}, formatDate(new Date(params.row.createTime), 'yyyy-MM-dd hh:mm:ss'));
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
                                        width: '65px'
                                    },
                                    on: {
                                        click: () => {
                                            this.checkDetails(params);
                                        }
                                    }
                                }, '查看详情')
                            ]);
                        }
                    }
                ],
                // 订单商品表格
                orderProductColumns: [
                    {
                        type: 'index',
                        align: 'center',
                        width: 75,
                        title: '序号',
                        render: (h, params) => {
                            return h('span', {}, params.index);
                        }
                    },
                    {
                        title: '商品名称',
                        align: 'center',
                        key: 'name',
                        render: (h, params) => {
                            return h('span', {}, params.row.product.name);
                        }
                    },
                    {
                        title: '库存',
                        align: 'center',
                        key: 'inventory',
                        render: (h, params) => {
                            return h('span', {}, params.row.product.inventory);
                        }
                    },
                    {
                        title: '出售价格',
                        align: 'center',
                        key: 'payType',
                        render: (h, params) => {
                            return h('span', {}, params.row.product.price);
                        }
                    },
                    {
                        title: '租赁价格',
                        align: 'center',
                        key: 'leasePrice',
                        render: (h, params) => {
                            return h('span', {}, params.row.product.leasePrice);
                        }
                    }],

                // 商品订单模态框
                detailModel: false,
                orderSellItem: {
                    tradeNo: '',
                    payNo: '',
                    price: 0,
                    payType: -1,
                    number: 0,
                    description:'',
                    status: 0,
                    product: {
                        name: '',
                        price: 0,
                        lease: 0,
                        sale: 0,
                    },
                    user: {
                        nickname: '',
                        phone: '',
                    },
                    receiverAddress: {
                        name: '',
                        phone: ''
                    }
                }
            };
        },
        methods: {

            // 初始化商品订单列表
            initOrderSellList () {
                orderSellRequest.getOrderSellList(this);
            },

            // 分页事件
            changePage (index) {
                this.pageNum = index;
                this.initOrderSellList();
            },
            changePageSize (val) {
                this.pageSize = val;
                this.pageNum = 1;
                this.initOrderSellList();
            },

            // 查看商品订单详情
            checkDetails (params) {
                this.orderProduct.orderId = params.row.id;
                orderSellRequest.getOrderProductByOrderId(this);
                this.orderSellItem = params.row;
                this.detailModel = true;
            },

            // 商品订单模态框确认操作
            detailModelOk () {
                this.detailModel = false;
            },

            // 商品订单模态框取消操作
            detailModelCancel () {
                this.detailModel = false;
            },

            // 批量选择订单
            selectOrder (selection) {
                this.orderShipmentsBatch = [];
                this.orderShipmentsBatch = selection;
            },
            // 批量发货
            shipmentsBatch () {
                orderSellRequest.shipmentsBatch(this);
            }
        },
        created () {
            this.initOrderSellList();
        }
    };
</script>

