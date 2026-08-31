let renderRafId = null;

function requestFastRender() {
    if (renderRafId) cancelAnimationFrame(renderRafId);
    renderRafId = requestAnimationFrame(() => {
        window.render();
        if (window.KioskSystem) {
            window.KioskSystem.renderKiosk();
            window.KioskSystem.broadcastState();
        }
        renderRafId = null;
    });
}

/**
 * Option 3: Liquid Sliding Magnetic Tab Indicator Engine
 */
window.updateTabIndicator = function(system) {
    const container = document.getElementById('tabSwitcherContainer');
    const pill = document.getElementById('tabPillIndicator');
    if (!container || !pill) return;

    let activeBtn = document.getElementById('tabPlatform');
    let activeBg = 'bg-emerald-600';
    let shadowGlow = 'shadow-emerald-500/30';

    if (system === 'manual') {
        activeBtn = document.getElementById('tabManual');
        activeBg = 'bg-orange-600';
        shadowGlow = 'shadow-orange-500/30';
    } else if (system === 'other') {
        activeBtn = document.getElementById('tabOther');
        activeBg = 'bg-sky-600';
        shadowGlow = 'shadow-sky-500/30';
    }

    if (!activeBtn) return;

    // Calculate relative offset and width
    const leftPos = activeBtn.offsetLeft;
    const btnWidth = activeBtn.offsetWidth;

    pill.style.left = `${leftPos}px`;
    pill.style.width = `${btnWidth}px`;
    pill.className = `absolute top-1.5 bottom-1.5 rounded-full shadow-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none ${activeBg} ${shadowGlow}`;

    // Update text states
    ['tabPlatform', 'tabManual', 'tabOther'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            if (btn === activeBtn) {
                btn.classList.add('text-white');
                btn.classList.remove('text-slate-500', 'dark:text-slate-400');
            } else {
                btn.classList.remove('text-white');
                btn.classList.add('text-slate-500', 'dark:text-slate-400');
            }
        }
    });
};

/**
 * Option 4: Logo Pulse & Expanding Luminous Ripple Wave Controller
 */
window.triggerLogoRipple = function() {
    const frame = document.querySelector('.executive-frame');
    const logo = document.getElementById('brandLogoImg');
    if (!frame) return;

    if (logo) {
        logo.classList.remove('logo-intro-pulse');
        void logo.offsetWidth;
        logo.classList.add('logo-intro-pulse');
    }

    const oldRing = frame.querySelector('.logo-ripple-ring');
    if (oldRing) oldRing.remove();

    const ring = document.createElement('div');
    ring.className = 'logo-ripple-ring';
    frame.appendChild(ring);

    setTimeout(() => {
        if (ring && ring.parentNode) {
            ring.parentNode.removeChild(ring);
        }
    }, 850);
};

/**
 * 3D Interactive Tilt & Holographic Specular Glow Engine
 */
window.attach3DTiltEffect = function() {
    const cards = document.querySelectorAll('.fintech-plan-card');
    cards.forEach(card => {
        if (card._tiltAttached) return;
        card._tiltAttached = true;

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const percentX = (x / rect.width) * 100;
            const percentY = (y / rect.height) * 100;

            const rotX = ((y / rect.height) - 0.5) * -14;
            const rotY = ((x / rect.width) - 0.5) * 14;

            card.style.setProperty('--mouse-x', `${percentX.toFixed(1)}%`);
            card.style.setProperty('--mouse-y', `${percentY.toFixed(1)}%`);
            card.style.transform = `perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-4px) scale3d(1.025, 1.025, 1.025)`;
            card.classList.add('tilt-active');
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.classList.remove('tilt-active');
        });
    });
};

window.selectPlan = function(months) {
    if (window.SoundEngine) window.SoundEngine.playTick();
    window.AppState.selectedPlan = months;
    requestFastRender();
};

window.switchTab = function(system) {
    if (window.SoundEngine) window.SoundEngine.playTabSwitch();
    const s = window.AppState;
    s.currentSystem = system;

    window.updateTabIndicator(system);
    requestFastRender();
};

window.applyTheme = function(theme) {
    if (window.SoundEngine) window.SoundEngine.playTick();
    const s = window.AppState;
    s.settings.theme = theme;
    const themeIcon = document.getElementById('themeIcon');
    const themeLabel = document.getElementById('themeLabel');

    if (theme === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        if (themeIcon) {
            themeIcon.setAttribute('data-lucide', 'moon');
            themeIcon.className = 'w-3.5 h-3.5 text-indigo-600';
        }
        if (themeLabel) themeLabel.textContent = 'ليلي 🌙';
    } else {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        if (themeIcon) {
            themeIcon.setAttribute('data-lucide', 'sun');
            themeIcon.className = 'w-3.5 h-3.5 text-amber-400';
        }
        if (themeLabel) themeLabel.textContent = 'نهاري ☀️';
    }
    if (window.lucide) lucide.createIcons();
    window.InstallmentData.Storage.saveSettings(s.settings);
};

window.clearAllFields = function() {
    if (window.SoundEngine) window.SoundEngine.playTick();
    const s = window.AppState;
    const els = window.AppElements;
    
    s.productName = '';
    s.customerPhone = '';
    s.principal = 0;
    s.downPayment = 0;

    if (els.inputProductName) els.inputProductName.value = '';
    if (els.inputCustomerPhone) els.inputCustomerPhone.value = '';
    if (els.inputPrincipal) {
        els.inputPrincipal.value = '';
        els.inputPrincipal.focus();
    }
    if (els.inputDownPayment) els.inputDownPayment.value = '';

    requestFastRender();
    window.showToast('🧹 تم تفريغ الحقول للحسبة التالية');
};

window.setupEventListeners = function() {
    const s = window.AppState;
    const els = window.AppElements;

    // Interactive Brand Logo Click Ripple
    const logoImg = document.getElementById('brandLogoImg');
    if (logoImg) {
        logoImg.addEventListener('click', () => {
            if (window.SoundEngine) window.SoundEngine.playTick();
            if (window.triggerLogoRipple) window.triggerLogoRipple();
        });
    }

    // Sound toggle button in header
    const soundBtn = document.getElementById('soundToggleBtn');
    if (soundBtn) {
        soundBtn.addEventListener('click', () => {
            if (window.SoundEngine) window.SoundEngine.toggleSound();
        });
    }

    // Product Name input
    if (els.inputProductName) {
        els.inputProductName.addEventListener('input', (e) => {
            s.productName = e.target.value;
            requestFastRender();
        });
    }

    // Customer Phone input
    if (els.inputCustomerPhone) {
        els.inputCustomerPhone.addEventListener('input', (e) => {
            s.customerPhone = e.target.value;
        });
    }

    // Quick Price Chips
    document.querySelectorAll('.amount-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            if (window.SoundEngine) window.SoundEngine.playTick();
            const val = Number(btn.getAttribute('data-value'));
            s.principal = val;
            els.inputPrincipal.value = val;
            requestFastRender();
        });
    });

    // Quick Down Payment Chips
    document.querySelectorAll('.dp-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            if (window.SoundEngine) window.SoundEngine.playTick();
            const val = Number(btn.getAttribute('data-dp-value'));
            s.downPayment = val;
            els.inputDownPayment.value = val;
            requestFastRender();
        });
    });

    // Quick Clear Button
    if (els.btnClearAll) {
        els.btnClearAll.addEventListener('click', window.clearAllFields);
    }

    if (els.inputPrincipal) {
        els.inputPrincipal.addEventListener('input', (e) => {
            s.principal = Math.max(0, Number(e.target.value) || 0);
            requestFastRender();
        });
    }

    if (els.inputDownPayment) {
        els.inputDownPayment.addEventListener('input', (e) => {
            s.downPayment = Math.max(0, Number(e.target.value) || 0);
            requestFastRender();
        });
    }

    if (els.downPaymentTypeBtn) {
        els.downPaymentTypeBtn.addEventListener('click', () => {
            if (window.SoundEngine) window.SoundEngine.playTick();
            s.downPaymentType = s.downPaymentType === 'fixed' ? 'percent' : 'fixed';
            els.downPaymentTypeBtn.textContent = s.downPaymentType === 'fixed' ? 'د.ع' : '%';
            requestFastRender();
        });
    }

    if (els.tabPlatform) els.tabPlatform.addEventListener('click', () => window.switchTab('platform'));
    if (els.tabManual) els.tabManual.addEventListener('click', () => window.switchTab('manual'));
    if (els.tabOther) els.tabOther.addEventListener('click', () => window.switchTab('other'));

    // Resize listener to realign indicator perfectly
    window.addEventListener('resize', () => {
        window.updateTabIndicator(window.AppState.currentSystem);
    });

    if (els.themeToggleBtn) {
        els.themeToggleBtn.addEventListener('click', () => {
            const next = s.settings.theme === 'dark' ? 'light' : 'dark';
            window.applyTheme(next);
        });
    }

    // Kiosk Mode Trigger
    const kioskBtn = document.getElementById('openKioskBtn');
    if (kioskBtn) {
        kioskBtn.addEventListener('click', () => {
            if (window.SoundEngine) window.SoundEngine.playTick();
            window.KioskSystem.openKiosk();
        });
    }

    // Protected Settings Trigger
    if (els.openSettingsBtn) {
        els.openSettingsBtn.addEventListener('click', () => {
            if (window.SoundEngine) window.SoundEngine.playTick();
            window.promptPasswordForSettings();
        });
    }
    
    // Password Modal actions
    if (els.closePasswordModalBtn) els.closePasswordModalBtn.addEventListener('click', window.closePasswordModal);
    if (els.submitPasswordBtn) els.submitPasswordBtn.addEventListener('click', window.checkPasswordAndOpen);
    if (els.passwordInput) {
        els.passwordInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') window.checkPasswordAndOpen();
        });
    }

    // Settings Modal actions
    if (els.closeSettingsBtn) els.closeSettingsBtn.addEventListener('click', window.closeSettingsModal);
    if (els.saveSettingsBtn) els.saveSettingsBtn.addEventListener('click', window.saveSettingsFromModal);
    if (els.resetRatesBtn) els.resetRatesBtn.addEventListener('click', window.resetRatesToDefault);
};
