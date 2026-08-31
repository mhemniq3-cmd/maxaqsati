/**
 * Fintech Luxury Web Audio Sound Engine
 * 100% Offline, Zero external assets, 48kHz synthesized sound effects
 */

window.SoundEngine = {
    ctx: null,
    enabled: true,

    init() {
        const saved = localStorage.getItem('installment_sound_enabled');
        if (saved !== null) {
            this.enabled = saved === 'true';
        } else {
            this.enabled = true;
        }
        this.updateToggleButton();
    },

    getAudioContext() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        return this.ctx;
    },

    toggleSound() {
        this.enabled = !this.enabled;
        localStorage.setItem('installment_sound_enabled', this.enabled);
        this.updateToggleButton();
        if (this.enabled) {
            this.playChirp();
            if (window.showToast) window.showToast('🔊 تم تفعيل المؤثرات الصوتية');
        } else {
            if (window.showToast) window.showToast('🔇 تم كتم الأصوات');
        }
    },

    updateToggleButton() {
        const btn = document.getElementById('soundToggleBtn');
        const icon = document.getElementById('soundToggleIcon');
        const label = document.getElementById('soundToggleLabel');
        if (btn) {
            if (this.enabled) {
                btn.className = 'px-2.5 py-1.5 rounded-lg hover:bg-slate-200/70 dark:hover:bg-slate-800/80 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition flex items-center gap-1 active:scale-95 cursor-pointer';
                if (icon) icon.setAttribute('data-lucide', 'volume-2');
                if (label) label.textContent = 'صوت 🔊';
            } else {
                btn.className = 'px-2.5 py-1.5 rounded-lg hover:bg-slate-200/70 dark:hover:bg-slate-800/80 text-slate-400 dark:text-slate-500 text-xs font-bold transition flex items-center gap-1 active:scale-95 cursor-pointer opacity-70';
                if (icon) icon.setAttribute('data-lucide', 'volume-x');
                if (label) label.textContent = 'مكتوم 🔇';
            }
            if (window.lucide) lucide.createIcons();
        }
    },

    playTick() {
        if (!this.enabled) return;
        try {
            const ctx = this.getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(950, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.035);
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.035);
        } catch (e) {}
    },

    playTabSwitch() {
        if (!this.enabled) return;
        try {
            const ctx = this.getAudioContext();
            if (!ctx) return;
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(520, now);
            osc.frequency.exponentialRampToValueAtTime(780, now + 0.06);
            gain.gain.setValueAtTime(0.09, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(now + 0.06);
        } catch (e) {}
    },

    playSuccessChime() {
        if (!this.enabled) return;
        try {
            const ctx = this.getAudioContext();
            if (!ctx) return;
            const now = ctx.currentTime;
            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(1318.5, now);
            gain1.gain.setValueAtTime(0.12, now);
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
            osc1.connect(gain1);
            gain1.connect(ctx.destination);
            osc1.start();
            osc1.stop(now + 0.25);

            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(1975.5, now + 0.07);
            gain2.gain.setValueAtTime(0.14, now + 0.07);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.start(now + 0.07);
            osc2.stop(now + 0.38);
        } catch (e) {}
    },

    playChirp() {
        if (!this.enabled) return;
        try {
            const ctx = this.getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.08);
        } catch (e) {}
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.SoundEngine.init();
});
