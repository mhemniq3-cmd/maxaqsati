window.AppState = {
    currentSystem: 'platform', // 'platform' | 'manual' | 'other'
    otherSubService: 'all', // 'all' | 'rafidain' | 'ahli_rasheed' | 'salary_advance'
    selectedPlan: 10, // 10 | 12 | 14 | 16 | 18
    productName: '', // Optional product name
    customerPhone: '', // Optional customer phone for direct WhatsApp
    principal: 1900000, // 1,900,000 IQD
    downPayment: 200000, // 200,000 IQD
    downPaymentType: 'fixed', // 'fixed' | 'percent'
    rates: window.InstallmentData.Storage.getRates(),
    settings: window.InstallmentData.Storage.getSettings(),
    tracking: window.InstallmentData.Storage.getTracking(),
    chart: null
};

window.AppElements = {};

function initElements() {
    const get = (id) => document.getElementById(id);
    window.AppElements = {
        themeToggleBtn: get('themeToggleBtn'),
        tabPlatform: get('tabPlatform'),
        tabManual: get('tabManual'),
        tabOther: get('tabOther'),
        inputProductName: get('inputProductName'),
        inputCustomerPhone: get('inputCustomerPhone'),
        inputPrincipal: get('inputPrincipal'),
        inputDownPayment: get('inputDownPayment'),
        downPaymentTypeBtn: get('downPaymentTypeBtn'),
        btnClearAll: get('btnClearAll'),
        systemBadge: get('systemBadge'),
        cardsContainer: get('cardsContainer'),
        cardsSectionTitle: get('cardsSectionTitle'),
        
        // Template Elements
        templatePreviewBox: get('templatePreviewBox'),
        btnCopyTemplate: get('btnCopyTemplate'),
        btnCopySinglePlan: get('btnCopySinglePlan'),
        btnWhatsApp: get('btnWhatsApp'),

        // Password Modal Elements
        passwordModal: get('passwordModal'),
        passwordInput: get('passwordInput'),
        submitPasswordBtn: get('submitPasswordBtn'),
        closePasswordModalBtn: get('closePasswordModalBtn'),
        passwordErrorMsg: get('passwordErrorMsg'),
        
        // Settings Modal Elements
        settingsModal: get('settingsModal'),
        openSettingsBtn: get('openSettingsBtn'),
        closeSettingsBtn: get('closeSettingsBtn'),
        saveSettingsBtn: get('saveSettingsBtn'),
        resetRatesBtn: get('resetRatesBtn'),
        newPasswordInput: get('newPasswordInput'),
        settingRoundingMode: get('settingRoundingMode'),
        
        toast: get('toast'),
        toastMessage: get('toastMessage'),
        storeNameDisplay: get('storeNameDisplay')
    };
}

window.showToast = function(message, duration = 3000) {
    const el = window.AppElements.toast;
    const msgEl = window.AppElements.toastMessage;
    if (!el || !msgEl) return;
    msgEl.textContent = message;
    el.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
    el.classList.add('opacity-100', 'translate-y-0');
    setTimeout(() => {
        el.classList.remove('opacity-100', 'translate-y-0');
        el.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
    }, duration);
};

window.fmtCurrency = function(amount, decimals = null) {
    return window.FinanceCalculator.formatCurrency(amount, 'د.ع', decimals);
};

window.fmtNumber = function(amount, decimals = null) {
    return window.FinanceCalculator.formatNumber(amount, decimals);
};
