<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Photo Gallery</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <!-- iOS large title -->
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Photo Gallery</ion-title>
        </ion-toolbar>
      </ion-header>

      <!-- Student Info -->
      <ion-card class="student-card">
        <ion-card-header>
          <ion-card-title>ผู้พัฒนาแอป</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <p><strong>รหัสนักศึกษา:</strong> 663380609-1</p>
          <p><strong>ชื่อ:</strong> พิษณุวัชร์ หงส์วิไล</p>
        </ion-card-content>
      </ion-card>

      <!-- Empty State -->
      <div v-if="photos.length === 0" class="empty-state">
        <ion-icon :icon="imagesOutline" />
        <p>
          ยังไม่มีรูปภาพ<br />
          กดปุ่มกล้องเพื่อเริ่มถ่ายภาพ
        </p>
      </div>

      <!-- Photo Grid -->
      <ion-grid v-else>
        <ion-row>
          <ion-col
            size="6"
            v-for="photo in photos"
            :key="photo.filepath"
          >
            <ion-img :src="photo.webviewPath" />
          </ion-col>
        </ion-row>
      </ion-grid>

      <!-- FAB -->
      <ion-fab vertical="bottom" horizontal="center" slot="fixed">
        <ion-fab-button @click="takePhoto">
          <ion-icon :icon="camera" />
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent
} from '@ionic/vue'

import { camera, imagesOutline } from 'ionicons/icons'
import { onMounted } from 'vue'
import { usePhotoGallery } from '@/composables/usePhotoGallery'

const { photos, takePhoto, loadSaved } = usePhotoGallery()

onMounted(() => {
  loadSaved()
})
</script>

<style scoped>
.student-card {
  margin: 16px;
}

.empty-state {
  height: 60%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--ion-color-medium);
}

.empty-state ion-icon {
  font-size: 64px;
  margin-bottom: 12px;
}

.empty-state p {
  font-size: 14px;
  line-height: 1.5;
}
</style>
