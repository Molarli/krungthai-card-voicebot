(function () {
  "use strict";

  const scenarios = [
    {
      id: "card",
      icon: "card",
      title: { th: "อายัดบัตร", en: "Block a lost card" },
      description: { th: "ยืนยันตัวตน อายัดบัตร และขอบัตรใหม่ในระบบจำลอง", en: "Verify identity, block a lost demo card, and order its replacement." },
      prompt: { th: "บัตรเดบิตหาย ขออายัดและขอบัตรใหม่ค่ะ", en: "Hi, I lost my card. Please block it and issue a new one." }
    },
    {
      id: "balance",
      icon: "wallet",
      title: { th: "ตรวจสอบยอดเงิน", en: "Check a balance" },
      description: { th: "ดูยอดเงินของบัญชีตัวอย่าง", en: "View the available balance of a sample account." },
      prompt: { th: "ขอตรวจสอบยอดเงินค่ะ", en: "What's my account balance?" }
    },
    {
      id: "transfer",
      icon: "transfer",
      title: { th: "ติดตามรายการโอน", en: "Track a transfer" },
      description: { th: "ตรวจสอบสถานะรายการโอนตัวอย่าง", en: "Check the status of a sample transfer." },
      prompt: { th: "ขอตรวจสอบสถานะการโอนเงินค่ะ", en: "Can I check the status of my transfer?" }
    },
    {
      id: "handoff",
      icon: "headset",
      title: { th: "ติดต่อเจ้าหน้าที่", en: "Talk to an agent" },
      description: { th: "ดูขั้นตอนจำลองการส่งต่อให้เจ้าหน้าที่", en: "Try a simulated handoff to a support agent." },
      prompt: { th: "ขอคุยกับเจ้าหน้าที่ค่ะ", en: "I'd like to talk to a human agent." }
    }
  ];

  const copy = {
    th: {
      welcome: "สวัสดีค่ะ ยินดีต้อนรับสู่ Krungthai Card VoiceBot เดโมจำลองสำหรับแจ้งบัตรเดบิตหาย ลองพูด พิมพ์ หรือเลือกสถานการณ์ตัวอย่างได้เลยค่ะ",
      protected: "ฉันซ่อนข้อความนี้เพราะอาจมีข้อมูลส่วนตัวค่ะ กรุณาใช้ข้อมูลสมมติ และอย่าพิมพ์หรือพูดรหัสผ่าน PIN OTP หรือหมายเลขบัญชีจริงนะคะ",
      fallback: "ฉันยังจับใจความไม่ได้ค่ะ ลองบอกว่า บัตรหาย ตรวจสอบยอดเงิน ติดตามการโอนเงิน หรือติดต่อเจ้าหน้าที่ได้เลยค่ะ",
      balance: "บัญชีเงินฝากตัวอย่างมียอดเงินที่ใช้ได้ 12,450 บาทค่ะ ยอดนี้เป็นข้อมูลสมมติสำหรับการสาธิต",
      transfer: "รายการโอนตัวอย่างจำนวน 850 บาทมีสถานะสำเร็จค่ะ รหัสอ้างอิงของรายการสมมติคือ DEMO-TF-A",
      handoff: "การส่งต่อให้เจ้าหน้าที่ในระบบจำลองสำเร็จค่ะ ในระบบจริง เจ้าหน้าที่จะได้รับหัวข้อที่ต้องการความช่วยเหลือเพื่อรับช่วงต่อ",
      verify: "ก่อนอายัดบัตร กรุณาเลือกวิธียืนยันตัวตนแบบจำลองค่ะ เลือกใช้ PIN ตัวอย่างที่ระบบเตรียมไว้ หรือจำลองการยืนยันด้วยเสียง โดยไม่ต้องบอกรหัสหรือใช้ข้อมูลจริง",
      verifiedPin: "ยืนยันตัวตนด้วย PIN ตัวอย่างสำเร็จค่ะ",
      verifiedVoice: "จำลองการยืนยันตัวตนด้วยเสียงสำเร็จค่ะ",
      verificationFailed: "การยืนยันตัวตนจำลองไม่สำเร็จค่ะ ฉันส่งต่อเรื่องให้เจ้าหน้าที่จำลองแล้ว เลขที่เรื่อง DEMO-CARD-A บัตรตัวอย่างยังไม่ได้ถูกอายัด และยังไม่มีคำขอออกบัตรใหม่",
      block: "ต้องการยืนยันการอายัดบัตรเดบิตตัวอย่างไหมคะ",
      replacement: "อายัดบัตรเดบิตตัวอย่างสำเร็จค่ะ ต้องการขอออกบัตรใหม่ในระบบจำลองไหมคะ",
      delivery: "ยืนยันให้จัดส่งบัตรใหม่ไปยังที่อยู่ลงทะเบียนตัวอย่างได้เลยค่ะ ระบบใช้ที่อยู่สมมติที่เตรียมไว้ จึงไม่ต้องระบุที่อยู่ของคุณ",
      cardDone: "บัตรเดบิตตัวอย่างถูกอายัดแล้วค่ะ ระบบจำลองได้บันทึกคำขอออกบัตรใหม่และจัดส่งไปยังที่อยู่ลงทะเบียนตัวอย่างแล้ว",
      cardOnly: "บัตรเดบิตตัวอย่างถูกอายัดแล้วค่ะ ไม่มีคำขอออกบัตรใหม่ในรอบนี้",
      cardAlready: "บัตรเดบิตตัวอย่างถูกอายัดในระบบจำลองแล้วค่ะ",
      cardCancel: "ยกเลิกขั้นตอนก่อนอายัดบัตรตัวอย่างแล้วค่ะ",
      demoPin: "ใช้ PIN ตัวอย่าง",
      demoVoice: "จำลองยืนยันด้วยเสียง",
      demoFailure: "จำลองยืนยันไม่สำเร็จ",
      confirm: "ยืนยันการอายัด",
      order: "ขอออกบัตรใหม่",
      confirmDelivery: "ยืนยันการจัดส่ง",
      skip: "ข้ามการออกบัตรใหม่",
      cancel: "ยกเลิก"
    },
    en: {
      welcome: "Welcome to the Krungthai Card VoiceBot simulation. Speak or type your request, or choose a sample scenario.",
      protected: "I hid that message because it may contain personal information. Please use fictional data and keep real passwords, PINs, OTPs, and account numbers out of the demo.",
      fallback: "I didn’t catch that. Try reporting a lost card, checking a balance, tracking a transfer, or asking for a support agent.",
      balance: "The sample savings account has an available balance of 12,450 baht. This amount is fictional.",
      transfer: "The sample transfer of 850 baht shows as completed. The fictional reference is DEMO-TF-A.",
      handoff: "The simulated handoff is complete. In a live service, a support agent would receive the topic and take over the conversation.",
      verify: "First, choose a simulated way to verify your identity. You can use the preset demo PIN or simulate voice verification. Both options use fictional information.",
      verifiedPin: "Identity verification passed with the preset demo PIN.",
      verifiedVoice: "Simulated voice verification passed.",
      verificationFailed: "Simulated identity verification failed. I recorded a handoff to a demo agent under case DEMO-CARD-A. The sample card is still active and no replacement was ordered.",
      block: "Would you like to confirm blocking the sample debit card?",
      replacement: "The sample debit card is blocked. Would you like to order a replacement in this simulation?",
      delivery: "Please confirm delivery to the preset fictional address on file. The demo already has the address.",
      cardDone: "The sample debit card is blocked. The simulation recorded a replacement order for delivery to the fictional address on file.",
      cardOnly: "The sample debit card is blocked. No replacement was ordered in this session.",
      cardAlready: "The sample debit card is already blocked in this simulation.",
      cardCancel: "The session was canceled before the sample debit card was blocked.",
      demoPin: "Use demo PIN",
      demoVoice: "Simulate voice verification",
      demoFailure: "Simulate failed verification",
      confirm: "Confirm block",
      order: "Order replacement",
      confirmDelivery: "Confirm delivery",
      skip: "Skip replacement",
      cancel: "Cancel"
    }
  };

  const intents = [
    ["handoff", /เจ้าหน้าที่|พนักงาน|คุยกับคน|โอเปอเรเตอร์|\b(?:agent|representative|operator|human|customer service|customer support|support staff)\b/i],
    ["card", /บัตร.{0,24}(?:หาย|หามิได้|ถูกขโมย|อายัด|ระงับ|ล็อก|ล็อค|ปิดใช้งาน)|(?:อายัด|ระงับ|ล็อก|ล็อค).{0,16}บัตร|\b(?:lost|stolen|missing|block|freeze|lock|disable|cancel)(?:ed)?\b.*\bcard\b|\bcard\b.*\b(?:lost|stolen|missing|block|blocked|freeze|frozen|lock|locked|disable|disabled)\b/i],
    ["transfer", /สถานะ.{0,16}(?:โอน|รายการ)|(?:ติดตาม|ตรวจสอบ|เช็ค|เช็ก).{0,18}(?:โอน|รายการ)|โอน.{0,12}(?:สำเร็จ|หรือยัง|เข้าหรือยัง)|\b(?:status|track|check|did)\b.*\btransfer\b|\btransfer\b.*\b(?:status|complete|completed|go through|arrive)\b/i],
    ["balance", /ยอด(?:เงิน|คงเหลือ|บัญชี)|เงินเหลือ|\b(?:balance|available funds)\b/i]
  ];

  const cancellation = /^(?:please\s+)?(?:no\b|nope\b|cancel\b|stop\b|skip\b|don['’]?t\b|do not\b|never\s?mind\b|ยกเลิก|ข้าม|ไม่(?:เอา|ค่ะ|ครับ|ต้อง|ยืนยัน|อายัด|ใช่|ก่อน|แล้ว|\s|$)|หยุด)/i;
  const affirmation = /^(?:(?:yes|yep|confirm|okay|ok|go ahead)(?:[\s,]+please)?|(?:ยืนยัน|ตกลง|ใช่|ได้เลย)\s*(?:ค่ะ|ครับ|นะคะ)?)[.!\s]*$/i;
  const blockApproval = /^(?:(?:yes[, ]+)?(?:confirm (?:the )?block|(?:please )?block (?:it|(?:the|my) (?:debit )?card))|(?:ยืนยัน(?:การ)?อายัด(?:บัตร)?|อายัด(?:บัตร)?เลย|อายัดบัตร)\s*(?:ค่ะ|ครับ|นะคะ)?)[.!\s]*$/i;
  const deliveryApproval = /^(?:confirm (?:the )?delivery|ยืนยัน(?:การ)?จัดส่ง\s*(?:ค่ะ|ครับ|นะคะ)?)[.!\s]*$/i;
  const replacementApproval = /ขอ(?:ออก)?บัตร(?:ใบ)?ใหม่|ออกบัตร(?:ใบ)?ใหม่|\b(?:order|issue|send|get)\b.*\b(?:replacement|new (?:card|one))\b/i;
  const verificationFailure = /ยืนยัน(?:ตัวตน)?ไม่สำเร็จ|ยืนยัน(?:ตัวตน)?ไม่ผ่าน|\b(?:failed verification|verification failed|fail verification)\b/i;
  const pinVerification = /^(?:(?:please )?(?:use )?(?:(?:the )?(?:preset )?demo )?pin|(?:ขอ)?ใช้\s*pin\s*ตัวอย่าง\s*(?:ค่ะ|ครับ|นะคะ)?)[.!\s]*$/i;
  const voiceVerification = /ยืนยัน(?:ตัวตน)?ด้วยเสียง|ใช้เสียง|\b(?:voice verification|verify by voice|use (?:my )?voice)\b/i;
  const greeting = /^(?:สวัสดี|หวัดดี|hello\b|hi\b|hey\b)/i;
  const spokenEnglishDigits = /\b(?:zero|one|two|three|four|five|six|seven|eight|nine)(?:[\s,.-]+(?:zero|one|two|three|four|five|six|seven|eight|nine)){3,}\b/i;
  const spokenThaiDigits = /(?:ศูนย์|หนึ่ง|สอง|สาม|สี่|ห้า|หก|เจ็ด|แปด|เก้า)(?:[\s,.-]*(?:ศูนย์|หนึ่ง|สอง|สาม|สี่|ห้า|หก|เจ็ด|แปด|เก้า)){3,}/;
  const sharedSecret = /(?:\b(?:my\s+)?(?:pin|otp|password|passcode|account number|card number|cvv|cvc|address)\s*(?:is\s+|[:=]\s*)\S|(?:รหัสผ่าน|รหัส\s*otp|รหัส\s*pin|เลขบัญชี|เลขบัตร|ที่อยู่)\s*(?:ของฉัน\s*)?(?:คือ|[:=])\s*\S|\b(?:cvv|cvc)\s*\p{Nd}{3}\b)/iu;
  const numberSequence = /\p{Nd}(?:[\s,().+-]*\p{Nd}){3}/u;
  const shortCode = /^\s*\p{Nd}{3}\s*$/u;
  const emailAddress = /[^\s@]+@[^\s@]+\.[^\s@]+/u;

  function isSensitive(input) {
    const normalized = String(input ?? "").normalize("NFKC");
    return numberSequence.test(normalized) || shortCode.test(normalized) || spokenEnglishDigits.test(normalized) ||
      spokenThaiDigits.test(normalized) || sharedSecret.test(normalized) || emailAddress.test(normalized);
  }

  function languageKey(lang) {
    return String(lang ?? "").toLowerCase().startsWith("en") ? "en" : "th";
  }

  function welcome(lang) {
    return copy[languageKey(lang)].welcome;
  }

  function result(text, intent, status, quickReplies = [], step = null, outcome = null, redactInput = false) {
    return { text, intent, status, quickReplies, step, outcome, redactInput };
  }

  function suggestions(lang) {
    return scenarios.map((scenario) => ({ label: scenario.title[lang], text: scenario.prompt[lang] }));
  }

  function cardActions(words, step) {
    const choices = {
      verify: [words.demoPin, words.demoVoice, words.demoFailure, words.cancel],
      block: [words.confirm, words.cancel],
      replacement: [words.order, words.skip],
      delivery: [words.confirmDelivery, words.cancel]
    };
    return (choices[step] ?? []).map((text) => ({ label: text, text }));
  }

  function create() {
    let cardStep = null;
    let cardBlocked = false;
    let replacementOrdered = false;

    function reset() {
      cardStep = null;
      cardBlocked = false;
      replacementOrdered = false;
    }

    function askCard(words, step, text) {
      cardStep = step;
      return result(text, "card", "pending", cardActions(words, step), step);
    }

    function finishCard(text, step, outcome, status = "completed") {
      cardStep = null;
      return result(text, "card", status, [], step, outcome);
    }

    function continueCard(message, words) {
      if (cancellation.test(message)) {
        return cardBlocked
          ? finishCard(words.cardOnly, "done", "card_blocked")
          : finishCard(words.cardCancel, null, "canceled", "ready");
      }

      switch (cardStep) {
        case "verify":
          if (verificationFailure.test(message)) {
            return finishCard(words.verificationFailed, "escalated", "verification_failed", "handoff");
          }
          if (pinVerification.test(message)) {
            return askCard(words, "block", `${words.verifiedPin} ${words.block}`);
          }
          if (voiceVerification.test(message)) {
            return askCard(words, "block", `${words.verifiedVoice} ${words.block}`);
          }
          return askCard(words, "verify", words.verify);
        case "block":
          if (affirmation.test(message) || blockApproval.test(message)) {
            cardBlocked = true;
            return askCard(words, "replacement", words.replacement);
          }
          return askCard(words, "block", words.block);
        case "replacement":
          if (affirmation.test(message) || replacementApproval.test(message)) {
            return askCard(words, "delivery", words.delivery);
          }
          return askCard(words, "replacement", words.replacement);
        case "delivery":
          if (affirmation.test(message) || deliveryApproval.test(message)) {
            replacementOrdered = true;
            return finishCard(words.cardDone, "done", "replacement_ordered");
          }
          return askCard(words, "delivery", words.delivery);
      }
    }

    function reply(input, lang) {
      const language = languageKey(lang);
      const words = copy[language];
      const message = String(input ?? "").normalize("NFC").trim();
      if (isSensitive(message)) {
        return result(words.protected, "privacy", "protected", cardActions(words, cardStep), cardStep, null, true);
      }

      const matchedIntent = intents.find(([, pattern]) => pattern.test(message))?.[0];
      const intent = matchedIntent ?? (replacementApproval.test(message) ? "card" : null);
      if (cardStep && (!intent || intent === "card" || cancellation.test(message))) {
        return continueCard(message, words);
      }

      if (intent) cardStep = null;
      switch (intent) {
        case "card":
          if (replacementOrdered) return finishCard(words.cardDone, "done", "replacement_ordered");
          if (!cardBlocked) return askCard(words, "verify", words.verify);
          if (replacementApproval.test(message)) return askCard(words, "replacement", words.replacement);
          return finishCard(words.cardAlready, "done", "card_blocked");
        case "balance":
          return result(words.balance, "balance", "completed");
        case "transfer":
          return result(words.transfer, "transfer", "completed");
        case "handoff":
          return result(words.handoff, "handoff", "handoff");
        default:
          return greeting.test(message)
            ? result(words.welcome, "greeting", "ready", suggestions(language))
            : result(words.fallback, "fallback", "fallback", suggestions(language));
      }
    }

    return { reset, reply };
  }

  window.KTBDialogue = { scenarios, create, welcome, isSensitive };
})();
