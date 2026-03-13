/* ════════════════════════════════════════════════
   RÉPÉTITEUR — Acting Practice App
   ════════════════════════════════════════════════ */

// ── State ──────────────────────────────────────
const state = {
  lines:       [],   // [{ character, text }]
  characters:  [],   // unique character names
  myCharacter: '',
  mode:        'teleprompter', // 'teleprompter' | 'memory' | 'prompt'
  current:     0,
  recordings:  [],
  mediaStream: null,
  recorder:    null,
  recChunks:   [],
  recInterval: null,
  recSeconds:  0,
};

// ── DOM refs ────────────────────────────────────
const $ = id => document.getElementById(id);

const screenSetup    = $('screen-setup');
const screenPractice = $('screen-practice');
const scriptFile     = $('script-file');
const uploadText     = $('upload-text');
const characterSect  = $('character-section');
const characterSelect= $('character-select');
const modeSect       = $('mode-section');
const btnStart       = $('btn-start');
const btnBack        = $('btn-back');
const btnRecord      = $('btn-record');
const recTimer       = $('rec-timer');
const recIndicator   = $('rec-indicator');
const videoPreview   = $('video-preview');
const linesContainer = $('lines-container');
const btnPrev        = $('btn-prev');
const btnNext        = $('btn-next');
const btnPrompt      = $('btn-prompt');
const progressBar    = $('progress-bar');
const progressText   = $('progress-text');
const headerChar     = $('header-character');
const headerMode     = $('header-mode');
const fabRecordings  = $('btn-show-recordings');
const modalRecordings= $('modal-recordings');
const recordingsList = $('recordings-list');
const btnCloseModal  = $('btn-close-modal');

// ── Script parsing ──────────────────────────────
/**
 * Parse a plain text script.
 * Supported formats:
 *   JEAN: Bonjour !          (character on same line)
 *   JEAN:                    (character on its own line, text follows)
 *
 * Lines that don't start with CHARNAME: are appended to the previous line.
 */
function parseScript(text) {
  const lines = [];
  const charPattern = /^([A-ZÀ-ÿa-z][A-ZÀ-ÿa-z0-9 _\-']{0,40})\s*:\s*(.*)/;
  const rawLines = text.split('\n');

  for (const raw of rawLines) {
    const trimmed = raw.trim();
    if (!trimmed) continue;

    const match = trimmed.match(charPattern);
    if (match) {
      const character = match[1].trim().toUpperCase();
      const lineText  = match[2].trim();
      lines.push({ character, text: lineText });
    } else {
      // Continuation of previous line
      if (lines.length > 0) {
        lines[lines.length - 1].text += ' ' + trimmed;
      }
    }
  }

  return lines;
}

function getCharacters(lines) {
  const seen = new Set();
  const chars = [];
  for (const l of lines) {
    if (!seen.has(l.character)) {
      seen.add(l.character);
      chars.push(l.character);
    }
  }
  return chars;
}

// ── File upload ─────────────────────────────────
scriptFile.addEventListener('change', () => {
  const file = scriptFile.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    const text = e.target.result;
    state.lines = parseScript(text);

    if (state.lines.length === 0) {
      alert('Aucune réplique détectée. Vérifiez le format du fichier (ex: JEAN: Bonjour !)');
      return;
    }

    state.characters = getCharacters(state.lines);
    uploadText.textContent = `✅ ${file.name} — ${state.lines.length} réplique(s)`;

    // Populate character selector
    characterSelect.innerHTML = state.characters
      .map(c => `<option value="${c}">${c}</option>`)
      .join('');

    characterSect.hidden = false;
    modeSect.hidden      = false;
    btnStart.hidden      = false;
  };
  reader.readAsText(file);
});

// ── Start session ───────────────────────────────
btnStart.addEventListener('click', async () => {
  state.myCharacter = characterSelect.value;
  state.mode = document.querySelector('input[name="mode"]:checked').value;
  state.current = 0;

  // Setup header
  headerChar.textContent = `🎭 ${state.myCharacter}`;
  const modeLabels = { teleprompter: '📜 Téléprompteur', memory: '🧠 Mémoire', prompt: '💬 Souffleur' };
  headerMode.textContent = modeLabels[state.mode];

  // Show/hide prompt button
  btnPrompt.classList.toggle('hidden', state.mode !== 'prompt');

  await startCamera();
  renderLines();
  showScreen('practice');
  fabRecordings.classList.remove('hidden');
});

// ── Camera ──────────────────────────────────────
async function startCamera() {
  try {
    state.mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: true,
    });
    videoPreview.srcObject = state.mediaStream;
  } catch (err) {
    console.warn('Camera unavailable:', err);
    // Still allow practice without camera
  }
}

function stopCamera() {
  if (state.mediaStream) {
    state.mediaStream.getTracks().forEach(t => t.stop());
    state.mediaStream = null;
    videoPreview.srcObject = null;
  }
}

// ── Recording ────────────────────────────────────
btnRecord.addEventListener('click', () => {
  if (state.recorder && state.recorder.state === 'recording') {
    stopRecording();
  } else {
    startRecording();
  }
});

function startRecording() {
  if (!state.mediaStream) {
    alert('Caméra non disponible pour l\'enregistrement.');
    return;
  }

  state.recChunks = [];
  state.recorder  = new MediaRecorder(state.mediaStream, { mimeType: getSupportedMimeType() });

  state.recorder.ondataavailable = e => {
    if (e.data.size > 0) state.recChunks.push(e.data);
  };

  state.recorder.onstop = saveRecording;
  state.recorder.start(1000);

  // UI
  btnRecord.textContent = '⏹ Arrêter';
  btnRecord.classList.add('recording');
  recIndicator.classList.remove('hidden');
  recTimer.classList.remove('hidden');
  state.recSeconds = 0;
  updateTimerDisplay();
  state.recInterval = setInterval(() => {
    state.recSeconds++;
    updateTimerDisplay();
  }, 1000);
}

function stopRecording() {
  if (state.recorder && state.recorder.state !== 'inactive') {
    state.recorder.stop();
  }
  clearInterval(state.recInterval);
  btnRecord.textContent = '⏺ Enregistrer';
  btnRecord.classList.remove('recording');
  recIndicator.classList.add('hidden');
  recTimer.classList.add('hidden');
}

function saveRecording() {
  const mime = getSupportedMimeType();
  const ext  = mime.includes('webm') ? 'webm' : 'mp4';
  const blob = new Blob(state.recChunks, { type: mime });
  const url  = URL.createObjectURL(blob);
  const ts   = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  state.recordings.push({ url, ts, ext });
  renderRecordingsList();
}

function getSupportedMimeType() {
  const types = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm', 'video/mp4'];
  return types.find(t => MediaRecorder.isTypeSupported(t)) || '';
}

function updateTimerDisplay() {
  const m = String(Math.floor(state.recSeconds / 60)).padStart(2, '0');
  const s = String(state.recSeconds % 60).padStart(2, '0');
  recTimer.textContent = `${m}:${s}`;
}

// ── Render lines ────────────────────────────────
function renderLines() {
  linesContainer.innerHTML = '';

  state.lines.forEach((line, idx) => {
    const isMine  = line.character === state.myCharacter;
    const isActive = idx === state.current;
    const isPast   = idx < state.current;

    const block = document.createElement('div');
    block.className = [
      'line-block',
      isActive ? 'active' : '',
      isPast   ? 'past'   : '',
    ].join(' ').trim();
    block.dataset.idx = idx;

    // Character label
    const charEl = document.createElement('div');
    charEl.className = `line-character ${isMine ? 'mine' : 'other'}`;
    charEl.textContent = line.character;
    block.appendChild(charEl);

    // Prompt badge (visible only in prompt mode when revealed)
    if (line._prompted) {
      const badge = document.createElement('div');
      badge.className = 'prompt-revealed-badge';
      badge.textContent = 'soufflé';
      block.appendChild(badge);
    }

    // Text
    const textEl = document.createElement('div');
    textEl.className = 'line-text';
    textEl.textContent = line.text;

    // Apply blur logic
    if (isMine && isActive) {
      if (state.mode === 'memory') {
        textEl.classList.add('blurred');
        textEl.title = 'Cliquer pour révéler';
        textEl.addEventListener('click', () => {
          textEl.classList.remove('blurred');
          textEl.classList.add('revealed');
        });
      } else if (state.mode === 'prompt' && !line._prompted) {
        textEl.classList.add('blurred');
      }
    }

    block.appendChild(textEl);
    linesContainer.appendChild(block);
  });

  scrollToActive();
  updateProgress();
  updateNavButtons();
}

function scrollToActive() {
  const active = linesContainer.querySelector('.line-block.active');
  if (active) {
    active.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// ── Navigation ───────────────────────────────────
btnNext.addEventListener('click', () => advance(1));
btnPrev.addEventListener('click', () => advance(-1));

document.addEventListener('keydown', e => {
  if ($('screen-practice').classList.contains('active')) {
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); advance(1); }
    if (e.key === 'ArrowLeft')                    { e.preventDefault(); advance(-1); }
  }
});

function advance(dir) {
  const next = state.current + dir;
  if (next < 0 || next >= state.lines.length) return;
  state.current = next;
  renderLines();
}

function updateNavButtons() {
  btnPrev.disabled = state.current === 0;
  btnNext.disabled = state.current === state.lines.length - 1;
}

// ── Prompt button ────────────────────────────────
btnPrompt.addEventListener('click', () => {
  const line = state.lines[state.current];
  if (!line) return;
  line._prompted = true;
  renderLines();
});

// ── Progress ─────────────────────────────────────
function updateProgress() {
  const pct = state.lines.length > 1
    ? ((state.current) / (state.lines.length - 1)) * 100
    : 100;
  progressBar.style.width = pct + '%';
  progressText.textContent = `Réplique ${state.current + 1} / ${state.lines.length}`;
}

// ── Recordings modal ──────────────────────────────
fabRecordings.addEventListener('click', () => {
  renderRecordingsList();
  modalRecordings.classList.remove('hidden');
});
btnCloseModal.addEventListener('click', () => {
  modalRecordings.classList.add('hidden');
});

function renderRecordingsList() {
  if (state.recordings.length === 0) {
    recordingsList.innerHTML = '<p style="color:var(--muted)">Aucun enregistrement pour l\'instant.</p>';
    return;
  }
  recordingsList.innerHTML = state.recordings.map((r, i) => `
    <div class="recording-item">
      <video src="${r.url}" controls style="width:120px;border-radius:6px;"></video>
      <div>
        <div style="font-weight:600;margin-bottom:.4rem">Prise ${i + 1} — ${r.ts}</div>
        <a href="${r.url}" download="repetition-prise-${i + 1}.${r.ext}">⬇ Télécharger</a>
      </div>
    </div>
  `).join('');
}

// ── Back to setup ────────────────────────────────
btnBack.addEventListener('click', () => {
  if (state.recorder && state.recorder.state === 'recording') stopRecording();
  stopCamera();
  fabRecordings.classList.add('hidden');
  showScreen('setup');
});

// ── Screen switcher ──────────────────────────────
function showScreen(name) {
  screenSetup.classList.toggle('active',    name === 'setup');
  screenPractice.classList.toggle('active', name === 'practice');
}
