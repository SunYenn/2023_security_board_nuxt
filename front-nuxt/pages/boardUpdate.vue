<template>
    <el-row :gutter="20" style="height: calc(100vh - 350px); margin: 30px;">
      <el-col :span="12" :offset="6">
        <div class="board_update">
          <div class="title">
            <h2>글 수정하기</h2> <br>
          </div>
          <div class="content">
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form label-width="100px" :model="board">
                  <el-form-item label="제목">
                    <el-input v-model="board.title" />
                  </el-form-item>
                  <el-form-item label="내용">
                    <el-input type="textarea" v-model="board.contents" height="200px" />
                  </el-form-item>
                  <!-- <el-form-item label="파일 첨부">
                    <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/"
                      :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :limit="3"
                      :on-exceed="handleExceed" :file-list="fileList">
                      <el-button size="mini" type="info" >Click to upload</el-button>
                    </el-upload>
                  </el-form-item> -->
                </el-form>
              </el-col>
            </el-row>
          </div>
  
        </div>
        <div class="board_footer">
          <el-button @click="board_u">저장</el-button>
          <el-button @click="backBtn">취소</el-button>
        </div>
      </el-col>
    </el-row>
  </template>
  
  <script>
  import axios from 'axios';
  import { setHeader } from '@/utils/setHeader'
  
  export default {
    data() {
      return {
        board: {
          idx: '',
          title: '',
          contents: ''
        },
      }
    },
  
    mounted() {
  
      setHeader();
  
      axios({
        method: 'get',
        url: this.$store.getters.getBackURL + 'board/view/' + this.$route.query.idx
      }).then((response) => {
        this.board = response.data
      })
  
    },
  
    methods: {
      backBtn() {
        window.location.href = this.$store.getters.getFrontURL + 'boardList'
      },
      board_u() {
        axios({
          method: 'post',
          url: this.$store.getters.getBackURL + 'board/update',
          data: this.board
        }).then((response) => {
          window.location.href = this.$store.getters.getFrontURL + 'boardView?idx=' + this.board.idx
        }).catch((error) => {
          console.error(error);
        })
      }
    }
  }
  
  </script>
  
  <style>
  * {
    margin: 0;
  }
  
  .board_update h2 {
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
  
  .board_update {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    border-radius: 4px;
    border: 1px solid #EBEEF5;
    background-color: #FFF;
    overflow: hidden;
    color: #303133;
    transition: .3s;
    margin-bottom: 5px;
  }
  
  .board_update>div {
    padding: 18px 20px;
    box-sizing: border-box;
    border-bottom: 1px solid #ebeef5;
  }
  
  .board_footer>.el-button {
    float: right;
    margin-left: 3px;
  }
  
  .board_update .el-form-item__label {
    text-align: center;
  }
  
  .board_update .el-form-item {
    margin-bottom: 5px;
  }
  
  .board_update textarea.el-textarea__inner {
    height: 300px;
  }
  </style>