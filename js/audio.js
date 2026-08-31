/**
 * Ultra-Responsive Synthesized Web Audio Sound Engine (48kHz Studio Quality)
 * High-precision fintech acoustic feedback with 0ms latency & 0 audio file dependencies
 */

window.SoundEngine = {
    ctx: null,
    muted: false,

    init() {
        if (this.ctx) return;
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
            this.ctx = new AudioCtx();
        }
    },

    resume() {
        if (!this.ctx) this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },

    toggleMute() {
        this.muted = !this.muted;
        try {
            localStorage.setItem('max_sound_muted', this.muted ? '1' : '0');
        } catch(e){}
        return this.muted;
    },

    toggleSound() {
        return this.toggleMute();
    },

    isMuted() {
        try {
            if (localStorage.getItem('max_sound_muted') === '1') {
                this.muted = true;
            }
        } catch(e){}
        return this.muted;
    },

    playTick() {
        this.playMechanicalTick();
    },

    playTabSwitch() {
        this.playToggleSwitch();
    },

    playSelect() {
        this.playCardSelectTick();
    },

    playMechanicalTick() {
        if (this.isMuted()) return;
        this.resume();
        if (!this.ctx) return;

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(1400, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(700, this.ctx.currentTime + 0.035);

            gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.035);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + 0.035);
        } catch(e){}
    },

    playCardSelectTick() {
        if (this.isMuted()) return;
        this.resume();
        if (!this.ctx) return;

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(950, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1600, this.ctx.currentTime + 0.045);

            gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.045);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + 0.045);
        } catch(e){}
    },

    playSuccessChime() {
        if (this.isMuted()) return;
        this.resume();
        if (!this.ctx) return;

        try {
            const notes = [1046.50, 1318.51, 1567.98, 2093.00];
            const now = this.ctx.currentTime;

            notes.forEach((freq, i) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + (i * 0.04));

                gain.gain.setValueAtTime(0.07, now + (i * 0.04));
                gain.gain.exponentialRampToValueAtTime(0.001, now + (i * 0.04) + 0.18);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now + (i * 0.04));
                osc.stop(now + (i * 0.04) + 0.18);
            });
        } catch(e){}
    },

    playToggleSwitch() {
        if (this.isMuted()) return;
        this.resume();
        if (!this.ctx) return;

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(440, this.ctx.currentTime);
            osc.frequency.setValueAtTime(880, this.ctx.currentTime + 0.02);

            gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + 0.05);
        } catch(e){}
    }
};

function bootAudio() {
    if (window.SoundEngine) window.SoundEngine.init();
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootAudio);
} else {
    bootAudio();
}
