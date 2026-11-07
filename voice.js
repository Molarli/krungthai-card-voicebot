(function () {
  "use strict";

  function localeFor(language) {
    if (language === "th") return "th-TH";
    if (language === "en") return "en-US";
    return language;
  }

  function create({ onTranscript = () => {}, onState = () => {}, onError = () => {} } = {}) {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const synthesis = window.speechSynthesis;
    const canListen = Boolean(Recognition);
    const canSpeak = Boolean(synthesis && window.SpeechSynthesisUtterance);
    let microphone;
    let speech;
    let state = "idle";

    function setState(next) {
      if (state === next) return;
      state = next;
      onState(next);
    }

    function clearMicrophone() {
      const previous = microphone;
      microphone = undefined;
      if (previous) window.clearTimeout(previous.timer);
      return previous;
    }

    function stopListening() {
      const previous = clearMicrophone();
      if (!previous) return;
      try {
        previous.recognition.abort();
      } catch {
        // The browser may already have ended recognition.
      }
      setState("idle");
    }

    function stopSpeaking() {
      if (!speech) return;
      speech = undefined;
      synthesis.cancel();
      setState("idle");
    }

    function listen(language = "th") {
      if (!canListen) {
        onError("unsupported-listening");
        return false;
      }
      if (microphone) return false;
      stopSpeaking();

      let recognition;
      try {
        recognition = new Recognition();
        recognition.lang = localeFor(language);
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
      } catch {
        onError("recognition-start");
        return false;
      }

      const capture = { recognition, transcript: "", timer: undefined };
      microphone = capture;
      recognition.onresult = (event) => {
        if (microphone !== capture) return;
        const finalParts = [];
        for (let index = 0; index < event.results.length; index += 1) {
          const result = event.results[index];
          if (result.isFinal) finalParts.push(result[0].transcript.trim());
        }
        capture.transcript = finalParts.join(" ").trim();
      };
      recognition.onerror = (event) => {
        if (microphone !== capture) return;
        stopListening();
        onError(event.error || "recognition-error");
      };
      recognition.onend = () => {
        if (microphone !== capture) return;
        clearMicrophone();
        setState("idle");
        if (capture.transcript) onTranscript(capture.transcript);
        else onError("no-speech");
      };
      capture.timer = window.setTimeout(() => {
        if (microphone !== capture) return;
        stopListening();
        if (capture.transcript) onTranscript(capture.transcript);
        else onError("recognition-timeout");
      }, 18000);

      try {
        recognition.start();
      } catch (error) {
        stopListening();
        onError(error.name === "NotAllowedError" ? "not-allowed" : "recognition-start");
        return false;
      }
      if (microphone === capture) setState("listening");
      return true;
    }

    function speak(text, language = "th") {
      if (!canSpeak) {
        onError("unsupported-speaking");
        return false;
      }
      if (!text.trim()) return false;
      stopListening();
      stopSpeaking();

      const utterance = new window.SpeechSynthesisUtterance(text);
      utterance.lang = localeFor(language);
      const voices = synthesis.getVoices();
      const desiredLocale = utterance.lang.toLowerCase();
      const languageCode = desiredLocale.split("-")[0];
      const voice = voices.find((option) => option.lang.toLowerCase() === desiredLocale)
        || voices.find((option) => option.lang.toLowerCase().split("-")[0] === languageCode);
      if (voice) utterance.voice = voice;
      speech = utterance;

      function finish(error) {
        if (speech !== utterance) return;
        speech = undefined;
        setState("idle");
        if (error) onError(error);
      }

      utterance.onend = () => finish();
      utterance.onerror = (event) => finish(event.error || "speech-error");
      setState("speaking");
      try {
        synthesis.speak(utterance);
      } catch {
        finish("speech-error");
        return false;
      }
      return true;
    }

    function reset() {
      stopListening();
      stopSpeaking();
    }

    return { canListen, canSpeak, listen, speak, stopListening, stopSpeaking, reset };
  }

  window.KTBVoice = { create };
})();
