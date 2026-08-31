/**
 * Action Handlers (Copy, WhatsApp, Telegram, Settings Modals & Advanced Security)
 * Enhanced with Sound FX, Visual Glow Effect, SHA-256 Password Verification & Anti-Brute Force Protection
 */

function normalizeArabicDigits(str) {
    if (!str) return '';
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return String(str).replace(/[٠-٩]/g, d => arabicDigits.indexOf(d)).trim();
}

function triggerCopyGlowEffect() {
    const box = document.getElementById('templatePreviewBox');
    if (box) {
        box.classList.remove('copy-glow-active');
        void box.offsetWidth;
        box.classList.add('copy-glow-active');
        setTimeout(() => {
            box.classList.remove('copy-glow-active');
        }, 900);
    }
}

window.handleCopyTemplate = function() {
    const box = document.getElementById('templatePreviewBox');
    if (!box || !box.value) return;

    if (window.SoundEngine) window.SoundEngine.playSuccessChime();

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(box.value).then(() => {
            triggerCopyGlowEffect();
            window.showToast('📋 تم نسخ الكليشة بنجاح!');
        }).catch(() => {
            box.select();
            document.execCommand('copy');
            triggerCopyGlowEffect();
            window.showToast('📋 تم نسخ الكليشة بنجاح!');
        });
    } else {
        box.select();
        document.execCommand('copy');
        triggerCopyGlowEffect();
        window.showToast('📋 تم نسخ الكليشة بنجاح!');
    }
};

window.handleCopySinglePlan = function() {
    const s = window.AppState;
    let singleText = '';

    if (window.SoundEngine) window.SoundEngine.playSuccessChime();

    if (s.currentSystem === 'platform' || s.currentSystem === 'manual') {
        const rate = (s.rates[s.currentSystem] && s.rates[s.currentSystem][s.selectedPlan]) ? s.rates[s.currentSystem][s.selectedPlan] : 0;
        const calc = window.FinanceCalculator.calculatePlan({
            principal: s.principal,
            downPayment: s.downPayment,
            downPaymentType: s.downPaymentType,
            months: s.selectedPlan,
            ratePercent: rate,
            calculationMode: s.settings.calculationMode,
            roundingMode: s.settings.roundingMode
        });

        const prodHeader = s.productName ? `📱 المنتج: ${s.productName}\n\n` : '';
        const durationTitle = s.selectedPlan === 12 ? 'تقسيط 12 أشهر' : `تقسيط ${s.selectedPlan} شهر`;
        const downPaymentStr = calc.actualDownPayment > 0 ? window.FinanceCalculator.formatIraqiShort(calc.actualDownPayment) : 'بدون مقدمة';

        singleText = `${prodHeader}🔴 ${durationTitle}\n\n` +
                     `💰 السعر النقدي: ${window.FinanceCalculator.formatNumber(calc.originalPrincipal)} دينار\n\n` +
                     `💵 المقدمة: ${downPaymentStr}\n\n` +
                     `📆 الاستقطاع الشهري: ${window.FinanceCalculator.formatIraqiShort(calc.monthlyInstallment)}\n\n` +
                     `💳 مجموع الأقساط: ${window.FinanceCalculator.formatIraqiShort(calc.totalRepayment)}`;
        
        if (s.settings.storeName) singleText += `\n\n━━━━━━━━━━━━━━━━━━━━\n📍 متجر ${s.settings.storeName}`;
    } else {
        window.handleCopyTemplate();
        return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(singleText).then(() => {
            triggerCopyGlowEffect();
            window.showToast(`📋 تم نسخ خطة (${s.selectedPlan} شهر) بنجاح!`);
        });
    } else {
        window.showToast(`📋 تم نسخ خطة (${s.selectedPlan} شهر) بنجاح!`);
    }
};

window.handleShareWhatsApp = function() {
    const s = window.AppState;
    const box = document.getElementById('templatePreviewBox');
    if (!box || !box.value) return;

    if (window.SoundEngine) window.SoundEngine.playSuccessChime();
    triggerCopyGlowEffect();

    let text = encodeURIComponent(box.value);
    let url = `https://wa.me/?text=${text}`;

    if (s.customerPhone && s.customerPhone.trim()) {
        let phone = s.customerPhone.trim().replace(/\D/g, '');
        if (phone.startsWith('07')) {
            phone = '964' + phone.substring(1);
        } else if (phone.startsWith('7')) {
            phone = '964' + phone;
        }
        url = `https://wa.me/${phone}?text=${text}`;
    }

    window.open(url, '_blank');
};

// Password Protection for Settings with Anti-Brute Force Lock
window.promptPasswordForSettings = function() {
    const passModal = document.getElementById('passwordModal');
    const passInput = document.getElementById('passwordInput');
    const err = document.getElementById('passwordErrorMsg');
    const submitBtn = document.getElementById('submitPasswordBtn');
    const lockoutBanner = document.getElementById('lockoutBanner');

    if (err) err.classList.add('hidden');
    if (passInput) passInput.value = '';

    const lockState = (window.SecurityEngine && window.SecurityEngine.getLockoutState) ? window.SecurityEngine.getLockoutState() : { locked: false };
    if (lockState.locked) {
        if (passInput) passInput.disabled = true;
        if (submitBtn) submitBtn.disabled = true;
        if (lockoutBanner) {
            lockoutBanner.classList.remove('hidden');
            lockoutBanner.textContent = `⏳ تم قفل المحاولات مؤقتاً. يرجى الانتظار (${lockState.remainingSec}) ثانية`;
        }
        if (window.SecurityEngine) {
            window.SecurityEngine.startLockoutCountdown(
                (sec) => {
                    if (lockoutBanner) lockoutBanner.textContent = `⏳ تم قفل المحاولات مؤقتاً. يرجى الانتظار (${sec}) ثانية`;
                },
                () => {
                    if (passInput) { passInput.disabled = false; passInput.focus(); }
                    if (submitBtn) submitBtn.disabled = false;
                    if (lockoutBanner) lockoutBanner.classList.add('hidden');
                }
            );
        }
    } else {
        if (passInput) passInput.disabled = false;
        if (submitBtn) submitBtn.disabled = false;
        if (lockoutBanner) lockoutBanner.classList.add('hidden');
    }

    if (passModal) passModal.classList.remove('hidden');
    setTimeout(() => { if (passInput && !passInput.disabled) passInput.focus(); }, 100);
};

window.closePasswordModal = function() {
    const passModal = document.getElementById('passwordModal');
    if (passModal) passModal.classList.add('hidden');
};

// Strict SHA-256 Password Verification with Anti-Brute Force Protection
window.checkPasswordAndOpen = async function() {
    const s = window.AppState;
    const passInput = document.getElementById('passwordInput');
    const err = document.getElementById('passwordErrorMsg');
    const submitBtn = document.getElementById('submitPasswordBtn');
    const lockoutBanner = document.getElementById('lockoutBanner');
    const rawEntered = passInput ? passInput.value : '';

    if (window.SecurityEngine && window.SecurityEngine.getLockoutState) {
        const lockState = window.SecurityEngine.getLockoutState();
        if (lockState.locked) return;
    }

    let isMatch = false;
    const activePassPlain = s.settings.password || s.settings.adminPassword || '1234';

    if (window.SecurityEngine && window.SecurityEngine.hashPassword) {
        const enteredHash = await window.SecurityEngine.hashPassword(rawEntered);
        const targetHash = await window.SecurityEngine.hashPassword(activePassPlain);
        isMatch = (enteredHash === targetHash);
    } else {
        const normEntered = normalizeArabicDigits(rawEntered);
        const normTarget = normalizeArabicDigits(activePassPlain);
        isMatch = (normEntered === normTarget);
    }

    if (isMatch) {
        if (window.SecurityEngine) window.SecurityEngine.resetAttempts();
        if (err) err.classList.add('hidden');
        if (lockoutBanner) lockoutBanner.classList.add('hidden');
        if (window.SoundEngine) window.SoundEngine.playSuccessChime();
        window.closePasswordModal();
        window.openSettingsModal();
    } else {
        let failState = { locked: false, remainingAttempts: 2 };
        if (window.SecurityEngine && window.SecurityEngine.recordFailedAttempt) {
            failState = window.SecurityEngine.recordFailedAttempt();
        }

        if (failState.locked) {
            if (passInput) passInput.disabled = true;
            if (submitBtn) submitBtn.disabled = true;
            if (err) err.classList.add('hidden');
            if (lockoutBanner) {
                lockoutBanner.classList.remove('hidden');
                lockoutBanner.textContent = `⏳ تم قفل المحاولات مؤقتاً بعد 3 محاولات خاطئة. يرجى الانتظار (${failState.remainingSec}) ثانية`;
            }
            if (window.SecurityEngine) {
                window.SecurityEngine.startLockoutCountdown(
                    (sec) => {
                        if (lockoutBanner) lockoutBanner.textContent = `⏳ تم قفل المحاولات مؤقتاً بعد 3 محاولات خاطئة. يرجى الانتظار (${sec}) ثانية`;
                    },
                    () => {
                        if (passInput) { passInput.disabled = false; passInput.focus(); }
                        if (submitBtn) submitBtn.disabled = false;
                        if (lockoutBanner) lockoutBanner.classList.add('hidden');
                    }
                );
            }
        } else {
            if (err) {
                err.textContent = `❌ كلمة المرور غير صحيحة (متبقي ${failState.remainingAttempts} محاولات)`;
                err.classList.remove('hidden');
            }
            if (passInput) passInput.select();
        }
    }
};

window.openSettingsModal = function() {
    const s = window.AppState;
    const modal = document.getElementById('settingsModal');
    if (!modal) return;

    if (!s.rates.other) {
        s.rates.other = { ...window.InstallmentData.DEFAULT_RATES.other };
    }

    // 1. Fill Platform & Manual Rates
    ['10', '12', '14', '16', '18'].forEach(m => {
        const pEl = document.getElementById(`set_p${m}`);
        const mEl = document.getElementById(`set_m${m}`);
        if (pEl) pEl.value = s.rates.platform[m] ?? 0;
        if (mEl) mEl.value = s.rates.manual[m] ?? 0;
    });

    // 2. Fill Other Services Rates
    const rafRateEl = document.getElementById('set_raf_rate');
    const ahliRateEl = document.getElementById('set_ahli_rate');
    const salCustFeeEl = document.getElementById('set_sal_cust_fee');
    const salMerchFeeEl = document.getElementById('set_sal_merch_fee');

    if (rafRateEl) rafRateEl.value = s.rates.other.rafidain_rate ?? 8.0;
    if (ahliRateEl) ahliRateEl.value = s.rates.other.ahli_rasheed_monthly ?? 2.0;
    if (salCustFeeEl) salCustFeeEl.value = s.rates.other.salary_customer_fee ?? 2000;
    if (salMerchFeeEl) salMerchFeeEl.value = s.rates.other.salary_merchant_fee ?? 1.0;

    // 3. Fill General Settings
    const storeNameEl = document.getElementById('settingStoreName');
    const calcModeEl = document.getElementById('settingCalcMode');
    const roundingModeEl = document.getElementById('settingRoundingMode');
    const storePhoneEl = document.getElementById('settingStorePhone');
    const storeAddressEl = document.getElementById('settingStoreAddress');
    const newPassEl = document.getElementById('newPasswordInput');

    if (storeNameEl) storeNameEl.value = s.settings.storeName || '';
    if (calcModeEl) calcModeEl.value = s.settings.calculationMode || 'flat';
    if (roundingModeEl) roundingModeEl.value = s.settings.roundingMode || 'none';
    if (storePhoneEl) storePhoneEl.value = s.settings.storePhone || '';
    if (storeAddressEl) storeAddressEl.value = s.settings.storeAddress || '';
    if (newPassEl) newPassEl.value = '';

    modal.classList.remove('hidden');
};

window.closeSettingsModal = function() {
    const modal = document.getElementById('settingsModal');
    if (modal) modal.classList.add('hidden');
};

window.saveSettingsFromModal = function() {
    const s = window.AppState;

    // 1. Save Platform & Manual Rates
    ['10', '12', '14', '16', '18'].forEach(m => {
        const pEl = document.getElementById(`set_p${m}`);
        const mEl = document.getElementById(`set_m${m}`);
        if (pEl) s.rates.platform[m] = Number(pEl.value) || 0;
        if (mEl) s.rates.manual[m] = Number(mEl.value) || 0;
    });

    // 2. Save Other Services Rates
    if (!s.rates.other) s.rates.other = {};
    const rafRateEl = document.getElementById('set_raf_rate');
    const ahliRateEl = document.getElementById('set_ahli_rate');
    const salCustFeeEl = document.getElementById('set_sal_cust_fee');
    const salMerchFeeEl = document.getElementById('set_sal_merch_fee');

    if (rafRateEl) s.rates.other.rafidain_rate = Number(rafRateEl.value) || 0;
    if (ahliRateEl) s.rates.other.ahli_rasheed_monthly = Number(ahliRateEl.value) || 0;
    if (salCustFeeEl) s.rates.other.salary_customer_fee = Number(salCustFeeEl.value) || 0;
    if (salMerchFeeEl) s.rates.other.salary_merchant_fee = Number(salMerchFeeEl.value) || 0;

    // 3. Save Store & App Options
    const storeNameEl = document.getElementById('settingStoreName');
    const calcModeEl = document.getElementById('settingCalcMode');
    const roundingModeEl = document.getElementById('settingRoundingMode');
    const storePhoneEl = document.getElementById('settingStorePhone');
    const storeAddressEl = document.getElementById('settingStoreAddress');
    const newPassEl = document.getElementById('newPasswordInput');

    if (storeNameEl) s.settings.storeName = storeNameEl.value;
    if (calcModeEl) s.settings.calculationMode = calcModeEl.value;
    if (roundingModeEl) s.settings.roundingMode = roundingModeEl.value;
    if (storePhoneEl) s.settings.storePhone = storePhoneEl.value;
    if (storeAddressEl) storeAddressEl.value = storeAddressEl.value;

    if (newPassEl && newPassEl.value.trim().length > 0) {
        const newPass = newPassEl.value.trim();
        s.settings.password = newPass;
        s.settings.adminPassword = newPass;
    }

    window.InstallmentData.Storage.saveRates(s.rates);
    window.InstallmentData.Storage.saveSettings(s.settings);

    const storeDisplay = document.getElementById('storeNameDisplay');
    if (storeDisplay) storeDisplay.textContent = s.settings.storeName;

    if (window.SoundEngine) window.SoundEngine.playSuccessChime();
    window.closeSettingsModal();
    window.render();
    window.showToast('✅ تم حفظ كافة النسب والإعدادات بنجاح');
};

window.resetRatesToDefault = function() {
    if (!confirm('هل أنت متأكد من استعادة كافة النسب الافتراضية؟')) return;
    const s = window.AppState;
    s.rates = JSON.parse(JSON.stringify(window.InstallmentData.DEFAULT_RATES));
    window.InstallmentData.Storage.saveRates(s.rates);
    window.openSettingsModal();
    window.render();
    window.showToast('🔄 تم استعادة كافة النسب الافتراضية');
};

// Immediate Robust Application Bootloader
function bootApplication() {
    try {
        if (typeof initElements === 'function') initElements();
        if (typeof window.setupEventListeners === 'function') window.setupEventListeners();

        const btnCopy = document.getElementById('btnCopyTemplate');
        const btnCopySingle = document.getElementById('btnCopySinglePlan');
        const btnWA = document.getElementById('btnWhatsApp');

        if (btnCopy) btnCopy.addEventListener('click', window.handleCopyTemplate);
        if (btnCopySingle) btnCopySingle.addEventListener('click', window.handleCopySinglePlan);
        if (btnWA) btnWA.addEventListener('click', window.handleShareWhatsApp);

        // Security Backup Buttons
        const btnExportBackup = document.getElementById('btnExportBackup');
        const btnImportBackup = document.getElementById('btnImportBackup');
        const fileImportInput = document.getElementById('fileImportInput');

        if (btnExportBackup) {
            btnExportBackup.addEventListener('click', () => {
                if (window.SecurityEngine) window.SecurityEngine.exportBackup();
            });
        }
        if (btnImportBackup && fileImportInput) {
            btnImportBackup.addEventListener('click', () => fileImportInput.click());
            fileImportInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files[0] && window.SecurityEngine) {
                    window.SecurityEngine.importBackup(e.target.files[0]);
                    e.target.value = '';
                }
            });
        }

        if (window.applyTheme) window.applyTheme(window.AppState.settings.theme || 'light');

        // Initial render
        if (typeof window.render === 'function') window.render();
        if (window.lucide) {
            try { lucide.createIcons(); } catch(e){}
        }
    } catch(err) {
        console.error('Initialization error:', err);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootApplication);
} else {
    bootApplication();
}
