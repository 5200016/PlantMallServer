<style lang="less">
    @import 'product-classify';
</style>
<template>
    <div class="product-classify">

        <!-- 分类类型 -->
        <Select v-model="searchValue.type" style="width:100px" placeholder="分类类型">
            <Option v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>

        <!--分类名称-->
        <Input v-model="searchValue.name" placeholder="分类名称" class="classify-name"/>
        <!--查询按钮-->
        <Button class="queryButton" type="primary" @click="initClassifyList">查询</Button>

        <Button class="add-button" type="primary" @click="insertClassify">新增分类</Button>

        <!-- 分类列表 -->
        <div class="product-classify-list">
            <Table :columns="classifyListColumns" border :data="classifyList" :loading="classifyLoading"></Table>
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

        <!-- 新增分类模态框 -->
        <Modal
                v-model="insertModel"
                title="新增分类"
                @on-ok="insertModelOk"
                @on-cancel="insertModelCancel"
                :mask-closable="false"
                :loading="insertModelLoading">
            <div style="margin-top: 20px">
                <Form :model="insertClassifyItem" :label-width="180">

                    <FormItem label="分类名称：">
                        <Input v-model="insertClassifyItem.name" placeholder="请输入"
                               style="width: 200px"></Input>
                    </FormItem>

                    <FormItem label="分类类型：">
                        <RadioGroup v-model="insertClassifyItem.type">
                            <Radio label="0">出售</Radio>
                            <Radio label="1">租赁</Radio>
                        </RadioGroup>
                    </FormItem>

                    <FormItem label="分类等级：">
                        <Input v-model="insertClassifyItem.sort"
                               :number = true
                               placeholder="请输入"
                               style="width: 200px"></Input>
                    </FormItem>
                </Form>
            </div>
        </Modal>

        <!-- 编辑分类模态框 -->
        <Modal
                v-model="updateModel"
                title="编辑分类"
                @on-ok="updateModelOk"
                @on-cancel="updateModelCancel"
                :mask-closable="false"
                :loading="updateModelLoading">
            <div>
                <Form :model="updateClassifyItem" :label-width="75">

                    <FormItem label="分类名称：">
                        <Input v-model="updateClassifyItem.name" placeholder="请输入"
                               style="width: 200px"></Input>
                    </FormItem>

                    <FormItem label="分类类型：">
                        <RadioGroup v-model="updateClassifyItem.type">
                            <Radio label="0">出售</Radio>
                            <Radio label="1">租赁</Radio>
                        </RadioGroup>
                    </FormItem>

                    <FormItem label="分类等级：">
                        <Input v-model="updateClassifyItem.sort"
                               :number = true
                               placeholder="请输入"
                               style="width: 200px"></Input>
                    </FormItem>
                </Form>
            </div>
        </Modal>
    </div>
</template>

<script>
    import * as classifyRequest from '../../../../request/product-manage/product-classify'

    export default {
        name: 'product-classify',
        data () {
            return {

                // 查询条件
                searchValue: {
                    name: '',
                    type: ''
                },

                // 选择器参数
                selectList: [
                    {
                        value: -1,
                        label: '全部'
                    },
                    {
                        value: 0,
                        label: '出售'
                    },
                    {
                        value: 1,
                        label: '租赁'
                    }
                ],

                // 分页参数
                pageNum: 1,
                pageSize: 10,
                totalElements: 0,

                // 删除id
                deleteId: 0,

                // 商品分类列表
                classifyList: [],
                classifyLoading: true,

                // 商品分类表格参数
                classifyListColumns : [
                    {
                        title: '分类等级',
                        align: 'center',
                        key: 'sort'
                    },
                    {
                        title: '分类名称',
                        align:'center',
                        key: 'name'
                    },
                    {
                        title: '分类类型',
                        align:'center',
                        key: 'type',
                        render: (h, params) => {
                            return h('div', {}, params.row.type == 0 ? "出售" : "租赁")
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
                                            this.updateClassify(params);
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
                                                    classifyRequest.deleteClassifyItem(this);
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
                insertModel: false,
                insertModelLoading: false,
                insertClassifyItem: {
                    name: '',
                    type: 0,
                    sort: 1
                },

                // 编辑充值项目模态框参数
                updateModel: false,
                updateModelLoading: false,
                updateClassifyItem: {},

            }
        },
        methods: {

            // 初始化商品分类列表
            initClassifyList(){
                classifyRequest.getClassifyList(this);
            },

            // 初始化新增模态框数据
            initInsertModel(){
                this.insertClassifyItem = {
                    name: '',
                    type: 0,
                    sort: 1
                };
            },

            // 分页事件
            changePage (index) {
                this.pageNum = index;
                this.initClassifyList();
            },
            changePageSize (val) {
                this.pageSize = val;
                this.pageNum = 1;
                this.initClassifyList();
            },

            // 新增商品分类
            insertClassify () {
                this.initInsertModel();
                this.insertModel = true;
            },

            // 新增模态框确认操作
            insertModelOk () {
                classifyRequest.insertClassifyItem(this);
            },

            // 新增模态框取消操作
            insertModelCancel () {
                this.initInsertModel();
                this.insertModel = false;
            },

            // 编辑商品分类
            updateClassify (params) {
                this.updateClassifyItem = params.row;
                this.updateModel = true;
            },

            // 编辑模态框确认操作
            updateModelOk () {
                classifyRequest.updateClassifyItem(this);
            },

            // 编辑模态框取消操作
            updateModelCancel () {
                this.updateClassifyItem = {};
                this.updateModel = false;
            }
        },
        created() {
            this.initClassifyList();
        }
    };
</script>
