<template>
  <v-container>
    <v-card>
      <p v-if="isAfterScoring" class="ml-5 pt-3 pb-3">
        <span class="text-h6 font-weight-regular mr-3">Score</span>
        <span class="font-weight-bold text-h5">
          {{ score }}
        </span>
        /100％
      </p>
    </v-card>
    <div v-if="loaded" class="mt-3">
      <v-card
        v-for="item in quiz"
        :key="item.id"
        class="mb-5"
        :color="pickUpColor(item)"
      >
        <v-card-text>
          <p class="py-3 pl-3 mb-0 black--text">{{ item.content }}</p>
          <p v-if="isAfterScoring" class="pl-3 black--text">
            解説: {{ item.explanation }}
          </p>
          <div v-for="choice in item.choices" :key="choice.id">
            <v-row class="ml-3">
              <v-checkbox
                v-model="choice.user_answer"
                :label="choice.content"
                :disabled="isAfterScoring"
              ></v-checkbox>
              <v-icon
                v-if="isAfterScoring && choice.is_answer"
                class="ml-5"
                color="teal accent-4"
              >
                mdi-checkbox-marked-circle
              </v-icon>
            </v-row>
          </div>
        </v-card-text>
      </v-card>
    </div>
    <div class="text-center">
      <v-btn
        v-if="isAfterScoring"
        color="teal accent-4"
        elevation="2"
        outlined
        rounded
        :loading="sendingScore"
        @click="$router.go(-2)"
      >
        戻る
      </v-btn>
      <v-btn
        v-else
        color="teal accent-4"
        elevation="2"
        outlined
        rounded
        @click="scoring()"
      >
        採点する
      </v-btn>
    </div>
  </v-container>
</template>

<script>
import UserService from '@/services/UserService'
import { getError } from '~/utils/helpers'
export default {
  layout: 'client',
  async asyncData(context) {
    const quizResponse = await UserService.getQuiz(context.params.id).catch(
      (err) => {
        return getError(err)
      }
    )
    const statusResponse = await UserService.getStatus().catch((err) => {
      return getError(err)
    })
    return {
      quiz: quizResponse.data.data,
      statuses: statusResponse.data.data,
    }
  },
  data: () => ({
    score: null,
    loaded: true,
    isAfterScoring: false,
    sendingScore: false,
  }),
  created() {
    this.quiz.forEach((item) => {
      item.is_correct = false
      item.choices.forEach((choice) => {
        choice.user_answer = false
      })
    })
  },
  methods: {
    scoring() {
      let isCorrect = true
      this.loaded = false
      let correctCount = 0
      this.quiz.forEach((item) => {
        isCorrect = true
        item.choices.forEach((choice) => {
          if (choice.user_answer !== Boolean(choice.is_answer)) {
            isCorrect = false
          }
        })
        if (isCorrect) {
          item.is_correct = true
          correctCount++
        }
      })
      this.score = (correctCount / this.quiz.length) * 100
      this.postQuizScore()
      this.isAfterScoring = true
      this.loaded = true
    },
    pickUpColor(item) {
      const correctColor = 'white'
      const incorrectColor = 'pink lighten-5'
      if (this.isAfterScoring) {
        return item.is_correct ? correctColor : incorrectColor
      }
    },
    postQuizScore() {
      this.sendingScore = true
      const status = this.statuses.find(
        (v) => v.material_id === this.quiz[0].material_id
      )
      const payload = {
        material_id: this.quiz[0].material_id,
        quiz_score: this.score,
        is_complete: true,
      }
      //  リソースが存在する場合は更新，そうでない場合は作成
      if (status) {
        UserService.updateStatus(status.id, payload)
          .then((response) => {
            this.sendingScore = false
          })
          .catch((err) => {
            return getError(err)
          })
      } else {
        UserService.createStatus(payload)
          .then((response) => {
            this.sendingScore = false
          })
          .catch((err) => {
            return getError(err)
          })
      }
    },
  },
}
</script>

<style>
/* disable時，選択肢がグレーにならないようにする */
.v-label {
  color: black !important;
}
</style>
