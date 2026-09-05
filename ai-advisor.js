/**
 * Max AI Sales Advisor Engine v2.0 (مستشار ماكس المالي الذكي)
 * Powered by Google Gemini 2.5 Flash AI + Contextual Arabic NLP
 * Strict Retail Rule: ZERO profit/interest percentage disclosure!
 */

window.MaxAIAdvisor = {
    MAX_AI_ICON_SVG: `<svg viewBox="0 0 100 100" class="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 74V30L42 54L50 44L58 54L78 30V74" stroke="url(#maxAiHeadGrad)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M50 10C50 20 43 27 33 27C43 27 50 34 50 44C50 34 57 27 67 27C57 27 50 20 50 10Z" fill="url(#maxAiStarGrad)" />
        <circle cx="50" cy="27" r="2.5" fill="#FFFFFF" />
        <circle cx="22" cy="30" r="4" fill="#10B981" />
        <circle cx="78" cy="30" r="4" fill="#F59E0B" />
    </svg>`,

    isOpen: false,
    history: [],     // Conversation memory (multi-turn)
    isProcessing: false,

    // =====================================================
    // GEMINI 2.5 FLASH CONFIG & API KEY MANAGEMENT
    // =====================================================
    GEMINI_API_KEY: '',
    GEMINI_MODEL: 'gemini-2.5-flash',

    getApiKey() {
        const stored = window.InstallmentData?.Storage?.getApiKey?.();
        if (stored && stored.trim()) return stored.trim();
        if (this.GEMINI_API_KEY && this.GEMINI_API_KEY.startsWith('AIzaSy')) {
            return this.GEMINI_API_KEY.trim();
        }
        return '';
    },

    // Device Knowledge Database in IQD
    DEVICE_PRESETS: [
        // Newly Extracted from Sheets (Realme, Infinix, Xiaomi Pads)
        { keys: ['realme 16 pro plus', 'ريلمي 16 برو بلس', '16 pro plus realme', '16 برو بلس'], name: 'realme 16 Pro Plus (12GB | 512GB)', price: 794000 },
        { keys: ['realme 16 pro', 'ريلمي 16 برو', '16 pro realme'], name: 'realme 16 Pro (12GB | 512GB)', price: 607000 },
        { keys: ['realme 15 pro', 'ريلمي 15 برو', '15 pro realme'], name: 'realme 15 PRO (12GB | 512GB)', price: 610000 },
        { keys: ['realme 15 t', 'ريلمي 15 تي', 'ريلمي 15t 512', '15t 512'], name: 'realme 15 T (12GB | 512GB)', price: 425000 },
        { keys: ['realme 15 t 256', 'ريلمي 15 تي 256', 'ريلمي 15t', '15t 256'], name: 'realme 15 T (8GB | 256GB)', price: 385000 },
        { keys: ['infinix hot 60 pro plus', 'انفينكس هوت 60 برو بلس', 'هوت 60 برو بلس', 'hot 60 pro plus'], name: 'Infinix HOT 60 Pro Plus (8GB | 256GB)', price: 310000 },
        { keys: ['infinix hot 60 pro', 'انفينكس هوت 60 برو', 'هوت 60 برو', 'hot 60 pro'], name: 'Infinix Hot 60 Pro (8GB | 256GB)', price: 280000 },
        { keys: ['infinix smart 20', 'انفينكس سمارت 20', 'سمارت 20', 'smart 20'], name: 'Infinix Smart 20 (8GB | 256GB)', price: 260000 },
        { keys: ['infinix smart 20 128', 'انفينكس سمارت 20 128', 'smart 20 128'], name: 'Infinix Smart 20 (4GB | 128GB)', price: 205000 },
        { keys: ['infinix smart 20 64', 'انفينكس سمارت 20 64', 'smart 20 64'], name: 'Infinix Smart 20 (4GB | 64GB)', price: 185000 },
        { keys: ['xiaomi pad 8 pro', 'شاومي باد 8 برو', 'باد 8 برو', 'pad 8 pro'], name: 'Xiaomi Pad 8 Pro (12GB | 512GB)', price: 940000 },
        { keys: ['xiaomi pad 8', 'شاومي باد 8', 'باد 8', 'pad 8'], name: 'Xiaomi Pad 8 (8GB | 256GB)', price: 680000 },
        { keys: ['xiaomi pad 7 512', 'شاومي باد 7 256 12', 'pad 7 512'], name: 'Xiaomi Pad 7 (12GB | 256GB)', price: 550000 },
        { keys: ['xiaomi pad 7', 'شاومي باد 7', 'باد 7', 'pad 7'], name: 'Xiaomi Pad 7 (8GB | 256GB)', price: 475000 },
        { keys: ['redmi pad 2 pro', 'ريدمي باد 2 برو', 'باد 2 برو', 'pad 2 pro'], name: 'redmi Pad 2 Pro (8GB | 256GB)', price: 485000 },
        { keys: ['redmi pad 2 256', 'ريدمي باد 2 256', 'ريدمي باد 2', 'redmi pad 2'], name: 'redmi Pad 2 (8GB | 256GB)', price: 340000 },
        { keys: ['redmi pad 2 128', 'ريدمي باد 2 128'], name: 'redmi Pad 2 (4GB | 128GB)', price: 290000 },
        { keys: ['xiaomi pad 2 9.7', 'شاومي باد 2 9.7', 'شاومي باد 2', 'pad 2 9.7'], name: 'XIAOMI Pad 2 9.7 (4GB | 128GB)', price: 250000 },
        { keys: ['16 pro max', '١٦ برو ماكس', '16 بروماكس', 'ايفون 16 برو ماكس'], name: 'iPhone 16 Pro Max', price: 1900000 },
        { keys: ['16 pro', '١٦ برو', 'ايفون 16 برو'], name: 'iPhone 16 Pro', price: 1700000 },
        { keys: ['16 plus', '16 بلس', 'ايفون 16 بلس'], name: 'iPhone 16 Plus', price: 1450000 },
        { keys: ['16 عادي', 'ايفون 16', 'iphone 16', '١٦'], name: 'iPhone 16', price: 1300000 },
        { keys: ['15 pro max', '١٥ برو ماكس', '15 بروماكس', 'ايفون 15 برو ماكس'], name: 'iPhone 15 Pro Max', price: 1550000 },
        { keys: ['15 pro', '١٥ برو', 'ايفون 15 برو'], name: 'iPhone 15 Pro', price: 1400000 },
        { keys: ['15 عادي', 'ايفون 15', 'iphone 15', '١٥'], name: 'iPhone 15', price: 1100000 },
        { keys: ['14 pro max', '١٤ برو ماكس', 'ايفون 14 برو ماكس'], name: 'iPhone 14 Pro Max', price: 1300000 },
        { keys: ['14 pro', '١٤ برو', 'ايفون 14 برو'], name: 'iPhone 14 Pro', price: 1150000 },
        { keys: ['14 عادي', 'ايفون 14', 'iphone 14', '١٤'], name: 'iPhone 14', price: 950000 },
        { keys: ['13 pro max', '١٣ برو ماكس', 'ايفون 13 برو ماكس'], name: 'iPhone 13 Pro Max', price: 1050000 },
        { keys: ['13 عادي', 'ايفون 13', 'iphone 13', '١٣'], name: 'iPhone 13', price: 800000 },
        { keys: ['12 pro max', 'ايفون 12 برو ماكس'], name: 'iPhone 12 Pro Max', price: 780000 },
        { keys: ['12', 'ايفون 12'], name: 'iPhone 12', price: 620000 },
        { keys: ['11', 'ايفون 11'], name: 'iPhone 11', price: 500000 },
        { keys: ['s25 ultra', 'اس 25 الترا', 'سامسونج s25 ultra', 's25 الترا'], name: 'Samsung Galaxy S25 Ultra', price: 1850000 },
        { keys: ['s25', 'اس 25'], name: 'Samsung Galaxy S25', price: 1250000 },
        { keys: ['s24 ultra', 'اس 24 الترا', 'سامسونج s24 ultra'], name: 'Samsung Galaxy S24 Ultra', price: 1500000 },
        { keys: ['s24', 'اس 24'], name: 'Samsung Galaxy S24', price: 1050000 },
        { keys: ['s23 ultra', 'اس 23 الترا'], name: 'Samsung Galaxy S23 Ultra', price: 1200000 },
        { keys: ['a55', 'سامسونج a55'], name: 'Samsung Galaxy A55', price: 460000 },
        { keys: ['a35', 'سامسونج a35'], name: 'Samsung Galaxy A35', price: 360000 },
        { keys: ['ps5', 'بلايستيشن 5', 'بلي 5', 'playstation 5', 'سوني 5'], name: 'PlayStation 5 Slim', price: 720000 },
        { keys: ['ps4', 'بلايستيشن 4', 'بلي 4'], name: 'PlayStation 4 Pro', price: 420000 },
        { keys: ['ايباد 10', 'ايباد الجيل العاشر', 'ipad 10'], name: 'iPad 10th Gen', price: 550000 },
        { keys: ['ايباد برو', 'ipad pro'], name: 'iPad Pro M4', price: 1500000 },
        { keys: ['ايباد اير', 'ipad air'], name: 'iPad Air M2', price: 950000 },
        { keys: ['ايباد', 'ipad'], name: 'Apple iPad', price: 550000 },
        { keys: ['ماك بوك', 'macbook'], name: 'Apple MacBook Air M3', price: 1650000 },
        { keys: ['ساعة ابل', 'apple watch'], name: 'Apple Watch Series 10', price: 580000 },
        { keys: ['شاشة', 'تلفزيون'], name: 'شاشة سمارت 4K', price: 450000 },
        { keys: ['سبلت', 'مكيف'], name: 'سبلت 2 طن انفيرتر', price: 850000 },
        { keys: ['ثلاجة', 'ثلاجه'], name: 'ثلاجة إنفيرتر حديثة', price: 750000 },
        { keys: ['غسالة', 'غساله'], name: 'غسالة فول أوتوماتيك', price: 580000 }
    ],

    // =====================================================
    // Build Gemini System Prompt (Deep Iraqi Dialect & Retail Finance)
    // =====================================================
    getMarkup() {
        if (typeof window.getStoreDeviceMarkup === 'function') {
            return window.getStoreDeviceMarkup();
        }
        const fromSettings = window.AppState?.settings?.scannerMarkup;
        if (fromSettings !== undefined && fromSettings !== null && !isNaN(Number(fromSettings))) {
            return Number(fromSettings);
        }
        return 15000;
    },

    getPresets() {
        const markup = this.getMarkup();

        const catalogDevices = (window.AppState && Array.isArray(window.AppState.devices) && window.AppState.devices.length > 0)
            ? window.AppState.devices.map(d => {
                const raw = (d.rawPrice !== undefined) ? Number(d.rawPrice) : (Number(d.price) || 0);
                const finalP = d.markupApplied ? Number(d.price) : Math.round(raw + markup);
                return {
                    keys: d.keys || [d.name.toLowerCase()],
                    name: d.name,
                    rawPrice: raw,
                    markupApplied: markup,
                    price: finalP
                };
            })
            : [];

        const basePresets = this.DEVICE_PRESETS.map(d => {
            const raw = Number(d.price) || 0;
            return {
                keys: d.keys,
                name: d.name,
                rawPrice: raw,
                markupApplied: markup,
                price: Math.round(raw + markup)
            };
        });

        return [...catalogDevices, ...basePresets];
    },

    buildSystemPrompt() {
        const s = window.AppState;
        const storeName = s?.settings?.storeName || 'مكتب ماكس للتقسيط';
        const storeAddr = s?.settings?.storeAddress || 'بغداد - العراق';
        const storePhone = s?.settings?.storePhone || '07700000000';
        const currentSys = s?.currentSystem === 'manual' ? 'تسديد يدوي مباشر' : 'منصة إلكترونية';
        const markup = this.getMarkup();
        const markupFmt = window.FinanceCalculator ? window.FinanceCalculator.formatIraqiShort(markup) : `${markup} د.ع`;

        // Contextual price sheet for quick reference (includes markup)
        const presets = this.getPresets();
        const deviceList = presets.slice(0, 35).map(d =>
            `- ${d.name}: ${window.FinanceCalculator ? window.FinanceCalculator.formatNumber(d.price) : d.price} د.ع نقداً`
        ).join('\n');

        return `أنت **«مساعد ماكس ✦ Max»**، المستشار المالي ومسؤول المبيعات الرسمي لـ **${storeName}** في العراق.
موقع المكتب: ${storeAddr}
رقم التواصل والواتساب: ${storePhone}
نظام التقسيط المعتمد حالياً: ${currentSys}
ساعات العمل: يومياً من 10 صباحاً حتى 10 مساءً
ملاحظة هامة: لا تذكر إطلاقاً كلمة Gemini أو أي مزود ذكاء خارجي، هويتك هي ماكس (مساعد ماكس الذكي) لمكتب ماكس.

## 💰 سياسة التسعير وهوامش الربح المعتمدة للمكتب (قاعدة ملزمة وحاسمة):
1. **المبلغ الإضافي المعتمد للمكتب هو (${markupFmt}) وهو مضاف ومدمج بالفعل على جميع أسعار الأجهزة المذكورة في قائمتك الاسترشادية أدناه**.
2. **عند إعطاء سعر أي جهاز للزبون، اذكر دائماً السعر النهائي المعتمد الذي يتضمن هذا المبلغ الإضافي حصراً**.
3. **إذا ذكر الزبون أي سعر لجهاز (مثلاً: 535 ألف)، أضف عليه دائماً المبلغ الإضافي المعتمد (${markupFmt}) ليكون سعره الرسمي المعروض للزبون هو (${window.FinanceCalculator ? window.FinanceCalculator.formatIraqiShort(535000 + markup) : '550 ألف'} د.ع نقداً) دائماً وأبداً، واحسب الأقساط عليه حصراً**.
4. **إذا سأل الزبون عن أي جهاز موجود في قائمتك، التزم بسعر قائمتك الرسمية المعتمدة وتجاهل أي سعر مغاير من نتائج البحث في Google**.
5. **ممنوع نهائياً ذكر السعر الأصلي الخام بدون الإضافة**، وممنوع ذكر كلمة "مبلغ إضافي" أو "زيادة" أو "نسبة ربح"، فقط اذكر السعر النهائي نقداً والأقساط مباشرة وبكل لباقة.

## 🇮🇶 إتقان اللهجات والمصطلحات العراقية (قاعدة إلزامية):
1. **أنت تتحدث باللهجة العراقية الأصيلة فقط** بأسلوب محبب، مهذب، شعبي ومحترف في نفس الوقت:
   - استخدم مصطلحات الترحيب واللباقة العراقية: *"تدلل عيوني"، "كل الهلا بيك"، "من عيوني أضبطلك أنسب حسبة"، "تأمر أمر"، "حياك الله تاج راسي"*.
2. **افهم وتجاوب مع جميع لهجات محافظات العراق بسلاسة تامة**:
   - **أهل بغداد والوسط**: (شكد القسط؟، شكد الواصل؟، بيه مجال؟، كفوء، بلا زحمة عليك، كفيل، ماستر كارد).
   - **أهل الجنوب (البصرة، الناصرية، العمارة، الكوت، السماوة)**: (جا شكد يطلع؟، شلونكم حبايب، شكد تنطونه؟، فد شي مرتب، شنهي السالفة).
   - **أهل الغربية (الأنبار، صلاح الدين، سامراء، الفلوجة)**: (الله حيهم، شنهو الشروط؟، شلون الحسبة مالتكم؟، يا هلا بيك).
   - **أهل الشمال (الموصل، كركوك)**: (أشقد يطلع القسط؟، أريد خوش موبايل، إشقد تأخذون واصل؟).
3. **فهم مصطلحات الرواتب والمصارف العراقية الدارجة**:
   - (كي كارد Qi Card، ماستر كارد رافدين أو رشيد، بطاقة النخيل، بطاقات المتقاعدين، شبكة الحماية الاجتماعية، استقطاع راتب، سلفة).
4. **فهم استبدال الأجهزة (Trade-in)**: إذا سأل الزبون عن تبديل جهازه القديم، أخبره: *"نعم نكدر نبدلك جهازك القديم ونحسب قيمته كدفعة أولى (واصل) ونقسطلك الباقي، تقدر تشرفنا للمكتب حتى يفحصه الفني وينطيك أعلى تقييم!"*.

## 🔒 القواعد التجارية والمالية الصارمة (خط أحمر لا تخالفه أبداً):
1. **ممنوع نهائياً** وبأي شكل ذكر أي نسبة مئوية (%) أو كلمة "فائدة" أو "ربحنا" أو "زيادة المكتب" — ابداً!
2. عندما يسأل الزبون عن الأقساط، اذكر فقط:
   - **السعر نقداً**
   - **المقدمة (المبلغ الواصل)**
   - **القسط الشهري الصافي**
   - **المجموع الكلي**
3. **الإيجابية وحل المشكلات**: إذا قال الزبون "غالي" أو "راتبي ما يكفي"، انصحه بلطف باختيار خطة أطول (16 أو 18 شهراً) لتخفيض القسط الشهري، أو اقترح عليه جهازا بديلاً ممتازا يناسب قدرته المالية.
4. **الاختصار والوضوح**: ردودك تكون مركزة وسريعة (3 إلى 5 جمل كافية وواضحة)، بعيداً عن الإطالة الإنشائية.

## 🎮 مستشار الأداء الحياتي والواقعي (قاعدة إلزامية):
الزبون العادي لا يفهم لغة الأرقام والمصطلحات المعقدة (نوع المعالج وتردد الرام). دائماً جاوبه بالأداء الواقعي بلغتنا العراقية الدارجة:
1. **ألعاب وببجي (PUBG Mobile & 90fps):**
   - اشرح له بالواقع: "الجهاز يشغل 90 فريم ثابتة وسلسة بدون هبوط، وتبريده ممتاز ما يحمى بجو الصيف حتى لو لعبت ساعات، وبطاريته 5000mAh وشاحنه سريع".
   - رشح له: **ريلمي 16 برو بلس (realme 16 Pro Plus)** أو **ريلمي 15T** أو **آيفون 16 برو**.
2. **تصوير للصالونات، الملابس، والتيك توك والإنستغرام:**
   - اشرح له: "الكاميرا تنطيك ألوان حقيقية وبشرة نقية وعزل سينمائي ناعم للمكياج والمودلز، وتصوير الفيديو ثابت بدون اهتزاز، والإضاءة الليلية واضحة بدون تشويش".
   - رشح له: **آيفون 16 برو / 15 برو**، أو **ريلمي 16 برو بلس** (كاميرا بيريسكوب بورتريه)، أو **سامسونج الترا**.
3. **دراسة وجهال ومحاضرات وبطارية تدوم:**
   - اشرح له: "شاشة عملاقة مريحة للعين لقراءة الـ PDF ومحاضرات الكلية واليوتيوب، وهيكل معدني قوي يتحمل طيحات وصدمات الجهال، والبطارية تكفيك يومين كاملين".
   - رشح له: **شاومي باد 8 برو (Xiaomi Pad 8 Pro)** أو **شاومي باد 8** أو **ريدمي باد 2 برو**.
4. **توصيل وتكاسي وكرف شمس:**
   - اشرح له: "شاشة سطوعها عالي جداً تقرا الخريطة بوضوح تام تحت شمس الظهر بدون ما تظلم، وبطارية 5000+ تدوم من الصبح لليل ويا الجي بي إس بدون ما تفصل".
   - رشح له: **انفينكس هوت 60 برو بلس**، **هوت 60 برو**، أو **ريلمي 15T**.
5. **ميزانية وقسط خفيف:**
   - اشرح له: "جهاز ذكي بمواصفات ممتازة وقسطه خفيف جداً ما تحس بيه على الراتب (أقل من 25-35 ألف شهرياً)".
   - رشح له: **انفينكس سمارت 20 (Infinix Smart 20)**.

## 💰 قائمة أسعار الأجهزة الاسترشادية (شاملة المبلغ الإضافي المعتمد):
${deviceList}

## 📋 المستمسكات والشروط العامة للتقسيط:
- البطاقة الوطنية الموحدة وبطاقة السكن
- بطاقة الماستر كارد / كي كارد الموطنة للراتب، أو كفيل موظف مستمر بالخدمة
- إمكانية التقسيط بدون كفيل لحاملي بطاقات الرواتب الموطنة مباشرة.

## 🌐 البحث المباشر في Google (ميزة البحث التلقائي):
عندما يسألك الزبون عن أي جهاز أو موديل غير موجود في قائمتك المحلية (مثل هواتف Honor، Google Pixel، Huawei، OnePlus، أو أسعار صرف الدولار، أو مواعيد نزول أجهزة جديدة):
1. ابحث في Google فوراً واجلب أحدث سعر ومواصفات موثوقة في السوق العراقي اليوم، وأضف عليه دائماً المبلغ الإضافي للمكتب (${markupFmt}).
2. قدم جواباً مختصراً جداً ومركزاً (سطرين إلى 3 أسطر كحد أقصى) بدون كلام إنشائي، وبالدينار العراقي.
3. اختم بلباقة عراقية: *"إذا حاب نوفره إلك بالتقسيط في مكتب ماكس، تكدر تراسلنا ع الواتساب وندبره إلك فوراً!"*.

## ⚠️ ختام الرد:
إذا سأل عن قسط جهاز محدد، اختم بعبارة قصيرة مثل:
*"تقدر تشوف خطط الأقساط مفصلة بالكرت جوه، وتكدر تدوس (تطبيق بالحاسبة ⚡) أو تراسلنا على الواتساب 💬 نحجزلك الجهاز فوراً!"*`;
    },

    // =====================================================
    // Call Gemini 2.5 Flash API with Live Google Search Grounding
    // =====================================================
    async callGemini(userMessage, ctx) {
        const apiKey = this.getApiKey();
        if (!apiKey) {
            throw new Error('NO_API_KEY');
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.GEMINI_MODEL}:generateContent?key=${apiKey}`;

        // Build conversation history for multi-turn memory (last 6 turns max)
        const recentHistory = this.history.slice(-6).map(h => ({
            role: h.sender === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }]
        })).filter(h => h.parts[0].text && h.parts[0].text.length > 1);

        // Add current message with retail margin context if available
        let userTextForGemini = userMessage;
        if (ctx && ctx.principal) {
            const markup = this.getMarkup();
            const markupFmt = window.FinanceCalculator ? window.FinanceCalculator.formatIraqiShort(markup) : `${markup} د.ع`;
            const priceFmt = window.FinanceCalculator ? window.FinanceCalculator.formatIraqiShort(ctx.principal) : `${ctx.principal.toLocaleString()} د.ع`;
            userTextForGemini += `\n\n[تعليمات إلزامية للتسعير من إدارة المكتب: السعر الرسمي المعتمد لهذا الجهاز في مكتب ماكس بعد إضافة هامش المكتب (${markupFmt}) هو (${priceFmt} / ${ctx.principal.toLocaleString()} د.ع نقداً). اذكر هذا السعر حصراً (${priceFmt}) كـ سعر نقدي واعتمد عليه في كافة حسبات الأقساط، وممنوع منعاً باتاً ذكر أي سعر خام قديم مثل ${ctx.rawPrice ? ctx.rawPrice.toLocaleString() : ''}].`;
        }
        recentHistory.push({ role: 'user', parts: [{ text: userTextForGemini }] });

        const body = {
            system_instruction: { parts: [{ text: this.buildSystemPrompt() }] },
            contents: recentHistory,
            tools: [
                { google_search: {} }
            ],
            generationConfig: {
                maxOutputTokens: 800,
                temperature: 0.7,
                topP: 0.9
            }
        };

        const resp = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!resp.ok) {
            const errData = await resp.json().catch(() => ({}));
            throw new Error(errData?.error?.message || `HTTP ${resp.status}`);
        }

        const data = await resp.json();
        const candidate = data?.candidates?.[0];
        const textParts = candidate?.content?.parts?.map(p => p.text || '').filter(Boolean);
        const replyText = textParts?.join('\n')?.trim();
        return replyText || '';
    },

    // =====================================================
    // Enforce Store Retail Markup On Model Outputs
    // Replaces any raw/wholesale prices with the official marked-up prices
    // =====================================================
    enforceMarkupOnReply(replyText, ctx) {
        if (!replyText || typeof replyText !== 'string') return replyText;
        const markup = this.getMarkup();
        if (markup <= 0) return replyText;

        // Build a replacement map of raw values to final values
        // e.g. 535000 -> 550000, 794000 -> 809000, 535 -> 550, 794 -> 809
        const priceMap = new Map();

        // 1. If financial context has a rawPrice and principal
        if (ctx && ctx.rawPrice && ctx.principal && ctx.rawPrice !== ctx.principal) {
            const rawP = Number(ctx.rawPrice);
            const finalP = Number(ctx.principal);
            const rawK = Math.round(rawP / 1000);
            const finalK = Math.round(finalP / 1000);
            priceMap.set(rawP, finalP);
            priceMap.set(rawK, finalK);
        }

        // 2. Presets (only add if not already in map)
        const presets = this.getPresets();
        presets.forEach(p => {
            if (p.rawPrice && p.price && p.rawPrice !== p.price) {
                const rP = Number(p.rawPrice);
                const fP = Number(p.price);
                const rK = Math.round(rP / 1000);
                const fK = Math.round(fP / 1000);
                if (!priceMap.has(rP)) priceMap.set(rP, fP);
                if (!priceMap.has(rK)) priceMap.set(rK, fK);
            }
        });

        if (priceMap.size === 0) return replyText;

        let text = replyText;

        // Single pass for thousands notation: e.g. "535 الف" or "794 الف"
        text = text.replace(/(^|[^0-9])(\d{2,4})\s*(?:الف|ألف|k)(?=[^0-9a-zA-Z]|$)/gi, (match, prefix, numStr) => {
            const val = Number(numStr);
            if (priceMap.has(val)) {
                return `${prefix}${priceMap.get(val)} الف`;
            }
            return match;
        });

        // Single pass for full numbers with or without commas: e.g. "535,000" or "535000" or "535،000"
        text = text.replace(/(^|[^0-9])(\d{1,3}(?:[,،]\d{3})+|\d{5,8})(?![0-9])/g, (match, prefix, numWithCommas) => {
            const cleanNum = Number(numWithCommas.replace(/[,،]/g, ''));
            if (priceMap.has(cleanNum)) {
                const finalVal = priceMap.get(cleanNum);
                const formatted = numWithCommas.includes(',') || numWithCommas.includes('،')
                    ? finalVal.toLocaleString()
                    : String(finalVal);
                return `${prefix}${formatted}`;
            }
            return match;
        });

        return text;
    },

    // =====================================================
    // Test Gemini API Key Connection
    // =====================================================
    async testApiKey(key) {
        if (!key || !key.trim()) {
            return { success: false, error: 'يرجى إدخال أو لصق مفتاح API أولاً' };
        }
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.GEMINI_MODEL}:generateContent?key=${key.trim()}`;
        const body = {
            contents: [{ parts: [{ text: 'مرحبا' }] }],
            generationConfig: { maxOutputTokens: 10 }
        };
        try {
            const resp = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (!resp.ok) {
                const errData = await resp.json().catch(() => ({}));
                return { success: false, error: errData?.error?.message || `خطأ في المصادقة: HTTP ${resp.status}` };
            }
            return { success: true, message: 'تم الاتصال بنجاح مع Google Gemini 2.5 Flash! ⚡' };
        } catch (e) {
            return { success: false, error: e.message || 'فشل الاتصال بالإنترنت' };
        }
    },

    // =====================================================
    // Local Intelligent Iraqi Sales Advisor Engine (Zero-Downtime Fallback)
    // Works 100% offline or when API key is not configured/expired
    // =====================================================
    generateLocalSmartReply(userText, ctx) {
        const norm = (userText || '').toLowerCase().replace(/[٠-٩]/g, d => '0123456789'['٠١٢٣٤٥٦٧٨٩'.indexOf(d)]);
        const s = window.AppState;
        const storeName = s?.settings?.storeName || 'مكتب ماكس للتقسيط';
        const storeAddr = s?.settings?.storeAddress || 'بغداد - العراق';
        const storePhone = s?.settings?.storePhone || '07700000000';
        const presets = this.getPresets();

        // 1. Greetings & Pleasantries
        if (/^(السلام عليكم|سلام عليكم|مرحبا|مرحباً|هلو|هلا|صباح الخير|مساء الخير|شلونك|شلونكم|شخبارك|حياك الله|عساكم بخير)/i.test(norm) && !ctx.identifiedProduct && !ctx.principal) {
            return `وعليكم السلام ورحمة الله وبركاته، كل الهلا بيك عيوني نورت **${storeName}** 💎\n\nأنا **مساعد ماكس الذكي**، حاضر وممنون لأي استفسار عن أسعار الأجهزة بالدينار العراقي وحساب الأقساط الشهرية.\n\nشنو الجهاز اللي ببالك أو تحب نحسبلك قسطه اليوم؟`;
        }

        // 2. Installment Terms & Required Documents
        if (/مستمسكات|شروط|شروطكم|المستمسك|شنو المطلوب|شلون اقسط|كفيل|بدون كفيل|استقطاع|كي كارد|ماستر كارد|ماستركارد|نخيل|رواتب/i.test(norm) && !ctx.identifiedProduct) {
            return `تدلل عيوني وياهلا بيك! شروط التقسيط في **${storeName}** مبسطة جداً:\n\n` +
                   `1. **لحاملي بطاقات الماستر كارد / الكي كارد (الموطنة رواتبهم):** التقسيط فوري بدون كفيل عن طريق استقطاع الراتب الرسمي.\n` +
                   `2. **للكسبة والأعمال الحرة:** البطاقة الوطنية الموحدة + بطاقة السكن + كفيل موظف مدني مستمر بالخدمة.\n\n` +
                   `تشرفنا بأي وقت أو راسلنا مباشرة على الواتساب (${storePhone}) ونكمل معاملتك فوراً 💬`;
        }

        // 3. Store Location & Working Hours
        if (/وين مكانكم|وين موقعكم|وين صايرين|عنوانكم|يا محافظة|ساعات العمل|شوكت تفتحون|وقت الدوام|شوكت تعزلون/i.test(norm)) {
            return `كل الهلا بيك تاج راسي! تشرفنا بأي وقت:\n\n` +
                   `📍 **العنوان:** ${storeAddr}\n` +
                   `⏰ **ساعات الدوام:** يومياً من الساعة 10:00 صباحاً حتى 10:00 مساءً\n` +
                   `📞 **رقم الواتساب والاستفسارات:** ${storePhone}\n\n` +
                   `تكدر تشرفنا للمكتب أو تراسلنا واتساب بأي وقت وندبرلك كل اللي تريده!`;
        }

        // 4. Trade-in / Device Exchange
        if (/ابدل|تبديل|استبدال|جهاز قديم|تاخذون مستعمل|مستعمل/i.test(norm) && !ctx.identifiedProduct) {
            return `نعم عيوني نكدر نبدلك جهازك القديم! 🔄📱\n\n` +
                   `تكدر تشرفنا للمكتب يفحصه الفني وينطيك بيه أعلى وأفضل سعر تقييم بالسوق، ونحسب قيمته كدفعة أولى (واصل) ونقسطلك الباقي بأقساط مريحة جداً.\n\n` +
                   `شنو موديل جهازك القديم؟ أو تكدر تشرفنا مباشرة للمكتب!`;
        }

        // 5. Specific Product Quote (Calculated with actionCard context)
        if (ctx.principal) {
            const prodTitle = ctx.identifiedProduct ? `جهاز **${ctx.identifiedProduct}**` : 'الجهاز المطلوب';
            const priceFmt = window.FinanceCalculator ? window.FinanceCalculator.formatIraqiShort(ctx.principal) : ctx.principal;
            const ratesMap = s.rates?.[s.currentSystem === 'manual' ? 'manual' : 'platform'] || window.InstallmentData?.DEFAULT_RATES?.platform || {};
            const r12 = ratesMap['12'] ?? 12;
            const calc12 = window.FinanceCalculator ? window.FinanceCalculator.calculatePlan({
                principal: ctx.principal,
                downPayment: ctx.downPayment || 0,
                downPaymentType: 'fixed',
                months: 12,
                ratePercent: r12,
                calculationMode: s.settings?.calculationMode || 'flat',
                roundingMode: s.settings?.roundingMode || 'none'
            }) : null;

            const monthlyFmt = calc12 ? window.FinanceCalculator.formatIraqiShort(calc12.monthlyPayment) : '';
            const perkText = ctx.lifePerk ? `\n\n✨ **مميزات الأداء:** ${ctx.lifePerk}` : '';

            return `تدلل عيوني وياهلا بيك! ${prodTitle} متوفر عدنا بسعر **${priceFmt}** نقداً.${perkText}\n\n` +
                   (monthlyFmt ? `تقدر تاخذه بنظام الأقساط المريحة بقسط شهري يبدأ من **${monthlyFmt}** (على خطة 12 شهر).\n\n` : '') +
                   `سويتلك كرت الحسبة التفصيلي جوه 👇 تكدر تدوس **(تطبيق بالحاسبة ⚡)** لتجربة كل الخطط والأشهر، أو تراسلنا على **الواتساب 💬** لحجز الجهاز فوراً!`;
        }

        // 6. Budget-based Recommendations
        const parsedAmt = this.parseArabicAmount(userText);
        if (parsedAmt && parsedAmt >= 150000 && parsedAmt <= 2500000) {
            const matching = presets.filter(d => Math.abs(d.price - parsedAmt) <= parsedAmt * 0.35 || d.price <= parsedAmt)
                                    .sort((a, b) => Math.abs(a.price - parsedAmt) - Math.abs(b.price - parsedAmt))
                                    .slice(0, 3);
            if (matching.length > 0) {
                const listStr = matching.map(m => `• **${m.name}**: ${window.FinanceCalculator ? window.FinanceCalculator.formatIraqiShort(m.price) : m.price} نقداً`).join('\n');
                return `تدلل عيوني! على حدود ميزانيتك (${window.FinanceCalculator ? window.FinanceCalculator.formatIraqiShort(parsedAmt) : parsedAmt})، أفضل وأقوى الأجهزة اللي أنصحك بيها:\n\n${listStr}\n\n` +
                       `كلها أجهزة كفوءة وضمان حقيقي، وتقدر تقسط أي جهاز منها بدون ما تحس بالقسط. جهزتلك كرت الحسبة لأبرز جهاز منهم جوه 👇`;
            }
        }

        // 7. General Inquiry or Unlisted Device
        return `يا هلا بيك عيوني نورت **${storeName}** 💎\n\n` +
               `كل أجهزة الهواتف الذكية (آيفون، سامسونج، ريلمي، انفينكس)، أجهزة التابلت وشاشات العرض متوفرة عدنا نقداً وبالتقسيط المريح.\n\n` +
               `تكدر تكتبلي اسم أي جهاز تريده أو ميزانيتك ونحسبلك قسطه فوراً، أو تكدر تضغط زر **الواتساب 💬** وندبرلك أي طلب خاص بأفضل سعر بالسوق!`;
    },

    // =====================================================
    // Smart Financial Context Detector
    // Detects if Gemini should be followed by a financial card
    // =====================================================
    extractFinancialContext(input) {
        const norm = input.toLowerCase().replace(/[٠-٩]/g, d => '0123456789'['٠١٢٣٤٥٦٧٨٩'.indexOf(d)]);

        let principal = null;
        let downPayment = 0;
        let identifiedProduct = null;
        let rawPrice = null;
        const markup = this.getMarkup();

        // Device detection
        const presets = this.getPresets();
        for (const preset of presets) {
            const isMatch = preset.keys.some(k => norm.includes(k.toLowerCase()) || input.includes(k));
            if (isMatch) {
                identifiedProduct = preset.name;
                principal = preset.price;
                rawPrice = preset.rawPrice || Math.max(0, preset.price - markup);
                break;
            }
        }

        // Fuzzy match on device model numbers if not yet found
        if (!identifiedProduct) {
            if (/ايفون 16|iphone 16|١٦/i.test(norm)) {
                const found = presets.find(p => /iphone 16 pro/i.test(p.name)) || presets.find(p => /iphone 16/i.test(p.name));
                if (found) { identifiedProduct = found.name; principal = found.price; rawPrice = found.rawPrice || Math.max(0, found.price - markup); }
            } else if (/ايفون 15|iphone 15|١٥/i.test(norm)) {
                const found = presets.find(p => /iphone 15 pro/i.test(p.name)) || presets.find(p => /iphone 15/i.test(p.name));
                if (found) { identifiedProduct = found.name; principal = found.price; rawPrice = found.rawPrice || Math.max(0, found.price - markup); }
            } else if (/ايفون 14|iphone 14|١٤/i.test(norm)) {
                const found = presets.find(p => /iphone 14/i.test(p.name));
                if (found) { identifiedProduct = found.name; principal = found.price; rawPrice = found.rawPrice || Math.max(0, found.price - markup); }
            } else if (/ايفون 13|iphone 13|١٣/i.test(norm)) {
                const found = presets.find(p => /iphone 13/i.test(p.name));
                if (found) { identifiedProduct = found.name; principal = found.price; rawPrice = found.rawPrice || Math.max(0, found.price - markup); }
            } else if (/ريلمي 16|realme 16/i.test(norm)) {
                const found = presets.find(p => /realme 16/i.test(p.name));
                if (found) { identifiedProduct = found.name; principal = found.price; rawPrice = found.rawPrice || Math.max(0, found.price - markup); }
            }
        }

        // Parse amounts
        const parsed = this.parseArabicAmount(input);
        if (parsed && parsed >= 100000) {
            if (/مقدمة|مقدمه|واصل|ادفع/i.test(input)) {
                downPayment = parsed;
            } else if (!principal) {
                rawPrice = parsed;
                principal = parsed + markup;
                if (!identifiedProduct) {
                    identifiedProduct = 'الجهاز المطلوب';
                }
            }
        }

        // Separate DP
        if (/بدون مقدمة|بدون مقدمه|صفر مقدمة|ما عندي مقدمة|ماكو مقدمة/i.test(input)) {
            downPayment = 0;
        } else {
            const dpMatch = input.match(/(?:مقدمة|مقدمه|واصل|عندي)\s*([^\n,،]{2,20})/i);
            if (dpMatch && dpMatch[1]) {
                const dpVal = this.parseArabicAmount(dpMatch[1]);
                if (dpVal && dpVal < (principal || 5000000) * 0.9) {
                    downPayment = dpVal;
                }
            }
        }

        // Salary detection
        let salary = null;
        const salMatch = input.match(/(?:راتبي|استلم|دخلي|دخلى)\s*([^\n,،]{2,20})/i);
        if (salMatch) {
            const v = this.parseArabicAmount(salMatch[1]);
            if (v) salary = v;
        }

        // Life Performance Matching (if product not explicitly detected yet, or attach real-world perk)
        let lifePerk = null;
        if (!identifiedProduct) {
            // 1. Gaming & PUBG
            if (/ببجي|pubg|العاب|ألعاب|كيمينك|جيمنج|فريم|فريمات|90 فريم|120 فريم/i.test(norm)) {
                const found = presets.find(p => /realme 16 pro plus/i.test(p.name));
                identifiedProduct = found ? found.name : 'realme 16 Pro Plus (12GB | 512GB)';
                principal = found ? found.price : (794000 + markup);
                lifePerk = '🎮 أداء 90fps ببجي فائق مع تبريد صيف ممتاز';
            }
            // 2. Photography & Social Media & Salons
            else if (/تصوير|كاميرا|كامره|كاميرة|صالون|مكياج|تيك توك|انستغرام|انستا|سيلفي|محتوى|ريلز|فلوقات/i.test(norm)) {
                if (/ايفون|آيفون|apple|iphone/i.test(norm)) {
                    const found = presets.find(p => /iphone 16 pro/i.test(p.name));
                    identifiedProduct = found ? found.name : 'iPhone 16 Pro';
                    principal = found ? found.price : (1700000 + markup);
                } else {
                    const found = presets.find(p => /realme 16 pro plus/i.test(p.name));
                    identifiedProduct = found ? found.name : 'realme 16 Pro Plus (12GB | 512GB)';
                    principal = found ? found.price : (794000 + markup);
                }
                lifePerk = '📸 كاميرا سينمائية وعزل ناعم للصالونات والمحتوى';
            }
            // 3. Study, Kids, University, Tablets
            else if (/دراسة|دراسه|جهال|أطفال|اطفال|محاضرات|تابلت|ايباد|آيباد|كلية|جامعة|مسلسلات/i.test(norm)) {
                const found = presets.find(p => /xiaomi pad 8 pro/i.test(p.name));
                identifiedProduct = found ? found.name : 'Xiaomi Pad 8 Pro (12GB | 512GB)';
                principal = found ? found.price : (940000 + markup);
                lifePerk = '📚 تابلت شاشة عملاقة للدراسة ومقاوم لصدمات الجهال';
            }
            // 4. Delivery, Taxi, Heavy Duty & Battery
            else if (/تكسي|تاكسي|دليفري|توصيل|سائق|شمس|كرف|شحن سريع/i.test(norm)) {
                const found = presets.find(p => /infinix hot 60 pro plus/i.test(p.name));
                identifiedProduct = found ? found.name : 'Infinix HOT 60 Pro Plus (8GB | 256GB)';
                principal = found ? found.price : (310000 + markup);
                lifePerk = '🔋 بطارية عملاقة وكرف شمس مع شحن فائق';
            }
            // 5. Lowest Installment & Budget
            else if (/ارخص|أرخص|رخيص|اقل قسط|أقل قسط|قسط خفيف|ميزانية محدودة/i.test(norm)) {
                const found = presets.find(p => /infinix smart 20/i.test(p.name));
                identifiedProduct = found ? found.name : 'Infinix Smart 20 (4GB | 64GB)';
                principal = found ? found.price : (185000 + markup);
                lifePerk = '💰 قسط خفيف جداً وأعلى قيمة توفير للميزانية';
            }
        } else {
            if (/realme 16 pro plus|ريلمي 16 برو بلس/i.test(identifiedProduct)) {
                lifePerk = '🎮 90fps ببجي + 📸 كاميرا بيريسكوب بورتريه';
            } else if (/iphone|آيفون/i.test(identifiedProduct)) {
                lifePerk = '📸 تصوير سينمائي فائق وسلاسة أبل الكاملة';
            } else if (/pad|تابلت|ايباد/i.test(identifiedProduct)) {
                lifePerk = '📚 تابلت شاشة عملاقة للدراسة والترفيه';
            } else if (/infinix|انفينكس/i.test(identifiedProduct)) {
                lifePerk = '🔋 بطارية كرف قوية وأفضل قيمة مقابل السعر';
            }
        }

        return { principal, downPayment, identifiedProduct, salary, lifePerk, rawPrice };
    },

    // =====================================================
    // Build a Financial Action Card (if applicable)
    // =====================================================
    buildFinancialCard(ctx) {
        const { principal, downPayment, identifiedProduct, salary, lifePerk } = ctx;
        if (!principal || principal < 100000) return null;

        const s = window.AppState;
        const ratesMap = s.rates?.[s.currentSystem === 'manual' ? 'manual' : 'platform'] ||
                         window.InstallmentData?.DEFAULT_RATES?.platform || {};

        const plans = [10, 12, 14, 16, 18].map(m => {
            const rate = ratesMap[String(m)] ?? 0;
            const calc = window.FinanceCalculator.calculatePlan({
                principal, downPayment, downPaymentType: 'fixed', months: m,
                ratePercent: rate,
                calculationMode: s.settings?.calculationMode || 'flat',
                roundingMode: s.settings?.roundingMode || 'none'
            });
            return { months: m, calc };
        });

        let recommended = plans.find(p => p.months === 12) || plans[0];
        if (salary) {
            const safe = plans.find(p => p.calc.monthlyInstallment <= salary * 0.35);
            if (safe) recommended = safe;
        }

        const plan10 = plans.find(p => p.months === 10);
        const plan18 = plans.find(p => p.months === 18);
        const savings = (plan10 && plan18) ? Math.max(0, plan18.calc.totalRepayment - plan10.calc.totalRepayment) : 0;

        return {
            productName: identifiedProduct || (s.productName || 'الجهاز المطلوب'),
            principal, downPayment,
            months: recommended.months,
            monthly: recommended.calc.monthlyInstallment,
            total: recommended.calc.totalRepayment,
            savings,
            lifePerk
        };
    },

    // =====================================================
    // Arabic Amount Parser (Deep Iraqi dialect support)
    // =====================================================
    parseArabicAmount(text) {
        if (!text) return null;
        text = text.replace(/[،,]/g, '').trim().toLowerCase();
        text = text.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.split('').indexOf(d));

        // 1. Iraqi Slang: "ورقة" (100k) / "ورقتين" (200k) / "شدة" (10,000$ ~ 15M IQD)
        if (/ورقتين|ورقتان/.test(text)) return 200000;
        if (/ورقة|ورقه/.test(text) && !/ورقت/.test(text)) return 100000;
        if (/شدة|شده/.test(text)) return 15000000;

        // 2. Fractions: "نص مليون", "ربع مليون"
        if (/نص\s*مليون|نصف\s*مليون/.test(text)) return 500000;
        if (/ربع\s*مليون/.test(text)) return 250000;

        // 3. Millions First (so 'مليون وميتين' or 'مليون ونص' is not prematurely matched by thousands)
        if (text.includes('مليونين')) {
            let b = 2000000;
            if (/نص|نصف/.test(text)) b += 500000;
            else if (/ربع/.test(text)) b += 250000;
            else if (/ميتين|مئتين/.test(text)) b += 200000;
            else if (/ثلاثمية|ثلاث\s*مية/.test(text)) b += 300000;
            else if (/اربعمية|اربع\s*مية/.test(text)) b += 400000;
            else if (/خمسمية|خمس\s*مية/.test(text)) b += 500000;
            else {
                const sub = text.match(/مليونين\s*(?:و|\+)?\s*(\d+)/);
                if (sub?.[1]) {
                    const n = +sub[1];
                    b += n < 1000 ? n * 1000 : n;
                }
            }
            return b;
        }

        const mM = text.match(/(\d+)?\s*مليون\s*(?:و|\+)?\s*([^\s,،]+)?/);
        if (mM) {
            let b = (mM[1] ? +mM[1] : 1) * 1000000;
            if (mM[2]) {
                if (/نص|نصف/.test(mM[2])) b += 500000;
                else if (/ربع/.test(mM[2])) b += 250000;
                else if (/ميتين|مئتين/.test(mM[2])) b += 200000;
                else if (/ثلاثمية|ثلاث\s*مية/.test(mM[2])) b += 300000;
                else if (/اربعمية|اربع\s*مية/.test(mM[2])) b += 400000;
                else if (/خمسمية|خمس\s*مية/.test(mM[2])) b += 500000;
                else if (/ستمية|ست\s*مية/.test(mM[2])) b += 600000;
                else if (/سبعمية|سبع\s*مية/.test(mM[2])) b += 700000;
                else if (/ثمانمية|ثمان\s*مية/.test(mM[2])) b += 800000;
                else if (/تسعمية|تسع\s*مية/.test(mM[2])) b += 900000;
                else if (/مية|مائة/.test(mM[2])) b += 100000;
                else if (/^\d+$/.test(mM[2])) {
                    const n = +mM[2];
                    b += n < 1000 ? n * 1000 : n;
                }
            }
            return b;
        }

        // 4. Iraqi Word Numbers for Thousands (Ordered highest prefix first)
        const thousandsWordsMap = [
            { pattern: /تسعمية\s*وخمسين|تسع\s*مية\s*وخمسين/i, val: 950000 },
            { pattern: /ثمانمية\s*وخمسين|ثمان\s*مية\s*وخمسين/i, val: 850000 },
            { pattern: /سبعمية\s*وخمسين|سبع\s*مية\s*وخمسين/i, val: 750000 },
            { pattern: /ستمية\s*وخمسين|ست\s*مية\s*وخمسين/i, val: 650000 },
            { pattern: /خمسمية\s*وخمسين|خمس\s*مية\s*وخمسين/i, val: 550000 },
            { pattern: /اربعمية\s*وخمسين|اربع\s*مية\s*وخمسين/i, val: 450000 },
            { pattern: /ثلاثمية\s*وخمسين|ثلاث\s*مية\s*وخمسين/i, val: 350000 },
            { pattern: /ميتين\s*وخمسين|مئتين\s*وخمسين/i, val: 250000 },
            { pattern: /مية\s*وخمسين|مئة\s*وخمسين/i, val: 150000 },
            { pattern: /تسعمية\s*الف|تسع\s*مية/i, val: 900000 },
            { pattern: /ثمانمية\s*الف|ثمان\s*مية/i, val: 800000 },
            { pattern: /سبعمية\s*الف|سبع\s*مية/i, val: 700000 },
            { pattern: /ستمية\s*الف|ست\s*مية/i, val: 600000 },
            { pattern: /خمسمية\s*الف|خمس\s*مية/i, val: 500000 },
            { pattern: /اربعمية\s*الف|اربع\s*مية/i, val: 400000 },
            { pattern: /ثلاثمية\s*الف|ثلاث\s*مية/i, val: 300000 },
            { pattern: /ميتين\s*الف|ميتين|مئتين/i, val: 200000 },
            { pattern: /مية\s*الف|مية|مائة/i, val: 100000 }
        ];

        for (const item of thousandsWordsMap) {
            if (item.pattern.test(text)) return item.val;
        }

        // 5. Direct thousands: "50 الف", "200k", "1.9m"
        const kM = text.match(/(\d+(?:\.\d+)?)\s*(?:الف|ألف|k)/i);
        if (kM) return Math.round(+kM[1] * 1000);

        const mNum = text.match(/(\d+(?:\.\d+)?)\s*(?:m|مليون)/i);
        if (mNum) return Math.round(+mNum[1] * 1000000);

        // 6. Raw numbers (e.g. 1900000, 200000)
        const raw = text.match(/\b(\d{5,8})\b/);
        if (raw) return +raw[1];

        return null;
    },

    // =====================================================
    // INIT
    // =====================================================
    init() {
        const triggerBtn = document.getElementById('aiAdvisorTriggerBtn');
        const closeBtn = document.getElementById('closeAiModalBtn');
        const minimizeBtn = document.getElementById('minimizeAiModalBtn');
        const backdrop = document.getElementById('aiAdvisorBackdrop');
        const clearBtn = document.getElementById('clearAiChatBtn');
        const sendBtn = document.getElementById('aiSendBtn');
        const input = document.getElementById('aiUserInput');

        if (triggerBtn) {
            triggerBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleModal(true);
            });
        }
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleModal(false);
            });
        }
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleModal(false);
            });
        }
        if (backdrop) {
            backdrop.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleModal(false);
            });
        }
        if (clearBtn) clearBtn.addEventListener('click', () => this.clearChat());

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.toggleModal(false);
            }
        });

        if (sendBtn && input) {
            sendBtn.addEventListener('click', () => this.handleSendMessage());
            input.addEventListener('keydown', e => { if (e.key === 'Enter') this.handleSendMessage(); });
        }

        document.querySelectorAll('.ai-chip-prompt').forEach(chip => {
            chip.addEventListener('click', () => {
                const text = chip.getAttribute('data-prompt') || chip.textContent.trim();
                if (input) input.value = text;
                this.handleSendMessage();
            });
        });

        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    },

    clearChat() {
        this.history = [];
        const container = document.getElementById('aiChatMessages');
        if (container) container.innerHTML = '';
        if (window.SoundEngine) window.SoundEngine.playTick();
        this.showWelcomeMessage();
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
        if (window.showToast) window.showToast('🧹 تم تفريغ المحادثة وبدء استشارة جديدة!');
    },

    toggleModal(open) {
        const modal = document.getElementById('aiAdvisorModal');
        const triggerBtn = document.getElementById('aiAdvisorTriggerBtn');
        const backdrop = document.getElementById('aiAdvisorBackdrop');
        if (!modal) return;
        this.isOpen = (typeof open === 'boolean') ? open : !this.isOpen;
        if (this.isOpen) {
            modal.classList.remove('hidden');
            modal.style.display = 'flex';
            if (backdrop) backdrop.classList.remove('hidden');
            if (triggerBtn) triggerBtn.classList.add('hidden');
            if (window.SoundEngine) window.SoundEngine.playSuccessChime();
            const input = document.getElementById('aiUserInput');
            if (input) setTimeout(() => input.focus(), 150);
            if (this.history.length === 0) this.showWelcomeMessage();
            if (window.lucide && typeof window.lucide.createIcons === 'function') {
                window.lucide.createIcons();
            }
        } else {
            modal.classList.add('hidden');
            modal.style.display = 'none';
            if (backdrop) backdrop.classList.add('hidden');
            if (triggerBtn) triggerBtn.classList.remove('hidden');
            if (window.SoundEngine) window.SoundEngine.playTick();
        }
    },

    showWelcomeMessage() {
        const storeName = window.AppState?.settings?.storeName || 'مكتب ماكس للتقسيط';
        this.appendMessage('assistant',
            `هلا وكل الهلا بيك في **${storeName}** 💎\n\nأنا **مساعد ماكس**.. آمرني عيوني، شنو الجهاز أو القسط اللي تحب نحسبه إلك اليوم؟`
        , null);
    },

    async handleSendMessage() {
        if (this.isProcessing) return;
        const input = document.getElementById('aiUserInput');
        if (!input || !input.value.trim()) return;

        const userText = input.value.trim();
        input.value = '';
        this.isProcessing = true;

        this.appendMessage('user', userText);
        if (window.SoundEngine) window.SoundEngine.playTick();

        this.showTypingIndicator(true);

        try {
            // Extract financial context & build card immediately
            const ctx = this.extractFinancialContext(userText);
            const actionCard = this.buildFinancialCard(ctx);

            let aiReply = null;
            const apiKey = this.getApiKey();

            if (apiKey) {
                try {
                    aiReply = await this.callGemini(userText, ctx);
                } catch (apiErr) {
                    console.warn('Gemini API call failed, falling back to Local Smart Advisor:', apiErr.message);
                }
            }

            // Post-process Gemini's reply to enforce store markup, or fallback to smart local advisor
            if (aiReply && aiReply.trim().length > 0) {
                aiReply = this.enforceMarkupOnReply(aiReply, ctx);
            } else {
                aiReply = this.generateLocalSmartReply(userText, ctx);
            }

            // Save to history for multi-turn memory
            this.history.push({ sender: 'user', text: userText });
            this.history.push({ sender: 'assistant', text: aiReply });

            // Keep history lean (last 20 messages max)
            if (this.history.length > 20) this.history = this.history.slice(-20);

            this.showTypingIndicator(false);
            this.appendMessage('assistant', aiReply, actionCard);
            if (window.SoundEngine) window.SoundEngine.playSuccessChime();

        } catch (err) {
            this.showTypingIndicator(false);
            console.error('Advisor Error:', err);
            try {
                const ctx = this.extractFinancialContext(userText);
                const actionCard = this.buildFinancialCard(ctx);
                const fallbackReply = this.generateLocalSmartReply(userText, ctx);
                this.appendMessage('assistant', fallbackReply, actionCard);
            } catch (fallbackErr) {
                this.appendMessage('assistant', `أهلاً وسهلاً بيك عيوني.. تقدر تتواصل معانا مباشرة على الواتساب 💬 ونخدمك فوراً!`);
            }
        } finally {
            this.isProcessing = false;
        }
    },

    showTypingIndicator(show) {
        let el = document.getElementById('aiTypingIndicator');
        const container = document.getElementById('aiChatMessages');
        if (!container) return;
        if (show) {
            if (!el) {
                el = document.createElement('div');
                el.id = 'aiTypingIndicator';
                el.className = 'flex items-center gap-2 p-2.5 px-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 w-fit text-slate-300 text-xs shadow-md';
                el.innerHTML = `
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce"></span>
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]"></span>
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]"></span>
                    <span class="font-medium pr-1 text-[11px] text-emerald-400">ماكس يكتب لك الآن...</span>
                `;
                container.appendChild(el);
            }
            container.scrollTop = container.scrollHeight;
        } else {
            if (el) el.remove();
        }
    },

    appendMessage(sender, text, actionCard = null) {
        const container = document.getElementById('aiChatMessages');
        if (!container) return;

        const msgDiv = document.createElement('div');

        if (sender === 'user') {
            msgDiv.className = 'flex flex-col items-end space-y-1 ai-message-animate';
            const bubble = document.createElement('div');
            bubble.className = 'max-w-[85%] p-3 px-4 msg-bubble-user text-xs sm:text-sm font-semibold shadow-md leading-relaxed';
            bubble.textContent = text;
            msgDiv.appendChild(bubble);
        } else {
            msgDiv.className = 'flex items-start gap-2 max-w-[95%] ai-message-animate';
            
            // Mini Avatar with Max AI Icon
            const avatar = document.createElement('div');
            avatar.className = 'w-7 h-7 rounded-full bg-slate-950 p-0.5 border border-emerald-500/50 shadow-md shrink-0 mt-0.5';
            avatar.innerHTML = this.MAX_AI_ICON_SVG;
            msgDiv.appendChild(avatar);

            const contentWrapper = document.createElement('div');
            contentWrapper.className = 'flex flex-col space-y-1.5 flex-1';

            const bubble = document.createElement('div');
            bubble.className = 'p-3.5 px-4 msg-bubble-bot text-slate-100 text-xs sm:text-sm leading-relaxed shadow-lg';
            let formatted = text
                .replace(/\*\*(.*?)\*\*/g, '<strong class="text-emerald-400 font-extrabold">$1</strong>')
                .replace(/\*(.*?)\*/g, '<em class="text-amber-300">$1</em>')
                .replace(/•/g, '<span class="text-emerald-400 font-bold">•</span>')
                .replace(/\n/g, '<br>');
            bubble.innerHTML = formatted;

            contentWrapper.appendChild(bubble);

            // Luxury Digital Banking Action Card
            if (actionCard && sender === 'assistant') {
                const card = document.createElement('div');
                card.className = 'mt-2.5 p-4 rounded-2xl ai-fin-card shadow-2xl space-y-3 max-w-[92%] w-full ai-message-animate';
                const dpText = actionCard.downPayment > 0 
                    ? window.FinanceCalculator.formatIraqiShort(actionCard.downPayment) 
                    : 'بدون مقدمة';

                card.innerHTML = `
                    <div class="flex items-center justify-between pb-2.5 border-b border-slate-800/80">
                        <div class="flex items-center gap-2">
                            <div class="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
                                📱
                            </div>
                            <span class="text-xs font-black text-slate-100 font-heading tracking-tight">${actionCard.productName}</span>
                        </div>
                        <span class="px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-black font-mono">
                            خطة ${actionCard.months} شهر
                        </span>
                    </div>

                    ${actionCard.lifePerk ? `
                        <div class="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-[11px] text-emerald-300 font-bold flex items-center gap-1.5">
                            <span>${actionCard.lifePerk}</span>
                        </div>
                    ` : ''}
                    
                    <div class="grid grid-cols-2 gap-2 text-xs">
                        <div class="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80">
                            <span class="text-[10px] text-slate-400 block mb-0.5 font-medium">القسط الشهري الصافي:</span>
                            <span class="text-sm sm:text-base font-black text-emerald-400 font-mono tracking-tight">${window.FinanceCalculator.formatIraqiShort(actionCard.monthly)}</span>
                        </div>
                        <div class="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80">
                            <span class="text-[10px] text-slate-400 block mb-0.5 font-medium">المقدمة (الواصل):</span>
                            <span class="text-sm sm:text-base font-black text-amber-400 font-mono tracking-tight">${dpText}</span>
                        </div>
                    </div>

                    <div class="p-2 rounded-xl bg-slate-950/80 border border-slate-800/60 flex items-center justify-between text-xs">
                        <span class="text-[11px] text-slate-400">المجموع الكلي لكامل المدة:</span>
                        <span class="font-black text-slate-200 font-mono">${window.FinanceCalculator.formatIraqiShort(actionCard.total)}</span>
                    </div>

                    ${actionCard.savings > 0 ? `
                        <div class="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 font-bold flex items-center gap-1.5">
                            <span>💡</span>
                            <span>توفر <strong>${window.FinanceCalculator.formatIraqiShort(actionCard.savings)}</strong> إذا اخترت 10 أشهر بدلاً من 18!</span>
                        </div>
                    ` : ''}

                    <div class="flex items-center gap-2 pt-1">
                        <button type="button" onclick="window.MaxAIAdvisor.applyToCalculator(${actionCard.principal}, ${actionCard.downPayment}, ${actionCard.months}, '${actionCard.productName}')"
                                class="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer">
                            <span>تطبيق بالحاسبة</span>
                            <span>⚡</span>
                        </button>
                        <button type="button" onclick="window.MaxAIAdvisor.openWhatsAppForPlan(${actionCard.principal}, ${actionCard.downPayment}, ${actionCard.months}, '${actionCard.productName}', ${actionCard.monthly}, ${actionCard.total})"
                                class="py-2.5 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700/80 text-emerald-400 text-xs font-black transition flex items-center justify-center gap-1 active:scale-95 cursor-pointer shadow-sm">
                            <span>واتساب</span>
                            <span>💬</span>
                        </button>
                    </div>
                `;
                contentWrapper.appendChild(card);
            }

            msgDiv.appendChild(contentWrapper);
        }

        container.appendChild(msgDiv);
        container.scrollTop = container.scrollHeight;
    },

    applyToCalculator(principal, downPayment, months, productName) {
        const s = window.AppState;
        const els = window.AppElements;
        s.principal = principal;
        s.downPayment = downPayment;
        s.selectedPlan = months;
        if (productName) s.productName = productName;
        if (els?.inputPrincipal) els.inputPrincipal.value = principal;
        if (els?.inputDownPayment) els.inputDownPayment.value = downPayment;
        if (els?.inputProductName && productName) els.inputProductName.value = productName;
        this.toggleModal(false);
        if (window.render) window.render();
        if (window.selectPlan) window.selectPlan(months);
        if (window.showToast) window.showToast(`✨ تم تطبيق خطة (${months} شهر) في الحاسبة!`);
    },

    openWhatsAppForPlan(principal, downPayment, months, productName, monthly, total) {
        const storeName = window.AppState?.settings?.storeName || 'مكتب ماكس للتقسيط';
        const dpStr = downPayment > 0 ? window.FinanceCalculator.formatIraqiShort(downPayment) : 'بدون مقدمة';
        const text = encodeURIComponent(
            `السلام عليكم ${storeName} 💎\nأرغب بالاستفسار وحجز:\n` +
            `📱 الجهاز: ${productName || 'جهاز إلكتروني'}\n` +
            `💰 السعر نقداً: ${window.FinanceCalculator.formatNumber(principal)} د.ع\n` +
            `💵 المقدمة: ${dpStr}\n` +
            `🔴 الخطة: ${months} شهر\n` +
            `📆 القسط الشهري: ${window.FinanceCalculator.formatIraqiShort(monthly)}\n` +
            `💳 المجموع الكلي: ${window.FinanceCalculator.formatIraqiShort(total)}\n\n` +
            `يرجى تزويدي بإجراءات الاستلام. شكراً!`
        );
        let phone = window.AppState?.settings?.storePhone || '';
        phone = phone.replace(/\D/g, '');
        if (phone.startsWith('07')) phone = '964' + phone.substring(1);
        const url = phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
        window.open(url, '_blank');
    }
};

// Automatic self-init to guarantee instant activation
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (window.MaxAIAdvisor && typeof window.MaxAIAdvisor.init === 'function') {
            window.MaxAIAdvisor.init();
        }
    });
} else {
    if (window.MaxAIAdvisor && typeof window.MaxAIAdvisor.init === 'function') {
        window.MaxAIAdvisor.init();
    }
}
