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

        if (openBtn) openBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.openProtectedSettings) {
                window.openProtectedSettings('scanner');
            } else {
                this.toggleModal(true);
            }
        });
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
                if (window.openProtectedSettings) {
                    window.openProtectedSettings('scanner');
                } else if (window.openSettingsWithTab) {
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

        const apiKey = window.InstallmentData?.Storage?.getApiKey?.() || window.MaxAIAdvisor?.getApiKey?.() || '';
        if (!apiKey) {
            if (statusText) {
                statusText.innerHTML = `
                    <div class="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-300 space-y-2 text-center">
                        <p class="font-bold text-xs">⚠️ يتطلب مسح وقراءة الصور بالذكاء الاصطناعي إدخال مفتاح Google Gemini API المجاني.</p>
                        <button type="button" onclick="window.switchSettingsTab('ai')" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition cursor-pointer shadow-sm">
                            <span>انقر هنا لإدخال المفتاح في تبويب الذكاء الاصطناعي 🤖</span>
                        </button>
                    </div>
                `;
            }
            if (window.showToast) window.showToast('⚠️ يرجى إدخال مفتاح Gemini API لتفعيل مسح الصور');
            this.isScanning = false;
            return;
        }

        const model = 'gemini-2.5-flash';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const promptText = `أنت خبير محترف في فحص وقراءة قوائم وفواتير أسعار الهواتف والأجهزة في العراق.
افحص الصورة المرفقة بدقة شديدة واستخرج جميع الأجهزة والأجهزة اللوحية (Pads/Tablets) والهواتف المذكورة مع سعات التخزين والرام وأسعارها بالدينار العراقي (IQD).

قواعد استخراج البيانات:
1. استخرج السعر نقداً بالدينار العراقي كاملاً كرقم صحيح إنجليزي فقط (مثال: إذا كان السعر في القائمة 535 أو 535 ألف اكتبه 535000، وإذا كان 794 اكتبه 794000) بدون كتابة IQD أو د.ع وبدون فواصل وبأرقام إنجليزية (0-9).
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
                const msg = err?.error?.message || `HTTP ${resp.status}`;
                if (resp.status === 401 || resp.status === 403 || /unauthorized|credentials/i.test(msg)) {
                    throw new Error('مفتاح Gemini API غير صالح أو منتهي الصلاحية. يرجى تحديثه في تبويب (الذكاء الاصطناعي)');
                }
                throw new Error(msg);
            }

            const data = await resp.json();
            const textResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
            const cleanedJson = textResponse.replace(/```(?:json)?/gi, '').trim();

            const parsedItems = JSON.parse(cleanedJson);
            if (Array.isArray(parsedItems) && parsedItems.length > 0) {
                const currentMarkup = (typeof window.getStoreDeviceMarkup === 'function')
                    ? window.getStoreDeviceMarkup()
                    : 15000;

                this.scannedItems = parsedItems.map(item => {
                    let str = String(item.price || '').trim();
                    str = str.replace(/[٠-٩]/g, d => '0123456789'['٠١٢٣٤٥٦٧٨٩'.indexOf(d)]);
                    const isThousandsWord = /(?:الف|ألف|k)/i.test(str);
                    const cleanedStr = str.replace(/[,،\s\D]/g, '');
                    let rawPrice = Math.round(Number(cleanedStr) || 0);
                    if (isThousandsWord && rawPrice < 10000) {
                        rawPrice = rawPrice * 1000;
                    } else if (rawPrice > 0 && rawPrice < 2000) {
                        // Handle Iraqi price lists where prices are given in thousands (e.g. 535 -> 535000)
                        rawPrice = rawPrice * 1000;
                    }
                    const finalPrice = Math.round(rawPrice + currentMarkup);

                    return {
                        id: (item.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || ('dev-' + Date.now()),
                        name: item.name || 'جهاز إلكتروني',
                        brand: item.brand || 'عام',
                        specs: item.specs || '',
                        rawPrice: rawPrice,
                        markupApplied: currentMarkup,
                        price: finalPrice,
                        category: item.category || 'هواتف ذكية',
                        keys: [item.name.toLowerCase(), (item.brand || '').toLowerCase()]
                    };
                });

                this.renderScannedResults();
                if (window.SoundEngine) window.SoundEngine.playSuccessChime();
                if (window.showToast) window.showToast(`🎉 تم استخراج ${this.scannedItems.length} جهاز بنجاح مع إضافة (+${currentMarkup.toLocaleString()} د.ع)!`);
            } else {
                throw new Error('لم يتم العثور على أجهزة واضحة في الصورة');
            }
        } catch (err) {
            console.error('Price Scanner Error:', err);
            if (statusText) statusText.textContent = `❌ تعذر الاستخراج: ${err.message || 'يرجى التأكد من وضوح الصورة'}`;
            if (window.showToast) window.showToast('⚠️ تعذر مسح الصورة، تحقق من المفتاح وصلاحية الصورة');
        } finally {
            this.isScanning = false;
        }
    },

    reapplyMarkup(newMarkup) {
        if (!this.scannedItems || !this.scannedItems.length) return;
        const markup = Math.max(0, Number(newMarkup) || 0);
        this.scannedItems.forEach(item => {
            const raw = (item.rawPrice !== undefined) ? item.rawPrice : item.price;
            item.rawPrice = raw;
            item.markupApplied = markup;
            item.price = Math.round(raw + markup);
        });
        this.renderScannedResults();
    },

    renderScannedResults() {
        const resultsContainer = document.getElementById('scannerResultsContainer');
        const tableBody = document.getElementById('scannerDevicesTableBody');
        const badge = document.getElementById('scannerDeviceCountBadge');
        const markupBadge = document.getElementById('scannerMarkupAppliedBadge');
        const applyBtn = document.getElementById('btnApplyScannedDevices');

        if (!resultsContainer || !tableBody) return;
        resultsContainer.classList.remove('hidden');

        if (badge) badge.textContent = `${this.scannedItems.length} أجهزة`;

        const firstItemMarkup = this.scannedItems[0]?.markupApplied ?? 0;
        if (markupBadge) {
            if (firstItemMarkup > 0) {
                markupBadge.textContent = `+${firstItemMarkup.toLocaleString()} د.ع مضافة`;
            } else {
                markupBadge.textContent = 'بدون إضافة (0)';
            }
        }

        if (applyBtn) applyBtn.disabled = this.scannedItems.length === 0;

        tableBody.innerHTML = this.scannedItems.map((item, index) => {
            const hasMarkup = (item.markupApplied && item.markupApplied > 0 && item.rawPrice);
            const breakdownHtml = hasMarkup 
                ? `<div class="text-[10px] text-amber-400 font-sans mt-0.5 flex items-center justify-end gap-1">
                     <span class="text-slate-400">الأصل:</span>
                     <span class="font-mono">${item.rawPrice.toLocaleString()}</span>
                     <span>+</span>
                     <span class="text-emerald-400 font-mono">${item.markupApplied.toLocaleString()}</span>
                   </div>`
                : '';

            return `
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
                    <div class="relative w-36">
                        <input type="number" step="1000" value="${item.price}"
                               onchange="window.PriceScanner.updateItemField(${index}, 'price', this.value)"
                               class="fintech-input rounded-xl py-1 px-2.5 text-right font-black text-xs text-emerald-400 w-full focus:outline-none focus:border-emerald-400">
                        <span class="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] text-slate-400">د.ع</span>
                    </div>
                    ${breakdownHtml}
                </td>
                <td class="p-3 text-center">
                    <button type="button" onclick="window.PriceScanner.removeItem(${index})"
                            class="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition cursor-pointer" title="حذف هذا الجهاز">
                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                    </button>
                </td>
            </tr>
            `;
        }).join('');

        if (window.lucide) window.lucide.createIcons();
    },

    updateItemField(index, field, value) {
        if (this.scannedItems[index]) {
            if (field === 'price') {
                const newPrice = Math.max(0, Number(value) || 0);
                this.scannedItems[index].price = newPrice;
                const applied = this.scannedItems[index].markupApplied || 0;
                this.scannedItems[index].rawPrice = Math.max(0, newPrice - applied);
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
