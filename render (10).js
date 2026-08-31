// Fintech Classic Luxury Fast Renderer with Dynamic Other Services Rates

window.render = function() {
    renderMainSystemView();
    if (window.attach3DTiltEffect) {
        window.attach3DTiltEffect();
    }
};

/**
 * Smooth Slot Rolling Counter Animation Engine
 */
window.animateRollingCounter = function(element, start, end, duration = 350, formatFn = null) {
    if (!element) return;
    
    start = Number(start) || 0;
    end = Number(end) || 0;

    if (!formatFn) {
        formatFn = (val) => window.FinanceCalculator.formatIraqiShort(val);
    }

    if (start === end) {
        element.textContent = formatFn(end);
        element.dataset.currentVal = end;
        element._currentNumericVal = end;
        return;
    }

    if (element._animId) {
        cancelAnimationFrame(element._animId);
    }

    element.classList.add('rolling-counter-active');
    const startTime = performance.now();

    function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (end - start) * ease);
        
        element._currentNumericVal = current;
        element.textContent = formatFn(current);

        if (progress < 1) {
            element._animId = requestAnimationFrame(step);
        } else {
            element.textContent = formatFn(end);
            element.dataset.currentVal = end;
            element._currentNumericVal = end;
            element._animId = null;
            setTimeout(() => {
                element.classList.remove('rolling-counter-active');
            }, 100);
        }
    }

    element._animId = requestAnimationFrame(step);
};

function renderMainSystemView() {
    const s = window.AppState;
    const els = window.AppElements;
    
    // Update System Badge
    if (els.systemBadge) {
        if (s.currentSystem === 'platform') {
            els.systemBadge.innerHTML = `
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 shadow-sm">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    تقسيط المنصة
                </span>
            `;
        } else if (s.currentSystem === 'manual') {
            els.systemBadge.innerHTML = `
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-500/15 text-orange-500 border border-orange-500/30 shadow-sm">
                    <span class="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                    التسديد اليدوي
                </span>
            `;
        } else if (s.currentSystem === 'other') {
            els.systemBadge.innerHTML = `
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-500/15 text-sky-500 border border-sky-500/30 shadow-sm">
                    <span class="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
                    خدمات مصرفية وأخرى
                </span>
            `;
        }
    }

    // Toggle Input Fields Visibility based on Active Tab
    updateInputFieldsVisibility();

    // Update Real-time Iraqi Currency Tafqeet Badges
    updateSpokenWordsBadges();

    renderPlanCards();
    renderTemplateBox();
}

function updateSpokenWordsBadges() {
    const s = window.AppState;
    const principalSpokenEl = document.getElementById('principalSpokenWord');
    const downPaymentSpokenEl = document.getElementById('downPaymentSpokenWord');

    if (principalSpokenEl) {
        if (s.principal > 0) {
            principalSpokenEl.textContent = window.FinanceCalculator.toIraqiSpokenWords(s.principal);
            principalSpokenEl.classList.remove('hidden');
        } else {
            principalSpokenEl.textContent = '';
            principalSpokenEl.classList.add('hidden');
        }
    }

    if (downPaymentSpokenEl) {
        if (s.downPayment > 0 && s.downPaymentType === 'fixed') {
            downPaymentSpokenEl.textContent = window.FinanceCalculator.toIraqiSpokenWords(s.downPayment);
            downPaymentSpokenEl.classList.remove('hidden');
        } else {
            downPaymentSpokenEl.textContent = '';
            downPaymentSpokenEl.classList.add('hidden');
        }
    }
}

function updateInputFieldsVisibility() {
    const s = window.AppState;
    const rowNamePhone = document.getElementById('rowProductNamePhone');
    const colDownPayment = document.getElementById('colDownPayment');
    const rowPriceAndDp = document.getElementById('rowPriceAndDp');

    if (!rowNamePhone || !colDownPayment || !rowPriceAndDp) return;

    if (s.currentSystem === 'other') {
        rowNamePhone.classList.add('hidden');
        colDownPayment.classList.add('hidden');
        rowPriceAndDp.classList.remove('sm:grid-cols-2');
        rowPriceAndDp.classList.add('grid-cols-1');
    } else {
        rowNamePhone.classList.remove('hidden');
        colDownPayment.classList.remove('hidden');
        rowPriceAndDp.classList.remove('grid-cols-1');
        rowPriceAndDp.classList.add('sm:grid-cols-2');
    }
}

function renderPlanCards() {
    const s = window.AppState;
    const els = window.AppElements;

    if (!els.cardsContainer) return;

    if (s.currentSystem === 'platform' || s.currentSystem === 'manual') {
        const isPlatform = s.currentSystem === 'platform';
        const activeClass = isPlatform ? 'active-platform' : 'active-manual';
        const accentText = isPlatform ? 'text-emerald-500' : 'text-orange-500';
        const durations = [10, 12, 14, 16, 18];

        if (els.cardsSectionTitle) {
            els.cardsSectionTitle.textContent = 'عروض وخطط السداد (10 - 18 شهر):';
        }

        const currentContainerSystem = els.cardsContainer.dataset.renderedSystem;
        const needsRebuild = currentContainerSystem !== s.currentSystem;

        if (needsRebuild) {
            els.cardsContainer.dataset.renderedSystem = s.currentSystem;
            els.cardsContainer.className = 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 cards-3d-perspective-container';
            
            let html = '';
            for (let i = 0; i < durations.length; i++) {
                const months = durations[i];
                html += `
                    <div id="card-plan-${months}" onclick="selectPlan(${months})" 
                         class="fintech-plan-card rounded-2xl p-3.5 sm:p-4 cursor-pointer relative flex flex-col justify-between">
                        
                        <!-- Plan Header Badges -->
                        <div class="flex items-center justify-between mb-2">
                            <span class="font-extrabold text-xs sm:text-sm text-slate-800 dark:text-slate-100 font-heading">${months} أشهر</span>
                            <span id="badge-plan-${months}" class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono">
                                ${months}M
                            </span>
                        </div>

                        <!-- Monthly Installment Display with Slot Rolling Counter -->
                        <div class="my-2 text-center py-2 px-1 rounded-xl plan-stat-box">
                            <span class="text-[10px] text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">الاستقطاع الشهري:</span>
                            <div id="installment-val-${months}" data-current-val="0" class="font-black text-lg sm:text-xl font-mono ${accentText} tracking-tight rolling-counter-val">
                                0
                            </div>
                        </div>

                        <!-- Plan Financial Summary -->
                        <div class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 space-y-1 pt-1.5 border-t border-slate-200 dark:border-slate-800">
                            <div class="flex items-center justify-between">
                                <span>المجموع:</span>
                                <span id="total-val-${months}" data-current-val="0" class="font-bold text-slate-800 dark:text-slate-200 font-mono">0</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span>الفائدة:</span>
                                <span id="profit-val-${months}" data-current-val="0" class="font-bold text-amber-500 dark:text-amber-400 font-mono">0</span>
                            </div>
                        </div>
                    </div>
                `;
            }
            els.cardsContainer.innerHTML = html;
        }

        durations.forEach(months => {
            const cardEl = document.getElementById(`card-plan-${months}`);
            const badgeEl = document.getElementById(`badge-plan-${months}`);
            const instEl = document.getElementById(`installment-val-${months}`);
            const totalEl = document.getElementById(`total-val-${months}`);
            const profitEl = document.getElementById(`profit-val-${months}`);

            const rate = s.rates[s.currentSystem][months] ?? 0;
            const calc = window.FinanceCalculator.calculatePlan({
                principal: s.principal,
                downPayment: s.downPayment,
                downPaymentType: s.downPaymentType,
                months: months,
                ratePercent: rate,
                calculationMode: s.settings.calculationMode,
                roundingMode: s.settings.roundingMode
            });

            const isSelected = s.selectedPlan === months;

            if (cardEl) {
                cardEl.className = `fintech-plan-card rounded-2xl p-3.5 sm:p-4 cursor-pointer relative flex flex-col justify-between ${isSelected ? activeClass : ''}`;
            }

            if (badgeEl) {
                badgeEl.className = `text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${isSelected ? (isPlatform ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300' : 'bg-orange-500/20 text-orange-600 dark:text-orange-300') : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`;
            }

            if (instEl) {
                const prevVal = Number(instEl._currentNumericVal ?? instEl.dataset.currentVal) || 0;
                window.animateRollingCounter(instEl, prevVal, calc.monthlyInstallment, 350);
            }

            if (totalEl) {
                const prevTotal = Number(totalEl._currentNumericVal ?? totalEl.dataset.currentVal) || 0;
                window.animateRollingCounter(totalEl, prevTotal, calc.totalRepayment, 350);
            }

            if (profitEl) {
                const prevProfit = Number(profitEl._currentNumericVal ?? profitEl.dataset.currentVal) || 0;
                window.animateRollingCounter(profitEl, prevProfit, calc.profitAmount, 350);
            }
        });

    } else if (s.currentSystem === 'other') {
        if (els.cardsSectionTitle) {
            els.cardsSectionTitle.textContent = 'الخدمات المصرفية والدفع عند الراتب:';
        }

        const otherRates = s.rates.other || window.InstallmentData.DEFAULT_RATES.other;
        const currentContainerSystem = els.cardsContainer.dataset.renderedSystem;
        const needsRebuild = currentContainerSystem !== 'other';

        if (needsRebuild) {
            els.cardsContainer.dataset.renderedSystem = 'other';
            els.cardsContainer.className = 'grid grid-cols-1 md:grid-cols-3 gap-3.5 cards-3d-perspective-container';

            const html = `
                <!-- 1. Rafidain Bank Card -->
                <div class="fintech-plan-card rounded-2xl p-4 sm:p-5 flex flex-col justify-between border-sky-500/30 bg-gradient-to-b from-sky-950/20 to-transparent">
                    <div>
                        <div class="flex items-center justify-between mb-3 pb-2 border-b border-slate-200 dark:border-slate-800">
                            <div class="flex items-center gap-2">
                                <span class="text-base">🏛️</span>
                                <span class="font-black text-sm text-slate-800 dark:text-slate-100 font-heading">مصرف الرافدين</span>
                            </div>
                            <span id="raf-badge-rate" class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 font-mono">شهر واحد (${otherRates.rafidain_rate}%)</span>
                        </div>
                        
                        <div class="my-3 text-center py-2.5 px-2 rounded-xl plan-stat-box">
                            <span class="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">المطلوب سداده بعد شهر:</span>
                            <div id="raf-installment-val" data-current-val="0" class="font-black text-xl text-sky-500 font-mono rolling-counter-val">
                                0
                            </div>
                        </div>

                        <div class="text-xs text-slate-500 dark:text-slate-400 space-y-1.5">
                            <div class="flex items-center justify-between">
                                <span id="raf-label-profit">فائدة المصرف (${otherRates.rafidain_rate}%):</span>
                                <span id="raf-profit-val" data-current-val="0" class="font-bold text-amber-500 font-mono">0</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span>سعر السلعة نقداً:</span>
                                <span id="raf-price-val" data-current-val="0" class="font-bold text-slate-700 dark:text-slate-300 font-mono">0</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 2. Ahli & Rasheed Bank Card -->
                <div class="fintech-plan-card rounded-2xl p-4 sm:p-5 flex flex-col justify-between border-purple-500/30 bg-gradient-to-b from-purple-950/20 to-transparent">
                    <div>
                        <div class="flex items-center justify-between mb-3 pb-2 border-b border-slate-200 dark:border-slate-800">
                            <div class="flex items-center gap-2">
                                <span class="text-base">🏦</span>
                                <span class="font-black text-sm text-slate-800 dark:text-slate-100 font-heading">الأهلي والرشيد</span>
                            </div>
                            <span id="ahli-badge-rate" class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-mono">${otherRates.ahli_rasheed_monthly}% شهرياً</span>
                        </div>

                        <div class="space-y-2 my-2">
                            <div class="flex items-center justify-between p-2 rounded-xl plan-stat-box text-xs">
                                <span id="ahli-title-6" class="font-bold text-slate-700 dark:text-slate-300">خطة 6 أشهر (${otherRates.ahli_rasheed_monthly * 6}%):</span>
                                <span id="ahli-inst-6" data-current-val="0" class="font-black text-purple-500 font-mono rolling-counter-val">0</span>
                            </div>
                            <div class="flex items-center justify-between p-2 rounded-xl plan-stat-box text-xs">
                                <span id="ahli-title-9" class="font-bold text-slate-700 dark:text-slate-300">خطة 9 أشهر (${otherRates.ahli_rasheed_monthly * 9}%):</span>
                                <span id="ahli-inst-9" data-current-val="0" class="font-black text-purple-500 font-mono rolling-counter-val">0</span>
                            </div>
                            <div class="flex items-center justify-between p-2 rounded-xl plan-stat-box text-xs">
                                <span id="ahli-title-12" class="font-bold text-slate-700 dark:text-slate-300">خطة 12 شهر (${otherRates.ahli_rasheed_monthly * 12}%):</span>
                                <span id="ahli-inst-12" data-current-val="0" class="font-black text-purple-500 font-mono rolling-counter-val">0</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 3. Pay on Salary Card -->
                <div class="fintech-plan-card rounded-2xl p-4 sm:p-5 flex flex-col justify-between border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 to-transparent">
                    <div>
                        <div class="flex items-center justify-between mb-3 pb-2 border-b border-slate-200 dark:border-slate-800">
                            <div class="flex items-center gap-2">
                                <span class="text-base">🔵</span>
                                <span class="font-black text-sm text-slate-800 dark:text-slate-100 font-heading">الدفع عند الراتب</span>
                            </div>
                            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono">دفعة واحدة</span>
                        </div>

                        <div class="my-3 text-center py-2.5 px-2 rounded-xl plan-stat-box">
                            <span class="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">المستقطع من راتب الزبون:</span>
                            <div id="sal-customer-total" data-current-val="0" class="font-black text-xl text-emerald-500 font-mono rolling-counter-val">
                                0
                            </div>
                            <span id="sal-note-fee" class="text-[10px] text-slate-400 mt-0.5 block">(شامل ${window.FinanceCalculator.formatNumber(otherRates.salary_customer_fee)} د.ع رسوم)</span>
                        </div>

                        <div class="text-xs text-slate-500 dark:text-slate-400 space-y-1.5 pt-1 border-t border-slate-200 dark:border-slate-800">
                            <div class="flex items-center justify-between">
                                <span id="sal-label-merchant">عمولة المنصة (${otherRates.salary_merchant_fee}%):</span>
                                <span id="sal-fee-amount" data-current-val="0" class="font-bold text-rose-500 font-mono">0</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span>صافي حساب المعرض:</span>
                                <span id="sal-merchant-net" data-current-val="0" class="font-bold text-emerald-500 font-mono">0</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            els.cardsContainer.innerHTML = html;
        }

        // Animate Banking Values
        const raf = window.FinanceCalculator.calculateRafidain({
            principal: s.principal,
            downPayment: 0,
            ratePercent: otherRates.rafidain_rate
        });
        const mRate = otherRates.ahli_rasheed_monthly;
        const ahli6 = window.FinanceCalculator.calculateAhliRasheed({ principal: s.principal, downPayment: 0, months: 6, monthlyRate: mRate });
        const ahli9 = window.FinanceCalculator.calculateAhliRasheed({ principal: s.principal, downPayment: 0, months: 9, monthlyRate: mRate });
        const ahli12 = window.FinanceCalculator.calculateAhliRasheed({ principal: s.principal, downPayment: 0, months: 12, monthlyRate: mRate });
        const sal = window.FinanceCalculator.calculateSalaryAdvance({
            principal: s.principal,
            customerFee: otherRates.salary_customer_fee,
            merchantFeePercent: otherRates.salary_merchant_fee
        });

        const rafInst = document.getElementById('raf-installment-val');
        const rafProfit = document.getElementById('raf-profit-val');
        const rafPrice = document.getElementById('raf-price-val');
        if (rafInst) window.animateRollingCounter(rafInst, Number(rafInst._currentNumericVal ?? rafInst.dataset.currentVal) || 0, raf.monthlyInstallment, 350);
        if (rafProfit) window.animateRollingCounter(rafProfit, Number(rafProfit._currentNumericVal ?? rafProfit.dataset.currentVal) || 0, raf.profitAmount, 350);
        if (rafPrice) window.animateRollingCounter(rafPrice, Number(rafPrice._currentNumericVal ?? rafPrice.dataset.currentVal) || 0, raf.originalPrincipal, 350);

        const ahli6El = document.getElementById('ahli-inst-6');
        const ahli9El = document.getElementById('ahli-inst-9');
        const ahli12El = document.getElementById('ahli-inst-12');
        if (ahli6El) window.animateRollingCounter(ahli6El, Number(ahli6El._currentNumericVal ?? ahli6El.dataset.currentVal) || 0, ahli6.monthlyInstallment, 350, val => `${window.FinanceCalculator.formatIraqiShort(val)} / شهر`);
        if (ahli9El) window.animateRollingCounter(ahli9El, Number(ahli9El._currentNumericVal ?? ahli9El.dataset.currentVal) || 0, ahli9.monthlyInstallment, 350, val => `${window.FinanceCalculator.formatIraqiShort(val)} / شهر`);
        if (ahli12El) window.animateRollingCounter(ahli12El, Number(ahli12El._currentNumericVal ?? ahli12El.dataset.currentVal) || 0, ahli12.monthlyInstallment, 350, val => `${window.FinanceCalculator.formatIraqiShort(val)} / شهر`);

        const salTotalEl = document.getElementById('sal-customer-total');
        const salFeeEl = document.getElementById('sal-fee-amount');
        const salNetEl = document.getElementById('sal-merchant-net');
        if (salTotalEl) window.animateRollingCounter(salTotalEl, Number(salTotalEl._currentNumericVal ?? salTotalEl.dataset.currentVal) || 0, sal.customerTotal, 350, val => `${window.FinanceCalculator.formatNumber(val)} د.ع`);
        if (salFeeEl) window.animateRollingCounter(salFeeEl, Number(salFeeEl._currentNumericVal ?? salFeeEl.dataset.currentVal) || 0, sal.merchantFeeAmount, 350, val => `${window.FinanceCalculator.formatNumber(val)} د.ع`);
        if (salNetEl) window.animateRollingCounter(salNetEl, Number(salNetEl._currentNumericVal ?? salNetEl.dataset.currentVal) || 0, sal.merchantNet, 350, val => `${window.FinanceCalculator.formatNumber(val)} د.ع`);
    }
}

function renderTemplateBox() {
    const s = window.AppState;
    const els = window.AppElements;
    if (!els.templatePreviewBox) return;

    const fullTemplate = window.FinanceCalculator.generateFullTemplate({
        principal: s.principal,
        downPayment: s.downPayment,
        downPaymentType: s.downPaymentType,
        system: s.currentSystem,
        otherSubService: s.otherSubService,
        rates: s.rates,
        calculationMode: s.settings.calculationMode,
        roundingMode: s.settings.roundingMode,
        productName: s.productName,
        storeName: s.settings.storeName,
        storePhone: s.settings.storePhone,
        storeAddress: s.settings.storeAddress
    });

    els.templatePreviewBox.value = fullTemplate;
}
