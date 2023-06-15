import Vuex from 'vuex'
import * as modules from './modules'

const createStore = () => {

  return new Vuex.Store({
    modules: {
      ...modules
    },

  });
};

export default createStore;
