<style lang="less">
    @import "image-text-manage";
</style>

<template>
    <div class="image-text-manage">
        <Button class="add-button" type="primary" @click="insertBanner">新增图文信息</Button>

        <!-- 图文列表 -->
        <div class="banner-list">
            <Table :columns="bannerListColumns" border :data="bannerList" :loading="bannerLoading"></Table>
        </div>

        <!-- 新增图文模态框 -->
        <Modal
                v-model="insertBannerModel"
                title="新增图文信息"
                width="50%"
                @on-ok="insertModelOk"
                @on-cancel="insertModelCancel"
                :mask-closable="false"
                :loading="insertModelLoading">
            <div>
                <Form :model="insertBannerItem" :label-width="110">

                    <FormItem label="排序等级：">
                        <Input v-model="insertBannerItem.sort"
                               placeholder="请输入"
                               style="width: 200px"></Input>
                    </FormItem>

                    <FormItem label="目标链接：">
                        <Cascader
                                v-model="insertBannerItem.cascadeId"
                                :data="classifyProductCascade"
                                @on-change="cascadeChange"
                                style="width: 200px"
                                change-on-select></Cascader>
                    </FormItem>

                    <FormItem label="图片：">
                        <Upload
                                multiple
                                ref="upload"
                                type="drag"
                                :format="['jpg','jpeg','png']"
                                :on-format-error="handleFormatError"
                                :on-success="insertUploadImage"
                                :action="uploadUrl"
                                :show-upload-list="false"
                                name="file">
                            <div style="height: 200px">
                                <div v-if="!haveImage">
                                    <Icon type="ios-cloud-upload" size="88" style="color: #3399ff;margin-top: 40px"></Icon>
                                    <p>点击或拖拽图片上传</p>
                                </div>
                                <img v-bind:src="url + insertBannerItem.image" class="banner-image" v-if="haveImage"/>

                            </div>
                        </Upload>
                    </FormItem>


                </Form>
            </div>
        </Modal>

        <!-- 编辑图文模态框 -->
        <Modal
                v-model="updateBannerModel"
                title="编辑图文信息"
                @on-ok="updateModelOk"
                @on-cancel="updateModelCancel"
                :mask-closable="false"
                width="50%"
                :loading="updateModelLoading">
            <div>
                <Form :model="updateBannerItem" :label-width="110">

                    <FormItem label="排序等级：">
                        <Input v-model="updateBannerItem.sort"
                               placeholder="请输入"
                               style="width: 200px"></Input>
                    </FormItem>

                    <FormItem label="目标链接：">
                        <Cascader
                                v-model="updateBannerItem.cascadeId"
                                :data="classifyProductCascade"
                                @on-change="cascadeChange"
                                style="width: 200px"
                                change-on-select></Cascader>
                    </FormItem>

                    <FormItem label="图片：">
                        <Upload
                                multiple
                                ref="upload"
                                type="drag"
                                :format="['jpg','jpeg','png']"
                                :on-format-error="handleFormatError"
                                :on-success="updateUploadImage"
                                :action="uploadUrl"
                                :show-upload-list="false"
                                name="file">
                            <div style="height: 200px">
                                <div v-if="!haveImage">
                                    <Icon type="ios-cloud-upload" size="88" style="color: #3399ff;margin-top: 40px"></Icon>
                                    <p>点击或拖拽图片上传</p>
                                </div>
                                <img v-bind:src="url + updateBannerItem.image" class="banner-image" v-if="haveImage"/>
                            </div>
                        </Upload>
                    </FormItem>
                </Form>
            </div>
        </Modal>
    </div>
</template>

<script>

    import * as productRequest from '../../../../request/product-manage/product-classify'
    import * as bannerRequest from '../../../../request/home-manage/image-text-manage'
    import {isEmpty} from '../../../../libs/ObjFun';
    import {BASE_URL, URL} from '../../../../request/config';

    export default {
        name: 'image-text-manage',
        data () {
            return {
                // 删除id
                deleteId: 0,

                // 图片上传参数
                url: URL + '/',
                uploadUrl: BASE_URL + '/file/home_image',
                imageUrl: '',
                haveImage: false,

                // 图文列表
                bannerList: [],
                bannerLoading: true,

                // 图文表格参数
                bannerListColumns : [
                    {
                        type: 'index',
                        align: 'center',
                        title: '序号',
                        render: (h, params) => {
                            return h('span', {}, params.index)
                        }
                    },
                    {
                        title: '排序等级',
                        align:'center',
                        key: 'sort'
                    },
                    {
                        title: '目标链接',
                        align:'center',
                        key: 'createTime',
                        render: (h, params) => {
                            let result = '';
                            if(!isEmpty(params.row.classifyName)){
                                result = params.row.classifyName;
                            }
                            if(!isEmpty(params.row.productName)){
                                result += ' ---------> ';
                                result += params.row.productName;
                            }
                            return h('pre', {}, result)
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
                                            this.updateBanner(params);
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
                                                    bannerRequest.deleteBannerItem(this);
                                                }
                                            });
                                        }
                                    }
                                }, '删除'),
                            ])
                        }
                    }
                ],

                // 新增图文模态框参数
                insertBannerModel: false,
                insertModelLoading: false,
                insertBannerItem: {
                    image: '',
                    path: '',
                    sort: 1,
                    type: 1,
                    cascadeId: [],
                },

                // 编辑图文模态框参数
                updateBannerModel: false,
                updateModelLoading: false,
                updateBannerItem: {},

                // 级联选择器参数
                classifyProductCascade: []
            };
        },
        methods: {

            // 初始化图文列表
            initBannerList(){
                bannerRequest.getBannerList(this);
                productRequest.getClassifyProductCascade(this)
            },
            initInsertBannerItem(){
                this.insertBannerItem = {
                    image: '',
                    path: '',
                    sort: 1,
                    type: 1
                };
                this.haveImage = false;
            },

            // 新增图文
            insertBanner () {
                this.initInsertBannerItem();
                this.insertBannerModel = true;
            },

            // 新增模态框确认操作
            insertModelOk () {
                bannerRequest.insertBannerItem(this);
            },

            // 新增模态框取消操作
            insertModelCancel () {
                this.insertBannerModel = false;
            },

            // 编辑图文
            updateBanner (params) {
                this.updateBannerItem = params.row;
                if(params.row.image !== null && params.row.image !== ''){
                    this.haveImage = true;
                }
                this.updateBannerModel = true;
            },

            // 编辑模态框确认操作
            updateModelOk () {
                bannerRequest.updateBannerItem(this);
            },

            // 编辑模态框取消操作
            updateModelCancel () {
                this.updateBannerModel = false;
            },

            // 级联选择器变化事件
            cascadeChange(){

            },

            // 上传图片事件
            handleFormatError() {
                this.$Message.error('文件类型不被支持')
            },
            insertUploadImage(rep) {
                if (rep.code == 200 && rep.result) {
                    this.$Message.success('上传成功');
                    this.insertBannerItem.image = rep.data.url;
                    this.haveImage = true;
                } else {
                    this.$Message.error('上传失败')
                }
            },
            updateUploadImage(rep) {
                if (rep.code == 200 && rep.result) {
                    this.$Message.success('上传成功');
                    this.updateBannerItem.image = rep.data.url;
                    this.haveImage = true;
                } else {
                    this.$Message.error('上传失败')
                }
            }
        },
        created() {
            this.initBannerList();
        }
    };
</script>

