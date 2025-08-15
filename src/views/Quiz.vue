<template>
  <div class="quiz-card">
    <!-- <div class="progress-row">
      <button class="home-btn" @click="router.push('/')">🏠</button>
      <div class="progress-info">Đề: <span class="muted">{{ examId }}</span></div>
      <div class="progress-bar" role="progressbar" :aria-valuenow="progressPercent">
        <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
      </div>
      <div class="progress-info right">{{ currentIndex + 1 }}/{{ questions.length }}</div>
    </div> -->
    <div class="quiz-header">
      <button class="home-btn" @click="router.push('/')">🏠</button>
      <div class="progress-info">Đề: <span class="muted">{{ examId }}</span></div>
      <div class="progress-bar" role="progressbar" :aria-valuenow="progressPercent">
        <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
      </div>
      <div class="progress-info">{{ currentIndex + 1 }}/{{ questions.length }}</div>
    </div>

    <div v-if="loading" class="center">Đang tải câu hỏi...</div>

    <section v-else class="question-area">
      <div class="q-box">
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
            <button class="btn primary" style="width: 100%; margin-top: 10px;" @click="submitted ? reset() : finish()">
              {{ primaryLabel }}
            </button>
          </div>
      </div>

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
            <div class="w-correct">Đáp án đúng: <strong>{{ showCorrect(w.index, w.correct) }}</strong></div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
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
const passThreshold = 0.8

onMounted(async () => {
  try {
    const res = await fetch('/questions.json')
    const data = await res.json()
    const chunkSize = 40
    const exams = []
    for (let i=0;i<data.length;i+=chunkSize) exams.push(data.slice(i,i+chunkSize))
    const idx = Math.max(1, examId) - 1
    if (idx >= exams.length) {
      router.push('/')
      return
    }
    questions.value = exams[idx]
    answers.value = Array(questions.value.length).fill(null)
  } catch(e){
    console.error(e)
  } finally {
    loading.value = false
  }
})

watch(()=>route.params.examId, (v)=>{ location.reload() })

const currentQuestion = computed(()=> questions.value[currentIndex.value] || { options: [], question: '' })
const progressPercent = computed(()=> { if (!questions.value.length) return 0; return Math.round(((currentIndex.value + 1) / questions.value.length) * 100) })

function letter(i){ return ['A','B','C','D','E'][i] || String.fromCharCode(65+i) }
function selectOption(idx){ if (submitted.value) return; answers.value[currentIndex.value] = idx }
function optionClass(idx){
  const chosen = answers.value[currentIndex.value]
  if (!submitted.value){ return { selected: chosen === idx } }
  else {
    const correctIdx = (currentQuestion.value.correctIndex || null) ? (currentQuestion.value.correctIndex - 1) : null
    if (correctIdx === idx) return 'correct'
    if (chosen === idx && chosen !== correctIdx) return 'wrong'
    return ''
  }
}

function next(){ if(currentIndex.value < questions.value.length - 1){ currentIndex.value++ }}
function prev(){ if(currentIndex.value > 0){ currentIndex.value-- }}

function finish(){
  let c=0; const wrong=[]
  questions.value.forEach((q,i)=>{
    const chosen = answers.value[i]
    const correct = q.correctIndex ? q.correctIndex -1 : null
    if (chosen === correct) c++
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
const wrongList = ref([])


function showOpt(idx){
    if(idx === null || idx === undefined) return '(Không chọn)'
    return idx === null ? '(Không chọn)' : (letter(idx) + '. ' + (questions.value[0] && questions.value[0].options[idx] ? questions.value[0].options[idx] : ''))
}
function showCorrect(index, idx){
    if(idx === null || idx === undefined) return '(Không chọn)'
    return idx === null ? '(Không chọn)' : (letter(idx) + '. ' + (questions.value[index-1] && questions.value[index-1].options[idx] ? questions.value[index-1].options[idx] : ''))
}
</script>

<style scoped>
.quiz-header {
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: var(--bg);
  z-index: 10;
}
.home-btn {
  font-size: 24px;  
  background: transparent;
  border: 1px solid #e6e9f2;
  border-radius: 5px;
  cursor: pointer;
}
.progress-bar {
  flex: 1;
  height: 10px;
  background: linear-gradient(90deg,#e6e9f2,#f3f4f6);
  border-radius: 999px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg,var(--accent-start), var(--accent-end));
  transition: width 350ms ease;
}
.progress-info {
  font-size: 14px;
  color: var(--muted);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 500;
}
.full-half { flex: 1; }
.full-width { width: 100%; }
.center{ text-align:center; color:var(--muted) }
.actions-row{ display:flex; gap:10px; margin-top:12px }
.primary-action{ margin-top:10px ; width:100% }
btn primary {width: 100%;}
</style>
