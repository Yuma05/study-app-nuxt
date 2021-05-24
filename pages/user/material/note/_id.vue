<template>
  <v-container>
    <v-card>
      <div class="py-4 px-4">
        <span v-html="$sanitize(material.content)"></span>
      </div>
    </v-card>
    <div class="text-center">
      <v-btn
        color="teal accent-4"
        elevation="2"
        outlined
        rounded
        class="mt-5"
        @click="$router.go(-2)"
      >
        戻る
      </v-btn>
    </div>
  </v-container>
</template>

<script>
import UserService from '@/services/UserService'
import { getError } from '@/utils/helpers'

export default {
  async asyncData(context) {
    const materialId = context.params.id
    const materialResponse = await UserService.getMaterial(materialId).catch(
      (err) => {
        return getError(err)
      }
    )
    return {
      material: materialResponse.data.data,
    }
  },
}
</script>

<style scoped></style>
