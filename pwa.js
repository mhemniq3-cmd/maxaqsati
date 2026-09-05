/**
 * PWA (Progressive Web App) & Cache Management
 */

let deferredInstallPrompt = null;

// Register Service Worker with active cache-busting
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js?v=56')
            .then((registration) => {
                console.log('[PWA] Service Worker registered:', registration.scope);
                // Force check for updates on every page load
                registration.update().catch(() => {});
            })
            .catch((error) => {
                console.warn('[PWA] Service Worker registration failed:', error);
            });
    });
}

// Handle Install Prompt Event
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;

    const installBtn = document.getElementById('installPwaBtn');
    if (installBtn) {
        installBtn.classList.remove('hidden');
        installBtn.addEventListener('click', () => {
            if (deferredInstallPrompt) {
                deferredInstallPrompt.prompt();
                deferredInstallPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        window.showToast('✅ تم تثبيت التطبيق بنجاح!');
                        installBtn.classList.add('hidden');
                    }
                    deferredInstallPrompt = null;
                });
            }
        });
    }
});

// App Installed Event
window.addEventListener('appinstalled', () => {
    const installBtn = document.getElementById('installPwaBtn');
    if (installBtn) installBtn.classList.add('hidden');
    window.showToast('🎉 تم تثبيت التطبيق على جهازك بنجاح!');
});

// Online / Offline Status Detection
window.addEventListener('online', () => {
    window.showToast('📶 متصل بالإنترنت');
});

window.addEventListener('offline', () => {
    window.showToast('📴 يعمل التطبيق الآن في وضع عدم الاتصال (بدون إنترنت)');
});
