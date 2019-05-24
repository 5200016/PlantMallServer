<style lang="less">
    @import 'mall-service';
</style>

<template>
    <div class="mall-service">
        <!-- 商城客服设置 -->
        <div class="title-panel">
            <div class="title">
                <span>商城客服设置</span>
            </div>
            <div class="content">
                <Form :model="serviceSetting" :label-width="110">
                    <FormItem label="客服电话：">
                        <Input v-model="serviceSetting.phone" placeholder="请输入" style="width: 300px"></Input>
                    </FormItem>

                    <FormItem label="邮箱：">
                        <Input v-model="serviceSetting.email" placeholder="请输入" style="width: 300px"></Input>
                    </FormItem>

                    <FormItem label="公司地址：">
                        <Input v-model="serviceSetting.address" placeholder="请输入" style="width: 300px"></Input>
                    </FormItem>
                </Form>
            </div>
            <div class="apply-button-position">
                <Button type="primary" class="apply-button" @click="apply">应用</Button>
            </div>
        </div>
    </div>
</template>

<script>
    import * as serviceRequest from '../../../../request/mall-manage/mall-service'
    export default {
        name: 'mall-service',
        data() {
            return {
                // 客服资料设置
                serviceSetting: {
                    phone: '',
                    address: '',
                    email: ''
                }
            }
        },
        methods: {
            apply(){
                serviceRequest.updateServiceSetting(this);
            },

            initServiceSetting(){
                serviceRequest.getServiceSetting(this);
            }
        },
        created (){
            this.initServiceSetting();
        }
    };
</script>


