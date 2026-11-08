import { defineStore } from "pinia";

const moduleName = "userInfo"

const userStore = defineStore(moduleName, {
  state: (): UserInfo => {
    return {
      username: "",
      phone: null,
      avatar: "",
      account: "",
      email: "",
    }
  },
  actions: {
    init () {
      const userStr = localStorage.getItem(moduleName)
      if (userStr) {
        try {
          const user = JSON.parse(userStr) as Partial<UserInfo>
          this.update(user)
        } catch (error) {
        }
      }
    },
    update (user: Partial<UserInfo>) {
      const keys = Object.keys(this.$state) as (keyof UserInfo)[]
      keys.forEach(<K extends keyof UserInfo>(key: K) => {
        const value = user[key]
        if (
          Object.prototype.hasOwnProperty.call(user, key) &&
          value !== undefined
        ) {
          this.$state[key] = value
        }
      })
      localStorage.setItem(moduleName, JSON.stringify(this.$state))
    },
    reset () {
      localStorage.removeItem(moduleName)
      this.$reset()
    },
  }
})

export default userStore
