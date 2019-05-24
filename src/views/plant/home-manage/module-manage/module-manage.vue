<style lang="less">
    @import "module-manage";
</style>

<template>
    <div class="module-manage">
        <Button class="add-button" type="primary" @click="insertModule">新增模块</Button>

        <!-- 模块列表 -->
        <div class="module-list">
            <Table :columns="moduleListColumns" border :data="moduleList" :loading="moduleLoading"></Table>
        </div>

        <!-- 新增模块模态框 -->
        <Modal
                v-model="insertModuleModel"
                title="新增模块"
                width="50%"
                @on-ok="insertModelOk"
                @on-cancel="insertModelCancel"
                :mask-closable="false"
                :loading="insertModelLoading">
            <div>
                <Form :model="insertModuleItem" :label-width="110">
                    <Row>
                        <Col span="12">
                            <FormItem label="模块图标：">
                                <Upload
                                        multiple
                                        style="width: 150px"
                                        ref="upload"
                                        type="drag"
                                        :format="['jpg','jpeg','png']"
                                        :on-format-error="handleFormatError"
                                        :on-success="insertUploadIcon"
                                        :action="uploadUrl"
                                        :show-upload-list="false"
                                        name="file">
                                    <div style="height: 150px;width: 150px;">
                                        <div v-if="!haveIcon">
                                            <Icon type="ios-cloud-upload" size="50"
                                                  style="color: #3399ff; margin-top: 32px"></Icon>
                                            <p>点击或拖拽图片上传</p>
                                        </div>
                                        <img v-bind:src="url + insertModuleItem.icon" class="module-icon" v-if="haveIcon"/>

                                    </div>
                                </Upload>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <Row>
                                <FormItem label="模块名称：">
                                    <Input v-model="insertModuleItem.name"
                                           placeholder="请输入"
                                           style="width: 200px"></Input>
                                </FormItem>
                            </Row>
                            <Row>
                                <FormItem label="目标链接：">
                                    <Cascader :data="moduleTypeCascade"
                                              v-model="insertModuleItem.typeList"
                                              style="width: 200px"
                                              @on-change="cascadeChange">
                                    </Cascader>
                                </FormItem>
                            </Row>
                            <Row>
                                <FormItem label="排序等级：">
                                    <Input v-model="insertModuleItem.sort"
                                           placeholder="请输入"
                                           style="width: 200px"></Input>
                                </FormItem>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem label="大图显示：">
                                <RadioGroup v-model="insertModuleItem.imageDisable">
                                    <Radio :label="0">
                                        <span>否</span>
                                    </Radio>
                                    <Radio :label="1">
                                        <span>是</span>
                                    </Radio>
                                </RadioGroup>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="首页菜单显示：">
                                <RadioGroup v-model="insertModuleItem.homeMenu">
                                    <Radio :label="0">
                                        <span>否</span>
                                    </Radio>
                                    <Radio :label="1">
                                        <span>是</span>
                                    </Radio>
                                </RadioGroup>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem label="内容排列：">
                                <RadioGroup v-model="insertModuleItem.styleType">
                                    <Radio :label="0">
                                        <span>纵向排列</span>
                                    </Radio>
                                    <Radio :label="1">
                                        <span>横向排列</span>
                                    </Radio>
                                </RadioGroup>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="首页底部显示：">
                                <RadioGroup v-model="insertModuleItem.homeBottom">
                                    <Radio :label="0">
                                        <span>否</span>
                                    </Radio>
                                    <Radio :label="1">
                                        <span>是</span>
                                    </Radio>
                                </RadioGroup>
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem label="模块大图：">
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
                                    <Icon type="ios-cloud-upload" size="88"
                                          style="color: #3399ff;margin-top: 40px"></Icon>
                                    <p>点击或拖拽图片上传</p>
                                </div>
                                <img v-bind:src="url + insertModuleItem.image" class="module-image" v-if="haveImage"/>

                            </div>
                        </Upload>
                    </FormItem>
                </Form>
            </div>
        </Modal>

        <!-- 编辑模块模态框 -->
        <Modal
                v-model="updateModuleModel"
                title="编辑模块"
                @on-ok="updateModelOk"
                @on-cancel="updateModelCancel"
                :mask-closable="false"
                width="50%"
                :loading="updateModelLoading">
            <div>
                <Form :model="updateModuleItem" :label-width="110">
                    <Row>
                        <Col span="12">
                            <FormItem label="模块图标：">
                                <Upload
                                        multiple
                                        style="width: 150px"
                                        ref="upload"
                                        type="drag"
                                        :format="['jpg','jpeg','png']"
                                        :on-format-error="handleFormatError"
                                        :on-success="updateUploadIcon"
                                        :action="uploadUrl"
                                        :show-upload-list="false"
                                        name="file">
                                    <div style="height: 150px;width: 150px;">
                                        <div v-if="!haveIcon">
                                            <Icon type="ios-cloud-upload" size="50"
                                                  style="color: #3399ff; margin-top: 32px"></Icon>
                                            <p>点击或拖拽图片上传</p>
                                        </div>
                                        <img v-bind:src="url + updateModuleItem.icon" class="module-icon" v-if="haveIcon"/>

                                    </div>
                                </Upload>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <Row>
                                <FormItem label="模块名称：">
                                    <Input v-model="updateModuleItem.name"
                                           placeholder="请输入"
                                           style="width: 200px"></Input>
                                </FormItem>
                            </Row>
                            <Row>
                                <FormItem label="目标链接：">
                                    <Cascader :data="moduleTypeCascade"
                                              v-model="updateModuleItem.typeList"
                                              style="width: 200px"
                                              @on-change="cascadeChange">
                                    </Cascader>
                                </FormItem>
                            </Row>
                            <Row>
                                <FormItem label="排序等级：">
                                    <Input v-model="updateModuleItem.sort"
                                           placeholder="请输入"
                                           style="width: 200px"></Input>
                                </FormItem>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem label="大图显示：">
                                <RadioGroup v-model="updateModuleItem.imageDisable">
                                    <Radio :label="0">
                                        <span>否</span>
                                    </Radio>
                                    <Radio :label="1">
                                        <span>是</span>
                                    </Radio>
                                </RadioGroup>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="首页菜单显示：">
                                <RadioGroup v-model="updateModuleItem.homeMenu">
                                    <Radio :label="0">
                                        <span>否</span>
                                    </Radio>
                                    <Radio :label="1">
                                        <span>是</span>
                                    </Radio>
                                </RadioGroup>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem label="内容排列：">
                                <RadioGroup v-model="updateModuleItem.styleType">
                                    <Radio :label="0">
                                        <span>纵向排列</span>
                                    </Radio>
                                    <Radio :label="1">
                                        <span>横向排列</span>
                                    </Radio>
                                </RadioGroup>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="首页底部显示：">
                                <RadioGroup v-model="updateModuleItem.homeBottom">
                                    <Radio :label="0">
                                        <span>否</span>
                                    </Radio>
                                    <Radio :label="1">
                                        <span>是</span>
                                    </Radio>
                                </RadioGroup>
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem label="模块大图：">
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
                                    <Icon type="ios-cloud-upload" size="88"
                                          style="color: #3399ff;margin-top: 40px"></Icon>
                                    <p>点击或拖拽图片上传</p>
                                </div>
                                <img v-bind:src="url + updateModuleItem.image" class="module-image" v-if="haveImage"/>

                            </div>
                        </Upload>
                    </FormItem>
                </Form>
            </div>
        </Modal>
    </div>
</template>

<script>
    import * as moduleRequest from '../../../../request/home-manage/module-manage';
    import {isEmpty} from '../../../../libs/ObjFun';
    import {BASE_URL, URL} from '../../../../request/config';

    export default {
        name: 'module-manage',
        data () {
            return {
                // 删除id
                deleteId: 0,

                // 图片上传参数
                url: URL + '/',
                uploadUrl: BASE_URL + '/file/module_image',
                haveImage: false,
                haveIcon: false,

                // 模块列表
                moduleList: [],
                moduleLoading: true,

                // 模块表格参数
                moduleListColumns: [
                    {
                        type: 'index',
                        align: 'center',
                        title: '序号',
                        render: (h, params) => {
                            return h('span', {}, params.index);
                        }
                    },
                    {
                        title: '排序等级',
                        align: 'center',
                        key: 'sort'
                    },
                    {
                        title: '图标',
                        align: 'center',
                        key: 'icon',
                        render: (h, params) => {
                            let icon = params.row.icon;
                            if (!isEmpty(icon)) {
                                icon = this.url + params.row.icon;
                            }
                            return h('Avatar', {
                                props: {
                                    src: icon,
                                    size: 'large'
                                }
                            });
                        }
                    },
                    {
                        title: '名称',
                        align: 'center',
                        key: 'name'
                    },
                    {
                        title: '大图显示',
                        align: 'center',
                        key: 'imageDisable',
                        render: (h, params) => {
                            let imageDisable = '';
                            switch (params.row.imageDisable) {
                                case 0:
                                    imageDisable = '否';
                                    break;
                                case 1:
                                    imageDisable = '是';
                                    break;
                            }
                            return h('span', {}, imageDisable);
                        }
                    },
                    {
                        title: '首页菜单显示',
                        align: 'center',
                        key: 'homeMenu',
                        render: (h, params) => {
                            let homeMenu = '';
                            switch (params.row.homeMenu) {
                                case 0:
                                    homeMenu = '否';
                                    break;
                                case 1:
                                    homeMenu = '是';
                                    break;
                            }
                            return h('span', {}, homeMenu);
                        }
                    },
                    {
                        title: '首页底部显示',
                        align: 'center',
                        key: 'homeBottom',
                        render: (h, params) => {
                            let homeBottom = '';
                            switch (params.row.homeBottom) {
                                case 0:
                                    homeBottom = '否';
                                    break;
                                case 1:
                                    homeBottom = '是';
                                    break;
                            }
                            return h('span', {}, homeBottom);
                        }
                    },
                    {
                        title: '内容排列',
                        align: 'center',
                        key: 'styleType',
                        render: (h, params) => {
                            let styleType = '';
                            switch (params.row.styleType) {
                                case 0:
                                    styleType = '纵向排列';
                                    break;
                                case 1:
                                    styleType = '横向排列';
                                    break;
                            }
                            return h('span', {}, styleType);
                        }
                    },
                    {
                        title: '目标链接',
                        align: 'center',
                        key: 'type',
                        render: (h, params) => {
                            let result = '';
                            if (!isEmpty(params.row.type)) {
                                switch (params.row.type) {
                                    case 0:
                                        if(!isEmpty(params.row.classify)){
                                            result = params.row.classify.name;

                                        }else {
                                            result = '';
                                        }
                                        break;
                                    case 1:
                                        result = '预约服务';
                                        break;
                                    case 2:
                                        result = '植物志';
                                        break;
                                }
                            }
                            return h('span', {}, result);
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 175,
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
                                            this.updateModule(params);
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
                                                    moduleRequest.deleteModuleItem(this);
                                                }
                                            });
                                        }
                                    }
                                }, '删除'),
                            ]);
                        }
                    }
                ],

                // 新增模块模态框参数
                insertModuleModel: false,
                insertModelLoading: false,
                insertModuleItem: {},

                // 编辑模块模态框参数
                updateModuleModel: false,
                updateModelLoading: false,
                updateModuleItem: {},

                // 级联选择器参数
                moduleTypeCascade: [
                    {
                        value: 0,
                        label: '商品分类',
                        children: []
                    },
                    {
                        value: 1,
                        label: '预约服务',
                        children: []
                    },
                    {
                        value: 2,
                        label: '植物志',
                        children: []
                    }
                ]
            };
        },
        methods: {

            // 初始化模块列表
            initModuleList () {
                moduleRequest.getModuleList(this);
                moduleRequest.getClassifyCascade(this);
            },

            initInsertModuleItem () {
                this.insertModuleItem = {
                    name: '',
                    icon: '',
                    image: '',
                    imageDisable: 0,
                    typeList: [],
                    styleType: 0,
                    homeMenu: 0,
                    homeBottom: 0,
                    sort: 1
                };
                this.haveImage = false;
                this.haveIcon = false;
            },

            initUpdateModuleItem () {
                this.insertModuleItem = {
                    name: '',
                    icon: '',
                    image: '',
                    imageDisable: 0,
                    typeList: [],
                    styleType: 0,
                    homeMenu: 0,
                    homeBottom: 0,
                    sort: 1
                };
                this.haveImage = false;
                this.haveIcon = false;
            },

            // 新增模块
            insertModule () {
                this.initInsertModuleItem();
                this.insertModuleModel = true;
            },

            // 新增模态框确认操作
            insertModelOk () {
                moduleRequest.insertModuleItem(this);
            },

            // 新增模态框取消操作
            insertModelCancel () {
                this.insertModuleModel = false;
            },

            // 编辑模块
            updateModule (params) {
                this.updateModuleItem = params.row;
                if (params.row.image !== null && params.row.image !== '') {
                    this.haveImage = true;
                }
                if (params.row.icon !== null && params.row.icon !== '') {
                    this.haveIcon = true;
                }
                this.updateModuleModel = true;
            },

            // 编辑模态框确认操作
            updateModelOk () {
                moduleRequest.updateModuleItem(this);
            },

            // 编辑模态框取消操作
            updateModelCancel () {
                this.initUpdateModuleItem();
                this.updateModuleModel = false;
            },

            // 级联选择器变化事件
            cascadeChange () {
            },

            // 上传图片事件
            handleFormatError () {
                this.$Message.error('文件类型不被支持');
            },
            insertUploadImage (rep) {
                if (rep.code == 200 && rep.result) {
                    this.$Message.success('上传成功');
                    this.insertModuleItem.image = rep.data.url;
                    this.haveImage = true;
                } else {
                    this.$Message.error('上传失败');
                }
            },
            insertUploadIcon (rep) {
                if (rep.code == 200 && rep.result) {
                    this.$Message.success('上传成功');
                    this.insertModuleItem.icon = rep.data.url;
                    this.haveIcon = true;
                } else {
                    this.$Message.error('上传失败');
                }
            },
            updateUploadImage (rep) {
                if (rep.code == 200 && rep.result) {
                    this.$Message.success('上传成功');
                    this.updateModuleItem.image = rep.data.url;
                    this.haveImage = true;
                } else {
                    this.$Message.error('上传失败');
                }
            },
            updateUploadIcon (rep) {
                if (rep.code == 200 && rep.result) {
                    this.$Message.success('上传成功');
                    this.updateModuleItem.icon = rep.data.url;
                    this.haveIcon = true;
                } else {
                    this.$Message.error('上传失败');
                }
            }
        },
        created () {
            this.initModuleList();
        }
    };
</script>
