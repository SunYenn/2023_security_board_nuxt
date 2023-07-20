import Vue from 'vue';
import { ValidationObserver, ValidationProvider, extend } from 'vee-validate';
import * as rules from 'vee-validate/dist/rules';

Object.keys(rules).forEach(rule => {
  extend(rule, {
    ...rules[rule],
    message: '{_field_}가 입력되지 않았습니다.',
  });
});

Vue.component('ValidationObserver', ValidationObserver);
Vue.component('ValidationProvider', ValidationProvider);