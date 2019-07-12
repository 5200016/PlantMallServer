<style lang="less">
    @import "product-add";
</style>
<template>
    <div class="product-add">
        <!-- 商品名称 -->
        <Input v-model="searchValue.name" placeholder="商品名称" class="product-name"/>

        <!-- 查询按钮 -->
        <Button class="queryButton" type="primary" @click="initProductList">查询</Button>
        <Button class="add-button" type="primary" @click="insertProduct">新增商品</Button>

        <!-- 商品列表 -->
        <div class="product-list">
            <Table :columns="productListColumns" border :data="productList" :loading="productLoading"></Table>
        </div>

        <!-- 分页器 -->
        <div class="page-div" align="right">
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

        <!-- 新增商品模态框 -->
        <Modal
                v-model="insertModel"
                title="新增商品"
                width="768px"
                @on-ok="insertModelOk"
                @on-cancel="insertModelCancel"
                :mask-closable="false"
                :loading="insertModelLoading">
            <div>
                <Form :model="insertProductItem" :label-width="75">
                    <FormItem label="商品名称：">
                        <Input v-model="insertProductItem.name" placeholder="请输入"
                               style="width: 200px"></Input>
                    </FormItem>

                    <FormItem label="缩略图：">
                        <Upload
                                multiple
                                style="width: 200px"
                                ref="upload"
                                type="drag"
                                :format="['jpg','jpeg','png']"
                                :on-format-error="handleFormatError"
                                :on-success="uploadImage"
                                :action="uploadUrl"
                                :show-upload-list="false"
                                name="file">
                            <div style="height: 200px;width: 200px;">
                                <div v-if="!haveImage">
                                    <Icon type="ios-cloud-upload" size="88" style="color: #3399ff;margin-top: 40px"></Icon>
                                    <p>点击或拖拽图片上传</p>
                                </div>
                                <img v-bind:src="url + imageUrl" class="plant-image" v-if="haveImage"/>
                            </div>
                        </Upload>
                    </FormItem>

                    <FormItem label="轮播图：">
                        <div class="demo-upload-list" v-for="item in insertProductItem.imageList">
                            <img :src="url + item.url">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="insertUploadView(item.url)"></Icon>
                                <Icon type="ios-trash-outline" @click.native="insertUploadRemove(item)"></Icon>
                            </div>
                        </div>
                        <Upload
                                ref="upload"
                                :show-upload-list="false"
                                :on-success="insertUploadSuccess"
                                :format="['jpg','jpeg','png']"
                                :max-size="2048"
                                :on-format-error="insertUploadFormatError"
                                :on-exceeded-size="insertUploadMaxSize"
                                :before-upload="insertBeforeUpload"
                                multiple
                                type="drag"
                                :action="uploadUrl"
                                style="display: inline-block;width:58px;">
                            <div style="width: 58px;height:58px;line-height: 58px;">
                                <Icon type="ios-camera" size="20"></Icon>
                            </div>
                        </Upload>
                        <Modal title="预览图片"
                               v-model="insertPreviewModel"
                               @on-ok="previewModelFunction('insert')"
                               @on-cancel="previewModelFunction('insert')"
                               :closable="false">
                            <img :src="previewImage" style="width: 100%">
                        </Modal>
                    </FormItem>

                    <FormItem label="商品分类：">
                        <Select v-model="insertProductItem.classifyId" multiple style="width:200px">
                            <OptionGroup label="出售">
                                <Option v-for="item in classifyGroup.sellClassify" :value="item.id" :key="item.id">{{
                                    item.name }}
                                </Option>
                            </OptionGroup>
                            <OptionGroup label="租赁">
                                <Option v-for="item in classifyGroup.leaseClassify" :value="item.id" :key="item.id">{{
                                    item.name }}
                                </Option>
                            </OptionGroup>
                        </Select>
                    </FormItem>

                    <FormItem label="出售价格：">
                        <Input v-model="insertProductItem.price" placeholder="请输入"
                               style="width: 200px"></Input>
                    </FormItem>

                    <FormItem label="租赁价格：">
                        <Input v-model="insertProductItem.leasePrice" placeholder="请输入"
                               style="width: 200px"></Input>
                    </FormItem>

                    <FormItem label="商品库存：">
                        <Input v-model="insertProductItem.inventory" placeholder="请输入"
                               style="width: 200px"></Input>
                    </FormItem>

                    <FormItem label="商品销量：">
                        <Input v-model="insertProductItem.sale" placeholder="请输入"
                               style="width: 200px"></Input>
                    </FormItem>

                    <FormItem label="商品描述：">
                        <vue-UEditor-wrap v-model="insertProductItem.description" :config="myConfig"></vue-UEditor-wrap>
                    </FormItem>
                </Form>
            </div>
        </Modal>

        <!-- 编辑商品模态框 -->
        <Modal
                v-model="updateModel"
                title="编辑商品"
                width="768px"
                @on-ok="updateModelOk"
                @on-cancel="updateModelCancel"
                :mask-closable="false"
                :loading="updateModelLoading">
            <div>
                <Form :model="updateProductItem" :label-width="75">

                    <FormItem label="商品名称：">
                        <Input v-model="updateProductItem.name" placeholder="请输入"
                               style="width: 200px"></Input>
                    </FormItem>

                    <FormItem label="缩略图：">
                        <Upload
                                multiple
                                style="width: 200px"
                                ref="upload"
                                type="drag"
                                :format="['jpg','jpeg','png']"
                                :on-format-error="handleFormatError"
                                :on-success="uploadImage"
                                :action="uploadUrl"
                                :show-upload-list="false"
                                name="file">
                            <div style="height: 200px;width: 200px;">
                                <div v-if="!haveImage">
                                    <Icon type="ios-cloud-upload" size="88" style="color: #3399ff;margin-top: 40px"></Icon>
                                    <p>点击或拖拽图片上传</p>
                                </div>
                                <img v-bind:src="url + imageUrl" class="plant-image" v-if="haveImage"/>
                            </div>
                        </Upload>
                    </FormItem>

                    <FormItem label="轮播图：">
                        <div class="demo-upload-list" v-for="item in updateProductItem.imageList">
                            <img :src="url + item.url">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="updateUploadView(item.url)"></Icon>
                                <Icon type="ios-trash-outline" @click.native="updateUploadRemove(item)"></Icon>
                            </div>
                        </div>
                        <Upload
                                ref="upload"
                                :show-upload-list="false"
                                :on-success="updateUploadSuccess"
                                :format="['jpg','jpeg','png']"
                                :max-size="2048"
                                :on-format-error="updateUploadFormatError"
                                :on-exceeded-size="updateUploadMaxSize"
                                :before-upload="updateBeforeUpload"
                                multiple
                                type="drag"
                                :action="uploadUrl"
                                style="display: inline-block;width:58px;">
                            <div style="width: 58px;height:58px;line-height: 58px;">
                                <Icon type="ios-camera" size="20"></Icon>
                            </div>
                        </Upload>
                        <Modal title="预览图片"
                               v-model="previewModel"
                               @on-ok="previewModelFunction('update')"
                               @on-cancel="previewModelFunction('update')"
                               :closable="false">
                            <img :src="previewImage" style="width: 100%">
                        </Modal>
                    </FormItem>

                    <FormItem label="商品分类：">
                        <Select v-model="updateProductItem.classifyId" multiple style="width:200px">
                            <OptionGroup label="出售">
                                <Option v-for="item in classifyGroup.sellClassify" :value="item.id" :key="item.id">{{
                                    item.name }}
                                </Option>
                            </OptionGroup>
                            <OptionGroup label="租赁">
                                <Option v-for="item in classifyGroup.leaseClassify" :value="item.id" :key="item.id">{{
                                    item.name }}
                                </Option>
                            </OptionGroup>
                        </Select>
                    </FormItem>

                    <FormItem label="出售价格：">
                        <Input v-model="updateProductItem.price" placeholder="请输入"
                               style="width: 200px"></Input>
                    </FormItem>

                    <FormItem label="租赁价格：">
                        <Input v-model="updateProductItem.leasePrice" placeholder="请输入"
                               style="width: 200px"></Input>
                    </FormItem>

                    <FormItem label="商品库存：">
                        <Input v-model="updateProductItem.inventory" placeholder="请输入"
                               style="width: 200px"></Input>
                    </FormItem>

                    <FormItem label="商品销量：">
                        <Input v-model="updateProductItem.sale" placeholder="请输入"
                               style="width: 200px"></Input>
                    </FormItem>

                    <FormItem label="商品描述：">
                        <vue-UEditor-wrap v-model="updateProductItem.description" :config="myConfig"></vue-UEditor-wrap>
                    </FormItem>
                </Form>
            </div>
        </Modal>

        <!-- 商品评论模态框 -->
        <Modal
                v-model="productReviewModel"
                title="商品评论"
                width="70%"
                @on-ok="productReviewModelOk"
                @on-cancel="productReviewModelCancel"
                :mask-closable="false"
                :scrollable="false"
                slot="footer"
                :loading="productReviewModelLoading">
            <div class="modal-handle" align="right">
                <!-- 商品名称 -->
                <Input v-model="reviewSearch.nickname" placeholder="用户昵称" class="nickname"/>

                <!-- 查询按钮 -->
                <Button class="queryButton" type="primary" @click="initProductReviewList">查询</Button>
                <Button type="error" class="delete-button" @click="deleteBatchProductReview">批量删除</Button>
            </div>
            <div>
                <Table border
                       @on-selection-change="selectReview"
                       ref="selection"
                       :columns="reviewListColumns"
                       :data="productReviewList"></Table>
            </div>
            <!-- 分页器 -->
            <div class="page-div" align="right">
                <Page class="page"
                      :current="pageNumReview"
                      :page-size="pageSizeReview"
                      :total="totalElementsReview"
                      placement="top"
                      show-sizer
                      show-elevator
                      show-total
                      @on-change="changePageProductReview"
                      @on-page-size-change="changePageSizeProductReview"></Page>
            </div>

        </Modal>
    </div>
</template>

<script>
    import VueUEditorWrap from 'vue-ueditor-wrap';
    import * as productRequest from '../../../../request/product-manage/product';
    import {BASE_URL, URL} from '../../../../request/config';
    import {formatDate} from '../../../../libs/Date';

    export default {
        name: 'product-add',
        components: {
            'vue-UEditor-wrap': VueUEditorWrap
        },
        data () {
            return {

                // 商品分类组
                classifyGroup: {
                    sellClassify: [],
                    leaseClassify: []
                },

                // 预览功能参数
                previewImage: '',
                previewModel: false,
                insertPreviewModel: false,

                // 查询条件
                searchValue: {
                    name: ''
                },

                // 分页参数
                pageNum: 1,
                pageSize: 10,
                totalElements: 0,

                // 商品删除id
                deleteId: 0,

                // 图片上传参数
                url: URL + '/',
                uploadUrl: BASE_URL + '/file/plant_image',
                imageUrl: '',
                haveImage: false,

                // 商品列表
                productList: [],
                productLoading: true,

                // 商品表格参数
                productListColumns: [
                    {
                        type: 'index',
                        align: 'center',
                        title: '序号',
                        render: (h, params) => {
                            return h('span', {}, params.index);
                        }
                    },
                    {
                        title: '商品名称',
                        align: 'center',
                        key: 'name'
                    },
                    {
                        title: '库存',
                        align: 'center',
                        key: 'inventory'
                    },
                    {
                        title: '销售量',
                        align: 'center',
                        key: 'sale'
                    },
                    {
                        title: '出售价格',
                        align: 'center',
                        key: 'price'
                    },
                    {
                        title: '租赁价格',
                        align: 'center',
                        key: 'leasePrice'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 275,
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
                                            this.checkProductReview(params);
                                        }
                                    }
                                }, '查看评论'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        width: '55px',
                                        marginLeft: '20px'
                                    },
                                    on: {
                                        click: () => {
                                            this.updateProduct(params);
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
                                        marginLeft: '20px'
                                    },
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                title: '删除提醒',
                                                content: '<p>您确定删除此条记录吗?</p>',
                                                onOk: () => {
                                                    this.deleteId = params.row.id;
                                                    productRequest.deleteProductItem(this);
                                                }
                                            });
                                        }
                                    }
                                }, '删除'),
                            ]);
                        }
                    }
                ],

                // 新增商品模态框参数
                insertModel: false,
                insertModelLoading: false,
                insertProductItem: {
                    name: '',
                    leasePrice: 0,
                    price: 0,
                    inventory: 0,
                    sale: 0,
                    description: '',
                    imageList: [],
                    classifyId: []
                },

                // 编辑商品模态框参数
                updateModel: false,
                updateModelLoading: false,
                updateProductItem: {
                    id: 0,
                    name: '',
                    image: '',
                    leasePrice: 0,
                    price: 0,
                    inventory: 0,
                    sale: 0,
                    description: '',
                    imageList: [],
                    classifyId: []
                },

                // 富文本编辑器参数
                myConfig: {
                    // 编辑器不自动被内容撑高
                    autoHeightEnabled: false,
                    // 初始容器高度
                    initialFrameHeight: 240,
                    // 初始容器宽度
                    initialFrameWidth: '100%',
                    // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
                    serverUrl: 'https://zdshop.zhideweini.com/mall/exec',
                    // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
                    UEDITOR_HOME_URL: '/static/UEditor/'
                },

                /********************** 商品评论模态框所需参数 **********************/

                // 商品评论模态框查询参数
                reviewSearch:{
                    productId: 0,
                    nickname:''
                },

                // 商品评论模态框参数
                productReviewModel: false,
                productReviewModelLoading: false,
                productReviewItem: {
                    id: 0,
                    nickname: '',
                    avatar: '',
                    content: '',
                    level: 0,
                    createTime: '',
                },

                // 商品评论删除id
                deleteReviewId: 0,
                // 商品评论批量删除id数组
                deleteReviewIdBatch: [],

                // 商品评论分页参数
                pageNumReview: 1,
                pageSizeReview: 10,
                totalElementsReview: 0,

                // 商品评论列表
                productReviewList: [],
                productReviewLoading: true,

                // 商品评论表格参数
                reviewListColumns: [
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
                        title: '用户昵称',
                        align: 'center',
                        key: 'nickname',
                        width: 100
                    },
                    {
                        title: '用户头像',
                        align: 'center',
                        key: 'avatar',
                        width: 85,
                        render: (h, params) => {
                            let avatarUrl = params.row.avatar;
                            if( avatarUrl !== '' && avatarUrl !== undefined && avatarUrl !== null){
                                avatarUrl = this.url + params.row.avatar;
                            }
                            return h('Avatar', {
                                props: {
                                    src: avatarUrl,
                                    size: 'large'
                                }
                            })
                        }
                    },
                    {
                        title: '评论内容',
                        align: 'center',
                        key: 'content'
                    },
                    {
                        title: '评论时间',
                        align: 'center',
                        key: 'createTime',
                        width: 150,
                        render: (h, params) => {
                            return h('span', {}, formatDate(new Date(params.row.createTime), 'yyyy-MM-dd hh:mm:ss'));
                        }
                    }
                ],
            };
        },
        methods: {

            // 初始化商品列表
            initProductList () {
                productRequest.getProductList(this);
                productRequest.getClassifyGroup(this);
            },

            // 初始化商品评论列表
            initProductReviewList () {
                productRequest.getProductReviewList(this);
            },

            // 初始化图片
            initImage(){
                this.haveImage = false;
                this.imageUrl = '';
            },

            // 预览操作
            previewModelFunction (flag) {
                if (flag === 'insert') {
                    this.insertPreviewModel = false;
                    this.insertModel = true;
                }
                if (flag === 'update') {
                    this.previewModel = false;
                    this.updateModel = true;
                }
            },

            // 分页事件
            changePage (index) {
                this.pageNum = index;
                this.initProductList();
            },
            changePageSize (val) {
                this.pageSize = val;
                this.pageNum = 1;
                this.initProductList();
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
            },

            /************************** 商品评论 **************************/


            // 商品评论分页事件
            changePageProductReview (index) {
                this.pageNumReview = index;
                this.initProductReviewList();
            },
            changePageSizeProductReview (val) {
                this.pageSizeReview = val;
                this.pageNumReview = 1;
                this.initProductReviewList();
            },

            // 商品评论模态框确认操作
            productReviewModelOk () {
                this.productReviewItem = {};
                this.productReviewModel = false;
            },

            // 商品评论模态框取消操作
            productReviewModelCancel () {
                this.productReviewItem = {};
                this.productReviewModel = false;
            },

            selectReview (selection) {
                this.deleteReviewIdBatch = [];
                selection.forEach(item => {
                    this.deleteReviewIdBatch.push(item.id);
                })
            },

            deleteBatchProductReview(){
                productRequest.deleteBatchProductReview(this);
            },

            // 查看商品评论
            checkProductReview (params) {
                this.reviewSearch.productId = params.row.id;
                this.initProductReviewList();
                this.productReviewModel = true;
            },

            /************************** 新增操作 **************************/

            // 新增商品
            insertProduct () {
                this.initInsertModel();
                this.insertModel = true;
            },

            // 初始化新增模态框数据
            initInsertModel () {
                this.insertProductItem = {
                    name: '',
                    image: '',
                    leasePrice: 0,
                    price: 0,
                    inventory: 0,
                    sale: 0,
                    description: '',
                    imageList: [],
                    classifyId: []
                };
                this.initImage();
            },

            // 新增模态框确认操作
            insertModelOk () {
                this.insertProductItem.image = this.imageUrl;
                productRequest.insertProductItem(this);
            },

            // 新增模态框取消操作
            insertModelCancel () {
                this.initInsertModel();
                this.insertModel = false;
            },

            // 上传图片事件（新增操作）
            insertUploadView (url) {
                this.previewImage = this.url + url;
                this.insertPreviewModel = true;
                this.insertModel = false;
            },
            insertUploadRemove (file) {
                this.insertProductItem.imageList.splice(this.insertProductItem.imageList.indexOf(file), 1);
            },
            insertUploadSuccess (rep) {
                if (rep.code === 200 && rep.result) {
                    this.insertProductItem.imageList.push({
                        url: rep.data.url
                    });
                    this.$Message.success('上传成功');
                } else {
                    this.$Message.error('上传失败');
                }
            },
            insertUploadFormatError (file) {
                this.$Notice.warning({
                    title: '文件格式错误',
                    desc: '文件 ' + file.name + ' 格式错误, 请选择 jpg 或者 png.'
                });
            },
            insertUploadMaxSize (file) {
                this.$Notice.warning({
                    title: '超过文件大小限制',
                    desc: '文件  ' + file.name + ' 不能超过2MB'
                });
            },
            insertBeforeUpload () {
                const check = this.insertProductItem.imageList.length < 5;
                if (!check) {
                    this.$Notice.warning({
                        title: '最多上传五张'
                    });
                }
                return check;
            },

            /************************** 编辑操作 **************************/

            // 编辑商品
            updateProduct (params) {
                this.updateProductItem = params.row;
                if(params.row.image != null && params.row.image != ''){
                    this.imageUrl = params.row.image;
                    this.haveImage = true;
                }
                this.updateModel = true;
            },

            // 编辑模态框确认操作
            updateModelOk () {
                this.updateProductItem.image = this.imageUrl;
                productRequest.updateProductItem(this);
            },

            // 编辑模态框取消操作
            updateModelCancel () {
                this.updateModel = false;
                this.updateProductItem = {};
                this.initImage();
            },

            // 上传图片事件（编辑操作）
            updateUploadView (url) {
                this.previewImage = this.url + url;
                this.previewModel = true;
                this.updateModel = false;
            },
            updateUploadRemove (file) {
                this.updateProductItem.imageList.splice(this.updateProductItem.imageList.indexOf(file), 1);
            },
            updateUploadSuccess (rep) {
                if (rep.code === 200 && rep.result) {
                    this.updateProductItem.imageList.push({
                        url: rep.data.url
                    });
                    this.$Message.success('上传成功');
                } else {
                    this.$Message.error('上传失败');
                }
            },
            updateUploadFormatError (file) {
                this.$Notice.warning({
                    title: '文件格式错误',
                    desc: '文件 ' + file.name + ' 格式错误, 请选择 jpg 或者 png.'
                });
            },
            updateUploadMaxSize (file) {
                this.$Notice.warning({
                    title: '超过文件大小限制',
                    desc: '文件  ' + file.name + ' 不能超过2MB'
                });
            },
            updateBeforeUpload () {
                const check = this.updateProductItem.imageList.length < 5;
                if (!check) {
                    this.$Notice.warning({
                        title: '最多上传五张'
                    });
                }
                return check;
            }
        },
        created () {
            this.initProductList();
        }
    };
</script>
