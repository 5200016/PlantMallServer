<style lang="less">
    @import "my-member.less";
</style>

<template>
    <div class="my-member">
        <div class="user-manage-menu">
            <!--用户手机号-->
            <Input v-model="phone" placeholder="手机号" class="search-user-phone"/>

            <!--查询按钮-->
            <Button class="queryButton" type="primary" @click="initUserList">查询</Button>
        </div>
        <div class="user-list">
            <Table :columns="userListColumns" border :data="userList" :loading="userListLoading"></Table>
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

        <Modal
                v-model="updateUserModel"
                title="设置养护计划"
                @on-ok="updateUserModelOk"
                @on-cancel="updateUserModelCancel"
                :mask-closable="false">
            <div>
                <Form :model="updateUserItem" :label-width="125">
                    <FormItem label="姓名：">
                        <Input v-model="updateUserItem.username"
                               placeholder="请输入"
                               style="width: 200px"></Input>
                    </FormItem>
                    <FormItem label="是否设置养护人员：">
                        <RadioGroup v-model="updateUserItem.setStatus">
                            <Radio :label="0">
                                <span>否</span>
                            </Radio>
                            <Radio :label="1">
                                <span>是</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                </Form>
            </div>
        </Modal>
    </div>
</template>

<script>
    import * as myMemberRequest from '../../../../request/member-manage/my-member';
    import {URL} from '../../../../request/config';

    export default {
        name: 'my-member',
        data(){
            return {
                url: URL + '/',

                // 手机号
                phone: '',

                // 用户列表
                userList: [],
                userListLoading: true,

                // 分页参数
                pageNum: 1,
                pageSize: 10,
                totalElements: 0,

                // 表格参数
                userListColumns : [
                    {
                        type: 'index',
                        align: 'center',
                        title: '序号',
                        render: (h, params) => {
                            return h('span', {}, params.index)
                        }
                    },
                    {
                        title: '身份',
                        align: 'center',
                        render: (h, params) => {
                            let status = 0;
                            if(params.row.maintenancePersonnelId !== null){
                                status = 1
                            }
                            return h('Tag', {
                                props: {
                                    color: status === 1 ? 'success' : 'primary'
                                }
                            }, status === 1 ? '养护人员' : '用户')
                        }
                    },
                    {
                        title: '头像',
                        align:'center',
                        key: 'avatar',
                        render: (h, params) => {
                            let avatarUrl = params.row.avatar;
                            if( avatarUrl !== '' && avatarUrl !== undefined && avatarUrl !== null){
                                avatarUrl = params.row.avatar;
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
                        title: '昵称',
                        align:'center',
                        key: 'nickname'
                    },
                    {
                        title: '姓名',
                        align:'center',
                        key: 'username'
                    },
                    {
                        title: '手机号',
                        align:'center',
                        key: 'phone'
                    },
                    {
                        title: '积分',
                        align:'center',
                        key: 'integral'
                    },
                    {
                        title: '成长值',
                        align:'center',
                        key: 'growthValue'
                    },
                    {
                        title: '会员等级',
                        align:'center',
                        key: 'memberLevel'
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
                                            this.updateUserInfo(params);
                                        }
                                    }
                                }, '编辑')
                            ]);
                        }
                    }
                ],

                // 编辑用户信息模态框
                updateUserModel: false,
                updateUserItem: {
                    id: null,
                    maintenancePersonnelId: null,
                    username: '',
                    setStatus: 0
                }
            }
        },
        methods: {

            // 查询用户信息
            initUserList(){
                myMemberRequest.getUserList(this);
            },

            // 分页事件
            changePage (index) {
                this.pageNum = index;
                this.initUserList();
            },
            changePageSize (val) {
                this.pageSize = val;
                this.pageNum = 1;
                this.initUserList();
            },

            updateUserInfo(params){
                this.updateUserModel = true;
                this.updateUserItem.id = params.row.id;
                this.updateUserItem.username = params.row.username;
                this.updateUserItem.maintenancePersonnelId = params.row.maintenancePersonnelId;
                if(params.row.maintenancePersonnelId !== null){
                    this.updateUserItem.setStatus = 1;
                }else {
                    this.updateUserItem.setStatus = 0;
                }
            },

            // 编辑用户信息模态框确认操作
            updateUserModelOk () {
                myMemberRequest.updateUser(this);
            },

            // 编辑用户信息模态框取消操作
            updateUserModelCancel () {
                this.updateUserModel = false;
            },
        },
        created () {
            this.initUserList(this);
        }
    };
</script>
