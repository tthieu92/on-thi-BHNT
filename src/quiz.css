:root {
    --bg: #f6f8fb;
    --card: #ffffff;
    --muted: #6b7280;
    --accent-start: #3b82f6;
    --accent-end: #7c3aed;
    --success: #10b981;
    --danger: #ef4444
}

@media (prefers-color-scheme: dark) {
    :root {
        --bg: #0b1020;
        --card: #0f1724;
        --muted: #9ca3af
    }

    body {
        background: var(--bg);
        color: #e6eef8
    }
}

body {
    margin: 0;
    font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
    background: var(--bg);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale
}

.app-shell {
    max-width: 720px;
    margin: 0 auto;
    padding: 14px;
    min-height: 100vh;
    display: flex;
    flex-direction: column
}

.topbar {
    text-align: left;
    margin-bottom: 12px
}

.topbar h1 {
    margin: 0;
    font-size: 20px
}

.topbar .subtitle {
    margin: 0;
    font-size: 12px;
    color: var(--muted)
}

.home-card,
.quiz-card {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.4));
    padding: 14px;
    border-radius: 14px;
    box-shadow: 0 8px 30px rgba(15, 23, 42, 0.08)
}

.progress-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px
}

.progress-info {
    font-size: 13px;
    color: var(--muted)
}

.progress-info.right {
    margin-left: auto
}

.progress-bar {
    flex: 1;
    height: 10px;
    background: linear-gradient(90deg, #e6e9f2, #f3f4f6);
    border-radius: 999px;
    overflow: hidden
}

.progress-fill {
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, var(--accent-start), var(--accent-end));
    transition: width 350ms ease;
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.18)
}

.question-area {
    display: flex;
    flex-direction: column;
    gap: 12px
}

.q-box {
    background: var(--card);
    padding: 12px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(2, 6, 23, 0.04)
}

.q-header {
    margin-bottom: 8px
}

.q-number {
    font-size: 13px;
    color: var(--muted)
}

.q-text {
    font-weight: 600;
    margin-top: 6px;
    font-size: 16px
}

.options {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 8px
}

.opt-btn {
    display: flex;
    gap: 12px;
    align-items: flex-start center;
    padding: 12px;
    border-radius: 10px;
    border: 1px solid rgba(15, 23, 42, 0.06);
    background: transparent;
    cursor: pointer;
    text-align: left;
    justify-items: center;
    width: 100%;
    transition: all 180ms ease
}

.opt-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(15, 23, 42, 0.06)
}

.opt-letter {
    width: 28px;
    height: 28px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background: linear-gradient(90deg, var(--accent-start), var(--accent-end));
    color: white;
    font-weight: 700
}

.opt-text {
    flex: 1;
    justify-content: center;
    vertical-align: middle;
    white-space: normal
}

.opt-btn.selected {
    background: linear-gradient(90deg, rgba(59, 130, 246, 0.08), rgba(124, 58, 237, 0.06));
    border: 1px solid rgba(59, 130, 246, 0.18)
}

.opt-btn.correct {
    background: linear-gradient(90deg, rgba(16, 185, 129, 0.08), rgba(16, 185, 129, 0.04));
    border: 1px solid rgba(16, 185, 129, 0.18)
}

.opt-btn.wrong {
    background: linear-gradient(90deg, rgba(239, 68, 68, 0.06), rgba(239, 68, 68, 0.03));
    border: 1px solid rgba(239, 68, 68, 0.12);
    opacity: 0.95
}

.actions {
    display: flex;
    gap: 10px;
    margin-top: 12px
}

.btn {
    flex: 1;
    padding: 12px;
    border-radius: 10px;
    border: none;
    background: linear-gradient(90deg, var(--accent-start), var(--accent-end));
    color: white;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.12)
}

.btn.ghost {
    background: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
    border: 1px solid rgba(15, 23, 42, 0.06);
    color: var(--muted);
    font-weight: 600
}

.result-box {
    margin-top: 12px;
    background: var(--card);
    padding: 12px;
    border-radius: 12px
}

.result-summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px
}

.score {
    font-size: 20px;
    font-weight: 800
}

.pass {
    font-size: 14px;
    padding: 6px 10px;
    border-radius: 999px;
    color: white
}

.pass.pass {
    background: linear-gradient(90deg, #16a34a, #10b981)
}

.pass.fail {
    background: linear-gradient(90deg, #ef4444, #f97316)
}

.wrong-list {
    margin-top: 10px
}

.wrong-item {
    padding: 8px;
    border-radius: 8px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0));
    border: 1px solid rgba(15, 23, 42, 0.03);
    margin-bottom: 8px
}

.w-q {
    font-weight: 600
}

.w-ans,
.w-correct {
    font-size: 13px;
    color: var(--muted);
    margin-top: 4px
}

.center {
    text-align: center;
    color: var(--muted)
}

/* transitions */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
    transition: transform 300ms ease, opacity 300ms ease;
    position: relative;
}

.slide-left-enter-from {
    transform: translateX(30%);
    opacity: 0
}

.slide-left-enter-to {
    transform: translateX(0);
    opacity: 1
}

.slide-left-leave-from {
    transform: translateX(0);
    opacity: 1
}

.slide-left-leave-to {
    transform: translateX(-30%);
    opacity: 0
}

.slide-right-enter-from {
    transform: translateX(-30%);
    opacity: 0
}

.slide-right-enter-to {
    transform: translateX(0);
    opacity: 1
}

.slide-right-leave-from {
    transform: translateX(0);
    opacity: 1
}

.slide-right-leave-to {
    transform: translateX(30%);
    opacity: 0
}

@media (max-width:420px) {
    .app-shell {
        padding: 10px
    }

    .q-text {
        font-size: 15px
    }

    .opt-btn {
        padding: 10px
    }

    .opt-letter {
        width: 24px;
        height: 24px;
        font-size: 13px
    }

    .btn {
        padding: 10px
    }
}
