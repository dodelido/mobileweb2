
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Photo Gallery</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <!-- Large title (iOS style) -->
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Photo Gallery</ion-title>
        </ion-toolbar>
      </ion-header>

      <!-- Student Info Card -->
      <ion-card class="student-card">
        <ion-card-header>
          <ion-card-title>ผู้พัฒนาแอป</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <p><strong>รหัสนักศึกษา:</strong> 663380609-1</p>
          <p><strong>ชื่อ:</strong> พิษณุวัชร์ หงส์วิไล</p>
        </ion-card-content>
      </ion-card>

      <!-- Empty state (ยังไม่ถ่ายรูป) -->
      <div class="empty-state">
        <ion-icon :icon="imagesOutline" />
        <p>ยังไม่มีรูปภาพ<br />กดปุ่มกล้องเพื่อเริ่มถ่ายภาพ</p>
      </div>

      <!-- Floating Action Button -->
      <ion-fab vertical="bottom" horizontal="center" slot="fixed">
        <ion-fab-button @click="takePhoto">
          <ion-icon :icon="camera"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <ion-grid>
      <ion-row>
      <ion-col size="6" v-for="photo in photos" :key="photo.filepath">
      <ion-img :src="photo.webviewPath"></ion-img>
      </ion-col>
  </ion-row>
</ion-grid>

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
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonImg
} from '@ionic/vue'

import { camera, imagesOutline } from 'ionicons/icons'
import { onMounted } from 'vue'
import { usePhotoGallery } from '@/composables/usePhotoGallery'

// เรียก composable แค่ครั้งเดียว
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
