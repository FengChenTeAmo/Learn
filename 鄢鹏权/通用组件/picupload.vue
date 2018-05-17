<template>
    <div>
    <div class="upload-list" v-for="item in UploadList">
        <template v-if="item.url">
            <img :src="item.url">
            <div class="upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
            </div>
        </template>
        <template v-else>
            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
        </template>
    </div>
    <Upload
        ref="upload"
        :show-upload-list="false"
        :default-file-list="defaultList"
        :on-success="handleSuccess"
        :format="['jpg','jpeg','png','gif']"
        :max-size="4096"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        :before-upload="handleBeforeUpload"
        type="drag"
        :with-credentials="true"
        :action="UploadURL"
        style="display: inline-block;width:58px;">
        <div style="width: 58px;height:58px;line-height: 58px;">
            <Icon type="camera" size="20"></Icon>
        </div>
    </Upload>
    <Modal title="查看图片" v-model="visible">
        <img :src="img.url" v-if="visible" style="width: 100%">
    </Modal>
    </div>
</template>
<script lang="ts">
// template 组件使用文档 https://sunshineji.github.io/amaze-vue-docs/#/close
import Vue from "../vue";
import Component from "vue-class-component";
import { Getter, Action } from "vuex-class";
import { SearchResult, clone } from "../store/IFace";
import { Route } from "vue-router";
import { findIndex } from "lodash";
//TODO 导入搜索接口
//props的属性一般不需要再在类中进行初始化
@Component({
  props: {
    // demo:{
    //     type:String,
    //     default:()=>{return {}}
    // }
    value: {
      type: [Array],
      default: () => {
        return [];
      }
    },
    Code: {
      type: String,
      default:
        "31b66E6w6W6yuG3P1AQwNBBFgtEnVUcR/DB9StF8Uvz5m8bBjBUpeAOwRA6c3pI5bo0KMmvaVdgn29vvfwKL8"
    }
  },
  components: {}
})
//TODO 更改类名
export default class picupload extends Vue {
  value: any;
  img: any = { name: "", url: "" };
  visible = false;
  Code: string | any;
  get UploadURL() {
    return `http://r.tansuyun.cn/upload.php?m=${this.Code}`;
  }
  get UploadList() {
    return this.value;
  }
  handleView(name: any) {
    this.img = name;
    this.visible = true;
  }
  handleRemove(file: any) {
    let i: number = findIndex(this.value, { url: file.url });
    let p = clone(this.value);
    if (i > -1) p.splice(i, 1);
    this.$emit("input", p);
    this.$emit("remove", file);
  }
  handleSuccess(res: any, file: any) {
    console.log(res, file);
    switch (res.c) {
      case 200:
        res.d.forEach((d: any) => {
          (file.name = d.SaveName), (file.url = d.Domain);
          let p = clone(this.value);
          p.push({
            name: d.SaveName,
            url: d.Domain
          });
          this.$emit("input", p);
          this.$emit("add", {
            name: d.SaveName,
            url: d.Domain
          });
        });
        break;
      case 403:
        this.$Message.error("资源服务器拒绝请求，请确认是否有权限上传文件!");
        break;
      default:
        this.$Message.error("未知错误代码");
        break;
    }
  }
  handleFormatError(file: any) {
    this.$Notice.warning({
      title: "文件格式不支持",
      desc: "文件格式" + file.name + "错误"
    });
  }
  handleMaxSize(file: any) {
    this.$Notice.warning({
      title: "文件大小超标",
      desc: "" + file.name + "太大，请上传小于4M的文件"
    });
  }
  handleBeforeUpload() {
    return true;
  }
  mounted() {
    //组件被加载的时候触发
  }
  created() {
    // 组件被创建的时候触发
  }
  beforeRouteEnter(to: Route, from: Route, next: Function) {}
}
</script>
<style scoped>
.upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.upload-list img {
  width: 100%;
  height: 100%;
}
.upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.upload-list:hover .upload-list-cover {
  display: block;
}
.upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>
