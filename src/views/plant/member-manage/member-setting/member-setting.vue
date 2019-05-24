<style lang="less">
    @import "member-setting.less";
</style>

<template>
    <div class="member-setting">

        <!-- 会员成长值设置 -->
        <div class="title-panel">
            <div class="title">
                <span>会员成长值设置</span>
            </div>
            <div class="content">
                <Form :model="memberSetting" :label-width="110">
                    <FormItem label="会员成长系数：">
                        <Input v-model="memberSetting.growthProportion" placeholder="请输入" style="width: 300px"></Input>
                        <span class="remark">会员下单获取的成长值=实付金额*会员成长系数，系数越大会员获得的成长值越多，会员等级升级速度越快。</span>
                    </FormItem>

                    <FormItem label="评价获得成长值：">
                        <Input v-model="memberSetting.reviewGrowthValue" placeholder="请输入" style="width: 300px"></Input>
                        <span class="remark">会员评价一次且通过审核可以获得的成长值</span>
                    </FormItem>

                    <FormItem label="签到获得成长值：" v-if="false">
                        <Input v-model="memberSetting.checkGrowthValue" placeholder="请输入" style="width: 300px"></Input>
                        <span class="remark">会员签到一次可以获得的成长值</span>
                    </FormItem>
                </Form>
            </div>
            <div class="apply-button-position">
                <Button type="primary" class="apply-button" @click="apply()">应用</Button>
            </div>
        </div>

        <!-- 会员积分设置 -->
        <div class="title-panel">
            <div class="title">
                <span>会员积分设置</span>
            </div>
            <div class="content">
                <Form :model="memberSetting" :label-width="110">
                    <FormItem label="积分奖励系数：">
                        <Input v-model="memberSetting.integralProportion" placeholder="请输入"
                               style="width: 300px"></Input>
                        <span class="remark">会员下单获取的积分=实付金额*积分奖励系数，系数越大会员获得的积分越多</span>
                    </FormItem>

                    <FormItem label="评价获得积分：">
                        <Input v-model="memberSetting.reviewIntegralValue" placeholder="请输入"
                               style="width: 300px"></Input>
                        <span class="remark">会员评价一次且通过审核获得的积分</span>
                    </FormItem>

                    <FormItem label="签到获得积分：" v-if="false">
                        <Input v-model="memberSetting.checkIntegralValue" placeholder="请输入"
                               style="width: 300px"></Input>
                        <span class="remark">会员签到一次可以获得的积分</span>
                    </FormItem>

                    <FormItem label="积分抵现比例：">
                        <Input v-model="memberSetting.integralProportionCash" placeholder="请输入"
                               style="width: 300px"></Input>
                        <span class="remark">积分抵1元现金设置积分抵扣现金的比例，例如输入100则表示100个积分可以抵扣1元现金</span>
                    </FormItem>
                </Form>
            </div>
            <div class="apply-button-position">
                <Button type="primary" class="apply-button" @click="apply()">应用</Button>
            </div>
        </div>

        <!-- 会员等级设置 -->
        <div class="title-panel">
            <div class="title">
                <span>会员等级设置</span>
            </div>
            <div class="memberLevelContent">
                <Table :columns="memberLevelsColumns" border :data="memberLevelList"></Table>
            </div>
        </div>

        <!-- 会员等级设置弹出框 -->
        <Modal
                v-model="memberLevelModel"
                title="会员等级"
                @on-ok="modelOk"
                @on-cancel="modelCancel"
                :mask-closable="false"
                :loading="modelLoading">
            <div style="margin:0 auto;width: 340px">
                <Form :model="memberLevel" :label-width="110">
                    <FormItem label="会员等级名称：">
                        <Input v-model="memberLevel.name" placeholder="请输入"
                               style="width: 200px"></Input>
                    </FormItem>
                </Form>
                <Form :model="memberLevel" :label-width="110">
                    <FormItem label="会员等级：">
                        <Input v-model="memberLevel.level" placeholder="请输入"
                               style="width: 200px"></Input>
                    </FormItem>
                </Form>
                <Form :model="memberLevel" :label-width="110">
                    <FormItem label="会员成长左边界：">
                        <Input v-model="memberLevel.leftValue" placeholder="请输入"
                               style="width: 200px"></Input>
                    </FormItem>
                </Form>
                <Form :model="memberLevel" :label-width="110">
                    <FormItem label="会员成长右边界：">
                        <Input v-model="memberLevel.rightValue" placeholder="请输入"
                               style="width: 200px"></Input>
                    </FormItem>
                </Form>
                <Form :model="memberLevel" :label-width="110">
                    <FormItem label="会员折扣：">
                        <Input v-model="memberLevel.discount" placeholder="请输入"
                               style="width: 200px"></Input>
                    </FormItem>
                </Form>
            </div>
        </Modal>

    </div>
</template>

<script>
    import * as memberSettingRequest from '../../../../request/member-manage/member-setting';

    export default {
        name: 'member-setting',
        data () {
            return {

                // 会员体系设置
                memberSetting: {
                    checkGrowthValue: 0,
                    growthProportion: 0,
                    reviewGrowthValue: 0,
                    integralProportion: 0,
                    reviewIntegralValue: 0,
                    checkIntegralValue: 0,
                    integralProportionCash: 0,
                },

                // 会员等级表格参数
                memberLevelsColumns: [
                    {
                        align: 'center',
                        title: '会员等级',
                        key: 'level',
                    },
                    {
                        title: '会员名称',
                        align: 'center',
                        key: 'name',
                    },
                    {
                        title: '所需成长值',
                        align: 'center',
                        render: (h, params) => {
                            return h('span', {}, params.row.leftValue + '-' + params.row.rightValue);
                        }
                    },
                    {
                        title: '会员折扣',
                        align: 'center',
                        render: (h, params) => {
                            return h('span', {}, params.row.discount + '折');
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
                                        type: 'primary'
                                    },
                                    style: {
                                        width: '80px'
                                    },
                                    on: {
                                        click: () => {
                                            this.updateMemberLevel(params);
                                        }
                                    }
                                }, '编辑')
                            ]);
                        }
                    }
                ],

                // 会员等级列表
                memberLevelList: [],
                memberLevel: {
                    name: '',
                    level: 0,
                    leftValue: 0,
                    rightValue: 0,
                    discount: 0
                },

                // 会员等级模态框参数
                memberLevelModel: false,
                modelLoading: false
            };
        },
        methods: {

            // 初始化会员体系设置
            initMemberSetting () {
                memberSettingRequest.getMemberSetting(this);
                memberSettingRequest.getMemberLevelList(this);
            },

            // 应用按钮点击事件
            apply () {
                memberSettingRequest.updateMemberSetting(this);
            },

            // 修改会员等级模态框
            updateMemberLevel (params) {
                this.memberLevelModel = true;
                this.memberLevel = params.row;
            },

            // 模态框确认操作
            modelOk () {
                memberSettingRequest.updateMemberLevel(this);
            },

            // 模态框取消操作
            modelCancel () {
                this.memberLevelModel = false;
            }
        },
        created () {
            this.initMemberSetting();
        }
    };
</script>
