// stores/counter.js
// import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => {
    return { 
      currentFuncId: ''
    }
  },
  // getters: {
  //   currentFuncId: (state) => state.currentFuncId,
  // },
  actions: {
    changeFuncId(id) {
      this.$state.currentFuncId = id
    },
  },
})
