<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>เพิ่มรายการรายรับ–รายจ่าย</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-input
        label="ชื่อรายการ"
        label-placement="stacked"
        @ionInput="title = $event.target.value"
      />

      <ion-input
        label="จำนวนเงิน"
        label-placement="stacked"
        type="number"
        @ionInput="amount = $event.target.value"
      />

      <ion-select
        label="ประเภท"
        label-placement="stacked"
        placeholder="เลือกประเภท"
        @ionChange="type = $event.detail.value"
      >
        <ion-select-option value="income">รายรับ</ion-select-option>
        <ion-select-option value="expense">รายจ่าย</ion-select-option>
      </ion-select>

      <ion-input
        label="หมวดหมู่"
        label-placement="stacked"
        @ionInput="category = $event.target.value"
      />

      <ion-textarea
        label="หมายเหตุ"
        label-placement="stacked"
        @ionInput="note = $event.target.value"
      />

      <ion-button expand="block" @click="saveExpense">
        บันทึกข้อมูล
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
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonButton
} from '@ionic/vue'

import { ref } from 'vue'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { useRouter } from 'vue-router'

const router = useRouter()

// state
const title = ref('')
const amount = ref('')
const type = ref<'income' | 'expense'>('expense')
const category = ref('')
const note = ref('')

const saveExpense = async () => {
  if (!title.value.trim() || Number(amount.value) <= 0) {
    alert('กรุณากรอกชื่อรายการและจำนวนเงินให้ถูกต้อง')
    return
  }

  await addDoc(collection(db, 'expenses'), {
    title: title.value.trim(),
    amount: Number(amount.value),
    type: type.value,
    category: category.value,
    note: note.value,
    createdAt: new Date()
  })

  router.push('/tabs/list')
}
</script>
