const silentChannel = {
  currentTime: 0,
  loop: false,
  volume: 0,
  play: () => Promise.resolve(),
  pause: () => {}
};
const createAudio = (source) => source ? new Audio(source) : { ...silentChannel };

window.audioManager = {
  ambient: createAudio(null),
  click: createAudio('audio/click.MP3'),
  fusion: createAudio('audio/click.MP3'),
  glitch: createAudio(null),
  started: false,

  init() {
    this.ambient.loop = true;
    this.ambient.volume = 0.15;
    this.click.volume = 0.5;
    this.fusion.volume = 0.7;
    this.glitch.volume = 0.6;
    this.glitch.loop = true;

    document.body.addEventListener('click', () => {
      if (this.started) return;
      this.ambient.play().catch(() => {});
      this.started = true;
    }, { once: true });
  },

  playClick() {
    this.click.currentTime = 0;
    this.click.play().catch(() => {});
  },

  playFusion() {
    this.fusion.currentTime = 0;
    this.fusion.play().catch(() => {});
  },

  playGlitch(state) {
    if (state) {
      this.glitch.play().catch(() => {});
      this.ambient.volume = 0.05;
      return;
    }
    this.glitch.pause();
    this.ambient.volume = 0.15;
  }
};
