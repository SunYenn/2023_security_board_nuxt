<template>
  <div class="center">
    <el-form :model="form" :rules="validationRules" ref="form" @submit.native.prevent="login">
      <div class="card login">
        <div class="header">
          <h1>LOGIN</h1>
        </div>
        <div class="body">
          <el-form-item label="id" prop="id" :error="errors['id']">
            <el-input 
              ref="form_id" 
              v-model="form.id" 
              placeholder="아이디를 입력해주세요." 
            />
          </el-form-item>
          <el-form-item label="pw" prop="pw" :error="errors['pw']">
            <el-input 
              ref="form_pw" 
              type="password" 
              v-model="form.pw" 
              placeholder="비밀번호를 입력해주세요." 
            />
          </el-form-item>
        </div>
        <div class="footer">
          <div class="grid-content" align="center">
            <el-button type="primary" @click="move_join">회원가입</el-button>
            <el-button type="primary" native-type="submit">로그인</el-button>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>

export default {

  data() {
    return {
      form: {
        id: '',
        pw: '',

      },
      errors: {},

      validationRules: {
        id: [
          { required: true, message: '아이디를 입력해주세요.', trigger: 'blur' },
        ],
        pw: [
          { required: true, message: '비밀번호를 입력해주세요.', trigger: 'blur' }
        ]
      }
    }
  },

  methods: {

    login() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const { id, pw } = this.form;
          this.$store.dispatch('login', { id, pw }) // 로그인
        } else {
          this.$message.error('양식을 다시 확인해주세요.');
        }
      });
    },

    move_join() {
      window.location.href = this.$store.getters.getFrontURL+'join'
    }

  }
}

</script>
