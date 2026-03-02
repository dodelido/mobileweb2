<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Lab09 Sensors</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <hr />

      <p>รอบทั้งหมด: {{ state?.stats.repsTotal ?? 0 }}</p>
      <p>รอบถูก: {{ state?.stats.repsOk ?? 0 }}</p>
      <p>รอบผิด: {{ state?.stats.repsBad ?? 0 }}</p>
      <p>Tempo เฉลี่ย: {{ state?.stats.avgRepMs ?? 0 }} ms</p>

      <p>
        เปอร์เซ็นต์ถูก:
        {{
          state?.stats.repsTotal
            ? Math.round(
                (state.stats.repsOk / state.stats.repsTotal) * 100
              )
            : 0
        }}%
      </p>

      <h1>{{ state?.repDisplay ?? 0 }}</h1>
      <p>คะแนน: {{ state?.stats.score ?? 0 }}</p>
      <p>{{ state?.stats.lastMessage }}</p>

      <ion-button expand="block" @click="start">Start</ion-button>
      <ion-button expand="block" color="medium" @click="stop">Stop</ion-button>
    </ion-content>

    <ion-footer class="ion-padding">
      663380609-1
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonFooter
} from "@ionic/vue";

import { MotionService } from "../core/MotionService";
import { TtsService } from "../core/TtsService";
import { ArmWorkoutEngine } from "../core/ArmWorkoutEngine";
import { HapticsService } from "../core/HapticsService";
import type { WorkoutState } from "../core/types";

const state = ref<WorkoutState | null>(null);

const engine = new ArmWorkoutEngine();
const motion = new MotionService();
const tts = new TtsService();
const haptics = new HapticsService();

onMounted(() => {
  engine.onChange((s) => (state.value = s));
});

watch(
  () => state.value?.repDisplay,
  async (newVal, oldVal) => {
    if (!newVal || newVal === oldVal) return;
    await tts.speak(newVal.toString());
    await haptics.success();
  }
);

async function start() {
  await tts.speak("เริ่มกายบริหารแขน ยกขึ้นจนสุดแล้วลดลง");
  engine.start();
  await motion.start((s) => engine.process(s));
}

async function stop() {
  await motion.stop();
  engine.stop();
}
</script>