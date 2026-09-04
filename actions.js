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

window.handleCopyTemplate = function(e) {
    const box = document.getElementById('templatePreviewBox');
    if (!box || !box.value) return;

    if (window.SoundEngine) window.SoundEngine.playSuccessChime();

    // Option 2: Trigger Emerald Sparkle Burst
    if (window.createEmeraldSparkleBurst && e) {
        window.createEmeraldSparkleBurst(e.clientX, e.clientY);
    }

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

window.handleCopySinglePlan = function(e) {
    const s = window.AppState;
    let singleText = '';

    if (window.SoundEngine) window.SoundEngine.playSuccessChime();

    // Option 2: Trigger Emerald Sparkle Burst
    if (window.createEmeraldSparkleBurst && e) {
        window.createEmeraldSparkleBurst(e.clientX, e.clientY);
    }

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
        window.handleCopyTemplate(e);
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

window.handleShareWhatsApp = function(e) {
    const s = window.AppState;
    const box = document.getElementById('templatePreviewBox');
    if (!box || !box.value) return;

    if (window.SoundEngine) window.SoundEngine.playSuccessChime();
    triggerCopyGlowEffect();

    // Option 2: Trigger Emerald Sparkle Burst
    if (window.createEmeraldSparkleBurst && e) {
        window.createEmeraldSparkleBurst(e.clientX, e.clientY);
    }

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

window.switchSettingsTab = function(tabId) {
    const tabs = ['scanner', 'catalog', 'rates', 'store', 'cloud', 'security'];
    tabs.forEach(t => {
        const btn = document.getElementById(`tabBtn_${t}`);
        const pane = document.getElementById(`tabPane_${t}`);
        if (btn) {
            if (t === tabId) {
                btn.className = 'px-3.5 py-2 rounded-xl text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm transition flex items-center gap-1.5 shrink-0 cursor-pointer';
            } else {
                btn.className = 'px-3.5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent transition flex items-center gap-1.5 shrink-0 cursor-pointer';
            }
        }
        if (pane) {
            if (t === tabId) {
                pane.classList.remove('hidden');
            } else {
                pane.classList.add('hidden');
            }
        }
    });

    if (tabId === 'catalog' && typeof window.renderSettingsCatalog === 'function') {
        window.renderSettingsCatalog();
    }
    if (window.lucide) window.lucide.createIcons();
};

window.openSettingsWithTab = function(tabId = 'scanner') {
    window.openSettingsModal();
    window.switchSettingsTab(tabId);
};

window.renderSettingsCatalog = function() {
    const tbody = document.getElementById('catalogDevicesTableBody');
    const countBadge = document.getElementById('catalogDeviceCountBadge');
    if (!tbody) return;
    
    const devices = window.AppState?.devices || [];
    if (countBadge) countBadge.textContent = `${devices.length} جهاز`;
    
    if (devices.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center p-6 text-slate-400">لا توجد أجهزة مضافة حالياً. يمكنك تحديث الأسعار بالصور أو إضافة جهاز جديد أدناه.</td></tr>`;
        return;
    }
    
    tbody.innerHTML = devices.map((d, idx) => `
        <tr class="hover:bg-slate-800/40 transition">
            <td class="p-3 font-bold text-slate-100">${d.name}</td>
            <td class="p-3 text-slate-400 text-xs">${d.specs || d.keys?.slice(0, 2).join(' | ') || '—'}</td>
            <td class="p-3">
                <div class="relative w-36">
                    <input type="number" step="1000" min="0" value="${d.price}" 
                           onchange="window.updateCatalogDevicePrice(${idx}, this.value)"
                           class="w-full fintech-input rounded-xl py-1 px-2.5 text-center font-bold text-emerald-400 text-xs font-mono">
                    <span class="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">د.ع</span>
                </div>
            </td>
            <td class="p-3 text-center">
                <button type="button" onclick="window.deleteCatalogDevice(${idx})" class="w-7 h-7 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 flex items-center justify-center transition cursor-pointer mx-auto" title="حذف الجهاز">
                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                </button>
            </td>
        </tr>
    `).join('');
    if (window.lucide) window.lucide.createIcons();
};

window.updateCatalogDevicePrice = function(index, newPrice) {
    const devices = window.AppState?.devices || [];
    if (devices[index]) {
        devices[index].price = Math.max(0, Number(newPrice) || 0);
        window.InstallmentData.Storage.saveDevices(devices);
        if (window.PriceScanner) window.PriceScanner.renderDeviceDatalist();
        if (window.showToast) window.showToast(`✅ تم تحديث سعر ${devices[index].name}`);
    }
};

window.deleteCatalogDevice = function(index) {
    const devices = window.AppState?.devices || [];
    if (!devices[index]) return;
    if (!confirm(`هل أنت متأكد من حذف ${devices[index].name} من الكتالوج؟`)) return;
    devices.splice(index, 1);
    window.InstallmentData.Storage.saveDevices(devices);
    if (window.PriceScanner) window.PriceScanner.renderDeviceDatalist();
    window.renderSettingsCatalog();
    if (window.showToast) window.showToast('🗑️ تم حذف الجهاز من الكتالوج');
};

window.addNewDeviceToCatalog = function() {
    const nameInput = document.getElementById('newDevName');
    const priceInput = document.getElementById('newDevPrice');
    const specsInput = document.getElementById('newDevSpecs');
    if (!nameInput || !priceInput) return;
    
    const name = nameInput.value.trim();
    const price = Number(priceInput.value) || 0;
    const specs = specsInput ? specsInput.value.trim() : '';
    
    if (!name || price <= 0) {
        alert('يرجى كتابة اسم الجهاز وسعره نقداً بشكل صحيح');
        return;
    }
    
    const devices = window.AppState?.devices || [];
    devices.unshift({
        name,
        price,
        specs,
        keys: [name.toLowerCase(), ...name.toLowerCase().split(' ')]
    });
    
    window.InstallmentData.Storage.saveDevices(devices);
    if (window.PriceScanner) window.PriceScanner.renderDeviceDatalist();
    window.renderSettingsCatalog();
    
    nameInput.value = '';
    priceInput.value = '';
    if (specsInput) specsInput.value = '';
    
    if (window.showToast) window.showToast(`✨ تمت إضافة ${name} إلى الكتالوج بنجاح!`);
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
    if (window.lucide) window.lucide.createIcons();
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
    if (storeAddressEl) s.settings.storeAddress = storeAddressEl.value;

    if (newPassEl && newPassEl.value.trim().length > 0) {
        const newPass = newPassEl.value.trim();
        s.settings.password = newPass;
        s.settings.adminPassword = newPass;
    }

    window.InstallmentData.Storage.saveRates(s.rates);
    window.InstallmentData.Storage.saveSettings(s.settings);

    // Push live updates directly to Google Firebase Cloud Database
    if (window.CloudSync && typeof window.CloudSync.pushConfigToCloud === 'function') {
        window.CloudSync.pushConfigToCloud();
    }

    const storeDisplay = document.getElementById('storeNameDisplay');
    if (storeDisplay) storeDisplay.textContent = s.settings.storeName;

    if (window.SoundEngine) window.SoundEngine.playSuccessChime();
    window.closeSettingsModal();
    window.render();
    window.showToast('☁️ تم حفظ ومزامنة النسب على سحابة Google لجميع الأجهزة!');
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

        // Trigger Option 4: Logo Pulse & Ripple Wave
        if (typeof window.triggerLogoRipple === 'function') {
            window.triggerLogoRipple();
        }

        // Initialize Option 3: Liquid Sliding Tab Indicator
        if (typeof window.updateTabIndicator === 'function') {
            setTimeout(() => {
                window.updateTabIndicator(window.AppState.currentSystem);
            }, 50);
        }

        // Initialize Global Cloud Sync Engine
        if (window.CloudSync && typeof window.CloudSync.init === 'function') {
            window.CloudSync.init();
        }

        // Initialize Max AI Sales Advisor Engine
        if (window.MaxAIAdvisor && typeof window.MaxAIAdvisor.init === 'function') {
            window.MaxAIAdvisor.init();
        }

        // Initialize AI Vision Price Sheet Scanner Engine
        if (window.PriceScanner && typeof window.PriceScanner.init === 'function') {
            window.PriceScanner.init();
        }

        // Bind Cloud Sync Buttons in Settings
        const btnDownloadConfig = document.getElementById('btnDownloadConfig');
        const btnCloudSyncNow = document.getElementById('btnCloudSyncNow');
        if (btnDownloadConfig) {
            btnDownloadConfig.addEventListener('click', () => {
                if (window.CloudSync) window.CloudSync.downloadUpdatedConfig();
            });
        }
        if (btnCloudSyncNow) {
            btnCloudSyncNow.addEventListener('click', async () => {
                if (window.CloudSync) {
                    await window.CloudSync.pullLatestConfig();
                    window.showToast('☁️ تم تحديث البيانات من السحابة المركزية بنجاح');
                }
            });
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
