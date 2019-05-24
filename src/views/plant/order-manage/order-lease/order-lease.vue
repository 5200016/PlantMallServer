<style lang="less">
    @import "order-lease";
</style>

<template>
    <div class="order-lease">
        <!-- 租赁订单号 -->
        <Input v-model="searchValue.tradeNo" placeholder="订单号" class="order-trade-no"/>

        <!-- 用户昵称、姓名、手机号 -->
        <Input v-model="searchValue.value" placeholder="收货人、手机号" class="order-value"/>
        <!-- 租赁订单状态 -->
        <Select v-model="searchValue.status" style="width:100px" placeholder="订单状态">
            <Option v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <!-- 查询按钮 -->
        <Button class="queryButton" type="primary" @click="initOrderLeaseList">查询</Button>

        <!-- 发货 -->
        <Button class="shipmentsBatch-button" type="primary" @click="shipmentsBatch">批量发货</Button>

        <!-- 租赁订单列表 -->
        <div class="order-lease-list">
            <Table :columns="orderLeaseListColumns"
                   border
                   ref="selection"
                   @on-selection-change="selectOrder"
                   :data="orderLeaseList"
                   :loading="orderLeaseLoading"></Table>
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
                        <Form :model="orderLeaseItem" :label-width="110" inline>

                            <FormItem label="订单号：">
                                <Input v-model="orderLeaseItem.tradeNo" readonly
                                       style="width: 200px"></Input>
                            </FormItem>

                            <FormItem label="订单状态：">
                                <Select v-model="orderLeaseItem.status" style="width:200px;" disabled>
                                    <Option v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </FormItem>

                            <FormItem label="支付单号：">
                                <Input v-model="orderLeaseItem.payNo" readonly
                                       style="width: 200px"></Input>
                            </FormItem>

                            <FormItem label="支付类型：">
                                <Select v-model="orderLeaseItem.payType" style="width:200px;" disabled>
                                    <Option v-for="item in selectList1" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </FormItem>

                            <FormItem label="实付金额：">
                                <Input v-model="orderLeaseItem.price" readonly
                                       style="width: 200px"></Input>
                            </FormItem>

                            <FormItem label="购买数量：">
                                <Input v-model="orderLeaseItem.number" readonly
                                       style="width: 200px"></Input>
                            </FormItem>

                        </Form>
                    </TabPane>
                    <TabPane label="商品详情" name="product">
                        <Select v-model="orderProduct.productId"
                                style="margin-bottom: 5px;width:200px;"
                                placeholder="请选择商品"
                                filterable>
                            <Option v-for="item in productList" :value="item.id" :key="item.id">{{ item.name }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;库存：{{item.inventory}}</Option>
                        </Select>
                        <Input v-model="orderProduct.productNumber" type="number" placeholder="补发数量" style="width: 82px;margin-bottom: 5px" />
                        <Button class="productButton left" type="primary" @click="reissueProduct">补发</Button>
                        <Button class="productButton left" type="error" @click="deleteOrderProductBatch">删除</Button>
                        <div class="order-lease-list">
                            <Table :columns="orderProductColumns"
                                   border
                                   ref="selection"
                                   @on-selection-change="selectOrderProduct"
                                   :data="orderProductList"
                                   :loading="orderProductLoading"></Table>
                        </div>
                    </TabPane>
                    <TabPane label="用户详情" name="user">
                        <Form :model="orderLeaseItem" :label-width="110" inline>

                            <FormItem label="微信用户昵称：">
                                <Input v-model="orderLeaseItem.user.nickname" readonly
                                       style="width: 200px"></Input>
                            </FormItem>

                            <FormItem label="微信用户电话：">
                                <Input v-model="orderLeaseItem.user.phone" readonly
                                       style="width: 200px"></Input>
                            </FormItem>

                            <FormItem label="收货人姓名：">
                                <Input v-model="orderLeaseItem.receiverAddress.name" readonly
                                       style="width: 200px"></Input>
                            </FormItem>

                            <FormItem label="收货人电话：">
                                <Input v-model="orderLeaseItem.receiverAddress.phone" readonly
                                       style="width: 200px"></Input>
                            </FormItem>

                            <FormItem label="收货地区：">
                                <Input v-model="orderLeaseItem.receiverAddress.area" readonly
                                       style="width: 200px"></Input>
                            </FormItem>

                            <FormItem label="收货详细地址：">
                                <Input v-model="orderLeaseItem.receiverAddress.address"
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

        <!-- 养护计划模态框 -->
        <Modal
                v-model="maintenancePlanModel"
                title="设置养护计划"
                @on-ok="maintenancePlanModelOk"
                @on-cancel="maintenancePlanModelCancel"
                :mask-closable="false">
            <div>
                <Form :model="maintenancePlaneItem" :label-width="125">
                    <FormItem label="养护时间：">
                        <DatePicker v-model="maintenancePlaneItem.maintenanceTime" format="yyyy年MM月dd日" type="date" multiple placeholder="请选择养护时间" style="width: 300px"></DatePicker>
                    </FormItem>

                    <FormItem label="养护人员：">
                        <Select v-model="maintenancePlaneItem.maintenancePersonnelId"
                                style="width:300px;"
                                placeholder="请选择养护人员"
                                filterable>
                            <Option v-for="item in maintenanceList" :value="item.id" :key="item.id">{{ item.name }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;手机号：{{item.phone}}</Option>
                        </Select>
                    </FormItem>

                    <FormItem label="养护描述：">
                        <Input v-model="maintenancePlaneItem.maintenanceDescription"
                               :autosize="true"
                               type="textarea"
                               style="width: 300px"></Input>
                    </FormItem>
                </Form>
            </div>
        </Modal>
    </div>
</template>

<script>
    import * as orderLeaseRequest from '../../../../request/order-manage/order-lease';
    import {formatDate} from '../../../../libs/Date';

    export default {
        name: 'order-lease',
        data () {
            return {

                // 订单商品
                orderProduct: {
                    productNumber: null,
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
                        label: '配送中'
                    },
                    {
                        value: 3,
                        label: '已租赁'
                    },
                    {
                        value: 4,
                        label: '已完成'
                    },
                    {
                        value: 5,
                        label: '已取消'
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
                // 商品列表
                productList: [],
                // 养护人员列表
                maintenanceList: [],

                // 分页参数
                pageNum: 1,
                pageSize: 10,
                totalElements: 0,

                // 租赁订单列表
                orderLeaseList: [],
                orderLeaseLoading: true,

                // 租赁订单商品列表
                orderProductList: [],
                orderProductLoading: true,

                // 批量发货订单
                orderShipmentsBatch: [],
                // 批量删除订单商品
                orderProductBatch: [],

                // 租赁订单表格参数
                orderLeaseListColumns: [
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
                                    status = '配送中';
                                    break;
                                case 3 :
                                    status = '已租赁';
                                    break;
                                case 4 :
                                    status = '已完成';
                                    break;
                                case 5 :
                                    status = '已取消';
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
                        width: 200,
                        align: 'center',
                        render: (h, params) => {
                            let status = params.row.status;
                            let maintenancePlanStatus = params.row.maintenancePlanStatus;
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: (maintenancePlanStatus === 0)? 'warning' : 'success',
                                        size: 'small'
                                    },
                                    style: {
                                        width: '85px',
                                        display:(status === 3)? "inline-block" : "none",
                                    },
                                    on: {
                                        click: () => {
                                            this.setMaintenancePlan(params, maintenancePlanStatus);
                                        }
                                    }
                                }, (maintenancePlanStatus === 0)? '设置养护计划' : '已设置'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        width: '65px',
                                        marginLeft: '10px'
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
                        type: 'selection',
                        width: 70,
                        align: 'center'
                    },
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
                        title: '订单数量',
                        align: 'center',
                        key: 'name',
                        render: (h, params) => {
                            return h('span', {}, params.row.productNumber);
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
                    },
                    {
                        title: '状态',
                        key: 'action',
                        width: 115,
                        align: 'center',
                        render: (h, params) => {
                            let status = params.row.productStatus;
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: (status === 1)? 'error' : 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        width: '85px',
                                        display:(status === 1 || status === 2)? "inline-block" : "none",
                                    },
                                }, (status === 1)? '已删除' : '补发')
                            ]);
                        }
                    }],

                // 租赁订单模态框
                detailModel: false,
                orderLeaseItem: {
                    tradeNo: '',
                    payNo: '',
                    price: 0,
                    payType: -1,
                    number: 0,
                    description:'',
                    status: 0,
                    maintenancePlanStatus: 0,
                    orderProducts: [],
                    user: {
                        nickname: '',
                        phone: '',
                    },
                    receiverAddress: {
                        name: '',
                        phone: ''
                    }
                },

                // 养护计划模态框
                maintenancePlanModel: false,
                maintenancePlaneItem: {
                    orderId: null,                // 订单id
                    maintenanceTime: [],          // 养护时间数组
                    maintenancePersonnelId: null, // 养护人员id
                    maintenanceDescription: '',   // 养护描述
                }
            };
        },
        methods: {

            // 初始化租赁订单列表
            initOrderLeaseList () {
                orderLeaseRequest.getOrderLeaseList(this);
            },

            // 分页事件
            changePage (index) {
                this.pageNum = index;
                this.initOrderLeaseList();
            },
            changePageSize (val) {
                this.pageSize = val;
                this.pageNum = 1;
                this.initOrderLeaseList();
            },

            // 查看租赁订单详情
            checkDetails (params) {
                this.orderProduct.orderId = params.row.id;
                orderLeaseRequest.getProductListBrief(this);
                orderLeaseRequest.getOrderProductByOrderId(this);
                this.orderLeaseItem = params.row;
                this.detailModel = true;
            },

            // 租赁订单模态框确认操作
            detailModelOk () {
                this.detailModel = false;
            },

            // 租赁订单模态框取消操作
            detailModelCancel () {
                this.detailModel = false;
            },

            // 设置养护计划
            setMaintenancePlan(params, status){
                orderLeaseRequest.getMaintenancePersonnelList(this);
                this.maintenancePlanModel = true;
                switch (status) {
                    case 0:
                        this.maintenancePlaneItem = {
                            orderId: params.row.id,
                            maintenanceTime: [],          // 养护时间数组
                            maintenancePersonnelId: null, // 养护人员id
                            maintenanceDescription: '',   // 养护描述
                        };break;
                    case 1:
                        this.maintenancePlaneItem = {
                            orderId: params.row.id,
                            maintenanceTime: params.row.maintenanceTime,
                            maintenancePersonnelId: params.row.maintenancePersonnelId,
                            maintenanceDescription: params.row.maintenanceDescription,   // 养护描述
                        };break;
                }
            },

            // 养护计划模态框确认操作
            maintenancePlanModelOk () {
                if(!Array.isArray(this.maintenancePlaneItem.maintenanceTime)){
                    this.maintenancePlaneItem.maintenanceTime = [];
                }
                orderLeaseRequest.setMaintenancePlan(this);
                this.maintenancePlanModel = false;
            },

            // 养护计划模态框取消操作
            maintenancePlanModelCancel () {
                this.maintenancePlanModel = false;
            },

            // 批量选择订单
            selectOrder (selection) {
                this.orderShipmentsBatch = [];
                this.orderShipmentsBatch = selection;
            },
            // 批量发货
            shipmentsBatch () {
                orderLeaseRequest.shipmentsBatch(this);
            },
            // 批量选择订单商品
            selectOrderProduct (selection) {
                this.orderProductBatch = [];
                this.orderProductBatch = selection;
            },
            // 批量删除订单商品
            deleteOrderProductBatch () {
                orderLeaseRequest.deleteOrderProductBatch(this);
            },

            // 补发商品
            reissueProduct(){
                orderLeaseRequest.reissueProduct(this);
            }
        },
        created () {
            this.initOrderLeaseList();
        }
    };
</script>
