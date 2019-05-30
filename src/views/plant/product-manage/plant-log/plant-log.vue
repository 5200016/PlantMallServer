<style lang="less">
    @import 'plant-log';
</style>

<template>
    <div class="plant-log">
        <!--植物名称-->
        <Input v-model="searchValue.name" placeholder="植物名称" class="plant-name"/>

        <!--查询按钮-->
        <Button class="queryButton" type="primary" @click="initPlantLogList">查询</Button>
        <Button class="add-button" type="primary" @click="insertPlantLog">新增植物志</Button>

        <!-- 植物志列表 -->
        <div class="plant-log-list">
            <Table :columns="plantLogListColumns" border :data="plantLogList" :loading="plantLogLoading"></Table>
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

        <!-- 新增植物志模态框 -->
        <Modal
                v-model="insertModel"
                title="新增植物志"
                width="768px"
                @on-ok="insertModelOk"
                @on-cancel="insertModelCancel"
                :mask-closable="false"
                :loading="insertModelLoading">
            <div>
                <Form :model="insertPlantLogItem" :label-width="75">

                    <FormItem label="植物名称：">
                        <Input v-model="insertPlantLogItem.name" placeholder="请输入"
                               style="width: 200px"></Input>
                    </FormItem>

                    <FormItem label="植物图片：">
                        <Upload
                                multiple
                                ref="upload"
                                type="drag"
                                :format="['jpg','jpeg','png']"
                                :on-format-error="handleFormatError"
                                :on-success="uploadImage"
                                :action="uploadUrl"
                                :show-upload-list="false"
                                name="file">
                            <div style="height: 200px">
                                <div v-if="!haveImage">
                                    <Icon type="ios-cloud-upload" size="88" style="color: #3399ff;margin-top: 40px"></Icon>
                                    <p>点击或拖拽图片上传</p>
                                </div>
                                <img v-bind:src="url + imageUrl" class="plant-image" v-if="haveImage"/>

                            </div>
                        </Upload>
                    </FormItem>

                    <FormItem label="植物描述：">
                        <vue-UEditor-wrap v-model="insertPlantLogItem.description" :config="myConfig"></vue-UEditor-wrap>
                    </FormItem>
                </Form>
            </div>
        </Modal>

        <!-- 编辑植物志模态框 -->
        <Modal
                v-model="updateModel"
                title="编辑植物志"
                width="768px"
                @on-ok="updateModelOk"
                @on-cancel="updateModelCancel"
                :mask-closable="false"
                :loading="updateModelLoading">
            <div>
                <Form :model="updatePlantLogItem" :label-width="75">

                    <FormItem label="植物名称：">
                        <Input v-model="updatePlantLogItem.name" placeholder="请输入"
                               style="width: 200px"></Input>
                    </FormItem>

                    <FormItem label="植物图片：">
                        <Upload
                                multiple
                                ref="upload"
                                type="drag"
                                :format="['jpg','jpeg','png']"
                                :on-format-error="handleFormatError"
                                :on-success="uploadImage"
                                :action="uploadUrl"
                                :show-upload-list="false"
                                name="file">
                            <div style="height: 200px">
                                <div v-if="!haveImage">
                                    <Icon type="ios-cloud-upload" size="88" style="color: #3399ff;margin-top: 40px"></Icon>
                                    <p>点击或拖拽图片上传</p>
                                </div>
                                <img v-bind:src="url + imageUrl" class="plant-image" v-if="haveImage"/>

                            </div>
                        </Upload>
                    </FormItem>

                    <FormItem label="植物描述：" class="plant-desc">
                        <vue-UEditor-wrap v-model="updatePlantLogItem.description" :config="myConfig"></vue-UEditor-wrap>
                    </FormItem>
                </Form>
            </div>
        </Modal>
    </div>
</template>
<script>
    import VueUEditorWrap from 'vue-ueditor-wrap'
    import * as plantLogRequest from '../../../../request/product-manage/plant-log'
    import {BASE_URL, URL} from '../../../../request/config';

    export default {
        name: 'plant-log',
        components: {
            'vue-UEditor-wrap': VueUEditorWrap
        },
        data () {
            return {

                // 查询条件
                searchValue: {
                    name: ''
                },

                // 分页参数
                pageNum: 1,
                pageSize: 10,
                totalElements: 0,

                // 删除id
                deleteId: 0,

                // 图片上传参数
                url: URL + '/',
                uploadUrl: BASE_URL + '/file/plant_image',
                imageUrl: '',
                haveImage: false,

                // 植物志列表
                plantLogList: [],
                plantLogLoading: true,

                // 植物志表格参数
                plantLogListColumns : [
                    {
                        type: 'index',
                        align: 'center',
                        title: '序号',
                        render: (h, params) => {
                            return h('span', {}, params.index)
                        }
                    },
                    {
                        title: '植物图片',
                        align:'center',
                        key: 'image',
                        render: (h, params) => {
                            return h('Avatar', {
                                props: {
                                    src: this.url + params.row.image,
                                    shape: 'square'
                                },
                                style: {
                                    marginTop: '10px',
                                    width: '100px',
                                    height: 'auto',
                                    background: '#FFFFFF',
                                    borderRadius: '0px'
                                }
                            })
                        }
                    },
                    {
                        title: '植物名称',
                        align:'center',
                        key: 'name'
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
                                            this.updatePlantLog(params);
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
                                                    plantLogRequest.deletePlantLogItem(this);
                                                }
                                            });
                                        }
                                    }
                                }, '删除'),
                            ])
                        }
                    }
                ],

                // 新增植物志模态框参数
                insertModel: false,
                insertModelLoading: false,
                insertPlantLogItem: {
                    name: '',
                    image: '',
                    description: ''
                },

                // 编辑植物志模态框参数
                updateModel: false,
                updateModelLoading: false,
                updatePlantLogItem: {},

                // 富文本编辑器参数
                myConfig: {
                    // 编辑器不自动被内容撑高
                    autoHeightEnabled: false,
                    // 初始容器高度
                    initialFrameHeight: 240,
                    // 初始容器宽度
                    initialFrameWidth: '100%',
                    // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
                    // serverUrl: 'http://35.201.165.105:8000/controller.php',
                    serverUrl: 'http://localhost:8081/mall/exec',
                    // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
                    UEDITOR_HOME_URL: '/static/UEditor/'
                }
            }
        },
        methods: {

            // 初始化植物志列表
            initPlantLogList(){
                plantLogRequest.getPlantLogList(this);
            },

            // 初始化新增模态框数据
            initInsertModel(){
                this.insertPlantLogItem = {
                    name: '',
                    image: '',
                    description: ''
                };
            },

            initImage(){
                this.haveImage = false;
                this.imageUrl = '';
            },

            // 分页事件
            changePage (index) {
                this.pageNum = index;
                this.initPlantLogList();
            },
            changePageSize (val) {
                this.pageSize = val;
                this.pageNum = 1;
                this.initPlantLogList();
            },

            // 新增植物志
            insertPlantLog () {
                this.initInsertModel();
                this.insertModel = true;
            },

            // 新增模态框确认操作
            insertModelOk () {
                this.insertPlantLogItem.image = this.imageUrl;
                plantLogRequest.insertPlantLogItem(this);
                this.initImage();
            },

            // 新增模态框取消操作
            insertModelCancel () {
                this.initInsertModel();
                this.initImage();
                this.insertModel = false;
            },

            // 编辑植物志
            updatePlantLog (params) {
                this.initImage();
                this.updatePlantLogItem = params.row;
                if(params.row.image != null && params.row.image != ''){
                    this.imageUrl = params.row.image;
                    this.haveImage = true;
                }
                this.updateModel = true;
            },

            // 编辑模态框确认操作
            updateModelOk () {
                this.updatePlantLogItem.image = this.imageUrl;
                plantLogRequest.updatePlantLogItem(this);
                this.initImage();
            },

            // 编辑模态框取消操作
            updateModelCancel () {
                this.updatePlantLogItem = {};
                this.initImage();
                this.updateModel = false;
            },

            // 上传图片事件
            handleFormatError() {
                this.$Message.error('文件类型不被支持')
            },
            uploadImage(rep) {
                if (rep.code == 200 && rep.result) {
                    this.$Message.success('上传成功');
                    this.imageUrl = rep.data.url;
                    this.haveImage = true;
                } else {
                    this.$Message.error('上传失败')
                }
            }
        },
        created() {
            this.initPlantLogList();
        }
    };
</script>

