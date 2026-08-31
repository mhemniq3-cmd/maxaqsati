/**
 * Installment Calculation System - Data & Defaults
 * Currency: IQD (الدينار العراقي)
 * Rates: Platform (5 Plans), Manual (5 Plans), and Other Banking Services
 */

window.InstallmentData = {
    DURATION_PLANS: [10, 12, 14, 16, 18],

    DEFAULT_RATES: {
        platform: {
            10: 10.0,
            12: 12.0,
            14: 14.5,
            16: 17.0,
            18: 19.5
        },
        manual: {
            10: 12.5,
            12: 15.0,
            14: 18.0,
            16: 21.0,
            18: 24.0
        },
        other: {
            rafidain_rate: 8.0,         // نسبة مصرف الرافدين الثابتة (%)
            ahli_rasheed_monthly: 2.0,  // نسبة المصرف الأهلي والرشيد شهرياً (%)
            salary_customer_fee: 2000,  // رسوم معاملة الزبون في الدفع عند الراتب (د.ع)
            salary_merchant_fee: 1.0    // عمولة المنصة المستقطعة من التاجر (%)
        }
    },

    DEFAULT_SETTINGS: {
        storeName: 'مكتب ماكس للتقسيط',
        storePhone: '',
        storeAddress: '',
        currency: 'IQD',
        currencySymbol: 'د.ع',
        calculationMode: 'flat', // 'flat' | 'annual'
        roundingMode: 'none', // 'none' | '1000' | '5000'
        theme: 'light', // Default to Light Mode
        password: '1234',
        adminPassword: '1234'
    },

    Storage: {
        KEYS: {
            RATES: 'installment_app_rates_iqd_v2',
            SETTINGS: 'installment_app_settings_iqd_v2',
            TRACKING: 'installment_app_tracking_iqd_v2'
        },

        getRates() {
            try {
                const saved = localStorage.getItem(this.KEYS.RATES);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    return {
                        platform: { ...window.InstallmentData.DEFAULT_RATES.platform, ...parsed.platform },
                        manual: { ...window.InstallmentData.DEFAULT_RATES.manual, ...parsed.manual },
                        other: { ...window.InstallmentData.DEFAULT_RATES.other, ...(parsed.other || {}) }
                    };
                }
            } catch (e) {
                console.warn('Failed to load rates from localStorage', e);
            }
            return JSON.parse(JSON.stringify(window.InstallmentData.DEFAULT_RATES));
        },

        saveRates(rates) {
            try {
                localStorage.setItem(this.KEYS.RATES, JSON.stringify(rates));
            } catch (e) {
                console.error('Failed to save rates', e);
            }
        },

        resetRates() {
            const defaults = JSON.parse(JSON.stringify(window.InstallmentData.DEFAULT_RATES));
            this.saveRates(defaults);
            return defaults;
        },

        getSettings() {
            try {
                const saved = localStorage.getItem(this.KEYS.SETTINGS);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    return {
                        ...window.InstallmentData.DEFAULT_SETTINGS,
                        ...parsed,
                        theme: parsed.theme || 'light',
                        password: parsed.password || parsed.adminPassword || '1234',
                        adminPassword: parsed.password || parsed.adminPassword || '1234'
                    };
                }
            } catch (e) {
                console.warn('Failed to load settings', e);
            }
            return { ...window.InstallmentData.DEFAULT_SETTINGS };
        },

        saveSettings(settings) {
            try {
                localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
            } catch (e) {
                console.error('Failed to save settings', e);
            }
        },

        getTracking() {
            try {
                const saved = localStorage.getItem(this.KEYS.TRACKING);
                return saved ? JSON.parse(saved) : {};
            } catch (e) {
                return {};
            }
        },

        saveTracking(tracking) {
            try {
                localStorage.setItem(this.KEYS.TRACKING, JSON.stringify(tracking));
            } catch (e) {
                console.error('Failed to save tracking', e);
            }
        }
    }
};
