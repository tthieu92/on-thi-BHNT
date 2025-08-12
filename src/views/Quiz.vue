<template>
  <div class="quiz-card" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
    <div class="progress-row">
      <div class="progress-info">Đề: <span class="muted">{{ examId }}</span></div>
      <div class="progress-bar" role="progressbar" :aria-valuenow="progressPercent">
        <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
      </div>
      <div class="progress-info right">{{ currentIndex + 1 }}/{{ questions.length }}</div>
    </div>

    <div v-if="loading" class="center">Đang tải câu hỏi...</div>

    <section v-else class="question-area">
      <transition :name="transitionName" mode="out-in">
        <div class="q-box" :key="currentIndex">
          <div class="q-header">
            <div class="q-number">Câu {{ currentIndex + 1 }}</div>
            <div class="q-text" v-html="currentQuestion.question"></div>
          </div>

          <div class="options">
            <button
              v-for="(opt, idx) in currentQuestion.options"
              :key="idx"
              class="opt-btn"
              :class="optionClass(idx)"
              @click="selectOption(idx)"
              :disabled="submitted"
            >
              <span class="opt-letter">{{ letter(idx) }}</span>
              <span class="opt-text">{{ opt }}</span>
            </button>
          </div>

          <div class="actions-row">
            <button class="btn ghost" @click="prev" :disabled="currentIndex===0">Prev</button>
            <button class="btn ghost" @click="next" :disabled="currentIndex===questions.length-1">Next</button>
          </div>

          <div class="primary-action">
            <button class="btn primary" @click="submitted ? reset() : finish()">
              {{ primaryLabel }}
            </button>
          </div>
        </div>
      </transition>

      <div v-if="submitted" class="result-box">
        <div class="result-summary">
          <div class="score">{{ score }} / {{ questions.length }}</div>
          <div class="pass" :class="{ pass: passed, fail: !passed }">{{ passed ? 'Đỗ' : 'Trượt' }}</div>
        </div>

        <div class="wrong-list" v-if="wrongList.length">
          <h4>Các câu sai ({{ wrongList.length }})</h4>
          <div v-for="w in wrongList" :key="w.index" class="wrong-item">
            <div class="w-q"><strong>Câu {{ w.index }}:</strong> {{ w.question }}</div>
            <div class="w-ans">Đáp án bạn chọn: <strong>{{ showOpt(w.chosen) }}</strong></div>
            <div class="w-correct">Đáp án đúng: <strong>{{ showOpt(w.correct) }}</strong></div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const examId = Number(route.params.examId) || 1

const questions = ref([])
const loading = ref(true)
const currentIndex = ref(0)
const answers = ref([])
const submitted = ref(false)
const score = ref(0)
const wrongList = ref([])
const passThreshold = 0.53333

// swipe handling
let touchStartX = 0
let touchCurrentX = 0
const MIN_SWIPE = 50
const transitionName = ref('slide-left') // default

function onTouchStart(e){ if(e.touches && e.touches.length) touchStartX = e.touches[0].clientX }
function onTouchMove(e){ if(e.touches && e.touches.length) touchCurrentX = e.touches[0].clientX }
function onTouchEnd(e){
  const dx = touchCurrentX - touchStartX
  if(Math.abs(dx) > MIN_SWIPE){
    if(dx < 0){ // swipe left -> next
      transitionName.value = 'slide-left'
      next()
    } else {
      transitionName.value = 'slide-right'
      prev()
    }
  }
  touchStartX = touchCurrentX = 0
}

// keyboard & number shortcuts
// function onKey(e){
//   if(e.key === 'ArrowRight'){ transitionName.value='slide-left'; next(); e.preventDefault() }
//   else if(e.key === 'ArrowLeft'){ transitionName.value='slide-right'; prev(); e.preventDefault() }
//   else if(e.key === 'Enter'){ if(!submitted.value) finish(); else reset(); e.preventDefault() }
//   else {
//     const key = e.key
//     if(!submitted.value && /^[1-5]$/.test(key)){
//       const idx = Number(key) - 1
//       if(currentQuestion.value && idx < currentQuestion.value.options.length){
//         selectOption(idx)
//       }
//     }
//   }
// }

// lifecycle: load data and register listeners
onMounted(async ()=>{
    window.addEventListener('keydown', onKey)
    try {
        const res = await fetch('/questions.json')
        const data = await res.json()
        const chunkSize = 40
        const exams = []
        for(let i=0;i<data.length;i+=chunkSize) exams.push(data.slice(i,i+chunkSize))
        const idx = Math.max(1, examId) - 1
        if(idx >= exams.length){ router.push('/'); return }
        questions.value = exams[idx]
        answers.value = Array(questions.value.length).fill(null)
    } catch(e){ console.error(e) } finally { loading.value = false }
})

onUnmounted(()=>{ window.removeEventListener('keydown', onKey) })

// core logic
const currentQuestion = computed(()=> questions.value[currentIndex.value] || { options: [], question: '' })
const progressPercent = computed(()=> questions.value.length ? Math.round(((currentIndex.value + 1) / questions.value.length) * 100) : 0)

function letter(i){ return ['A','B','C','D','E'][i] || String.fromCharCode(65+i) }
function selectOption(idx){ if(submitted.value) return; answers.value[currentIndex.value] = idx }
function optionClass(idx){
    const chosen = answers.value[currentIndex.value]
    if(!submitted.value) return { selected: chosen === idx }
    const correctIdx = (currentQuestion.value.correctIndex || null) ? (currentQuestion.value.correctIndex - 1) : null
    if(correctIdx === idx) return 'correct'
    if(chosen === idx && chosen !== correctIdx) return 'wrong'
    return ''
}
function next(){ if(currentIndex.value < questions.value.length - 1){ transitionName.value='slide-left'; currentIndex.value++ } }
function prev(){ if(currentIndex.value > 0){ transitionName.value='slide-right'; currentIndex.value-- } }

function finish(){
    let c=0; const wrong=[]
    questions.value.forEach((q,i)=>{
        const chosen = answers.value[i]
        const correct = q.correctIndex ? q.correctIndex -1 : null
        if(chosen === correct) c++
        else wrong.push({ index: i+1, question: q.question, chosen, correct })
    })
    score.value = c; submitted.value = true; wrongList.value = wrong
}

function reset(){
    answers.value = Array(questions.value.length).fill(null)
    submitted.value = false
    score.value = 0
    wrongList.value = []
    currentIndex.value = 0
}

const primaryLabel = computed(()=> submitted.value ? 'Làm lại' : 'Nộp bài')
const passed = computed(()=> score.value >= Math.ceil(questions.value.length * passThreshold))

function showOpt(idx){
    if(idx === null || idx === undefined) return '(Không chọn)'
    return idx === null ? '(Không chọn)' : (letter(idx) + '. ' + (questions.value[0] && questions.value[0].options[idx] ? questions.value[0].options[idx] : ''))
}
</script>

<style scoped>
.center{ text-align:center; color:var(--muted) }
.actions-row{ display:flex; gap:10px; margin-top:12px }
.primary-action{ margin-top:10px ; width:100% }
</style>
