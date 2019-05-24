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
                                            // this.$onClickUpdateUserInfo(params);
                                        }
                                    }
                                }, '编辑')
                            ]);
                        }
                    }
                ],
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
                this.pageSize = val
                this.pageNum = 1
                this.initUserList();
            }
        },
        created () {
            this.initUserList(this);
        }
    };
</script>
