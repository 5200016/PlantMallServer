<template>
    <div class="editor-content">
        <Row class="upload-text-image">
            <Col span="12" offset="4">
            <Upload
                    id="iviewUp"
                    ref="upload"
                    multiple
                    type="drag"
                    :on-success="$onClickRichTextImage"
                    :action="upload_url"
                    name="myfile">
                <div style="padding: 0 0;height: 200px">
                    <div style="padding: 60px 0px;">
                        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                        <p>点击或将图片拖拽到这里上传</p>
                    </div>
                    <!--<img v-bind:src="imageUrl" class="s_fileShow" v-if="haveImage"/>-->
                </div>
            </Upload>
            </Col>
        </Row>
        <Row>
            <vue-editor style=" white-space: pre-wrap; background-color: white;" @change="onEditorChange($event)" v-model="typeContent" :options="editorSettings" ref="myQuillEditor"></vue-editor>
        </Row>
    </div>
</template>

<script>
    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import 'quill/dist/quill.bubble.css'
    import {BASE_URL, URL} from '../../request/config';
    import {quillEditor , Quill} from 'vue-quill-editor'
    import ImageResize from 'quill-image-resize-module'
    Quill.register('modules/imageResize', ImageResize)
    export default {
        name: "",
        components: {
            'vue-editor': quillEditor
        },
        props:{
            contents:{
                type: String
            }
        },
        data(){
            return{
                editorSettings: {
                    modules: {
                        imageResize: {},
                        toolbar: {
                            container: [
                                ['bold', 'italic', 'underline', 'strike'],
                                ['blockquote', 'code-block'],
                                [{'header': 1}, {'header': 2}],
                                [{'list': 'ordered'}, {'list': 'bullet'}],
                                [{'script': 'sub'}, {'script': 'super'}],
                                [{'indent': '-1'}, {'indent': '+1'}],
                                [{'direction': 'rtl'}],
                                [{'size': ['small', false, 'large', 'huge']}],
                                [{'header': [1, 2, 3, 4, 5, 6, false]}],
                                [{'font': []}],
                                [{'color': []}, {'background': []}],
                                [{'align': []}],
                                ['clean'],
                                ['link', 'image', 'video']
                            ],
                            handlers: {
                                'image': function (value) {
                                    if (value) {
                                        document.querySelector('#iviewUp input').click()
                                    } else {
                                        this.quill.format('image', false);
                                    }
                                }
                            }
                        }
                    },
                    placeholder: '请编辑...'
                },
                upload_url: BASE_URL + 'permit/upload/image',//头像url,
                imageUrl: '',
                typeContent: '',
                haveImage: false
            }
        },
        watch:{
            contents(){
                this.typeContent = this.contents;
            }
        },
        methods:{
            //插入图片到富文本
            $onClickRichTextImage(rep) {
                // 获取富文本组件实例
                let vm = this
                let quill = this.$refs.myQuillEditor.quill
                if (rep.code == 200 && rep.result) {
                    let avatarUrl = URL + rep.data.url;

                    // 获取光标所在位置
                    let length = quill.getSelection().index;
                    // 插入图片  res.info为服务器返回的图片地址
                    quill.insertEmbed(length, 'image', avatarUrl)
                    // 调整光标到最后
                    quill.setSelection(length + 1)

                    this.$Message.success('上传成功');
                    this.imageUrl = avatarUrl;
                    this.haveImage = true;
                } else {
                    this.$Message.error('上传失败')
                }
            },
            onEditorChange({ quill, html, text }) {
                this.$emit("contentChange",html)
            }
        }
    }
</script>

<style scoped>
    .editor-content {
       /* position: absolute;
        top: 9px;
        bottom: 9px;*/
        background: #FFF;
        /*padding: 15px 20px 0 20px;*/
    }
    .upload-text-image{
        position: absolute;
        z-index: -100;
    }
</style>