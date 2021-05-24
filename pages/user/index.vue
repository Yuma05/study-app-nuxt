<template>
  <v-container>
    <v-card class="my-5">
      <v-row justify="center" dense>
        <v-col cols="auto" class="pa-0">
          <v-list-item class="mx-auto">
            <v-list-item-icon class="mr-3">
              <v-icon color="blue darken-4" large>mdi-account-circle</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              <span class="font-weight-medium text-h6">
                {{ authUser.name }}
              </span>
              さん
            </v-list-item-title>
          </v-list-item>
        </v-col>
        <v-col cols="auto" class="pa-0" align-self="center">
          <v-list-item class="mx-auto">
            <v-list-item-icon class="mr-3">
              <v-icon color="blue darken-4" large>mdi-check</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              <span class="caption">完了したレッスン</span>
              <span class="font-weight-medium text-h6">
                {{ completeCount }}
              </span>
            </v-list-item-title>
          </v-list-item>
        </v-col>
      </v-row>
    </v-card>
    <p class="mb-0 font-weight-bold blue-grey--text text--darken-3 mt-5">
      教材一覧
    </p>
    <v-row justify="start">
      <v-col v-for="category in categories" :key="category" cols="4">
        <v-card
          class="mx-auto mt-5"
          nuxt
          :href="'user/material/' + category.id"
        >
          <v-row align="end" class="fill-height">
            <v-col cols="auto" class="py-0">
              <v-avatar color="grey" size="80" rounded>
                <v-img :src="category.image_src"></v-img>
              </v-avatar>
            </v-col>
            <v-col align-self="center">
              <v-card-title class="py-0 px-0">{{ category.name }}</v-card-title>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import UserService from '@/services/UserService'
import { mapGetters } from 'vuex'
import { getError } from '~/utils/helpers'
export default {
  layout: 'user',
  async asyncData({ store }) {
    await store.dispatch('auth/getAuthUser')
    const categoryResponse = await UserService.getCategory().catch((err) => {
      return getError(err)
    })
    const statusResponse = await UserService.getStatus().catch((err) => {
      return getError(err)
    })
    return {
      categories: categoryResponse.data.data,
      statuses: statusResponse.data.data,
    }
  },
  data: () => ({
    completeCount: null,
  }),
  computed: {
    ...mapGetters('auth', ['authUser']),
  },
  mounted() {
    this.completeCount = this.statuses.filter(
      (item) => item.is_complete === 1
    ).length
  },
}
</script>

<style scoped></style>
