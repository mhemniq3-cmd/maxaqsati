/**
 * AI Vision Price Sheet Scanner Engine - Max Installment System
 * Powered by Google Gemini 2.5 Flash Multimodal Vision
 * Automatically extracts products, specs, and IQD cash prices from images
 */

window.PriceScanner = {
    isOpen: false,
    scannedItems: [],
    isScanning: false,

    init() {
        const openBtn = document.getElementById('openPriceScannerBtn');
        const closeBtn = document.getElementById('closePriceScannerBtn');
        const cancelBtn = document.getElementById('btnCancelScanner');
        const dropzone = document.getElementById('scannerDropzone');
        const fileInput = document.getElementById('scannerFileInput');
        const applyBtn = document.getElementById('btnApplyScannedDevices');
        const exportBtn = document.getElementById('btnExportDevicesJson');
        const productInput = document.getElementById('inputProductName');

        if (openBtn) openBtn.addEventListener('click', () => this.toggleModal(true));
        if (closeBtn) closeBtn.addEventListener('click', () => this.toggleModal(false));
        if (cancelBtn) cancelBtn.addEventListener('click', () => this.toggleModal(false));

        if (dropzone && fileInput) {
            dropzone.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files[0]) {
                    this.handleImageFile(e.target.files[0]);
                }
            });

            ['dragenter', 'dragover'].forEach(evt => {
                dropzone.addEventListener(evt, (e) => {
                    e.preventDefault();
                    dropzone.classList.add('border-amber-400', 'bg-amber-950/30');
                });
            });

            ['dragleave', 'drop'].forEach(evt => {
                dropzone.addEventListener(evt, (e) => {
                    e.preventDefault();
                    dropzone.classList.remove('border-amber-400', 'bg-amber-950/30');
                });
            });

            dropzone.addEventListener('drop', (e) => {
                if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
                    this.handleImageFile(e.dataTransfer.files[0]);
                }
            });
        }

        window.addEventListener('paste', (e) => {
            if (!this.isOpen) return;
            const items = (e.clipboardData || e.originalEvent?.clipboardData)?.items;
            if (!items) return;
            for (let item of items) {
                if (item.type && item.type.indexOf('image') !== -1) {
                    const blob = item.getAsFile();
                    this.handleImageFile(blob);
                    break;
                }
            }
        });

        if (applyBtn) {
            applyBtn.addEventListener('click', () => this.applyScannedDevices());
        }

        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportDevicesJson());
        }

        this.renderDeviceDatalist();

        if (productInput) {
            productInput.addEventListener('input', () => this.handleProductSelection(productInput.value));
            productInput.addEventListener('change', () => this.handleProductSelection(productInput.value));
        }
    },

    toggleModal(open) {
        if (typeof open === 'boolean') {
            this.isOpen = open;
            if (open) {
                if (window.openSettingsWithTab) {
                    window.openSettingsWithTab('scanner');
                } else if (window.openSettingsModal) {
                    window.openSettingsModal();
                }
                if (window.SoundEngine) window.SoundEngine.playSuccessChime();
            } else {
                if (window.closeSettingsModal) window.closeSettingsModal();
                if (window.SoundEngine) window.SoundEngine.playTick();
            }
        } else {
            const modal = document.getElementById('settingsModal');
            const isVisible = modal && !modal.classList.contains('hidden');
            this.toggleModal(!isVisible);
        }
    },

    handleImageFile(file) {
        if (!file || !file.type.startsWith('image/')) {
            if (window.showToast) window.showToast('⚠️ يرجى اختيار ملف صورة صالح (JPG, PNG, WebP)');
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            const dataUrl = e.target.result;
            const base64Data = dataUrl.split(',')[1];
            const mimeType = file.type || 'image/jpeg';

            const previewImg = document.getElementById('scannerPreviewImg');
            const statusBanner = document.getElementById('scannerScanningStatus');
            const resultsContainer = document.getElementById('scannerResultsContainer');

            if (previewImg) previewImg.src = dataUrl;
            if (statusBanner) statusBanner.classList.remove('hidden');
            if (resultsContainer) resultsContainer.classList.add('hidden');

            await this.processImageWithAI(base64Data, mimeType);
        };
        reader.readAsDataURL(file);
    },

    async processImageWithAI(base64Data, mimeType) {
        this.isScanning = true;
        const statusText = document.getElementById('scannerStatusText');
        if (statusText) statusText.textContent = 'جاري تحليل الصورة والأسعار بواسطة Google Gemini Vision AI...';

        const apiKey = window.MaxAIAdvisor?.GEMINI_API_KEY || 'AQ.Ab8RN6LH1Lbcq1RZT0I1bGasfpou6k3W-TBM1PrdclHTi3igQQ';
        const model = 'gemini-2.5-flash';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const promptText = `أنت خبير محترف في فحص وقراءة قوائم وفواتير أسعار الهواتف والأجهزة في العراق.
افحص الصورة المرفقة بدقة شديدة واستخرج جميع الأجهزة والأجهزة اللوحية (Pads/Tablets) والهواتف المذكورة مع سعات التخزين والرام وأسعارها بالدينار العراقي (IQD).

قواعد استخراج البيانات:
1. استخرج السعر نقداً بالدينار العراقي كرقم صحيح فقط (مثال: 794000) بدون كتابة IQD أو د.ع وبدون فواصل.
2. اكتب اسم الجهاز كاملاً مع الشركة والذاكرة والرام (مثال: "realme 16 Pro Plus (12GB | 512GB)").
3. حدد الفئة (هواتف ذكية أو أجهزة لوحية (تابلت) أو إلكترونيات).
4. أرجع النتيجة حصراً بصيغة مصفوفة JSON نقية صالحة تماماً، بدون أي نصوص أو شروحات قبلها أو بعدها، وبدون وسم الماركداون:
[
  {
    "name": "اسم الجهاز والمواصفات",
    "brand": "الشركة المصنعة",
    "specs": "سعة التخزين والرام",
    "price": 794000,
    "category": "هواتف ذكية"
  }
]`;

        try {
            const body = {
                contents: [
                    {
                        parts: [
                            { inline_data: { mime_type: mimeType, data: base64Data } },
                            { text: promptText }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.1,
                    maxOutputTokens: 2500
                }
            };

            const resp = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (!resp.ok) {
                const err = await resp.json().catch(() => ({}));
                throw new Error(err?.error?.message || `HTTP ${resp.status}`);
            }

            const data = await resp.json();
            const textResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
            const cleanedJson = textResponse.replace(/```(?:json)?/gi, '').trim();

            const parsedItems = JSON.parse(cleanedJson);
            if (Array.isArray(parsedItems) && parsedItems.length > 0) {
                this.scannedItems = parsedItems.map(item => ({
                    id: (item.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || ('dev-' + Date.now()),
                    name: item.name || 'جهاز إلكتروني',
                    brand: item.brand || 'عام',
                    specs: item.specs || '',
                    price: Math.round(Number(item.price) || 0),
                    category: item.category || 'هواتف ذكية',
                    keys: [item.name.toLowerCase(), (item.brand || '').toLowerCase()]
                }));

                this.renderScannedResults();
                if (window.SoundEngine) window.SoundEngine.playSuccessChime();
                if (window.showToast) window.showToast(`🎉 تم استخراج ${this.scannedItems.length} جهاز بنجاح!`);
            } else {
                throw new Error('لم يتم العثور على أجهزة واضحة في الصورة');
            }
        } catch (err) {
            console.error('Price Scanner Error:', err);
            if (statusText) statusText.textContent = `❌ تعذر الاستخراج: ${err.message || 'يرجى التأكد من وضوح الصورة'}`;
            if (window.showToast) window.showToast('⚠️ لم نتمكن من قراءة الصورة، حاول بصورة أكثر وضوحاً');
        } finally {
            this.isScanning = false;
        }
    },

    renderScannedResults() {
        const resultsContainer = document.getElementById('scannerResultsContainer');
        const tableBody = document.getElementById('scannerDevicesTableBody');
        const badge = document.getElementById('scannerDeviceCountBadge');
        const applyBtn = document.getElementById('btnApplyScannedDevices');

        if (!resultsContainer || !tableBody) return;
        resultsContainer.classList.remove('hidden');

        if (badge) badge.textContent = `${this.scannedItems.length} أجهزة`;
        if (applyBtn) applyBtn.disabled = this.scannedItems.length === 0;

        tableBody.innerHTML = this.scannedItems.map((item, index) => `
            <tr class="hover:bg-slate-800/40 transition">
                <td class="p-3 font-bold text-slate-100 flex items-center gap-2">
                    <span class="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-mono shrink-0">
                        ${index + 1}
                    </span>
                    <input type="text" value="${item.name.replace(/"/g, '&quot;')}"
                           onchange="window.PriceScanner.updateItemField(${index}, 'name', this.value)"
                           class="bg-transparent border-b border-slate-700/60 focus:border-amber-400 py-1 text-xs w-full text-slate-100 focus:outline-none">
                </td>
                <td class="p-3 text-slate-400 font-mono">
                    <input type="text" value="${(item.specs || '').replace(/"/g, '&quot;')}"
                           onchange="window.PriceScanner.updateItemField(${index}, 'specs', this.value)"
                           class="bg-transparent border-b border-slate-700/60 focus:border-amber-400 py-1 text-xs w-28 text-slate-300 focus:outline-none">
                </td>
                <td class="p-3 font-bold font-mono text-emerald-400">
                    <div class="relative w-32">
                        <input type="number" step="1000" value="${item.price}"
                               onchange="window.PriceScanner.updateItemField(${index}, 'price', this.value)"
                               class="fintech-input rounded-xl py-1 px-2 text-right font-black text-xs text-emerald-400 w-full focus:outline-none">
                    </div>
                </td>
                <td class="p-3 text-center">
                    <button type="button" onclick="window.PriceScanner.removeItem(${index})"
                            class="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition" title="حذف هذا الجهاز">
                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        if (window.lucide) window.lucide.createIcons();
    },

    updateItemField(index, field, value) {
        if (this.scannedItems[index]) {
            if (field === 'price') {
                this.scannedItems[index].price = Math.max(0, Number(value) || 0);
            } else {
                this.scannedItems[index][field] = value;
            }
        }
    },

    removeItem(index) {
        this.scannedItems.splice(index, 1);
        this.renderScannedResults();
    },

    applyScannedDevices() {
        if (!this.scannedItems.length) return;

        let existing = window.AppState?.devices || [];
        if (!Array.isArray(existing)) existing = [];

        let addedCount = 0;
        let updatedCount = 0;

        this.scannedItems.forEach(scanned => {
            const matchIndex = existing.findIndex(e =>
                (e.name && scanned.name && e.name.trim().toLowerCase() === scanned.name.trim().toLowerCase()) ||
                (e.id && scanned.id && e.id === scanned.id)
            );

            if (matchIndex >= 0) {
                existing[matchIndex].price = scanned.price;
                if (scanned.specs) existing[matchIndex].specs = scanned.specs;
                updatedCount++;
            } else {
                existing.unshift(scanned);
                addedCount++;
            }
        });

        window.AppState.devices = existing;
        if (window.InstallmentData?.Storage?.saveDevices) {
            window.InstallmentData.Storage.saveDevices(existing);
        }

        if (window.MaxAIAdvisor) {
            window.MaxAIAdvisor.DEVICE_PRESETS = existing.map(d => ({
                keys: d.keys || [d.name.toLowerCase()],
                name: d.name,
                price: d.price
            }));
        }

        this.renderDeviceDatalist();

        if (window.SoundEngine) window.SoundEngine.playSuccessChime();
        if (window.showToast) {
            window.showToast(`✅ تم تحديث الأسعار بنجاح: (${addedCount} جديد، ${updatedCount} تم تحديثه)`);
        }

        this.toggleModal(false);
    },

    renderDeviceDatalist() {
        const datalist = document.getElementById('deviceListDatalist');
        if (!datalist) return;

        const devices = window.AppState?.devices || window.InstallmentData?.Storage?.getDevices() || [];
        datalist.innerHTML = devices.map(d => {
            const priceStr = window.FinanceCalculator ? window.FinanceCalculator.formatNumber(d.price) : d.price;
            return `<option value="${d.name.replace(/"/g, '&quot;')}" data-price="${d.price}">${priceStr} د.ع - ${d.category || 'أجهزة'}</option>`;
        }).join('');
    },

    handleProductSelection(value) {
        if (!value || !value.trim()) return;
        const norm = value.trim().toLowerCase();
        const devices = window.AppState?.devices || [];

        const match = devices.find(d => 
            d.name.toLowerCase() === norm ||
            d.name.toLowerCase().startsWith(norm) ||
            (d.keys && d.keys.some(k => k.toLowerCase() === norm))
        );

        if (match && match.price) {
            const priceInput = document.getElementById('inputPrincipal');
            if (priceInput) {
                priceInput.value = match.price;
                window.AppState.principal = match.price;
                window.AppState.productName = match.name;

                const spoken = document.getElementById('principalSpokenWord');
                if (spoken && window.FinanceCalculator?.toIraqiSpokenWords) {
                    spoken.textContent = window.FinanceCalculator.toIraqiSpokenWords(match.price);
                }

                if (window.render) window.render();
                if (window.showToast) {
                    window.showToast(`✨ تم تحديد سعر ${match.name}: ${window.fmtNumber ? window.fmtNumber(match.price) : match.price} د.ع`);
                }
            }
        }
    },

    exportDevicesJson() {
        const devices = window.AppState?.devices || window.InstallmentData?.Storage?.getDevices() || [];
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(devices, null, 2));
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute('href', dataStr);
        dlAnchor.setAttribute('download', 'devices.json');
        dlAnchor.click();
        if (window.showToast) window.showToast('💾 تم تحميل ملف devices.json المحدث');
    }
};
