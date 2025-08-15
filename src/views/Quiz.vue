<template>
  <div class="quiz-card">
    <div class="quiz-header">
      <button class="home-btn" @click="router.push('/')">🏠</button>
      <div class="progress-info">Đề: <span class="muted">{{ examId }}</span></div>
      <div class="progress-bar" role="progressbar" :aria-valuenow="progressPercent">
        <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
      </div>
      <div class="progress-info">{{ currentIndex + 1 }}/{{ questions.length }}</div>
      <div class="user-time">
        <span class="username" v-if="username">👤 {{ username }}</span>
        <span class="timer" :class="{ danger: remainingSeconds <= 300 }">{{ timeText }}</span>
      </div>
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
    <!-- Name Popup Overlay -->
    <transition name="fade">
      <div v-if="showNamePopup" class="overlay">
        <div class="popup-card">
          <div class="popup-icon" aria-hidden="true">
            <!-- Simple user SVG -->
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="7" r="4" stroke="white" stroke-width="2"/>
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="white" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <h3>Nhập tên để bắt đầu</h3>
          <div class="input-row">
            <span class="input-icon">👤</span>
            <input v-model="tempName" type="text" placeholder="Tên của bạn" @keyup.enter="confirmName" />
          </div>
          <button class="btn primary full-width" @click="confirmName">Bắt đầu</button>
        </div>
      </div>
    </transition>
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
const passThreshold = 0.8

// username + popup
const username = ref(localStorage.getItem('username') || '')
const showNamePopup = ref(!username.value)
const tempName = ref('')

// countdown
const totalSeconds = 60 * 60
const remainingSeconds = ref(totalSeconds)
const timeText = computed(()=> {
  const m = Math.floor(remainingSeconds.value / 60).toString().padStart(2,'0')
  const s = Math.floor(remainingSeconds.value % 60).toString().padStart(2,'0')
  return `${m}:${s}`
})
let timerId = null
let warned = false
const startTime = ref(null)

function startCountdown(){
  if(timerId) clearInterval(timerId)
  startTime.value = new Date()
  remainingSeconds.value = totalSeconds
  warned = false
  timerId = setInterval(()=>{
    remainingSeconds.value--
    if(!warned && remainingSeconds.value <= 300){
      warned = true
      playBeep()
    }
    if(remainingSeconds.value <= 0){
      clearInterval(timerId); timerId = null
      if(!submitted.value) finish()
    }
  }, 1000)
}

let audioCtx = null
function playBeep(freq=880, dur=0.25){
  try{
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)()
    const o = audioCtx.createOscillator()
    const g = audioCtx.createGain()
    o.type = 'sine'; o.frequency.value = freq
    o.connect(g); g.connect(audioCtx.destination)
    g.gain.setValueAtTime(0.0001, audioCtx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.1, audioCtx.currentTime + 0.01)
    o.start()
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur)
    o.stop(audioCtx.currentTime + dur)
  }catch(e){ /* ignore */ }
}

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
    if(!username.value){
      showNamePopup.value = true
    } else {
      // start immediately
      startCountdown()
    }
  } catch(e){
    console.error(e)
  } finally {
    loading.value = false
  }
})

onUnmounted(()=>{
  if(timerId) clearInterval(timerId)
})

// watch(()=>route.params.examId, (v)=>{ location.reload() })

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

async function finish(){
  let c=0; const wrong=[]
  questions.value.forEach((q,i)=>{
    const chosen = answers.value[i]
    const correct = q.correctIndex ? q.correctIndex -1 : null
    if (chosen === correct) c++
    else wrong.push({ index: i+1, question: q.question, chosen, correct })
  })
  score.value = c; 
  submitted.value = true; 
  wrongList.value = wrong

  // duration
  const end = new Date();
  const durMs = startTime.value ? (end - startTime.value) : (totalSeconds - remainingSeconds.value) * 1000
  const durMin = Math.round(durMs / 60000)
  // Gửi log
  const payload = {
    user: localStorage.getItem('username') || 'Unknown',
    exam: examId,
    score: `${c}/${questions.value.length}`,
    duration: `${durMin} phút`,
    submittedAt: formatSubmittedAt(end)
  };

  try{
    fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  }catch(e){ /* ignore */ }
}

function reset(){
    answers.value = Array(questions.value.length).fill(null)
    submitted.value = false
    score.value = 0
    wrongList.value = []
    currentIndex.value = 0
    startCountdown()
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

// name popup actions
function confirmName(){
  const name = (tempName.value || '').trim()
  if(!name) return
  username.value = name
  localStorage.setItem('username', name)
  showNamePopup.value = false
  // start after user interacted -> audio allowed
  startCountdown()
}

// formatting
function formatSubmittedAt(dt){
  const y = dt.getFullYear()
  const m = String(dt.getMonth()+1).padStart(2,'0')
  const d = String(dt.getDate()).padStart(2,'0')
  const hh = String(dt.getHours()).padStart(2,'0')
  const mm = String(dt.getMinutes()).padStart(2,'0')
  return `${y}/${m}/${d} ${hh}h${mm}`
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
.progress-meta { font-size: 12px; color: var(--muted) }

.user-time { display: flex; flex-direction: column; gap: 2px; align-items: flex-end }
.username { font-size: 12px; color: var(--muted) }
.timer { font-weight: 800 }
.timer.danger { color: #ef4444 }
.full-half { flex: 1; }
.full-width { width: 100%; }
/* Popup */
.overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 100;
}
.popup-card {
  width: min(92vw, 440px);
  background: linear-gradient(180deg, rgba(59,130,246,0.15), rgba(124,58,237,0.12));
  border: 1px solid rgba(255,255,255,0.2);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 12px 36px rgba(15,23,42,0.25);
  color: white;
  text-align: center;
}
.popup-icon { margin: 8px auto 4px; opacity: 0.95 }
.input-row {
  display:flex; align-items:center; gap:8px;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: 12px; padding: 10px 12px; margin: 12px 0;
}
.input-row .input-icon { font-size: 16px; opacity: 0.9 }
.input-row input {
  flex:1; background: transparent; border: none; outline: none;
  color: white; font-size: 16px;
}
.fade-enter-active, .fade-leave-active { transition: opacity 250ms ease }
.fade-enter-from, .fade-leave-to { opacity: 0 }

</style>
