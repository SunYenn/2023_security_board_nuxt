import axios from 'axios'
import { setCookie, getCookie, deleteCookie } from '@/utils/cookie' // 쿠키 유틸리티 함수 임포트

export default {

  getters: {
    getNickname() {
      return getCookie('nickname');
    },
    getBackURL() {
      return `http://${window.location.hostname}:8080/api/`;
    },
    getFrontURL() {
      return `http://${window.location.host}/`;
    }
  },

  actions: {
    login({ commit }, { id, pw }) {

      const params = {
        "id": id,
        "pw": pw
      }

      axios.post("http://localhost:8080/api/user/login", JSON.stringify(params), {
        headers: { 'content-type': 'application/json' }
      }).then(res => {
        alert("정보가 확인되었습니다.\n환영합니다!")
        commit('login', res);
        setCookie('token', res.headers['accesstoken']);
        setCookie('nickname', res.data['nickname']);
        setCookie('id', res.data['id']);
        this.$router.push("/boardList")
      }).catch(e => {
        console.log(e)
        alert("로그인 요청에 문제가 발생했습니다.")
      })

    },

    logout() {
      deleteCookie('token');
      deleteCookie('nickname');
      deleteCookie('id');
      this.$router.push("./");
    }
  }
}