<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Lab08: Gemini Vision โดย พิษณุวัชร์ หงส์วิไล 663380609-1</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <!-- Loading Overlay -->
      <ion-loading :is-open="loading" message="กำลังวิเคราะห์..." />

      <input
        ref="fileEl"
        type="file"
        accept="image/*"
        hidden
        @change="onFileChange"
      />

      <ion-button expand="block" @click="fileEl?.click()">
        เลือกไฟล์ภาพ
      </ion-button>

      <ion-button expand="block" @click="onTakePhoto">
        ถ่ายภาพ (Camera)
      </ion-button>

      <ion-img
  v-if="previewUrl"
  :src="previewUrl"
  class="preview-img"
/>

      <ion-button
        expand="block"
        :disabled="!img || loading"
        @click="onAnalyze"
      >
        วิเคราะห์ภาพ
      </ion-button>

      <!-- Result Card -->
      <ion-card v-if="result">
        <ion-card-header>
          <ion-card-title>ผลการวิเคราะห์</ion-card-title>
        </ion-card-header>

        <ion-card-content>

          <!-- Caption -->
          <h2>{{ result.caption }}</h2>

          <!-- Tags -->
          <div style="margin: 10px 0;">
            <ion-chip
              v-for="tag in result.tags"
              :key="tag"
              color="primary"
              style="margin:4px"
            >
              {{ tag }}
            </ion-chip>
          </div>

          <!-- Objects -->
          <ion-list v-if="result.objects?.length">
            <ion-item
              v-for="obj in result.objects"
              :key="obj.name"
            >
              <ion-label>
                {{ obj.name }}
                ({{ ((obj.confidence ?? 0) * 100).toFixed(1) }}%)
              </ion-label>
            </ion-item>
          </ion-list>

          <!-- Safety -->
          <div style="margin-top:10px">
            <ion-badge
              :color="result.safety?.isSensitive ? 'danger' : 'success'"
            >
              {{ result.safety?.isSensitive
                ? 'Sensitive Content'
                : 'Safe Content'
              }}
            </ion-badge>
          </div>

        </ion-card-content>
      </ion-card>

    </ion-content>
  </ion-page>
</template>

<style scoped>
.preview-img {
  max-height: 300px;
  max-width: 100%;
  width: auto;
  display: block;
  margin: 12px auto;
  object-fit: contain;
  border-radius: 12px;
}
</style>

<script setup lang="ts">
import { ref } from "vue";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonImg,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonChip,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonLoading
} from "@ionic/vue";

import { PhotoService } from "../core/photo.service";
import { GeminiVisionService } from "../core/gemini.service";
import type { Base64Image } from "../core/ai.interface";
import type { ImageAnalysisResult } from "../core/ai.interface";

const fileEl = ref<HTMLInputElement | null>(null);
const img = ref<Base64Image | null>(null);
const previewUrl = ref("");
const result = ref<ImageAnalysisResult | null>(null);
const loading = ref(false);

async function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  img.value = await PhotoService.fromFile(file);
  previewUrl.value = URL.createObjectURL(file);
  result.value = null;
}

async function onTakePhoto() {
  loading.value = true;
  try {
    const b64 = await PhotoService.fromCamera();
    img.value = b64;
    previewUrl.value = `data:${b64.mimeType};base64,${b64.base64}`;
    result.value = null;
  } finally {
    loading.value = false;
  }
}

async function onAnalyze() {
  if (!img.value) return;

  loading.value = true;
  try {
    result.value = await GeminiVisionService.analyze(img.value);
  } finally {
    loading.value = false;
  }
}
</script>
