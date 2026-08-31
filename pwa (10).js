/**
 * PWA (Progressive Web App) & Offline Management
 */

let deferredInstallPrompt = null;

// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then((registration) => {
                console.log('[PWA] Service Worker registered successfully:', registration.scope);
            })
            .catch((error) => {
                console.warn('[PWA] Service Worker registration failed:', error);
            });
    });
}

// Handle Install Prompt Event
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent standard mini-infobar
    e.preventDefault();
    deferredInstallPrompt = e;

    // Show Install Button if available
    const installBtn = document.getElementById('installPwaBtn');
    if (installBtn) {
        installBtn.classList.remove('hidden');
        installBtn.addEventListener('click', () => {
            if (deferredInstallPrompt) {
                deferredInstallPrompt.prompt();
                deferredInstallPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('[PWA] User accepted the install prompt');
                        window.showToast('✅ تم تثبيت التطبيق بنجاح!');
                        installBtn.classList.add('hidden');
                    } else {
                        console.log('[PWA] User dismissed the install prompt');
                    }
                    deferredInstallPrompt = null;
                });
            }
        });
    }
});

// App Installed Event
window.addEventListener('appinstalled', () => {
    console.log('[PWA] Application installed successfully');
    const installBtn = document.getElementById('installPwaBtn');
    if (installBtn) installBtn.classList.add('hidden');
    window.showToast('🎉 تم تثبيت التطبيق على جهازك ويعمل الآن كبرنامج مستقل بدون إنترنت!');
});

// Online / Offline Status Detection
window.addEventListener('online', () => {
    const offlineBadge = document.getElementById('offlineIndicator');
    if (offlineBadge) offlineBadge.classList.add('hidden');
    window.showToast('📶 متصل بالإنترنت');
});

window.addEventListener('offline', () => {
    const offlineBadge = document.getElementById('offlineIndicator');
    if (offlineBadge) offlineBadge.classList.remove('hidden');
    window.showToast('📴 يعمل التطبيق الآن في وضع عدم الاتصال (بدون إنترنت)');
});
