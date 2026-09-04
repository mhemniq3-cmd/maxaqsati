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

    DEFAULT_DEVICES: [
    {
        "id": "realme-16-pro-plus",
        "name": "realme 16 Pro Plus (12GB | 512GB)",
        "brand": "Realme",
        "category": "هواتف ذكية",
        "specs": "12GB | 512GB",
        "price": 794000,
        "keys": [
            "realme 16 pro plus",
            "ريلمي 16 برو بلس",
            "ريلمي 16 برو+",
            "16 pro plus realme"
        ]
    },
    {
        "id": "realme-16-pro",
        "name": "realme 16 Pro (12GB | 512GB)",
        "brand": "Realme",
        "category": "هواتف ذكية",
        "specs": "12GB | 512GB",
        "price": 607000,
        "keys": [
            "realme 16 pro",
            "ريلمي 16 برو",
            "16 pro realme"
        ]
    },
    {
        "id": "realme-15-pro",
        "name": "realme 15 PRO (12GB | 512GB)",
        "brand": "Realme",
        "category": "هواتف ذكية",
        "specs": "12GB | 512GB",
        "price": 610000,
        "keys": [
            "realme 15 pro",
            "ريلمي 15 برو",
            "15 pro realme"
        ]
    },
    {
        "id": "realme-15-t-512",
        "name": "realme 15 T (12GB | 512GB)",
        "brand": "Realme",
        "category": "هواتف ذكية",
        "specs": "12GB | 512GB",
        "price": 425000,
        "keys": [
            "realme 15 t",
            "ريلمي 15 تي",
            "ريلمي 15t 512",
            "15t 512"
        ]
    },
    {
        "id": "realme-15-t-256",
        "name": "realme 15 T (8GB | 256GB)",
        "brand": "Realme",
        "category": "هواتف ذكية",
        "specs": "8GB | 256GB",
        "price": 385000,
        "keys": [
            "realme 15 t 256",
            "ريلمي 15 تي 256",
            "ريلمي 15t",
            "15t 256"
        ]
    },
    {
        "id": "infinix-hot-60-pro-plus",
        "name": "Infinix HOT 60 Pro Plus (8GB | 256GB)",
        "brand": "Infinix",
        "category": "هواتف ذكية",
        "specs": "8GB | 256GB",
        "price": 310000,
        "keys": [
            "infinix hot 60 pro plus",
            "انفينكس هوت 60 برو بلس",
            "هوت 60 برو بلس",
            "hot 60 pro plus"
        ]
    },
    {
        "id": "infinix-hot-60-pro",
        "name": "Infinix Hot 60 Pro (8GB | 256GB)",
        "brand": "Infinix",
        "category": "هواتف ذكية",
        "specs": "8GB | 256GB",
        "price": 280000,
        "keys": [
            "infinix hot 60 pro",
            "انفينكس هوت 60 برو",
            "هوت 60 برو",
            "hot 60 pro"
        ]
    },
    {
        "id": "infinix-smart-20-256",
        "name": "Infinix Smart 20 (8GB | 256GB)",
        "brand": "Infinix",
        "category": "هواتف ذكية",
        "specs": "8GB | 256GB",
        "price": 260000,
        "keys": [
            "infinix smart 20 256",
            "انفينكس سمارت 20 256",
            "سمارت 20 256",
            "smart 20 256"
        ]
    },
    {
        "id": "infinix-smart-20-128",
        "name": "Infinix Smart 20 (4GB | 128GB)",
        "brand": "Infinix",
        "category": "هواتف ذكية",
        "specs": "4GB | 128GB",
        "price": 205000,
        "keys": [
            "infinix smart 20 128",
            "انفينكس سمارت 20 128",
            "سمارت 20 128",
            "smart 20 128"
        ]
    },
    {
        "id": "infinix-smart-20-64",
        "name": "Infinix Smart 20 (4GB | 64GB)",
        "brand": "Infinix",
        "category": "هواتف ذكية",
        "specs": "4GB | 64GB",
        "price": 185000,
        "keys": [
            "infinix smart 20 64",
            "انفينكس سمارت 20 64",
            "سمارت 20 64",
            "smart 20 64"
        ]
    },
    {
        "id": "xiaomi-pad-8-pro",
        "name": "Xiaomi Pad 8 Pro (12GB | 512GB)",
        "brand": "Xiaomi",
        "category": "أجهزة لوحية (تابلت)",
        "specs": "12GB | 512GB",
        "price": 940000,
        "keys": [
            "xiaomi pad 8 pro",
            "شاومي باد 8 برو",
            "باد 8 برو",
            "pad 8 pro"
        ]
    },
    {
        "id": "xiaomi-pad-8",
        "name": "Xiaomi Pad 8 (8GB | 256GB)",
        "brand": "Xiaomi",
        "category": "أجهزة لوحية (تابلت)",
        "specs": "8GB | 256GB",
        "price": 680000,
        "keys": [
            "xiaomi pad 8",
            "شاومي باد 8",
            "باد 8",
            "pad 8"
        ]
    },
    {
        "id": "xiaomi-pad-7-512",
        "name": "Xiaomi Pad 7 (12GB | 256GB)",
        "brand": "Xiaomi",
        "category": "أجهزة لوحية (تابلت)",
        "specs": "12GB | 256GB",
        "price": 550000,
        "keys": [
            "xiaomi pad 7 12gb",
            "شاومي باد 7 256",
            "باد 7 12gb",
            "pad 7 550"
        ]
    },
    {
        "id": "xiaomi-pad-7-256",
        "name": "Xiaomi Pad 7 (8GB | 256GB)",
        "brand": "Xiaomi",
        "category": "أجهزة لوحية (تابلت)",
        "specs": "8GB | 256GB",
        "price": 475000,
        "keys": [
            "xiaomi pad 7",
            "شاومي باد 7",
            "باد 7",
            "pad 7"
        ]
    },
    {
        "id": "redmi-pad-2-pro",
        "name": "redmi Pad 2 Pro (8GB | 256GB)",
        "brand": "Xiaomi",
        "category": "أجهزة لوحية (تابلت)",
        "specs": "8GB | 256GB",
        "price": 485000,
        "keys": [
            "redmi pad 2 pro",
            "ريدمي باد 2 برو",
            "باد 2 برو",
            "pad 2 pro"
        ]
    },
    {
        "id": "redmi-pad-2-256",
        "name": "redmi Pad 2 (8GB | 256GB)",
        "brand": "Xiaomi",
        "category": "أجهزة لوحية (تابلت)",
        "specs": "8GB | 256GB",
        "price": 340000,
        "keys": [
            "redmi pad 2 256",
            "ريدمي باد 2 256",
            "ريدمي باد 2",
            "redmi pad 2"
        ]
    },
    {
        "id": "redmi-pad-2-128",
        "name": "redmi Pad 2 (4GB | 128GB)",
        "brand": "Xiaomi",
        "category": "أجهزة لوحية (تابلت)",
        "specs": "4GB | 128GB",
        "price": 290000,
        "keys": [
            "redmi pad 2 128",
            "ريدمي باد 2 128",
            "باد 2 128"
        ]
    },
    {
        "id": "xiaomi-pad-2-97",
        "name": "XIAOMI Pad 2 9.7 (4GB | 128GB)",
        "brand": "Xiaomi",
        "category": "أجهزة لوحية (تابلت)",
        "specs": "4GB | 128GB",
        "price": 250000,
        "keys": [
            "xiaomi pad 2 9.7",
            "شاومي باد 2 9.7",
            "شاومي باد 2",
            "pad 2 9.7"
        ]
    },
    {
        "id": "iphone-16-pro-max",
        "name": "iPhone 16 Pro Max 256GB",
        "brand": "Apple",
        "category": "هواتف ذكية",
        "specs": "256GB",
        "price": 1900000,
        "keys": [
            "iphone 16 pro max",
            "ايفون 16 برو ماكس",
            "16 pro max",
            "١٦ برو ماكس",
            "بروماكس 16"
        ]
    },
    {
        "id": "iphone-16-pro",
        "name": "iPhone 16 Pro 256GB",
        "brand": "Apple",
        "category": "هواتف ذكية",
        "specs": "256GB",
        "price": 1700000,
        "keys": [
            "iphone 16 pro",
            "ايفون 16 برو",
            "16 pro",
            "١٦ برو"
        ]
    },
    {
        "id": "iphone-15-pro-max",
        "name": "iPhone 15 Pro Max 256GB",
        "brand": "Apple",
        "category": "هواتف ذكية",
        "specs": "256GB",
        "price": 1550000,
        "keys": [
            "iphone 15 pro max",
            "ايفون 15 برو ماكس",
            "15 pro max"
        ]
    },
    {
        "id": "samsung-s25-ultra",
        "name": "Samsung Galaxy S25 Ultra 256GB",
        "brand": "Samsung",
        "category": "هواتف ذكية",
        "specs": "256GB",
        "price": 1850000,
        "keys": [
            "s25 ultra",
            "سامسونج s25 ultra",
            "اس 25 الترا"
        ]
    },
    {
        "id": "samsung-a55",
        "name": "Samsung Galaxy A55 256GB",
        "brand": "Samsung",
        "category": "هواتف ذكية",
        "specs": "256GB",
        "price": 460000,
        "keys": [
            "samsung a55",
            "سامسونج a55",
            "a55"
        ]
    },
    {
        "id": "ps5-slim",
        "name": "PlayStation 5 Slim",
        "brand": "Sony",
        "category": "ألعاب وجيمنج",
        "specs": "1TB SSD",
        "price": 720000,
        "keys": [
            "ps5",
            "بلايستيشن 5",
            "بلي 5",
            "playstation 5"
        ]
    }
],

    Storage: {
        KEYS: {
            RATES: 'installment_app_rates_iqd_v2',
            SETTINGS: 'installment_app_settings_iqd_v2',
            TRACKING: 'installment_app_tracking_iqd_v2',
            DEVICES: 'installment_app_devices_iqd_v2'
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
        },

        getDevices() {
            try {
                const saved = localStorage.getItem(this.KEYS.DEVICES);
                if (saved) {
                    return JSON.parse(saved);
                }
            } catch (e) {
                console.warn('Failed to load devices from storage', e);
            }
            return JSON.parse(JSON.stringify(window.InstallmentData.DEFAULT_DEVICES || []));
        },

        saveDevices(devices) {
            try {
                localStorage.setItem(this.KEYS.DEVICES, JSON.stringify(devices));
            } catch (e) {
                console.error('Failed to save devices', e);
            }
        },

        resetDevices() {
            const defaults = JSON.parse(JSON.stringify(window.InstallmentData.DEFAULT_DEVICES || []));
            this.saveDevices(defaults);
            return defaults;
        }
    }
};
