// ===== التبويبات =====
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tool').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
    });
});

// دالة مساعدة لعرض النتيجة
function showResult(id, html) {
    const el = document.getElementById(id);
    el.innerHTML = html;
    el.classList.add('show');
}

// ===== 1. حساب الجرعات =====
function calcDose() {
    const w = parseFloat(document.getElementById('doseWeight').value);
    const d = parseFloat(document.getElementById('dosePerKg').value);
    const c = parseFloat(document.getElementById('doseConc').value);

    if (!w || !d) {
        showResult('doseResult', '⚠️ يرجى إدخال الوزن والجرعة');
        return;
    }
    const totalDose = w * d;
    let html = `الجرعة الكلية = <span class="highlight">${totalDose.toFixed(2)} mg</span>`;
    if (c) {
        html += `<br>الحجم المطلوب = <span class="highlight">${(totalDose / c).toFixed(2)} ml</span>`;
    }
    showResult('doseResult', html);
}

// ===== 2. حساب التخفيف =====
function calcDilution() {
    const c1 = parseFloat(document.getElementById('c1').value);
    const v1 = parseFloat(document.getElementById('v1').value);
    const c2 = parseFloat(document.getElementById('c2').value);
    const v2 = parseFloat(document.getElementById('v2').value);

    let result = '';
    if (isNaN(v1) && c1 && c2 && v2) {
        result = `V₁ = <span class="highlight">${((c2 * v2) / c1).toFixed(2)} ml</span>`;
    } else if (isNaN(c1) && v1 && c2 && v2) {
        result = `C₁ = <span class="highlight">${((c2 * v2) / v1).toFixed(2)} %</span>`;
    } else if (isNaN(v2) && c1 && v1 && c2) {
        result = `V₂ = <span class="highlight">${((c1 * v1) / c2).toFixed(2)} ml</span>`;
    } else if (isNaN(c2) && c1 && v1 && v2) {
        result = `C₂ = <span class="highlight">${((c1 * v1) / v2).toFixed(2)} %</span>`;
    } else {
        result = '⚠️ يرجى ترك حقل واحد فقط فارغاً وإدخال الباقي';
    }
    showResult('dilutionResult', result);
}

// ===== 3. BMI =====
function calcBMI() {
    const w = parseFloat(document.getElementById('bmiWeight').value);
    const h = parseFloat(document.getElementById('bmiHeight').value) / 100;

    if (!w || !h) {
        showResult('bmiResult', '⚠️ يرجى إدخال الوزن والطول');
        return;
    }
    const bmi = w / (h * h);
    let cat = '';
    if (bmi < 18.5) cat = 'نقص في الوزن';
    else if (bmi < 25) cat = 'وزن طبيعي ✅';
    else if (bmi < 30) cat = 'زيادة في الوزن';
    else cat = 'سمنة ⚠️';

    showResult('bmiResult',
        `BMI = <span class="highlight">${bmi.toFixed(1)}</span><br>التصنيف: <b>${cat}</b>`);
}

// ===== 4. تصفية الكرياتينين =====
function calcCrCl() {
    const age = parseFloat(document.getElementById('crAge').value);
    const weight = parseFloat(document.getElementById('crWeight').value);
    const scr = parseFloat(document.getElementById('crSerum').value);
    const gender = document.getElementById('crGender').value;

    if (!age || !weight || !scr) {
        showResult('crResult', '⚠️ يرجى ملء جميع الحقول');
        return;
    }
    let crcl = ((140 - age) * weight) / (72 * scr);
    if (gender === 'female') crcl *= 0.85;

    let note = '';
    if (crcl >= 90) note = 'وظيفة كلوية طبيعية';
    else if (crcl >= 60) note = 'قصور كلوي خفيف';
    else if (crcl >= 30) note = 'قصور كلوي متوسط';
    else if (crcl >= 15) note = 'قصور كلوي شديد';
    else note = 'فشل كلوي';

    showResult('crResult',
        `CrCl = <span class="highlight">${crcl.toFixed(1)} ml/min</span><br>التقييم: <b>${note}</b>`);
}

// ===== 5. نصف العمر =====
function calcHalfLife() {
    const c0 = parseFloat(document.getElementById('hlC0').value);
    const t = parseFloat(document.getElementById('hlT').value);
    const time = parseFloat(document.getElementById('hlTime').value);

    if (!c0 || !t || !time) {
        showResult('hlResult', '⚠️ يرجى ملء جميع الحقول');
        return;
    }
    const ct = c0 * Math.pow(0.5, time / t);
    const ke = Math.LN2 / t;
    showResult('hlResult',
        `التركيز المتبقي بعد ${time} ساعة = <span class="highlight">${ct.toFixed(3)} mg/L</span><br>
         ثابت الإطراح (kₑ) = <b>${ke.toFixed(4)} h⁻¹</b><br>
         عدد أنصاف العمر المنقضية = <b>${(time / t).toFixed(2)}</b>`);
}

// ===== 6. محول الوحدات =====
const units = {
    // الوزن - المرجع غرام
    g:   { type: 'mass', factor: 1 },
    mg:  { type: 'mass', factor: 0.001 },
    mcg: { type: 'mass', factor: 0.000001 },
    // الحجم - المرجع لتر
    L:   { type: 'vol', factor: 1 },
    ml:  { type: 'vol', factor: 0.001 }
};

function convertUnit() {
    const val = parseFloat(document.getElementById('convValue').value);
    const from = document.getElementById('convFrom').value;
    const to = document.getElementById('convTo').value;

    if (isNaN(val)) {
        showResult('convResult', '⚠️ يرجى إدخال قيمة صحيحة');
        return;
    }
    if (units[from].type !== units[to].type) {
        showResult('convResult', '⚠️ لا يمكن التحويل بين وحدات وزن وحجم مباشرة');
        return;
    }
    const result = val * units[from].factor / units[to].factor;
    showResult('convResult',
        `${val} ${from} = <span class="highlight">${result.toPrecision(6)} ${to}</span>`);
}