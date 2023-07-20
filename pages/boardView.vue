<template>
    <el-row :gutter="20" style="height: calc(100vh - 350px); margin: 30px;">
      <el-col :span="12" :offset="6">
        <div class="board_view">
  
          <div class="title">
            <h2>제목 : {{ board.title }}</h2> <br>
            <el-row :gutter="20">
              <el-col :span="18">
                <span>{{ board.nickname }}, {{ board.writedate }}</span>
              </el-col>
              <el-col :span="6">
                <span class="views">
                  <img :src="require('../assets/images/eye.png')" width="20px" /><span>{{ board.views }}</span>
                </span>
              </el-col>
            </el-row>
          </div>
  
          <div class="content">
            <div class="main" v-html="replaceEnter(board.contents)"></div>
            <div class="attach">
              <el-button type="text" v-if="board.orifilename != null" @click="downloadFile">
                {{ board.orifilename }}
              </el-button>
            </div>
          </div>
  
          <div class="comment_c">
            <el-form ref="form" :model="form" label-width="50px" @submit.native.prevent="comment_c">
              <el-input placeholder="댓글을 입력해주세요." v-model="form.contents">
                <el-button slot="append" native-type="comment_c">등록하기</el-button>
              </el-input>
            </el-form>
          </div>
  
          <div v-if="cmt_length != 0" class="comment_r">
            <el-menu default-active="2" class="el-menu-vertical-demo">
              <el-submenu index="1">
                
                <template slot="title">
                  <span>댓글 창</span>
                </template>
  
                <!-- comment_list 반복문 -->
                <div class="comment_list" v-for="(item, index) in board.commentList" :key="index"
                  :style="getStyle(item.step * 15)">
                  <div>
                    <div>
                      <img :src="require('../assets/images/arrow.png')" width="15px" height="15px" />
                    </div>
                    <div style="margin-left: 5px; width: calc(100% - 15px);" :id="getid(item.idx)">
                      <div style="min-height: 27px;">
                        <span>{{ item.nickname }}</span>
                        <span class="comment_date">{{ item.writedate }}</span>
                        <span style="float: right;">
                          <el-popover placement="right" width="100" trigger="click">
                            <el-button size="mini" @click="update_cmt(item.idx)">수정</el-button>
                            <el-button v-if="item.status == 0" size="mini" @click="delete_cmt(item.idx)">삭제</el-button>
                            <el-button v-else size="mini" @click="restore_cmt(item.idx)">복구</el-button>
                            <el-button v-if="item.nickname == login_nickname" type="text" slot="reference" style="padding: 0;">
                              <i class="el-icon-circle-plus-outline" />
                            </el-button>
                          </el-popover>
                        </span>
                      </div>

                      <div class="cocmt_btn">
                        <span v-if="item.status == 0" v-html="replaceEnter(item.contents)"></span>
                        <span v-else>삭제된 댓글입니다.</span>
                        <el-button class="minimini open_cocmt_c" round style="float: right;"
                          @click="toggleCocmt(item.idx, 'open')">댓글</el-button>
                        <el-button class="minimini close_cocmt_c" round style="float: right; display: none;"
                          @click="toggleCocmt(item.idx, 'close')">댓글</el-button>
                      </div>

                      <!-- 대댓글 폼 -->
                      <div class="cocmt_c" style="display: none; margin: 10px 25px 10px 10px;">
                        <el-form :model="cocmt" @submit.native.prevent="cocmt_c(item.idx, item.gup, item.seq, item.step)">
                          <el-input placeholder="대댓글을 입력해주세요." size="mini" v-model="cocmt.contents">
                            <el-button slot="append" native-type="cocmt_c" size="mini">등록</el-button>
                          </el-input>
                        </el-form>
                      </div>
  
                    </div>
                  </div>
                </div>
  
              </el-submenu>
            </el-menu>
          </div>

        </div>
        <div class="board_footer">
          <el-button @click="backBtn">목록</el-button>
          <el-button v-if="board.nickname == login_nickname" @click="move_board_u">수정</el-button>
          <el-button v-if="board.nickname == login_nickname" @click="deleteBtn">삭제</el-button>
        </div>
      </el-col>
    </el-row>
  </template>
  
  <script>
  import axios from 'axios';
  import moment from 'moment';
  import { setHeader } from '@/utils/setHeader'
  
  export default {
    data() {
      return {
        login_nickname: '',
        board: [],
        cmt_length: '',
        form: {
          board_idx: '',
          contents: '',
          step: 1
        },
        cocmt: {
          board_idx: '',
          contents: '',
          gup: 1,
          seq: 0,
          step: 1
        },
      }
    },
  
    mounted() {
      setHeader();
      this.login_nickname = this.$store.getters.getNickname;
      this.getBoardView()
    },
  
    methods: {
      getStyle(padding) {
        return 'padding-left : ' + padding + 'px';
      },
  
      replaceEnter(text) {
        return text ? text.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>') : '';
      },
  
      deleteBtn() {
        this.$confirm('삭제하시겠습니까?', 'Warning', {
          confirmButtonText: '삭제',
          cancelButtonText: '취소',
          type: 'warning',
          center: true
        }).then(() => {
          axios.get(this.$store.getters.getBackURL + `board/delete/${this.$route.query.idx}`)
          window.location.href = this.$store.getters.getFrontURL + 'boardList'
        }).catch(() => {
          this.$message({
            message: '댓글 삭제에 실패했습니다.',
            type: 'warning'
          });
        });
      },
  
      backBtn() {
        window.location.href = this.$store.getters.getFrontURL + 'boardList'
      },
  
      move_board_u() {
        window.location.href = this.$store.getters.getFrontURL + `boardUpdate?idx=${this.$route.query.idx}`
      },
  
      comment_c() {
        this.form.contents.replace(/ /g, '%20').replace(/</g, '%3C').replace(/>/g, '%3E').replace(/\n/g, '%0a');
        axios({
          method: 'post',
          url: this.$store.getters.getBackURL + `board/comment/insert`,
          data: this.form
        }).then((response) => {
          this.getBoardView()
          this.form.contents = ''
        })
      },
  
      getBoardView() {
        axios.get(this.$store.getters.getBackURL + `board/view/${this.$route.query.idx}`)
          .then((response) => {
            this.board = response.data;
            this.form.board_idx = response.data.idx;
            this.cocmt.board_idx = response.data.idx;
            this.cmt_length = response.data.commentList.length;
            for (const comment of this.board.commentList) {
              comment.writedate = moment.utc(comment.writedate).utcOffset(9).format('YYYY-MM-DD HH:mm:ss');
            }
          }).catch((error) => {
            this.$message.error('잘못된 접근입니다.');
            setTimeout(() => {
              this.backBtn();
            }, 500);
          })
      },
  
      downloadFile() {
        axios({
          url: this.$store.getters.getBackURL + 'board/download',
          method: 'POST',
          responseType: 'blob', // 다운로드 받을 파일의 형식이 바이너리임을 명시
          data: {
            fileName: this.board.realfilename
          }
        }).then(response => {
          console.log(response.data)
          console.log(new Blob([response.data]))
          // 다운로드 요청이 성공하면 파일 다운로드 시작
          // 서버에서 받은 response.data를 사용하여 Blob 객체(파일 데이터) 생성
          const url = window.URL.createObjectURL(new Blob([response.data]));
          // 파일을 다운로드하기 위한 링크 생성
          const link = document.createElement('a');
          link.href = url;
          // 링크의 download 속성을 설정하여 파일의 원본 이름 지정
          link.setAttribute('download', this.board.orifilename);
          document.body.appendChild(link);
          // 링크를 클릭하여 파일 다운로드 시작
          link.click();
        }).catch(error => {
          this.$message.error('삭제된 파일입니다.');
        });
      },
  
      update_cmt(idx) {
        this.$prompt('수정할 내용을 입력해주세요.', ' ', {
          confirmButtonText: '제출',
          cancelButtonText: '취소',
        }).then(({ value }) => {
          value.replace(/ /g, '%20').replace(/</g, '%3C').replace(/>/g, '%3E').replace(/\n/g, '%0a');
          this.form.contents = value;
          this.form.idx = idx,
            axios({
              method: 'post',
              url: this.$store.getters.getBackURL + `board/comment/update`,
              data: this.form
            }).then((response) => {
              this.getBoardView()
              this.form.contents = ''
            })
        }).catch(() => {
          this.$message.info('수정이 취소됐습니다.');
        });
      },
  
      delete_cmt(idx) {
        this.$confirm('댓글을 삭제하시겠습니까?', 'Warning', {
          confirmButtonText: '삭제',
          cancelButtonText: '취소',
          type: 'warning'
        }).then(() => {
          axios({
            method: 'post',
            url: this.$store.getters.getBackURL + `board/comment/delete/${idx}`,
          }).then((response) => {
            this.getBoardView()
            this.form.contents = ''
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '삭제가 취소됐습니다.'
          });
        });
      },
  
      restore_cmt(idx) {
        this.$confirm('댓글을 복구하시겠습니까?', 'Warning', {
          confirmButtonText: '복구',
          cancelButtonText: '취소',
          type: 'warning'
        }).then(() => {
          axios({
            method: 'post',
            url: this.$store.getters.getBackURL + `board/comment/restore/${idx}`,
          }).then((response) => {
            this.getBoardView()
            this.form.contents = ''
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '복구가 취소됐습니다.'
          });
        });
      },
  
      getid(idx) {
        return "add_point_" + idx;
      },
  
      toggleCocmt(idx, display) {
  
        const elDocument = document.getElementById("add_point_" + idx);
        const elDiv = elDocument.getElementsByClassName("cocmt_c")[0];
        const elOpenBtn = elDocument.getElementsByClassName("open_cocmt_c")[0];
        const elCloseBtn = elDocument.getElementsByClassName("close_cocmt_c")[0];
  
        if (display === 'open') {
          var x = document.getElementsByClassName("cocmt_c");
          for (var i = 0; i < x.length; i++) {
            x[i].style.display = 'none';
          }
        }
  
        elDiv.style.display = display === 'open' ? '' : 'none';
        elOpenBtn.style.display = display === 'open' ? 'none' : '';
        elCloseBtn.style.display = display === 'open' ? '' : 'none';
      },
  
      cocmt_c(idx, gup, seq, step) {
        axios({
          method: 'post',
          url: this.$store.getters.getBackURL + `board/comment/insert`,
          data: {
            board_idx: this.cocmt.board_idx,
            nickname: this.form.nickname,
            contents: this.cocmt.contents.replace(/ /g, '%20').replace(/</g, '%3C').replace(/>/g, '%3E').replace(/\n/g, '%0a'),
            gup: gup,
            seq: seq + 1,
            step: step +1
          }
        }).then((response) => {
          this.getBoardView()
          this.cocmt.contents = ''
          this.toggleCocmt(idx, 'close');
        })
      }
  
    }
  }
  
  </script>
  
  <style>
  * {
    margin: 0;
  }
  
  .board_view h2 {
    margin: 0;
  }
  
  .views {
    float: right;
    display: flex;
    align-items: center;
  }
  
  .views>img {
    margin-right: 5px;
  }
  
  .board_view {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    border-radius: 4px;
    border: 1px solid #EBEEF5;
    background-color: #FFF;
    overflow: hidden;
    color: #303133;
    transition: .3s;
    margin-bottom: 5px;
  }
  
  .board_view>div {
    padding: 18px 20px;
    box-sizing: border-box;
    border-bottom: 1px solid #ebeef5;
  }
  
  .board_view>.content {
    height: 300px;
  }
  
  .board_view>.content>.main {
    overflow: auto;
    height: 240px;
  }
  
  .board_footer>.el-button {
    float: right;
    margin: 0 0 15px 3px;

  }
  
  .comment_r .el-menu {
    border: none;
  }
  
  .comment_list {
    border: 1px solid #ebeef5;
    padding: 7px;
    border-radius: 5px;
  }
  
  .comment_list>div {
    margin-bottom: 10px;
    display: flex;
  }
  
  .comment_list>div:last-child {
    margin: 0;
  }
  
  .comment_list .minimini {
    padding: 3px 5px;
    font-size: 11px;
  }
  
  span.comment_date {
    color: #ccc;
    padding-left: 5px;
  }
  
  .el-popover {
    min-width: 130px;
  }

  </style>