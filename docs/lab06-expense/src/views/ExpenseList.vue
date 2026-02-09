<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>รายการรายรับรายจ่าย</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- สรุปผล -->
      <ion-card>
        <ion-card-content>
          <p>รายรับรวม: {{ totalIncome }} บาท</p>
          <p>รายจ่ายรวม: {{ totalExpense }} บาท</p>
          <p>คงเหลือ: {{ totalIncome - totalExpense }} บาท</p>
        </ion-card-content>
      </ion-card>

      <!-- รายการ (กดเพื่อแก้ไข) -->
      <ion-list>
        <ion-item
          v-for="item in expenses"
          :key="item.id"
          button
          :color="item.type === 'income' ? 'success' : 'danger'"
          @click="goEdit(item.id)"
        >
          <ion-label>
            <h2>{{ item.title }}</h2>
            <p>{{ item.category }} | {{ item.amount }} บาท</p>
          </ion-label>
        </ion-item>
      </ion-list>
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
  IonList,
  IonItem,
  IonLabel,
  IonCard,
  IonCardContent
} from '@ionic/vue'

import { ref, onMounted } from 'vue'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '@/firebase'
import { useRouter } from 'vue-router'

interface Expense {
  id: string
  title: string
  amount: number
  type: 'income' | 'expense'
  category: string
}

const router = useRouter()

const expenses = ref<Expense[]>([])
const totalIncome = ref(0)
const totalExpense = ref(0)

// ไปหน้าแก้ไข
const goEdit = (id: string) => {
  router.push(`/tabs/edit/${id}`)
}

onMounted(() => {
  const q = query(
    collection(db, 'expenses'),
    orderBy('createdAt', 'desc')
  )

  onSnapshot(q, (snapshot) => {
    const temp: Expense[] = []
    let income = 0
    let expense = 0

    snapshot.forEach((doc) => {
      const data = doc.data()

      const item: Expense = {
        id: doc.id,
        title: data.title,
        amount: data.amount,
        type: data.type,
        category: data.category
      }

      temp.push(item)

      if (item.type === 'income') {
        income += item.amount
      } else {
        expense += item.amount
      }
    })

    expenses.value = temp
    totalIncome.value = income
    totalExpense.value = expense
  })
})
</script>
