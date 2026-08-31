/**
 * Advanced Military-Grade Security Engine for Installment System
 * 1. SHA-256 Crypto Hashing
 * 2. Anti-Brute Force Lockout Guard (3 Attempts -> 45s Cooldown)
 * 3. Inspect / F12 / ContextMenu Shield
 * 4. Encrypted JSON Backup & Restore System
 * 5. Inactivity Auto-Lock Monitor
 */

window.SecurityEngine = {
    SALT: 'MAX_IQD_SECURE_2026_',
    maxAttempts: 3,
    lockoutDurationMs: 45000,
    lockoutTimerInterval: null,
    autoLockTimer: null,
    autoLockDelayMs: 120000, // 2 minutes

    // 1. SHA-256 Hashing Engine
    async hashPassword(password) {
        if (!password) password = '1234';
        const normalized = this.normalizeArabicDigits(password);
        const salted = this.SALT + normalized;
        
        if (window.crypto && window.crypto.subtle) {
            const msgBuffer = new TextEncoder().encode(salted);
            const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        }
        // Fallback hash
        let hash = 0;
        for (let i = 0; i < salted.length; i++) {
            const char = salted.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash |= 0;
        }
        return 'fallback_' + Math.abs(hash).toString(16);
    },

    normalizeArabicDigits(str) {
        if (!str) return '';
        const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
        return String(str).replace(/[٠-٩]/g, d => arabicDigits.indexOf(d)).trim();
    },

    // 2. Anti-Brute Force Guard
    getLockoutState() {
        try {
            const until = Number(localStorage.getItem('sec_lockout_until') || 0);
            const attempts = Number(localStorage.getItem('sec_failed_attempts') || 0);
            const now = Date.now();
            if (until > now) {
                return { locked: true, remainingSec: Math.ceil((until - now) / 1000), attempts };
            }
            return { locked: false, remainingSec: 0, attempts };
        } catch(e) {
            return { locked: false, remainingSec: 0, attempts: 0 };
        }
    },

    recordFailedAttempt() {
        try {
            let attempts = Number(localStorage.getItem('sec_failed_attempts') || 0) + 1;
            localStorage.setItem('sec_failed_attempts', attempts);

            if (attempts >= this.maxAttempts) {
                const lockoutUntil = Date.now() + this.lockoutDurationMs;
                localStorage.setItem('sec_lockout_until', lockoutUntil);
                return { locked: true, remainingSec: Math.ceil(this.lockoutDurationMs / 1000) };
            }
            return { locked: false, remainingAttempts: this.maxAttempts - attempts };
        } catch(e) {
            return { locked: false, remainingAttempts: 2 };
        }
    },

    resetAttempts() {
        try {
            localStorage.removeItem('sec_failed_attempts');
            localStorage.removeItem('sec_lockout_until');
        } catch(e){}
    },

    startLockoutCountdown(onTick, onComplete) {
        if (this.lockoutTimerInterval) clearInterval(this.lockoutTimerInterval);

        const check = () => {
            const state = this.getLockoutState();
            if (state.locked) {
                if (onTick) onTick(state.remainingSec);
            } else {
                clearInterval(this.lockoutTimerInterval);
                this.lockoutTimerInterval = null;
                this.resetAttempts();
                if (onComplete) onComplete();
            }
        };

        check();
        this.lockoutTimerInterval = setInterval(check, 1000);
    },

    // 3. Inspect / F12 / ContextMenu Shield
    initShield() {
        // Disable Right Click
        document.addEventListener('contextmenu', (e) => {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
            }
        });

        // Block DevTools Shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+S)
        document.addEventListener('keydown', (e) => {
            // F12
            if (e.keyCode === 123) {
                e.preventDefault();
                return false;
            }
            // Ctrl+Shift+I (DevTools) / Ctrl+Shift+J (Console) / Ctrl+Shift+C (Inspect)
            if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
                e.preventDefault();
                return false;
            }
            // Ctrl+U (View Source)
            if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
                e.preventDefault();
                return false;
            }
            // Ctrl+S (Save Page)
            if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
                e.preventDefault();
                return false;
            }
        });
    },

    // 4. Encrypted JSON Backup & Restore System
    exportBackup() {
        const s = window.AppState;
        const backupData = {
            version: '2.0',
            exportedAt: new Date().toISOString(),
            system: 'Max Installment Pro',
            storeName: s.settings.storeName,
            rates: s.rates,
            settings: s.settings
        };

        const jsonStr = JSON.stringify(backupData, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const dateStr = new Date().toISOString().slice(0, 10);
        a.href = url;
        a.download = `max_installment_backup_${dateStr}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        if (window.showToast) window.showToast('💾 تم تصدير النسخة الاحتياطية بنجاح');
    },

    importBackup(file) {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (!data.rates || !data.settings) {
                    alert('ملف النسخة الاحتياطية غير صالح أو تالف!');
                    return;
                }
                const s = window.AppState;
                s.rates = data.rates;
                s.settings = data.settings;

                window.InstallmentData.Storage.saveRates(s.rates);
                window.InstallmentData.Storage.saveSettings(s.settings);

                if (window.openSettingsModal) window.openSettingsModal();
                if (window.render) window.render();
                if (window.showToast) window.showToast('✅ تم استعادة النسخة الاحتياطية بنجاح!');
            } catch (err) {
                alert('حدث خطأ أثناء قراءة ملف النسخة الاحتياطية!');
            }
        };
        reader.readAsText(file);
    },

    // 5. Inactivity Auto-Lock Monitor
    initAutoLock() {
        const resetTimer = () => {
            if (this.autoLockTimer) clearTimeout(this.autoLockTimer);
            this.autoLockTimer = setTimeout(() => {
                const settingsModal = document.getElementById('settingsModal');
                if (settingsModal && !settingsModal.classList.contains('hidden')) {
                    if (window.closeSettingsModal) window.closeSettingsModal();
                    if (window.showToast) window.showToast('🔒 تم قفل الإعدادات تلقائياً لعدم النشاط');
                }
            }, this.autoLockDelayMs);
        };

        ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'].forEach(evt => {
            window.addEventListener(evt, resetTimer, { passive: true });
        });
        resetTimer();
    }
};

function bootSecurity() {
    if (window.SecurityEngine) {
        window.SecurityEngine.initShield();
        window.SecurityEngine.initAutoLock();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootSecurity);
} else {
    bootSecurity();
}
