<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>แก้ไขรายการ</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-input
        label="ชื่อรายการ"
        label-placement="stacked"
        @ionInput="title = $event.target.value"
        :value="title"
      />

      <ion-input
        label="จำนวนเงิน"
        label-placement="stacked"
        type="number"
        @ionInput="amount = $event.target.value"
        :value="amount"
      />

      <ion-select
        label="ประเภท"
        label-placement="stacked"
        :value="type"
        @ionChange="type = $event.detail.value"
      >
        <ion-select-option value="income">รายรับ</ion-select-option>
        <ion-select-option value="expense">รายจ่าย</ion-select-option>
      </ion-select>

      <ion-input
        label="หมวดหมู่"
        label-placement="stacked"
        @ionInput="category = $event.target.value"
        :value="category"
      />

      <ion-textarea
        label="หมายเหตุ"
        label-placement="stacked"
        @ionInput="note = $event.target.value"
        :value="note"
      />

      <!-- ปุ่มอัปเดต -->
      <ion-button expand="block" @click="updateExpense">
        อัปเดตข้อมูล
      </ion-button>

      <!-- ปุ่มลบ -->
      <ion-button
        expand="block"
        color="danger"
        fill="outline"
        @click="showDeleteConfirm = true"
      >
        ลบข้อมูล
      </ion-button>

      <!-- กล่องยืนยันการลบ -->
      <ion-alert
        :is-open="showDeleteConfirm"
        header="ยืนยันการลบ"
        message="คุณต้องการลบรายการนี้ใช่หรือไม่?"
        :buttons="alertButtons"
        @didDismiss="showDeleteConfirm = false"
      />
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
  IonButton,
  IonAlert
} from '@ionic/vue'

import { ref, onMounted } from 'vue'
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const id = route.params.id as string

// state
const title = ref('')
const amount = ref('')
const type = ref<'income' | 'expense'>('expense')
const category = ref('')
const note = ref('')

const showDeleteConfirm = ref(false)

// โหลดข้อมูลเดิม
onMounted(async () => {
  const snap = await getDoc(doc(db, 'expenses', id))
  if (snap.exists()) {
    const data = snap.data()
    title.value = data.title
    amount.value = String(data.amount)
    type.value = data.type
    category.value = data.category
    note.value = data.note
  }
})

// อัปเดตข้อมูล
const updateExpense = async () => {
  if (!title.value.trim() || Number(amount.value) <= 0) {
    alert('กรุณากรอกข้อมูลให้ถูกต้อง')
    return
  }

  await updateDoc(doc(db, 'expenses', id), {
    title: title.value,
    amount: Number(amount.value),
    type: type.value,
    category: category.value,
    note: note.value
  })

  router.push('/tabs/list')
}

// ลบข้อมูล
const deleteExpense = async () => {
  await deleteDoc(doc(db, 'expenses', id))
  router.push('/tabs/list')
}

// ปุ่มใน Alert
const alertButtons = [
  {
    text: 'ยกเลิก',
    role: 'cancel'
  },
  {
    text: 'ลบ',
    role: 'destructive',
    handler: deleteExpense
  }
]
</script>
