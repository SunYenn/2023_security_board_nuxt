<template>
  <el-row :gutter="20" style="height: calc(100vh - 350px); margin: 30px;">
    <el-col :span="12" :offset="6">
      <el-form label-width="100px" :model="form" @submit.native.prevent="board_c">
        <div class="board_insert">
          <div class="title">
            <h2>게시판 글쓰기</h2>
          </div>
          <div class="content">
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="제목">
                  <el-input v-model="form.title" ref="form_title" />
                </el-form-item>
                <el-form-item label="내용">
                  <el-input type="textarea" v-model="form.contents" ref="form_contents" height="200px" />
                </el-form-item>
                <el-form-item label="파일 첨부">
                  <el-upload ref="upload" :headers="{ 'accesstoken': token }" :action="uploadUrl" :limit="1"
                    :auto-upload="false" :on-change="beforeUpload" :on-success="onSuccess" :on-error="onError">
                    <el-button size="mini" type="info">Click to upload</el-button>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="board_footer">
          <el-button native-type="submit">저장</el-button>
          <el-button @click="backBtn">취소</el-button>
        </div>
      </el-form>
    </el-col>
  </el-row>
</template>
  
<script>
import axios from 'axios';
import { setHeader } from '@/utils/setHeader'

export default {
  data() {
    return {
      board: [],
      form: {
        title: '',
        contents: '',
        orifilename: null,
        realfilename: null
      },
      uploadUrl: '',
      fileList: [],
      file: null,
      token: null
    }
  },

  mounted() {
    this.token = setHeader();
    this.uploadUrl = this.$store.getters.getBackURL + "board/upload";
  },

  methods: {

    backBtn() {
      window.location.href = this.$store.getters.getFrontURL + 'boardList'
    },

    beforeUpload(file) {
      this.form.orifilename = file.name;
      return true;
    },

    onSuccess(response, file, fileList) {
      this.form.realfilename = response;
      this.insert();
      
    },

    onError(err, file, fileList) {
      console.error(err);
      this.$message.error('Failed to upload file.');
    },

    board_c() {

      if (this.form.title == '') {
        this.$message.error('제목을 입력해주세요.');
        this.$refs.form_title.focus();
        return
      } else if (this.form.contents == '') {
        this.$message.error('내용을 입력해주세요.');
        this.$refs.form_contents.focus();
        return
      }

      if(this.form.orifilename) this.$refs.upload.submit()
      else this.insert();
      
    },

    insert() {
      axios({
        method: 'post',
        url: this.$store.getters.getBackURL + 'board/insert',
        data: this.form
      }).then((response) => {
        this.$message.success('File uploaded successfully!');
        setTimeout(() => {
          window.location.href = this.$store.getters.getFrontURL + 'boardList';
        }, 500);
      }).catch((error) => {
        console.error(error);
        this.$message.error('Failel to insert board.');
      })
    }

  }
}

</script>
  
<style>
* {
  margin: 0;
}

.board_insert h2 {
  margin: 0;
  text-align: center;
}

.hit {
  float: right;
  display: flex;
  align-items: center;
}

.hit>img {
  margin-right: 5px;
}

.board_insert {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
  border-radius: 4px;
  border: 1px solid #EBEEF5;
  background-color: #FFF;
  overflow: hidden;
  color: #303133;
  transition: .3s;
  margin-bottom: 5px;
}

.board_insert>div {
  padding: 18px 20px;
  box-sizing: border-box;
  border-bottom: 1px solid #ebeef5;
}

.board_footer>.el-button {
  float: right;
  margin-left: 3px;
}

.board_insert .el-form-item__label {
  text-align: center;
}

.board_insert .el-form-item {
  margin-bottom: 5px;
}

.board_insert textarea.el-textarea__inner {
  height: 300px;
}
</style>