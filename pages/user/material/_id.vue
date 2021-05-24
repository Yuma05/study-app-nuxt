<template>
  <v-container>
    <p class="mb-0 font-weight-bold blue-grey--text text--darken-3 mt-5">
      {{ category.name }}
    </p>
    <v-row justify="start">
      <v-col v-for="material in materials" :key="material" cols="6">
        <v-card class="mx-auto mt-5">
          <v-row align="end" class="fill-height">
            <v-col align-self="center" cols="auto">
              <v-row>
                <v-icon
                  v-if="material.status && material.status.is_complete"
                  class="pl-6"
                  color="teal accent-4"
                >
                  mdi-checkbox-marked-circle
                </v-icon>
                <v-icon v-else class="pl-6" color="teal accent-4">
                  mdi-checkbox-blank-circle-outline
                </v-icon>
                <v-card-title class="py-0 pl-2">{{
                  material.name
                }}</v-card-title>
                <p v-if="material.status" class="mb-0">
                  <span class="font-weight-bold text-h6">
                    {{ material.status.quiz_score }}
                  </span>
                  /100％
                </p>
              </v-row>
            </v-col>
            <v-spacer></v-spacer>
            <v-col align-self="center" cols="auto" class="mr-3">
              <v-btn
                class="mr-2"
                color="teal accent-4"
                elevation="2"
                outlined
                rounded
                nuxt
                :href="'/user/material/note/' + material.id"
              >
                ノート
              </v-btn>
              <v-btn
                color="teal accent-4"
                elevation="2"
                outlined
                rounded
                nuxt
                :href="'/user/material/quiz/' + material.id"
              >
                クイズ
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import UserService from '@/services/UserService'
import { getError } from '~/utils/helpers'
export default {
  layout: 'client',
  async asyncData(context) {
    const categoryId = context.params.id
    const materialsResponse = await UserService.getMaterials(categoryId).catch(
      (err) => {
        return getError(err)
      }
    )
    const categoryResponse = await UserService.getOneCategory(categoryId).catch(
      (err) => {
        return getError(err)
      }
    )
    const statusesResponse = await UserService.getStatus().catch((err) => {
      return getError(err)
    })
    return {
      materials: materialsResponse.data.data,
      category: categoryResponse.data.data,
      statuses: statusesResponse.data.data,
    }
  },
  created() {
    // materialsにstatusをマージ
    this.materials.forEach((material) => {
      const status = this.statuses.find(
        (item) => item.material_id === material.id
      )
      if (status) {
        material.status = status
      } else {
        material.status = null
      }
    })
  },
}
</script>

<style scoped></style>
