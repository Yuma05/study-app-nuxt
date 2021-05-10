<template>
  <v-card
    max-width="700px"
    class="mx-auto mt-7"
    elevation="5"
    :loading="isLoading"
  >
    <template slot="progress">
      <v-progress-linear color="blue" indeterminate></v-progress-linear>
    </template>
    <v-card-title>
      <span class="mx-auto text-h5 font-weight-bold">Login</span>
    </v-card-title>
    <div
      v-if="isShowError"
      class="text-center text-body-2 red--text text--lighten-1"
    >
      {{ error }}
    </div>
    <v-card-text class="text-center">
      <v-form ref="form" v-model="valid">
        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="メールアドレス"
          required
          color="blue"
        ></v-text-field>
        <v-text-field
          v-model="password"
          :rules="passwordRules"
          label="パスワード"
          required
          type="password"
          color="blue"
        ></v-text-field>
        <div style="width: 100%" class="text-center">
          <v-btn outlined color="blue" :disabled="!valid" @click="login()">
            sign in
          </v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { getError } from '@/utils/helpers'
import AuthService from '@/services/AuthService'
export default {
  data: () => ({
    valid: false,
    isLoading: false,
    email: null,
    emailRules: [
      (v) => !!v || 'メールアドレスは必須です',
      (v) => /.+@.+\..+/.test(v) || 'メールアドレスを入力してください',
    ],
    password: null,
    passwordRules: [(v) => !!v || 'パスワードは必須です'],
    isShowError: false,
    error: null,
  }),
  methods: {
    async login() {
      const payload = {
        email: this.email,
        password: this.password,
      }
      this.isShowError = false
      this.error = null
      try {
        await AuthService.login(payload)
        const authUser = await this.$store.dispatch('auth/getAuthUser')
        if (authUser.is_admin) {
          this.$router.push('/admin')
        } else {
          this.$router.push('/client')
        }
      } catch (error) {
        this.isShowError = true
        this.error = 'メールアドレスまたはパスワードが違います．'
        this.password = null
        getError(error)
      }
    },
  },
}
</script>

<style scoped></style>
