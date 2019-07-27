import Vue from 'vue'
import Vuex from 'vuex'
import { getCurrent } from '@/api/getData'

Vue.use(Vuex)

const state = {
	adminInfo: {
		avatar: 'default.jpg'
	},
}

const mutations = {
	saveAdminInfo(state, adminInfo) {
		state.adminInfo = adminInfo;
	}
}

const actions = {
	async getAdminData({ commit }) {
		try {
			const res = await getCurrent()
			if (res.code == 200) {
				commit('saveAdminInfo', res.data);
			} else {
				throw new Error(res.type)
			}
		} catch (err) {
			console.log(err.message)
		}
	}
}

export default new Vuex.Store({
	state,
	actions,
	mutations,
})
