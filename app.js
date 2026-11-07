(() => {
  const copy = {
    th: {
      prototype: 'ต้นแบบโครงงาน', language: 'ภาษาของเดโม',
      title: ['แจ้งบัตรหาย', 'ด้วยเสียง'],
      subtitle: 'ทดลองคุยกับผู้ช่วยเสียงกรุงไทย ตั้งแต่แจ้งบัตรเดบิตหายจนถึงจำลองการอายัดและออกบัตรใหม่',
      tryDemo: 'เริ่มทดลอง', scenarioKicker: 'สถานการณ์จำลอง', scenarios: 'เลือกเรื่องที่จะคุย',
      journeyKicker: 'ติดตามสถานะ', journeyTitle: 'ขั้นตอนอายัดบัตร',
      safeTitle: 'ข้อมูลสมมติสำหรับเดโม', safeBody: 'กรุณาอย่าป้อนรหัส PIN, OTP หรือข้อมูลบัญชีจริง',
      voiceNote: 'การแปลงเสียงอาจใช้บริการของเบราว์เซอร์',
      footer: 'ต้นแบบเพื่อการศึกษา · ทุกธุรกรรมเป็นการจำลอง',
      audio: 'เสียงตอบกลับอัตโนมัติ', reset: 'เริ่มบทสนทนาใหม่',
      transcript: 'บทสนทนา', mic: 'เริ่มพูด', stopMic: 'หยุดฟัง', send: 'ส่งข้อความ', message: 'พิมพ์ข้อความ',
      placeholder: 'พิมพ์ข้อความ หรือกดไมค์เพื่อพูด…', noMicPlaceholder: 'พิมพ์ข้อความที่นี่…',
      idle: 'พร้อมสนทนา', listening: 'กำลังฟัง…', speaking: 'กำลังตอบด้วยเสียง…',
      user: 'คุณ', assistant: 'ผู้ช่วยเสียง', redacted: 'ซ่อนข้อความที่อาจเป็นข้อมูลส่วนตัว',
      unavailable: 'เบราว์เซอร์นี้ใช้ไมค์ไม่ได้ ลองพิมพ์ข้อความหรือเลือกสถานการณ์',
      permission: 'เบราว์เซอร์ไม่อนุญาตให้ใช้ไมค์ คุณยังพิมพ์ข้อความได้',
      noSpeech: 'ไม่ได้ยินเสียง ลองพูดอีกครั้งหรือพิมพ์ข้อความ',
      microphoneError: 'ใช้การรับเสียงไม่ได้ในขณะนี้ คุณยังพิมพ์ข้อความได้',
      speechError: 'เล่นเสียงตอบกลับไม่ได้ คุณยังอ่านข้อความได้',
      verify: 'ยืนยันตัวตนจำลอง', block: 'อายัดบัตรเดบิต', replacement: 'ขอบัตรใหม่', delivery: 'ยืนยันการจัดส่ง',
      replacement_ordered: 'ผลจำลอง · อายัดบัตรและสั่งบัตรใหม่แล้ว',
      card_blocked: 'ผลจำลอง · อายัดบัตรแล้ว',
      canceled: 'ผลจำลอง · ยกเลิกขั้นตอนแล้ว',
      verification_failed: 'ผลจำลอง · ส่งต่อเจ้าหน้าที่โดยยังไม่ได้อายัดบัตร'
    },
    en: {
      prototype: 'Classroom prototype', language: 'Demo language',
      title: ['Lost your card?', 'Just say it.'],
      subtitle: 'Try the Krungthai voice assistant for a lost debit card, from reporting it to blocking it and ordering a replacement.',
      tryDemo: 'Try the demo', scenarioKicker: 'DEMO SCENARIOS', scenarios: 'Choose a scenario',
      journeyKicker: 'JOURNEY TRACKER', journeyTitle: 'Card blocking steps',
      safeTitle: 'Fictional demo data', safeBody: 'Keep real PINs, OTPs, and account details out of the demo.',
      voiceNote: 'Voice recognition may use your browser’s speech service.',
      footer: 'Classroom prototype · All banking actions are simulated',
      audio: 'Spoken replies', reset: 'Start a new conversation',
      transcript: 'Conversation transcript', mic: 'Start listening', stopMic: 'Stop listening', send: 'Send message', message: 'Type a message',
      placeholder: 'Type a message, or tap the mic to speak…', noMicPlaceholder: 'Type a message…',
      idle: 'Ready to chat', listening: 'Listening…', speaking: 'Speaking…',
      user: 'You', assistant: 'Voice assistant', redacted: 'Potentially sensitive message hidden',
      unavailable: 'This browser cannot use the microphone here. Type a message or choose a scenario.',
      permission: 'Microphone access was denied. You can still type a message.',
      noSpeech: 'No speech was detected. Try again or type your message.',
      microphoneError: 'Voice input is unavailable right now. You can still type a message.',
      speechError: 'Audio playback is unavailable. The reply is in the transcript.',
      verify: 'Verify identity', block: 'Block debit card', replacement: 'Request replacement', delivery: 'Confirm delivery',
      replacement_ordered: 'Simulated outcome · Card blocked and replacement ordered',
      card_blocked: 'Simulated outcome · Card blocked',
      canceled: 'Simulated outcome · Request canceled',
      verification_failed: 'Simulated outcome · Referred to an agent without blocking the card'
    }
  };

  const ui = Object.fromEntries([
    'scenario-list', 'journey-steps', 'outcome', 'voice-state', 'audio', 'reset',
    'transcript', 'quick-replies', 'notice', 'composer', 'mic', 'message',
    'try-demo', 'conversation'
  ].map(id => [id, document.getElementById(id)]));
  const steps = ['verify', 'block', 'replacement', 'delivery'];
  const dialogue = window.KTBDialogue.create();
  let lang = 'th';
  let voiceState = 'idle';
  let audioEnabled = true;
  let activeScenario = null;
  let journeyStep = null;
  let outcome = null;
  let noticeKey = null;

  const voice = window.KTBVoice.create({
    onTranscript: text => submit(text),
    onState: state => {
      voiceState = state;
      renderControls();
    },
    onError: code => {
      const errors = {
        'unsupported-listening': 'unavailable', 'not-allowed': 'permission',
        'service-not-allowed': 'permission', 'no-speech': 'noSpeech',
        'recognition-timeout': 'noSpeech', 'speech-error': 'speechError',
        'unsupported-speaking': 'speechError', 'language-unavailable': 'speechError',
        'voice-unavailable': 'speechError', 'synthesis-unavailable': 'speechError',
        'synthesis-failed': 'speechError', 'audio-busy': 'speechError'
      };
      showNotice(errors[code] ?? 'microphoneError');
    }
  });

  function icon(name) {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    const use = document.createElementNS(ns, 'use');
    svg.setAttribute('aria-hidden', 'true');
    use.setAttribute('href', '#i-' + name);
    svg.append(use);
    return svg;
  }

  function label(button, key) {
    button.setAttribute('aria-label', copy[lang][key]);
    button.title = copy[lang][key];
  }

  function renderControls() {
    const listening = voiceState === 'listening';
    ui['voice-state'].dataset.state = voiceState;
    ui['voice-state'].textContent = copy[lang][voiceState] ?? copy[lang].idle;
    ui.mic.setAttribute('aria-pressed', String(listening));
    ui.mic.replaceChildren(icon(listening ? 'stop' : 'mic'));
    label(ui.mic, listening ? 'stopMic' : 'mic');
    ui.audio.setAttribute('aria-pressed', String(audioEnabled && voice.canSpeak));
    ui.audio.replaceChildren(icon(audioEnabled && voice.canSpeak ? 'volume' : 'mute'));
    ui.audio.disabled = !voice.canSpeak;
  }

  function showNotice(key) {
    noticeKey = key;
    ui.notice.hidden = !key;
    ui.notice.textContent = key ? copy[lang][key] : '';
  }

  function renderScenarios() {
    ui['scenario-list'].replaceChildren(...window.KTBDialogue.scenarios.map(scenario => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'scenario';
      button.dataset.scenario = scenario.id;
      button.setAttribute('aria-pressed', String(activeScenario === scenario.id));
      const mark = document.createElement('span');
      mark.className = 'scenario-icon';
      mark.append(icon(scenario.icon));
      const text = document.createElement('span');
      const title = document.createElement('strong');
      title.textContent = scenario.title[lang];
      const description = document.createElement('small');
      description.textContent = scenario.description[lang];
      text.append(title, description);
      button.append(mark, text, icon('arrow'));
      button.addEventListener('click', () => {
        submit(scenario.prompt[lang], scenario.id);
        ui['conversation'].scrollIntoView({block: 'nearest'});
      });
      return button;
    }));
  }

  function renderJourney() {
    const stepIndex = steps.indexOf(journeyStep);
    const completedSteps = outcome === 'replacement_ordered' ? 4 :
      outcome === 'card_blocked' ? 2 : Math.max(stepIndex, 0);
    ui['journey-steps'].replaceChildren(...steps.map((step, index) => {
      const item = document.createElement('li');
      if (index === stepIndex) item.setAttribute('aria-current', 'step');
      const complete = index < completedSteps;
      item.dataset.done = String(complete);
      const marker = document.createElement('i');
      marker.textContent = complete ? '✓' : String(index + 1);
      marker.setAttribute('aria-hidden', 'true');
      item.append(marker, copy[lang][step]);
      return item;
    }));
    ui.outcome.hidden = !outcome || !copy[lang][outcome];
    ui.outcome.dataset.handoff = String(outcome === 'verification_failed');
    ui.outcome.textContent = copy[lang][outcome] ?? '';
  }

  function renderText() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-copy]').forEach(element => {
      const value = copy[lang][element.dataset.copy];
      if (Array.isArray(value)) {
        const line = document.createElement('span');
        line.textContent = value[1];
        element.replaceChildren(value[0], line);
      } else {
        element.textContent = value;
      }
    });
    document.querySelectorAll('[data-label]').forEach(element => {
      element.setAttribute('aria-label', copy[lang][element.dataset.label]);
    });
    label(ui.audio, 'audio');
    label(ui.reset, 'reset');
    label(document.querySelector('[data-label=send]'), 'send');
    ui.message.placeholder = copy[lang][voice.canListen ? 'placeholder' : 'noMicPlaceholder'];
    document.querySelectorAll('[data-lang]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.lang === lang));
    });
    showNotice(noticeKey);
    renderControls();
    renderScenarios();
    renderJourney();
  }

  function turn(kind, content) {
    const entry = document.createElement('article');
    entry.className = 'turn ' + kind;
    if (kind === 'assistant') {
      const mark = document.createElement('span');
      mark.className = 'assistant-mark';
      mark.append(icon('wave'));
      entry.append(mark);
    }
    const body = document.createElement('div');
    body.className = 'turn-body';
    const heading = document.createElement('p');
    heading.className = 'turn-label';
    heading.textContent = copy[lang][kind];
    const text = document.createElement('p');
    text.className = 'bubble';
    text.textContent = content;
    body.append(heading, text);
    entry.append(body);
    ui.transcript.append(entry);
    ui.transcript.scrollTop = ui.transcript.scrollHeight;
  }

  function quickReplies(items) {
    const container = ui['quick-replies'];
    container.hidden = items.length === 0;
    container.replaceChildren(...items.map(item => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = item.label;
      button.addEventListener('click', () => {
        submit(item.text, null, item.label);
        const nextChoice = container.querySelector('button');
        (nextChoice ?? ui.message).focus({preventScroll: true});
      });
      return button;
    }));
  }

  function submit(text, scenarioId = null, displayText = text) {
    const input = text.trim();
    if (!input) return;
    voice.stopListening();
    voice.stopSpeaking();
    showNotice(null);
    ui.message.value = '';
    const result = dialogue.reply(input, lang);
    const scenario = window.KTBDialogue.scenarios.find(item => item.id === result.intent);
    if (scenarioId || scenario) activeScenario = scenarioId ?? scenario.id;
    if (result.intent === 'card') {
      journeyStep = result.step;
      if (steps.includes(journeyStep)) outcome = null;
    } else if (scenario && steps.includes(journeyStep)) {
      const alreadyBlocked = ['replacement', 'delivery'].includes(journeyStep);
      journeyStep = null;
      outcome = alreadyBlocked ? 'card_blocked' : 'canceled';
    }
    if (result.outcome) outcome = result.outcome;
    turn('user', result.redactInput ? copy[lang].redacted : displayText.trim());
    turn('assistant', result.text);
    quickReplies(result.quickReplies);
    renderJourney();
    ui['scenario-list'].querySelectorAll('button').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.scenario === activeScenario));
    });
    if (audioEnabled && voice.canSpeak) voice.speak(result.text, lang);
  }

  function reset() {
    voice.reset();
    dialogue.reset();
    activeScenario = null;
    journeyStep = null;
    outcome = null;
    ui.message.value = '';
    ui.transcript.replaceChildren();
    quickReplies([]);
    showNotice(null);
    renderText();
    turn('assistant', window.KTBDialogue.welcome(lang));
  }

  ui.composer.addEventListener('submit', event => {
    event.preventDefault();
    submit(ui.message.value);
  });
  ui.mic.addEventListener('click', () => {
    showNotice(null);
    if (voiceState === 'listening') voice.stopListening();
    else voice.listen(lang);
  });
  ui.audio.addEventListener('click', () => {
    audioEnabled = !audioEnabled;
    if (!audioEnabled) voice.stopSpeaking();
    renderControls();
  });
  ui.reset.addEventListener('click', () => {
    reset();
    ui.message.focus({preventScroll: true});
  });
  ui['try-demo'].addEventListener('click', () => {
    reset();
    ui['scenario-list'].querySelector('[data-scenario=card]').click();
    ui['conversation'].scrollIntoView({block: 'start'});
    ui['quick-replies'].querySelector('button')?.focus({preventScroll: true});
  });
  document.querySelectorAll('[data-lang]').forEach(button => {
    button.addEventListener('click', () => {
      if (lang === button.dataset.lang) return;
      lang = button.dataset.lang;
      reset();
    });
  });
  reset();
})();
