<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-input
        label="Email"
        label-placement="stacked"
        v-model="email"
      />
      <ion-input
        label="Password"
        type="password"
        label-placement="stacked"
        v-model="password"
      />

      <ion-button expand="block" @click="loginEmail">
        Login Email / Password
      </ion-button>

      <ion-button expand="block" color="danger" @click="loginGoogle">
        Login Google
      </ion-button>

      <ion-input
        label="Phone (+66...)"
        label-placement="stacked"
        v-model="phone"
      />
      <div id="recaptcha-container"></div>

      <ion-button expand="block" color="secondary" @click="loginPhone">
        Login Phone
      </ion-button>
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
  IonInput,
  IonButton,
} from "@ionic/vue";

import { ref } from "vue";
import { useRouter } from "vue-router";
import { authService } from "@/auth/auth-service";

const router = useRouter();

const email = ref("");
const password = ref("");
const phone = ref("");

async function loginEmail() {
  await authService.loginWithEmailPassword({
    email: email.value,
    password: password.value,
  });
  router.replace("/tabs/tab1");
}

async function loginGoogle() {
  await authService.loginWithGoogle();
  router.replace("/tabs/tab1");
}

async function loginPhone() {
  const { verificationId } = await authService.startPhoneLogin({
    phoneNumberE164: phone.value,
  });

  const code = prompt("Enter OTP");
  if (!code) return;

  await authService.confirmPhoneCode({
    verificationId,
    verificationCode: code,
  });

  router.replace("/tabs/tab1");
}
</script>
