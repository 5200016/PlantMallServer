<style lang="less">
    @import "appointment";
</style>

<template>
    <div class="appointment">
        <!-- 姓名、手机号 -->
        <Input v-model="searchValue.value" placeholder="用户姓名、手机号" class="appointment-value"/>
        <!-- 处理状态 -->
        <Select v-model="searchValue.status" style="width:100px" placeholder="处理状态">
            <Option v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <!-- 查询按钮 -->
        <Button class="queryButton" type="primary" @click="initAppointmentList">查询</Button>

        <!-- 批量处理 -->
        <Button class="dispose-batch-button" type="primary" @click="disposeBatch">批量处理</Button>

        <!-- 预约记录列表 -->
        <div class="appointment-list">
            <Table :columns="appointmentListColumns"
                   border
                   ref="selection"
                   @on-selection-change="selectAppointment"
                   :data="appointmentList"
                   :loading="appointmentLoading"></Table>
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
    </div>
</template>

<script>
    import * as appointmentRequest from '../../../request/appointment-manage/appointment';
    import {formatDate} from '../../../libs/Date';

    export default {
        name: 'appointment',
        data(){
            return {
                // 查询条件
                searchValue: {
                    value: '',
                    status: '',
                },

                // 选择器参数（处理状态）
                selectList: [
                    {
                        value: -1,
                        label: '全部'
                    },
                    {
                        value: 0,
                        label: '未处理'
                    },
                    {
                        value: 1,
                        label: '已处理'
                    }
                ],

                // 分页参数
                pageNum: 1,
                pageSize: 10,
                totalElements: 0,

                // 预约记录列表
                appointmentList: [],
                appointmentLoading: true,

                // 批量处理预约记录状态
                disposeBatchList:[],

                // 预约记录表格参数
                appointmentListColumns: [
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
                        title: '姓名',
                        width: 100,
                        align: 'center',
                        key: 'name'
                    },
                    {
                        title: '联系方式',
                        align: 'center',
                        width: 110,
                        key: 'phone'
                    },
                    {
                        title: '地区',
                        align: 'center',
                        width: 160,
                        key: 'area'
                    },
                    {
                        title: '详细地址',
                        align: 'center',
                        key: 'address'
                    },
                    {
                        title: '预约时间',
                        align: 'center',
                        width: 150,
                        key: 'time',
                        render: (h, params) => {
                            return h('span', {}, formatDate(new Date(params.row.time), 'yyyy-MM-dd hh:mm:ss'));
                        }
                    },
                    {
                        title: '预约备注',
                        align: 'center',
                        key: 'remark'
                    },
                    {
                        title: '处理状态',
                        key: 'action',
                        width: 200,
                        align: 'center',
                        render: (h, params) => {
                            let status = params.row.status;
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: (status === 0)? 'warning' : 'success',
                                        size: 'small'
                                    },
                                    style: {
                                        width: '85px'
                                    }
                                }, (status === 0)? '未处理' : '已处理')
                            ]);
                        }
                    }
                ],
            }
        },
        methods: {

            // 初始化预约记录列表
            initAppointmentList () {
                appointmentRequest.getAppointmentList(this);
            },

            // 分页事件
            changePage (index) {
                this.pageNum = index;
                this.initAppointmentList();
            },
            changePageSize (val) {
                this.pageSize = val;
                this.pageNum = 1;
                this.initAppointmentList();
            },

            // 批量选择处理记录
            selectAppointment (selection) {
                this.disposeBatchList = [];
                selection.forEach(item => {
                   this.disposeBatchList.push(item.id);
                });
            },
            // 批量处理
            disposeBatch () {
                appointmentRequest.disposeBatch(this);
            }
        },
        created () {
            this.initAppointmentList();
        }
    };
</script>

