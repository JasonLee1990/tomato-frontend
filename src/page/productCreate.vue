<template>
  <div>
    <head-top></head-top>
    <el-row style="margin-top: 20px;">
      <el-col :span="16" :offset="4">
        <el-form
          :model="formData"
          :rules="rules"
          ref="formData"
          label-width="110px"
          class="demo-formData"
        >
          <el-form-item label="商品名称" prop="productName">
            <el-input v-model="formData.productName"></el-input>
          </el-form-item>
          <el-form-item label="商品售价" prop="salePrice">
            <el-input-number
              v-model="formData.salePrice"
              :precision="2"
              :min="1"
              :step="2"
              :max="1000"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="公开内容" prop="pubContent" class="editor-item">
            <quill-editor
              v-model="formData.pubContent"
              ref="pubContentQuillEditor"
              class="editor"
              @ready="onEditorReady($event)"
            ></quill-editor>
          </el-form-item>
          <el-form-item label="收费内容" prop="chargedContent" class="editor-item">
            <quill-editor
              v-model="formData.chargedContent"
              ref="chargedContentQuillEditor"
              class="editor"
              @ready="onEditorReady($event)"
            ></quill-editor>
          </el-form-item>
          <el-form-item label="附件链接" prop="attachedUrl">
            <el-input v-model="formData.attachedUrl"></el-input>
          </el-form-item>
          <el-form-item class="button_submit">
            <el-button type="primary" @click="submitForm('formData')">立即创建</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import headTop from "@/components/headTop";
import { quillEditor } from "vue-quill-editor";
import { productCreate } from "@/api/getData";
export default {
  data() {
    return {
      city: {},
      formData: {
        productName: "",
        salePrice: 1, //地址
        pubContent: "",
        chargedContent: "",
        attachedUrl: ""
      },
      rules: {
        productName: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        chargedContent: [
          { required: true, message: "请输入收费内容", trigger: "blur" }
        ]
      }
    };
  },
  components: {
    headTop,
    quillEditor
  },
  activated() {
    this.initData();
  },
  computed: {
    // editor() {
    //   return this.$refs.pubContentQuillEditor.quill;
    // }
  },
  methods: {
    onEditorReady(editor) {
      console.log("editor ready!", editor);
    },
    initData() {
      this.formData = {
        productName: "",
        salePrice: 1, //地址
        pubContent: "",
        chargedContent: "",
        attachedUrl: ""
      };
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let result = await productCreate(this.formData);
          if (result.successful) {
            this.$message({
              type: "success",
              message: `商品【${this.formData.productName}】创建成功`
            });
            this.$router.push("/productList");
          }
        } else {
          this.$notify.error({
            title: "错误",
            message: "请检查输入是否正确",
            offset: 100
          });
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less">
@import "../style/mixin";
.button_submit {
  text-align: center;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
.el-table .info-row {
  background: #c9e5f5;
}

.el-table .positive-row {
  background: #e2f0e4;
}
.editor-item {
  min-height: 200px;
}
.editor {
  height: 100%;
}
</style>
