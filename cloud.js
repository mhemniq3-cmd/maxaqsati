/**
 * Global Live Cloud Sync Engine - Max Installment System
 * Keeps all devices and users synchronized with the master rates & settings
 */

window.CloudSync = {
    CONFIG_URL: './config.json',
    lastSyncTime: null,
    isSyncing: false,

    async init() {
        await this.pullLatestConfig();
    },

    async pullLatestConfig() {
        if (this.isSyncing) return;
        this.isSyncing = true;

        try {
            const cacheBuster = `?t=${Date.now()}`;
            const response = await fetch(`${this.CONFIG_URL}${cacheBuster}`);
            
            if (response.ok) {
                const config = await response.json();
                if (config && config.rates) {
                    const s = window.AppState;
                    
                    // Verify if remote config is newer or differs
                    let hasChanges = false;
                    
                    if (JSON.stringify(s.rates) !== JSON.stringify(config.rates)) {
                        s.rates = config.rates;
                        window.InstallmentData.Storage.saveRates(s.rates);
                        hasChanges = true;
                    }

                    if (config.settings) {
                        const mergedSettings = { ...s.settings, ...config.settings };
                        if (JSON.stringify(s.settings) !== JSON.stringify(mergedSettings)) {
                            s.settings = mergedSettings;
                            window.InstallmentData.Storage.saveSettings(s.settings);
                            hasChanges = true;
                        }
                    }

                    this.lastSyncTime = new Date();
                    this.updateSyncBadge('connected');

                    if (hasChanges && typeof window.render === 'function') {
                        window.render();
                        console.log('☁️ Successfully synchronized rates with master cloud config!');
                    }
                }
            } else {
                this.updateSyncBadge('cached');
            }
        } catch (err) {
            console.warn('Cloud sync running in offline cached mode:', err);
            this.updateSyncBadge('cached');
        } finally {
            this.isSyncing = false;
        }
    },

    updateSyncBadge(status) {
        const badge = document.getElementById('cloudSyncStatusBadge');
        if (!badge) return;

        if (status === 'connected') {
            badge.innerHTML = `
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span class="text-emerald-400 font-bold">السحابة المركزية متصلة ونشطة 🟢</span>
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
            version: (s.configVersion || 1) + 1,
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

        window.showToast('💾 تم تنزيل ملف config.json المحدث لرفعه إلى GitHub');
    }
};
