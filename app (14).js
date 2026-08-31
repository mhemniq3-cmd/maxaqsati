document.addEventListener('DOMContentLoaded', () => {
    const state = {
        currentSystem: 'platform',
        selectedPlan: 12,
        principal: 10000,
        downPayment: 0,
        downPaymentType: 'fixed',
        startDate: new Date().toISOString().split('T')[0],
        clientName: '',
        clientPhone: '',
        contractNo: 'CNT-' + Math.floor(100000 + Math.random() * 900000),
        rates: window.InstallmentData.Storage.getRates(),
        settings: window.InstallmentData.Storage.getSettings(),
        tracking: window.InstallmentData.Storage.getTracking(),
        chart: null
    };

    const elements = {
        themeToggleBtn: document.getElementById('themeToggleBtn'),
        tabPlatform: document.getElementById('tabPlatform'),
        tabManual: document.getElementById('tabManual'),
        tabComparison: document.getElementById('tabComparison'),
        inputPrincipal: document.getElementById('inputPrincipal'),
        inputDownPayment: document.getElementById('inputDownPayment'),
        downPaymentTypeBtn: document.getElementById('downPaymentTypeBtn'),
        inputStartDate: document.getElementById('inputStartDate'),
        inputClientName: document.getElementById('inputClientName'),
        inputClientPhone: document.getElementById('inputClientPhone'),
        systemBadge: document.getElementById('systemBadge'),
        cardsContainer: document.getElementById('cardsContainer'),
        comparisonView: document.getElementById('comparisonView'),
        singleSystemView: document.getElementById('singleSystemView'),
        metricMonthly: document.getElementById('metricMonthly'),
        metricProfit: document.getElementById('metricProfit'),
        metricTotal: document.getElementById('metricTotal'),
        metricDownPayment: document.getElementById('metricDownPayment'),
        metricRate: document.getElementById('metricRate'),
        metricMonths: document.getElementById('metricMonths'),
        metricFinanced: document.getElementById('metricFinanced'),
        scheduleTableBody: document.getElementById('scheduleTableBody'),
        scheduleTotalInstallments: document.getElementById('scheduleTotalInstallments'),
        schedulePaidCount: document.getElementById('schedulePaidCount'),
        scheduleRemainingCount: document.getElementById('scheduleRemainingCount'),
        scheduleEndDate: document.getElementById('scheduleEndDate'),
        comparisonTableBody: document.getElementById('comparisonTableBody'),
        settingsModal: document.getElementById('settingsModal'),
        openSettingsBtn: document.getElementById('openSettingsBtn'),
        closeSettingsBtn: document.getElementById('closeSettingsBtn'),
        saveSettingsBtn: document.getElementById('saveSettingsBtn'),
        resetRatesBtn: document.getElementById('resetRatesBtn'),
        btnPrint: document.getElementById('btnPrint'),
        btnPdf: document.getElementById('btnPdf'),
        btnWhatsApp: document.getElementById('btnWhatsApp'),
        btnCopySummary: document.getElementById('btnCopySummary'),
        btnExportCsv: document.getElementById('btnExportCsv'),
        toast: document.getElementById('toast'),
        toastMessage: document.getElementById('toastMessage'),
        storeNameDisplay: document.getElementById('storeNameDisplay')
    };

    function fmtCurrency(amount, decimals = 2) {
        return window.FinanceCalculator.formatCurrency(amount, state.settings.currencySymbol, decimals);
    }

    function fmtNumber(amount, decimals = 2) {
        return window.FinanceCalculator.formatNumber(amount, decimals);
    }

    function showToast(message, duration = 3000) {
        if (!elements.toast) return;
        elements.toastMessage.textContent = message;
        elements.toast.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
        elements.toast.classList.add('opacity-100', 'translate-y-0');
        setTimeout(() => {
            elements.toast.classList.remove('opacity-100', 'translate-y-0');
            elements.toast.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
        }, duration);
    }

    function applyTheme(theme) {
        state.settings.theme = theme;
        if (theme === 'light') {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
        } else {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        }
        window.InstallmentData.Storage.saveSettings(state.settings);
        if (window.lucide) window.lucide.createIcons();
    }

    function init() {
        if (elements.inputPrincipal) elements.inputPrincipal.value = state.principal;
        if (elements.inputDownPayment) elements.inputDownPayment.value = state.downPayment;
        if (elements.inputStartDate) elements.inputStartDate.value = state.startDate;
        
        applyTheme(state.settings.theme || 'dark');
        updateStoreBranding();
        setupEventListeners();
        render();
    }

    function updateStoreBranding() {
        if (elements.storeNameDisplay) {
            elements.storeNameDisplay.textContent = state.settings.storeName || 'نٸام التقسيط المعتمدت';
        }
    }

    function setupEventListeners() {
        document.querySelectorAll('.amount-chip').forEach(btn => {
            btn.addEventListener('click', () => {
                const val = Number(btn.getAttribute('data-value'));
                state.principal = val;
                elements.inputPrincipal.value = val;
                render();
            });
        });

        elements.inputPrincipal.addEventListener('input', (e) => {
            state.principal = Math.max(0, Number(e.target.value) || 0);
            render();
        });

        elements.inputDownPayment.addEventListener('input', (e) => {
            state.downPayment = Math.max(0, Number(e.target.value) || 0);
            render();
        });

        if (elements.downPaymentTypeBtn) {
            elements.downPaymentTypeBtn.addEventListener('click', () => {
                state.downPaymentType = state.downPaymentType === 'fixed' ? 'percent' : 'fixed';
                elements.downPaymentTypeBtn.textContent = state.downPaymentType === 'fixed' ? state.settings.currencySymbol : '%';
                render();
            });
        }

        if (elements.inputStartDate) {
            elements.inputStartDate.addEventListener('change', (e) => {
                state.startDate = e.target.value;
                renderSchedule();
            });
        }

        if (elements.inputClientName) {
            elements.inputClientName.addEventListener('input', (e) => {
                state.clientName = e.target.value;
            });
        }
        if (elements.inputClientPhone) {
            elements.inputClientPhone.addEventListener('input', (e) => {
                state.clientPhone = e.target.value;
            });
        }

        elements.tabPlatform.addEventListener('click', () => switchTab('platform'));
        elements.tabManual.addEventListener('click', () => switchTab('manual'));
        elements.tabComparison.addEventListener('click', () => switchTab('comparison'));

        elements.themeToggleBtn.addEventListener('click', () => {
            const nextTheme = state.settings.theme === 'dark' ? 'light' : 'dark';
            applyTheme(nextTheme);
        });

        elements.openSettingsBtn.addEventListener('click', openSettingsModal);
        elements.closeSettingsBtn.addEventListener('click', closeSettingsModal);
        elements.saveSettingsBtn.addEventListener('click', saveSettingsFromModal);
        elements.resetRatesBtn.addEventListener('click', resetRatesToDefault);

        if (elements.btnPrint) elements.btnPrint.addEventListener('click', handlePrint);
        if (elements.btnPdf) elements.btnPdf.addEventListener('click', handleExportPdf);
        if (elements.btnWhatsApp) elements.btnWhatsApp.addEventListener('click', handleShareWhatsApp);
        if (elements.btnCopySummary) elements.btnCopySummary.addEventListener('click', handleCopySummary);
        if (elements.btnExportCsv) elements.btnExportCsv.addEventListener('click', handleExportCsv);
    }

    function switchTab(system) {
        state.currentSystem = system;

        const tabs = [
            { el: elements.tabPlatform, key: 'platform', activeBg: 'bg-indigo-600', text: 'text-white' },
            { el: elements.tabManual, key: 'manual', activeBg: 'bg-emerald-600', text: 'text-white' },
            { el: elements.tabComparison, key: 'comparison', activeBg: 'bg-amber-600', text: 'text-white' }
        ];

        tabs.forEach(t => {
            t.el.classList.remove('bg-indigo-600', 'bg-emerald-600', 'bg-amber-600', 'text-white', 'shadow-lg');
            t.el.classList.add('text-slate-400', 'hover:text-slate-200');
            if (t.key === system) {
                t.el.classList.add(t.activeBg, t.text, 'shadow-lg');
                t.el.classList.remove('text-slate-400', 'hover:text-slate-200');
            }
        });

        render();
    }

    window.updateInlineRate = function(system, months, delta) {
        const currentRate = Number(state.rates[system][months]) || 0;
        let newRate = Math.round((currentRate + delta) * 10) / 10;
        if (newRate < 0) newRate = 0;
        state.rates[system][months] = newRate;
        window.InstallmentData.Storage.saveRates(state.rates);
        render();
        showToast('تم تحدية نق���{b���������ѡ̀����b�b�băb�ff$��������I�є��������(������((����ݥ���ܹ͕�%�����I�ѕ%���Ѐ�չ�ѥ������ѕ������ѡ̰�م����(����������Ё���I�є��5�Ѡ�������9յ��ɡم���������(���������хє�Ʌѕ�m���ѕ�um���ѡ�t�􁹕�I�є�(��������ݥ���ܹ%��х�������ф�MѽɅ���ٕͅI�ѕ̡�хє�Ʌѕ̤�(��������ɕ���Ƞ��(������((����ݥ���ܹ͕����A�����չ�ѥ������ѡ̤��(���������хє�͕���ѕ�A����􁵽�ѡ��(��������ɕ���Ƞ��(������((����ݥ���ܹѽ����A�嵕��Mх��̀�չ�ѥ�������-�䰁���ѡ%���ँ�(������������Ё�����хє����ɕ��M��ѕ�����|��������-�䀬��}��������ѡ%�����(���������хє��Ʌ�����m���t���хє��Ʌ�����m���t�(��������ݥ���ܹ%��х�������ф�MѽɅ���ٕͅQɅ�������хє��Ʌ�������(��������ɕ����M����ձ����(������(