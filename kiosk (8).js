/**
 * Customer Display / Kiosk Mode System (Direct Commercial Wording)
 */

const KIOSK_CHANNEL_NAME = 'installment_kiosk_sync_channel';
const kioskChannel = ('BroadcastChannel' in window) ? new BroadcastChannel(KIOSK_CHANNEL_NAME) : null;

window.KioskSystem = {
    isOpen: false,

    broadcastState() {
        if (!kioskChannel) return;
        const s = window.AppState;
        kioskChannel.postMessage({
            type: 'STATE_UPDATE',
            data: {
                currentSystem: s.currentSystem,
                selectedPlan: s.selectedPlan,
                principal: s.principal,
                downPayment: s.downPayment,
                downPaymentType: s.downPaymentType,
                rates: s.rates,
                settings: s.settings
            }
        });
    },

    openKiosk() {
        const overlay = document.getElementById('kioskOverlay');
        if (!overlay) return;

        this.isOpen = true;
        overlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        try {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen().catch(() => {});
            }
        } catch (e) {}

        this.renderKiosk();
        this.broadcastState();
        if (window.lucide) window.lucide.createIcons();
    },

    closeKiosk() {
        const overlay = document.getElementById('kioskOverlay');
        if (!overlay) return;

        this.isOpen = false;
        overlay.classList.add('hidden');
        document.body.style.overflow = 'auto';

        try {
            if (document.exitFullscreen && document.fullscreenElement) {
                document.exitFullscreen().catch(() => {});
            }
        } catch (e) {}
    },

    openSecondScreenWindow() {
        const w = window.open('./kiosk.html', 'KioskCustomerDisplay', 'width=1280,height=800,menubar=no,toolbar=no,location=no');
        if (w) {
            window.showToast('🖥️ تم فتح شاشة الزبون في نافذة ثانية - اسحبها لشاشة العميل!');
            setTimeout(() => this.broadcastState(), 500);
        } else {
            this.openKiosk();
        }
    },

    selectKioskPlan(months) {
        window.AppState.selectedPlan = months;
        window.render();
        this.renderKiosk();
        this.broadcastState();
    },

    renderKiosk() {
        const overlay = document.getElementById('kioskOverlay');
        if (!overlay || overlay.classList.contains('hidden')) return;

        const s = window.AppState;
        const isPlatform = s.currentSystem === 'platform';
        const systemTitle = isPlatform ? 'تقسيط المنصة' : 'التسديد اليدوي';

        // Update Kiosk Header
        document.getElementById('kioskStoreName').textContent = s.settings.storeName || 'نظام حساب الأقساط';
        document.getElementById('kioskSystemBadge').innerHTML = `
            <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-black ${isPlatform ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-orange-500/20 text-orange-300 border border-orange-500/40'}">
                <span class="w-2.5 h-2.5 rounded-full ${isPlatform ? 'bg-emerald-400 animate-pulse' : 'bg-orange-400 animate-pulse'}"></span>
                ${systemTitle}
            </span>
        `;

        // Update Cash Price & Down Payment
        document.getElementById('kioskCashPrice').textContent = window.fmtCurrency(s.principal);
        const actualDownPayment = s.downPaymentType === 'percent' ? (s.principal * s.downPayment / 100) : s.downPayment;
        document.getElementById('kioskDownPayment').textContent = actualDownPayment > 0 ? window.fmtCurrency(actualDownPayment) : 'بدون مقدمة';

        // Render 5 Luxury Kiosk Cards
        const container = document.getElementById('kioskCardsContainer');
        if (!container) return;

        let html = '';
        const durations = [10, 12, 14, 16, 18];

        durations.forEach(months => {
            const rate = s.rates[s.currentSystem][months] ?? 0;
            const calc = window.FinanceCalculator.calculatePlan({
                principal: s.principal,
                downPayment: s.downPayment,
                downPaymentType: s.downPaymentType,
                months: months,
                ratePercent: rate,
                calculationMode: s.settings.calculationMode
            });

            const isSelected = s.selectedPlan === months;
            const activeBorder = isPlatform 
                ? 'border-emerald-500 ring-4 ring-emerald-500/30 bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-950 shadow-2xl shadow-emerald-500/20 scale-105' 
                : 'border-orange-500 ring-4 ring-orange-500/30 bg-gradient-to-b from-orange-950/40 via-slate-900 to-slate-950 shadow-2xl shadow-orange-500/20 scale-105';

            html += `
                <div onclick="window.KioskSystem.selectKioskPlan(${months})"
                     class="glass-card rounded-3xl p-6 border transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden ${isSelected ? activeBorder : 'border-slate-800 hover:border-slate-700 bg-slate-900/80 hover:scale-102'}">
                    
                    ${isSelected ? `
                        <div class="absolute top-0 right-0 left-0 h-1.5 ${isPlatform ? 'bg-emerald-500' : 'bg-orange-500'}"></div>
                    ` : ''}

                    <div>
                        <!-- Duration Header -->
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center gap-3">
                                <div class="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg ${isSelected ? (isPlatform ? 'bg-emerald-500 text-slate-950' : 'bg-orange-500 text-slate-950') : 'bg-slate-800 text-slate-300'}">
                                    ${months}
                                </div>
                                <div>
                                    <h4 class="font-black text-lg sm:text-xl text-white font-heading">مدة ${months} أشهر</h4>
                                    <span class="text-xs text-slate-400 font-medium">${months} أقساط شهرية</span>
                                </div>
                            </div>
                            ${isSelected ? `
                                <span class="px-3 py-1 rounded-full text-xs font-black ${isPlatform ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-orange-500/20 text-orange-300 border border-orange-500/40'}">
                                    ✓ اختيارك
                                </span>
                            ` : ''}
                        </div>

                        <!-- Installment Box -->
                        <div class="bg-slate-950/90 rounded-2xl p-4 mb-4 border border-slate-800/80 shadow-inner text-center">
                            <span class="text-xs text-slate-400 font-bold block mb-1">القسط الشهري</span>
                            <div class="text-2xl sm:text-3xl font-black ${isPlatform ? 'text-emerald-400' : 'text-orange-400'} font-heading tracking-tight">
                                ${window.FinanceCalculator.formatIraqiShort(calc.monthlyInstallment)}
                            </div>
                            <span class="text-[11px] text-slate-400 font-mono">(${window.fmtCurrency(calc.monthlyInstallment)} / شهر)</span>
                        </div>

                        <!-- Details Row -->
                        <div class="space-y-2 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/60 text-xs">
                            <div class="flex items-center justify-between">
                                <span class="text-slate-400">المتبقي بالأقساط:</span>
                                <span class="font-extrabold text-slate-100 font-mono">${window.fmtCurrency(calc.totalRepayment)}</span>
                            </div>
                            <div class="flex items-center justify-between pt-1 border-t border-slate-800/60">
                                <span class="text-slate-400">السعر الكلي مع المقدمة:</span>
                                <span class="font-black text-slate-200 font-mono">${window.fmtCurrency(calc.grandTotal)}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Touch Selection Indicator -->
                    <div class="mt-4 pt-3 border-t border-slate-800/60 text-center">
                        <span class="text-xs font-extrabold ${isSelected ? (isPlatform ? 'text-emerald-400' : 'text-orange-400') : 'text-slate-400'} flex items-center justify-center gap-1.5">
                            ${isSelected ? '● الخطة المحددة حالياً' : 'اضغط لاختيار الخطة'}
                        </span>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }
};

// Listen for external sync messages
if (kioskChannel) {
    kioskChannel.onmessage = (event) => {
        if (event.data && event.data.type === 'STATE_UPDATE') {
            const data = event.data.data;
            if (window.AppState) {
                Object.assign(window.AppState, data);
                if (window.KioskSystem.isOpen) {
                    window.KioskSystem.renderKiosk();
                }
            }
        }
    };
}
