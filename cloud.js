/**
 * Global Live Cloud Sync Engine - Max Installment System
 * Powered by Google Firebase Realtime Database
 * Keeps all devices and users worldwide synchronized with live rates & settings
 */

window.CloudSync = {
    FIREBASE_URL: 'https://maxaqsati-default-rtdb.firebaseio.com/config.json',
    FALLBACK_URL: './config.json',
    lastSyncTime: null,
    isSyncing: false,

    async init() {
        await this.pullLatestConfig();
    },

    async pullLatestConfig() {
        if (this.isSyncing) return;
        this.isSyncing = true;

        try {
            let config = null;
            let source = 'firebase';

            // 1. Try Live Google Firebase Cloud DB first
            try {
                const fbRes = await fetch(this.FIREBASE_URL, { cache: 'no-store' });
                if (fbRes.ok) {
                    const fbData = await fbRes.json();
                    if (fbData && fbData.rates) {
                        config = fbData;
                    }
                }
            } catch (fbErr) {
                console.warn('[CloudSync] Firebase unreachable, falling back...', fbErr);
            }

            // 2. Fallback to static config.json if Firebase empty or offline
            if (!config) {
                source = 'static';
                const cacheBuster = `?t=${Date.now()}`;
                const res = await fetch(`${this.FALLBACK_URL}${cacheBuster}`);
                if (res.ok) {
                    config = await res.json();
                }
            }

            if (config && config.rates) {
                const s = window.AppState;
                let hasChanges = false;

                // Sync Rates
                if (JSON.stringify(s.rates) !== JSON.stringify(config.rates)) {
                    s.rates = config.rates;
                    window.InstallmentData.Storage.saveRates(s.rates);
                    hasChanges = true;
                }

                // Sync Settings
                if (config.settings) {
                    const mergedSettings = { ...s.settings, ...config.settings };
                    if (JSON.stringify(s.settings) !== JSON.stringify(mergedSettings)) {
                        s.settings = mergedSettings;
                        window.InstallmentData.Storage.saveSettings(s.settings);
                        hasChanges = true;
                    }
                }

                this.lastSyncTime = new Date();
                this.updateSyncBadge('connected', source);

                if (hasChanges && typeof window.render === 'function') {
                    window.render();
                }
                console.log(`[CloudSync] Synced successfully via ${source}!`);
            } else {
                this.updateSyncBadge('cached');
            }
        } catch (err) {
            console.warn('[CloudSync] Offline cache mode active:', err);
            this.updateSyncBadge('cached');
        } finally {
            this.isSyncing = false;
        }
    },

    async pushConfigToCloud(customData = null) {
        const s = window.AppState;
        const payload = customData || {
            rates: s.rates,
            settings: {
                storeName: s.settings.storeName || 'مكتب ماكس للتقسيط',
                storePhone: s.settings.storePhone || '',
                storeAddress: s.settings.storeAddress || '',
                currency: s.settings.currency || 'IQD',
                currencySymbol: s.settings.currencySymbol || 'د.ع',
                calculationMode: s.settings.calculationMode || 'flat',
                roundingMode: s.settings.roundingMode || 'none',
                scannerMarkup: Number(s.settings.scannerMarkup !== undefined ? s.settings.scannerMarkup : 15000)
            },
            version: Date.now(),
            updatedAt: new Date().toISOString()
        };

        try {
            const res = await fetch(this.FIREBASE_URL, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                this.updateSyncBadge('connected', 'firebase');
                console.log('[CloudSync] Pushed to Firebase cloud successfully!');
                return true;
            } else {
                console.warn('[CloudSync] Firebase push returned status:', res.status);
                return false;
            }
        } catch (err) {
            console.error('[CloudSync] Error pushing to cloud:', err);
            return false;
        }
    },

    updateSyncBadge(status, source = 'firebase') {
        const badge = document.getElementById('cloudSyncStatusBadge');
        if (!badge) return;

        if (status === 'connected') {
            const label = source === 'firebase' ? 'سحابة Google الحية متصلة 🟢' : 'السحابة متصلة 🟢';
            badge.innerHTML = `
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span class="text-emerald-400 font-bold">${label}</span>
            `;
        } else {
            badge.innerHTML = `
                <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                <span class="text-amber-400 font-bold">وضع الذاكرة المحلية (Offline) 🟡</span>
            `;
        }
    },

    downloadUpdatedConfig() {
        const s = window.AppState;
        const configData = {
            rates: s.rates,
            settings: {
                storeName: s.settings.storeName || 'مكتب ماكس للتقسيط',
                storePhone: s.settings.storePhone || '',
                storeAddress: s.settings.storeAddress || '',
                currency: s.settings.currency || 'IQD',
                currencySymbol: s.settings.currencySymbol || 'د.ع',
                calculationMode: s.settings.calculationMode || 'flat',
                roundingMode: s.settings.roundingMode || 'none'
            },
            version: Date.now(),
            updatedAt: new Date().toISOString()
        };

        const jsonStr = JSON.stringify(configData, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'config.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        window.showToast('💾 تم تنزيل ملف config.json المحدث');
    }
};
