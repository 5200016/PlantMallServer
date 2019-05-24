<style lang="less">
    @import 'recharge';
</style>
<template>
    <div class="recharge">
        <Button class="add-button" type="primary" @click="insertRecharge">新增充值项</Button>

        <!-- 充值项目列表 -->
        <div class="recharge-list">
            <Table :columns="rechargeListColumns" border :data="rechargeList" :loading="rechargeLoading"></Table>
        </div>

        <!-- 新增充值项目模态框 -->
        <Modal
                v-model="insertRechargeModel"
                title="新增充值项目"
                @on-ok="insertModelOk"
                @on-cancel="insertModelCancel"
                :mask-closable="false"
                :loading="insertModelLoading">
            <div style="margin:0 auto;width: 340px">
                <Form :model="insertRechargeItem" :label-width="110">
                    <FormItem label="充值金额：">
                        <Input v-model="insertRechargeItem.price" placeholder="请输入"
                               style="width: 200px"></Input>
                    </FormItem>
                </Form>
            </div>
        </Modal>

        <!-- 编辑充值项目模态框 -->
        <Modal
                v-model="updateRechargeModel"
                title="编辑充值项目"
                @on-ok="updateModelOk"
                @on-cancel="updateModelCancel"
                :mask-closable="false"
                :loading="updateModelLoading">
            <div style="margin:0 auto;width: 340px">
                <Form :model="updateRechargeItem" :label-width="110">
                    <FormItem label="充值金额：">
                        <Input v-model="updateRechargeItem.price" placeholder="请输入"
                               style="width: 200px"></Input>
                    </FormItem>
                </Form>
            </div>
        </Modal>
    </div>
</template>

<script>
    import * as rechargeRequest from '../../../../request/member-manage/recharge'
    import {formatDate} from '../../../../libs/Date';
    export default {
        name: 'recharge',
        data () {
            return {
                // 删除id
                deleteId: 0,

                // 充值项目列表
                rechargeList: [],
                rechargeLoading: true,

                // 充值项目表格参数
                rechargeListColumns : [
                    {
                        type: 'index',
                        align: 'center',
                        title: '序号',
                        render: (h, params) => {
                            return h('span', {}, params.index)
                        }
                    },
                    {
                        title: '充值金额',
                        align:'center',
                        key: 'price',
                        render: (h, params) => {
                            return h('span', {}, params.row.price + '元')
                        }
                    },
                    {
                        title: '创建时间',
                        align:'center',
                        key: 'createTime',
                        render: (h, params) => {
                            return h('span', {}, formatDate(new Date(params.row.createTime),'yyyy-MM-dd hh:mm:ss'))
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
                                        width:'55px'
                                    },
                                    on: {
                                        click: () => {
                                            this.updateRecharge(params);
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        width:'55px',
                                        marginLeft: '20px'
                                    },
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                title: '删除提醒',
                                                content: '<p>您确定删除此条记录吗?</p>',
                                                onOk: () => {
                                                    this.deleteId = params.row.id;
                                                    rechargeRequest.deleteRechargeItem(this);
                                                }
                                            });
                                        }
                                    }
                                }, '删除'),
                            ])
                        }
                    }
                ],

                // 新增充值项目模态框参数
                insertRechargeModel: false,
                insertModelLoading: false,
                insertRechargeItem: {
                    price: 0
                },

                // 编辑充值项目模态框参数
                updateRechargeModel: false,
                updateModelLoading: false,
                updateRechargeItem: {},
            };
        },
        methods: {

            // 初始化充值项目列表
            initRechargeList(){
                rechargeRequest.getRechargeList(this);
            },

            // 新增充值项
            insertRecharge () {
                this.insertRechargeItem = {
                    price: 0
                };
                this.insertRechargeModel = true;
            },

            // 新增模态框确认操作
            insertModelOk () {
                rechargeRequest.insertRechargeItem(this);
            },

            // 新增模态框取消操作
            insertModelCancel () {
                this.insertRechargeItem = {
                    price: 0
                };
                this.insertRechargeModel = false;
            },

            // 编辑充值项
            updateRecharge (params) {
                this.updateRechargeItem = params.row;
                this.updateRechargeModel = true;
            },

            // 编辑模态框确认操作
            updateModelOk () {
                rechargeRequest.updateRechargeItem(this);
            },

            // 编辑模态框取消操作
            updateModelCancel () {
                this.updateRechargeItem = {};
                this.updateRechargeModel = false;
            }
        },
        created() {
            this.initRechargeList();
        }
    };
</script>


