<script setup lang="ts">
import { ref, onMounted } from "vue";
import { authService } from "@/auth/auth-service";

const user = ref<any>(null);

onMounted(async () => {
  user.value = await authService.getCurrentUser();
});
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Profile</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <pre>{{ user }}</pre>
    </ion-content>
  </ion-page>
</template>
