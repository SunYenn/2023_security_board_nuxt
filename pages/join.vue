<template>
  <div class="center">
    <el-form :model="form" ref="form" @submit.native.prevent="join">
      <div class="card login">
        <div class="header">
          <h1>JOIN US</h1>
        </div>
          <div class="body">
            <el-form-item label="Nickname" prop="nickname" :rules="getValidationRules('nickname')">
              <el-input 
                ref="form_nickname" 
                v-model="form.nickname" 
                placeholder="닉네임을 입력해주세요."
                @input="checkField('nickname')">
                <div slot="append">
                  <i :class="getValidationIcon('nickname')" />
                </div>
              </el-input>
            </el-form-item>
            <el-form-item label="Id" prop="id" :rules="getValidationRules('id')">
              <el-input ref="form_id" v-model="form.id" placeholder="아이디를 입력해주세요." @input="checkField('id')">
                <div slot="append">
                  <i :class="getValidationIcon('id')" />
                </div>
              </el-input>
            </el-form-item>
            <el-form-item label="Email" prop="email" :rules="emailRules">
              <el-input ref="form_email" v-model="form.email" placeholder="이메일을 입력해주세요." />
            </el-form-item>
            <el-form-item label="Password" prop="pw" :rules="pw1Rules">
              <el-input ref="form_pw" v-model="form.pw" placeholder="비밀번호를 입력해주세요." type="password" />
            </el-form-item>
            <el-form-item label="Check Password" prop="pw2" :rules="pw2Rules">
              <el-input ref="form_pw2" v-model="form.pw2" placeholder="비밀번호 확인" type="password" />
            </el-form-item>
          </div>
          <div class="footer">
            <div class="grid-content" align="center">
              <el-button type="primary" @click="move_login">돌아가기</el-button>
              <el-button type="primary" native-type="join">회원가입</el-button>
            </div>
          </div>
        </div>
      </el-form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import * as yup from 'yup';
  
  export default {
  
    data() {
      return {
        form: {
          id: null,
          nickname: null,
          pw: null,
          email: null,
          pw2: null
        },
        validationFlags: {
          nickname: false,
          id: false,
        },
      }
    },
  
    computed: {
  
      emailRules() {
        return [
          {
            required: true,
            message: '이메일은 필수 입력 사항입니다.',
            trigger: 'blur',
          },
          {
            validator: (rule, value, callback) => {
              if (!value || yup.string().email().isValidSync(value)) {
                callback();
              } else {
                callback('유효한 이메일 형식이 아닙니다');
              }
            },
            trigger: 'blur',
          },
        ];
      },
  
      pw1Rules() {
        return [
          {
            required: true,
            message: '비밀번호는 필수 입력 사항입니다.',
            trigger: 'blur',
          },
          {
            validator: (rule, value, callback) => {
  
              const passwordSchema = yup.string()
                .min(6, '비밀번호는 최소 6자 이상이어야 합니다.')
                .matches(
                  /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[~!@#$%^&+=])(?=\S+$)/,
                  '비밀번호는 숫자, 영문자, 특수문자를 포함해야 합니다.'
                );
  
              // 데이터의 유효성 검사 후 true, false 반환
              if (!value || passwordSchema.isValidSync(value)) { 
                callback();
              } else {
                callback('비밀번호는 6자 이상, 숫자, 영문자, 특수문자를 포함해야 합니다.');
              }
            },
            trigger: 'blur',
          },
        ];
      },

      pw2Rules() {
        return [
          {
            required: true,
            message: '비밀번호가 일치하지 않습니다.',
            trigger: 'blur',
          },
          {
            validator: (rule, value, callback) => {
  
              const password = this.form.pw;
              if (!value || value === password) {
                callback();
              } else {
                callback('비밀번호가 일치하지 않습니다.');
              }
            },
            trigger: 'blur',
          },
        ];
      }
  
    },
  
    methods: {
  
      getValidationRules(field) {
  
        const title = field == 'id' ? '아이디는' : '닉네임은';
        return [
          {
            required: true,
            message: `${title} 필수 입력 사항입니다.`,
            trigger: 'blur',
          },
        ];
      },
  
      getValidationIcon(field) {
        return {
          'el-icon-circle-check': this.validationFlags[field],
          'el-icon-circle-close': !this.validationFlags[field],
        };
      },
  
      move_login() {
        window.location.href = this.$store.getters.getFrontURL
      },
  
      checkField(field) {
        axios({
          method: 'post',
          url: this.$store.getters.getBackURL + `user/check${capitalize(field)}`,
          data: this.form
        }).then((response) => {
          this.validationFlags[field] = response.data;
        }).catch((error) => {
          console.error(error);
          this.$message.error('서버와의 통신에 오류가 발생했습니다.');
        });
      },
  
      join() {
  
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (!this.validationFlags.nickname) {
              this.$message.error('중복된 닉네임입니다.');
              this.$refs.form_nickname.focus();
              return;
            } else if (!this.validationFlags.id) {
              this.$message.error('중복된 아이디입니다.');
              this.$refs.form_id.focus();
              return;
            }
            axios({
              method: 'post',
              url: this.$store.getters.getBackURL + 'user/join',
              data: this.form
            }).then((response) => {
              this.$message.success('회원가입 성공!');
              setTimeout(() => {
                this.move_login();
              }, 500);
            }).catch((error) => {
              console.error(error);
              this.$message.error('회원가입 양식을 다시 확인해주세요.');
            })
          } else {
            this.$message.error('회원가입 양식을 다시 확인해주세요.');
          }
        });
      },
  
    },
  };
  
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  
  </script>