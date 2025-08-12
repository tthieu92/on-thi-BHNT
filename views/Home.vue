<template>
  <div class="home-card">
    <h2>Chọn bộ đề</h2>
    <p class="small muted">Tự động chia toàn bộ danh sách câu thành các đề (mỗi đề 60 câu)</p>

    <div v-if="loading" class="center">Đang tải...</div>

    <div v-else class="exam-grid">
      <button v-for="i in numExams" :key="i" class="exam-btn" @click="go(i)">
        Đề {{ i }}
        <div class="exam-sub">60 câu</div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(true)
const questions = ref([])
const numExams = ref(0)

onMounted(async ()=>{
  try {
    const res = await fetch('/questions.json')
    const data = await res.json()
    questions.value = data
    numExams.value = Math.ceil(data.length / 60)
  } catch(e){
    console.error(e)
  } finally {
    loading.value = false
  }
})

function go(i){
  router.push({ name: 'Quiz', params: { examId: i } })
}
</script>

<style scoped>
.home-card{ background: linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0.4)); padding:16px; border-radius:12px }
.exam-grid{ display:flex; flex-wrap:wrap; gap:12px; margin-top:12px }
.exam-btn{ min-width:120px; flex:1 1 120px; padding:14px; border-radius:12px; border:none; background:linear-gradient(90deg,#3b82f6,#7c3aed); color:white; font-weight:700; cursor:pointer }
.exam-sub{ font-size:12px; opacity:0.9; margin-top:6px }
.small.muted{ color:var(--muted); font-size:13px }
.center{ text-align:center; color:var(--muted) }
</style>
