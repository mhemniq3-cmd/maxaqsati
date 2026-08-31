/**
 * Finance Calculation Engine (IQD Only - No Fractions)
 * Supports:
 * 1. Platform & Manual Installments (10, 12, 14, 16, 18 Months)
 * 2. Rafidain Bank (Dynamic Customizable Rate - Default 8%)
 * 3. Ahli & Rasheed Bank (Dynamic Monthly Rate - Default 2%/mo)
 * 4. Pay at Salary (Dynamic Customer Fee & Merchant Fee)
 * 5. Real-time Iraqi Arabic Spoken Words Tafqeet
 */

window.FinanceCalculator = {

    /**
     * Spoken Iraqi Currency Phrasing (تفقيط دينار عراقي شعبي ومضبوط)
     */
    toIraqiSpokenWords(amount) {
        const val = Math.round(Number(amount) || 0);
        if (val <= 0) return '';

        if (val < 1000) {
            return `${val.toLocaleString('en-US')} دينار`;
        }

        const millions = Math.floor(val / 1000000);
        const remainderThousands = Math.floor((val % 1000000) / 1000);
        const remainderUnits = val % 1000;

        let parts = [];

        if (millions === 1) {
            parts.push('مليون');
        } else if (millions === 2) {
            parts.push('مليونين');
        } else if (millions >= 3 && millions <= 10) {
            parts.push(`${millions} ملايين`);
        } else if (millions > 10) {
            parts.push(`${millions.toLocaleString('en-US')} مليون`);
        }

        if (remainderThousands > 0) {
            parts.push(`${remainderThousands.toLocaleString('en-US')} الف`);
        }

        if (remainderUnits > 0) {
            parts.push(`${remainderUnits.toLocaleString('en-US')}`);
        }

        return `« ${parts.join(' و ')} دينار »`;
    },

    /**
     * Standard Multi-Month Plan Calculation (Platform / Manual)
     */
    calculatePlan({
        principal,
        downPayment = 0,
        downPaymentType = 'fixed',
        months,
        ratePercent = 0,
        calculationMode = 'flat',
        roundingMode = 'none'
    }) {
        const p = Math.max(0, Number(principal) || 0);
        let dp = Math.max(0, Number(downPayment) || 0);

        if (downPaymentType === 'percent') {
            dp = (p * dp) / 100;
        }
        dp = Math.min(p, dp);

        const rate = Math.max(0, Number(ratePercent) || 0);
        const m = Math.max(1, Number(months) || 12);

        let profit = 0;
        if (calculationMode === 'annual') {
            profit = p * (rate / 100) * (m / 12);
        } else {
            profit = p * (rate / 100);
        }

        const fullGrandTotal = p + profit;
        const remainingForMonths = Math.max(0, fullGrandTotal - dp);
        let monthly = m > 0 ? remainingForMonths / m : 0;

        if (roundingMode === '1000') {
            monthly = Math.ceil(monthly / 1000) * 1000;
        } else if (roundingMode === '5000') {
            monthly = Math.ceil(monthly / 5000) * 5000;
        } else {
            monthly = Math.round(monthly);
        }

        const financed = Math.max(0, p - dp);

        return {
            originalPrincipal: Math.round(p),
            actualDownPayment: Math.round(dp),
            financedAmount: Math.round(financed),
            months: m,
            ratePercent: rate,
            profitAmount: Math.round(profit),
            totalRepayment: Math.round(fullGrandTotal),
            monthlyInstallment: Math.round(monthly),
            grandTotal: Math.round(fullGrandTotal)
        };
    },

    /**
     * Rafidain Bank: Dynamic Fixed Fee Rate (Default 8%)
     */
    calculateRafidain({ principal, downPayment = 0, ratePercent = 8 }) {
        const p = Math.max(0, Number(principal) || 0);
        const dp = Math.max(0, Number(downPayment) || 0);
        const rate = Number(ratePercent) || 8;
        const profit = p * (rate / 100);
        const fullTotal = p + profit;
        const remaining = Math.max(0, fullTotal - dp);

        return {
            originalPrincipal: Math.round(p),
            actualDownPayment: Math.round(dp),
            profitAmount: Math.round(profit),
            ratePercent: rate,
            months: 1,
            monthlyInstallment: Math.round(remaining),
            totalRepayment: Math.round(fullTotal),
            grandTotal: Math.round(fullTotal)
        };
    },

    /**
     * Ahli & Rasheed Bank: Dynamic Monthly Rate (Default 2%/mo)
     */
    calculateAhliRasheed({ principal, downPayment = 0, months = 6, monthlyRate = 2 }) {
        const p = Math.max(0, Number(principal) || 0);
        const dp = Math.max(0, Number(downPayment) || 0);
        const m = Number(months) || 6;
        const mRate = Number(monthlyRate) || 2;
        const rate = m * mRate;
        const profit = p * (rate / 100);
        const fullTotal = p + profit;
        const remaining = Math.max(0, fullTotal - dp);
        const monthly = m > 0 ? Math.round(remaining / m) : 0;

        return {
            originalPrincipal: Math.round(p),
            actualDownPayment: Math.round(dp),
            profitAmount: Math.round(profit),
            ratePercent: rate,
            months: m,
            monthlyInstallment: Math.round(monthly),
            totalRepayment: Math.round(fullTotal),
            grandTotal: Math.round(fullTotal)
        };
    },

    /**
     * Pay on Salary: Dynamic Customer Fee & Merchant Fee
     */
    calculateSalaryAdvance({ principal, customerFee = 2000, merchantFeePercent = 1 }) {
        const p = Math.max(0, Number(principal) || 0);
        const cFee = Number(customerFee) || 2000;
        const mFeePercent = Number(merchantFeePercent) || 1;
        const customerTotal = p + cFee;
        const merchantFeeAmount = p * (mFeePercent / 100);
        const merchantNet = p - merchantFeeAmount;

        return {
            originalPrincipal: Math.round(p),
            customerFee: cFee,
            customerTotal: Math.round(customerTotal),
            merchantFeePercent: mFeePercent,
            merchantFeeAmount: Math.round(merchantFeeAmount),
            merchantNet: Math.round(merchantNet)
        };
    },

    /**
     * Format numbers into clean Iraqi thousands notation
     */
    formatIraqiShort(amount) {
        const val = Math.round(amount || 0);
        if (val === 0) return '0';

        if (val >= 1000) {
            const inThousands = val / 1000;
            let formattedNumber = '';
            if (Number.isInteger(inThousands)) {
                formattedNumber = inThousands.toLocaleString('en-US');
            } else {
                formattedNumber = Number(inThousands.toFixed(1)).toLocaleString('en-US', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 1
                });
            }
            return `${formattedNumber} الف`;
        }
        return `${val.toLocaleString('en-US')} دينار`;
    },

    /**
     * Generate dynamic copyable template based on active system
     */
    generateFullTemplate({
        principal,
        downPayment,
        downPaymentType,
        system,
        otherSubService = 'all',
        rates,
        calculationMode = 'flat',
        roundingMode = 'none',
        productName = '',
        storeName = '',
        storePhone = '',
        storeAddress = ''
    }) {
        let output = '';
        if (productName && productName.trim()) {
            output += `📱 المنتج: ${productName.trim()}\n\n━━━━━━━━━━━━━━━━━━━━\n\n`;
        }

        const otherRates = (rates && rates.other) ? rates.other : window.InstallmentData.DEFAULT_RATES.other;

        if (system === 'platform' || system === 'manual') {
            const durations = [10, 12, 14, 16, 18];
            const planBlocks = [];

            durations.forEach(months => {
                const rate = (rates && rates[system] && rates[system][months]) ? rates[system][months] : 0;
                const calc = this.calculatePlan({
                    principal,
                    downPayment,
                    downPaymentType,
                    months,
                    ratePercent: rate,
                    calculationMode,
                    roundingMode
                });

                const durationTitle = months === 12 ? 'تقسيط 12 أشهر' : `تقسيط ${months} شهر`;
                const priceStr = `${this.formatNumber(calc.originalPrincipal)} دينار`;
                const downPaymentStr = calc.actualDownPayment > 0 ? this.formatIraqiShort(calc.actualDownPayment) : 'بدون مقدمة';
                const installmentStr = this.formatIraqiShort(calc.monthlyInstallment);
                const totalRepaymentShort = this.formatIraqiShort(calc.totalRepayment);

                const block = `🔴 ${durationTitle}\n\n` +
                              `💰 السعر النقدي: ${priceStr}\n\n` +
                              `💵 المقدمة: ${downPaymentStr}\n\n` +
                              `📆 الاستقطاع الشهري: ${installmentStr}\n\n` +
                              `💳 مجموع الأقساط: ${totalRepaymentShort}`;

                planBlocks.push(block);
            });

            output += planBlocks.join('\n\n━━━━━━━━━━━━━━━━━━━━\n\n');
        } else if (system === 'other') {
            const priceStr = `${this.formatNumber(principal)} دينار`;
            const blocks = [];

            // 1. Rafidain Bank
            if (otherSubService === 'all' || otherSubService === 'rafidain') {
                const raf = this.calculateRafidain({
                    principal,
                    downPayment,
                    ratePercent: otherRates.rafidain_rate
                });
                const blockRaf = `🏛️ عروض تقسيط موظفي (مصرف الرافدين) - فائدة ${raf.ratePercent}%:\n\n` +
                                 `💰 السعر النقدي: ${priceStr}\n\n` +
                                 `💵 المقدمة: ${raf.actualDownPayment > 0 ? this.formatIraqiShort(raf.actualDownPayment) : 'بدون مقدمة'}\n\n` +
                                 `💳 المبلغ المطلوب سداده بعد شهر واحد: ${this.formatIraqiShort(raf.monthlyInstallment)} (فائدة ${raf.ratePercent}%: ${this.formatIraqiShort(raf.profitAmount)})`;
                blocks.push(blockRaf);
            }

            // 2. Ahli & Rasheed Bank
            if (otherSubService === 'all' || otherSubService === 'ahli_rasheed') {
                const mRate = otherRates.ahli_rasheed_monthly;
                const ahli6 = this.calculateAhliRasheed({ principal, downPayment, months: 6, monthlyRate: mRate });
                const ahli9 = this.calculateAhliRasheed({ principal, downPayment, months: 9, monthlyRate: mRate });
                const ahli12 = this.calculateAhliRasheed({ principal, downPayment, months: 12, monthlyRate: mRate });

                const blockAhli = `🏦 عروض تقسيط موظفي (المصرف الأهلي / مصرف الرشيد) - ${mRate}% شهرياً:\n\n` +
                                  `💰 السعر النقدي: ${priceStr}\n\n` +
                                  `▫️ خطة 6 أشهر (${ahli6.ratePercent}%): الاستقطاع ${this.formatIraqiShort(ahli6.monthlyInstallment)} / شهر (المجموع: ${this.formatIraqiShort(ahli6.totalRepayment)})\n\n` +
                                  `▫️ خطة 9 أشهر (${ahli9.ratePercent}%): الاستقطاع ${this.formatIraqiShort(ahli9.monthlyInstallment)} / شهر (المجموع: ${this.formatIraqiShort(ahli9.totalRepayment)})\n\n` +
                                  `▫️ خطة 12 شهر (${ahli12.ratePercent}%): الاستقطاع ${this.formatIraqiShort(ahli12.monthlyInstallment)} / شهر (المجموع: ${this.formatIraqiShort(ahli12.totalRepayment)})`;
                blocks.push(blockAhli);
            }

            // 3. Pay on Salary
            if (otherSubService === 'all' || otherSubService === 'salary_advance') {
                const sal = this.calculateSalaryAdvance({
                    principal,
                    customerFee: otherRates.salary_customer_fee,
                    merchantFeePercent: otherRates.salary_merchant_fee
                });
                const blockSal = `🔵 خدمة الدفع عند الراتب (دفعة واحدة):\n\n` +
                                 `💰 سعر الجهاز: ${priceStr}\n\n` +
                                 `💳 المبلغ المطلوب استقطاعه عند نزول الراتب: ${this.formatNumber(sal.customerTotal)} د.ع\n` +
                                 `*(رسوم المعاملة ${this.formatNumber(sal.customerFee)} د.ع فقط)*`;
                blocks.push(blockSal);
            }

            output += blocks.join('\n\n━━━━━━━━━━━━━━━━━━━━\n\n');
        }

        // Store Signature Footer
        const storeDetails = [];
        if (storeName && storeName.trim()) storeDetails.push(`📍 متجر ${storeName.trim()}`);
        if (storeAddress && storeAddress.trim()) storeDetails.push(`العنوان: ${storeAddress.trim()}`);
        if (storePhone && storePhone.trim()) storeDetails.push(`📞 للحجز والاستفسار: ${storePhone.trim()}`);

        if (storeDetails.length > 0) {
            output += `\n\n━━━━━━━━━━━━━━━━━━━━\n` + storeDetails.join('\n');
        }

        return output;
    },

    formatNumber(amount) {
        return Math.round(amount || 0).toLocaleString('en-US');
    },

    formatCurrency(amount, symbol = 'د.ع') {
        return `${this.formatNumber(amount)} ${symbol}`;
    }
};
