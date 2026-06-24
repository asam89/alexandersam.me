import getDefaultState from "@/store/state";

export default {
  resetState(state) {
    Object.assign(state, getDefaultState())
  },

  setUser(state, user) {
    state.user = user
  },
}
