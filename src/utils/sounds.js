// Web Audio API sounds — no audio files needed.
let ctx;
const getCtx = () => {
  if (!ctx) {
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch {}
  }
  return ctx;
};

const tone = (freq, start, duration, gain = 0.15) => {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = 'sine';
  osc.frequency.value = freq;
  osc.connect(g);
  g.connect(c.destination);
  const t = c.currentTime + start;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.start(t);
  osc.stop(t + duration + 0.05);
};

export const playSound = (name) => {
  try {
    switch (name) {
      case 'success':  // pleasant rising two-tone
        tone(660, 0, 0.15, 0.12);
        tone(990, 0.09, 0.22, 0.10);
        break;
      case 'error':
        tone(220, 0, 0.20, 0.12);
        tone(160, 0.10, 0.25, 0.10);
        break;
      case 'notify':  // iOS-like triple chime
        tone(1046, 0, 0.14, 0.09);
        tone(1318, 0.12, 0.14, 0.09);
        tone(1568, 0.24, 0.20, 0.09);
        break;
      case 'pop':
        tone(520, 0, 0.09, 0.08);
        break;
      case 'message':
        tone(880, 0, 0.10, 0.09);
        tone(1174, 0.08, 0.14, 0.09);
        break;
      case 'send':
        tone(1046, 0, 0.06, 0.06);
        break;
      default:
        tone(600, 0, 0.08, 0.06);
    }
  } catch {}
};
