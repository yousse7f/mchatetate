/**
 * مصفوفة حسم التردد - الوظائف الرئيسية
 *
 * هذا السكربت يدير:
 * - إضافة العناصر والمعايير
 * -  اجراء عمليات
 * - حساب النتائج وعرضها
 * - عرض الرسم البياني للنتائج
 */

// -----------------------------
// الثوابت والمتغيرات العامة 
// -----------------------------
const items = [];             // قائمة العناصر المدخلة
const criteria = [];          // قائمة المعايير المدخلة (أسماء فقط)
const MAX_SCORE = 10;         // الدرجة القصوى لكل معيار
const MIN_SCORE = 1;          // الدرجة الدنيا لكل معيار
let chart = null;             // متغير لتخزين كائن الرسم Chart.js

// -----------------------------
// 1. إدارة البيانات
// -----------------------------

/**
 * ينشئ عنصرًا جديدًا ويهيئ درجاته لكل معيار بقيمة MIN_SCORE
 * @param {string} name - اسم العنصر الجديد
 */
function addItem(name) {
  if (!name) return;
  const newItem = { name, scores: {} };
  criteria.forEach(c => newItem.scores[c] = MIN_SCORE);
  items.push(newItem);
  renderTable();
}

/**
 * ينشئ معيارًا جديدًا ويهيئ درجاته في جميع العناصر بقيمة MIN_SCORE
 * @param {string} name - اسم المعيار الجديد
 */
function addCriterion(name) {
  if (!name) return;
  criteria.push(name);
  items.forEach(item => item.scores[name] = MIN_SCORE);
  renderTable();
}

/**
 * يحدث الدرجة المدخلة لعنصر معيّن ومعيار معيّن، مع الالتزام بالنطاق MIN_SCORE..MAX_SCORE
 * @param {number} itemIndex - فهرس العنصر في المصفوفة
 * @param {string} criterion - اسم المعيار
 * @param {number|string} value - القيمة الجديدة من حقل الإدخال
 */
function updateScore(itemIndex, criterion, value) {
  const numeric = Number(value) || MIN_SCORE;
  const clamped = Math.max(MIN_SCORE, Math.min(MAX_SCORE, numeric));
  items[itemIndex].scores[criterion] = clamped;
  renderTable();
}

// -----------------------------
// 2. حساب النتائج
// -----------------------------

/**
 * يحسب مجموع الدرجات والنسبة المئوية لكل عنصر
 * @returns {Array<{name:string, total:number, percent:number}>} قائمة النتائج مرتبة تنازليًا
 */
function calculateResults() {
  const maxTotal = criteria.length * MAX_SCORE;
  return items.map(item => {
    const total = criteria.reduce((sum, c) => sum + item.scores[c], 0);
    const percent = maxTotal ? (total / maxTotal * 100) : 0;
    return { name: item.name, total, percent: parseFloat(percent.toFixed(2)) };
  }).sort((a, b) => b.total - a.total);
}

// -----------------------------
// 3. العرض في الصفحة
// -----------------------------

/**
 * يبني ويعرض جدول المقارنة والدخلات لكل عنصر ومعيار
 */
function renderTable() {
  const theadRow = document.querySelector('#comparison-table thead tr');
  const tbody = document.querySelector('#comparison-table tbody');

  // رأس الجدول
  theadRow.innerHTML =
    '<th>العنصر</th>' +
    criteria.map(c => `<th>${c}</th>`).join('') +
    '<th>المجموع</th>';

  // جسم الجدول
  tbody.innerHTML = items.map((item, idx) => {
    const total = criteria.reduce((sum, c) => sum + item.scores[c], 0);
    const rowCells = criteria.map(c => {
      const safeName = encodeURIComponent(c);
      return `<td>
        <input
          type="number" min="${MIN_SCORE}" max="${MAX_SCORE}"
          value="${item.scores[c]}"
          oninput="this.value = Math.max(${MIN_SCORE}, Math.min(${MAX_SCORE}, this.value))"
          onchange="updateScore(${idx}, decodeURIComponent('${safeName}'), this.value)"
        />
      </td>`;
    }).join('');

    return `<tr>
      <td>${item.name}</td>
      ${rowCells}
      <td>${total}</td>
    </tr>`;
  }).join('');
}

// -----------------------------
// 4. عرض النتائج والتوصيات
// -----------------------------

/**
 * ينشئ الملخص، التوصيات، ويرسم الرسم البياني
 */
function showResults() {
  const results = calculateResults();
  if (!results.length) return;

  const best = results[0];
  document.getElementById('summary-text').textContent =
    `العنصر: ${best.name} هو الأعلى بمجموع ${best.total} ونسبة ${best.percent}%`;

  const recList = document.getElementById('recommendations-list');
  recList.innerHTML = '';

  // بناء التوصيات بناءً على الدرجات غير القصوى
  criteria.forEach(c => {
    const score = items.find(it => it.name === best.name).scores[c];
    if (score < MAX_SCORE) {
      const improvement = Math.round((MAX_SCORE - score) / MAX_SCORE * 100);
      const li = document.createElement('li');
      li.textContent = `معيار "${c}" للعنصر "${best.name}" يساوي ${score} من ${MAX_SCORE}؛ يُنصح بتحسينه بنسبة ${improvement}%`;
      recList.appendChild(li);
    }
  });

  if (!recList.hasChildNodes()) {
    recList.innerHTML = `<li>جميع معايير العنصر "${best.name}" مكتملة، لا توجد توصيات.</li>`;
  }

  drawChart(results);
}

// -----------------------------
// 5. الرسم البياني
// -----------------------------

/**
 * يرسم مخططًا شريطيًا أفقيًا للنتائج باستخدام Chart.js
 * @param {Array<{name:string, total:number}>} data - قائمة النتائج
 */

function drawChart(data) {
  const ctx = document.getElementById('chart');
  const labels = data.map(d => d.name);
  const values = data.map(d => d.total);

  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets: [{ label: 'المجموع', data: values }] },
    options: { indexAxis: 'y', scales: { x: { beginAtZero: true } } }
  });
}

// -----------------------------
// 6. تهيئة المعاملة مع الواجهة
// -----------------------------

/**
 * يربط الأزرار بوظائفها المناسبة عند التحميل
 */
function bindUIActions() {
  document.getElementById('add-item-btn').addEventListener('click', () => {
    const input = document.getElementById('new-item-name');
    addItem(input.value.trim());
    input.value = '';
  });

  document.getElementById('add-criterion-btn').addEventListener('click', () => {
    const input = document.getElementById('new-criterion-name');
    addCriterion(input.value.trim());
    input.value = '';
  });

  document.getElementById('calculate-btn').addEventListener('click', showResults);

  document.getElementById('alertOverlay').querySelector('button')
    .addEventListener('click', closeAlert);
}

/**
 *نافذة الترحيب ووصف البرنامج ثم التالي ينقلك الى نافذة التنبيه  
 */



function handleAlert() {
  const overlay = document.getElementById('alertOverlay');
  const step = Number(overlay.dataset.step);

  if (step === 1) {
    // الخطوة الثانية: عرض التعليمات
    overlay.querySelector('.alert-box').innerHTML = `
        <div class="alert-box">
            <h2>تنبيه !!</h2>
            <p>إقرأ التعليمات قبل البدء .</p>
            <ul type="square" id="alerts">
                <li>قم بإدخال العنصر الذي تريد مقارنته</li>
                <li>قم بإدخال معيار المفاضلة</li>
            </ul>
            <button onclick="handleAlert()">فهمت</button>
        </div>
    `;
    overlay.dataset.step = "2";

  } else {
    // الخطوة الثالثة: إغلاق النافذة
    overlay.style.display = 'none';
  }
}



/**
 *نافذة الترحيب ووصف البرنامج ثم التالي ينقلك الى نافذة التنبيه  
 */

 
// ----------------------------------------

// 1.  دالة الطباعة 
document.getElementById("print-report").addEventListener("click", function () {
  const results = calculateResults();
  const best = results[0] || { name: '-', total: 0, percent: 0 };
  const c = criteria[0] || '-';
  const score = items.find(it => it.name === best.name).scores[c] || 0;
  const improvement = Math.round((MAX_SCORE - score) / MAX_SCORE * 100) || 0;

        // اخفاء div result المتكرر
    const resultDiv = document.getElementById("result");
    if (resultDiv) {  
        resultDiv.style.display = 'none';
    }
  // اخفاء زر الرجوع عند الطباعة
  const backButton = document.getElementById("to-bake");
  if (backButton) {
    backButton.style.display = 'none';
  }
  const printContent = document.getElementById("body").innerHTML;
 // إنشاء نافذة جديدة للطباعة
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  printWindow.document.open();
  printWindow.document.write(`
    <style>
        body {direction: rtl;}
    </style>
    <link rel="stylesheet" href="style.css">
    <header id="main-header">
        <h1><i class="fa-solid fa-table-list"></i> قراري </h1>
        <h3> تقرير</h3>
    </header>
        ${printContent}
        <div id="result">
            <div id="summary">
                <h6>الخيار الأفضل لك هو: </h6>
                <p id="summary-text">العنصر: ${best.name} هو الأعلى بمجموع ${best.total} ونسبة ${best.percent}%</p>
            </div>
            <div id="recommendations">
                <h6>إن أردت تطوير بعض المعايير إليك&nbsp;التوصيات</h6>
                <ul id="recommendations-list"><li>معيار "${c}" للعنصر "${best.name}" يساوي ${score} من ${MAX_SCORE}؛ يُنصح بتحسينه بنسبة ${improvement}%</li></ul>
            </div>
            <div id="chart-container">
                <canvas id="chart" width="429" height="214" style="display: block; box-sizing: border-box; height: 130px; width: 260px;"></canvas>
            </div>
            <hr>
            <br>

        </div>
        <h1 style="color:red"; text-align: center;>هذا التقرير تجريبي فقط </h1>

  <footer id="main-footer">
        <p>جميع الحقوق محفوظة &copy; 2025 </p>
        <p>فكرة د. يوسف الجابري</p>
        <p> برمجة : يوسف محمد عبد الله</p>
    </footer>

  `);


  printWindow.document.close();
  printWindow.focus();
  // الانتظار حتى يتم تحميل المحتوى في النافذة الجديدة  
  printWindow.onload = function () {
    // بدء الطباعة  
    printWindow.print();
    // إغلاق نافذة الطباعة بعد الانتهاء
    printWindow.close();
  };
  // إظهار زر الرجوع بعد الطباعة)
  setTimeout(() => {
    if (backButton) {
      backButton.style.display = 'block';
    }
  }, 1000);
});


// --------------------------------------

// 3. دالة الحفظ – save-report
/*
document.getElementById("save-report").addEventListener("click", function () {
    const reportData = document.getElementById("body").innerHTML;
    const timeStamp = new Date().toLocaleString();

    let savedReports = JSON.parse(localStorage.getItem("reportList")) || [];

    savedReports.push({
        content: reportData,
        savedAt: timeStamp
    });

    localStorage.setItem("reportList", JSON.stringify(savedReports));
    alert("تم حفظ التقرير بنجاح.");
});
*/

// 2. دالة الحفظ – save-report بعد التعديل حفظ كل البيانات
document.getElementById("save-report").addEventListener("click", function () {
    const results = calculateResults();
    const best = results[0] || { name: '-', total: 0, percent: 0 };
    const c = criteria[0] || '-';
    const score = items.find(it => it.name === best.name).scores[c] || 0;
    const improvement = Math.round((MAX_SCORE - score) / MAX_SCORE * 100) || 0;

    // اخفاء زر الرجوع عند الطباعة
    const backButton = document.getElementById("to-bake");
    if (backButton) {
        backButton.style.display = 'none';
    }

    // إنشاء محتوى التقرير
    const reportData = `
        ${document.getElementById("body").innerHTML}
        <div id="result">
            <div id="summary">
                <h6>الخيار الأفضل لك هو: </h6>
                <p id="summary-text">العنصر: ${best.name} هو الأعلى بمجموع ${best.total} ونسبة ${best.percent}%</p>
            </div>
            <div id="recommendations">
                <h6>إن أردت تطوير بعض المعايير إليك&nbsp;التوصيات</h6>
                <ul id="recommendations-list"><li>معيار "${c}" للعنصر "${best.name}" يساوي ${score} من ${MAX_SCORE}؛ يُنصح بتحسينه بنسبة ${improvement}%</li></ul>
            </div>
            <div id="chart-container">
                <canvas id="chart" width="429" height="214" style="display: block; box-sizing: border-box; height: 130px; width: 260px;"></canvas>
            </div>
            <hr>
            <br>
        </div>
    `;
    const timeStamp = new Date().toLocaleString();
    let savedReports = JSON.parse(localStorage.getItem("reportList")) || [];
    savedReports.push({
        content: reportData,
        savedAt: timeStamp
    });
    localStorage.setItem("reportList", JSON.stringify(savedReports));
    alert("تم حفظ التقرير بنجاح.");
   
    });

 
    // إظهار زر الحذف بعد الطباعة   



   
// --------------------------------------


// دالة عرض كل البيانات المخزنة في اللوكال ستوريج 
document.getElementById("show-btn").addEventListener("click", function () {
    // إخفاء العناصر غير الضرورية عند عرض التقارير
    document.querySelectorAll('#header, #show-btn, #save-report, #calculate-btn').forEach(el => {
        if (el) el.style.display = 'none';
    });

    const data = localStorage.getItem("reportList");

    if (!data) {
        alert("لا توجد تقارير محفوظة.");
        return;
    }

    const reports = JSON.parse(data);

    // بناء HTML للتقارير على شكل جدول
    let html = `
        <header id="main-header">
            <h3>التقارير المحفوظة</h3>
        </header>
        <div class="table-report">
            <table class="table">
                <thead>
                    <tr>
                        <th>م</th>
                        <th>عرض</th>
                        <th>العنوان</th>
                        <th>تاريخ الحفظ</th>
                        <th>تحديد</th>
                    </tr>
                </thead>
                <tbody>
    `;

    reports.forEach((report, index) => {
        html += `
            <tr>
                <td>${index + 1}</td>
                <td><a href="#" onclick="showReport(${index}); return false;">عرض</a></td>
                <td>تقرير ${index + 1}</td>
                <td>${report.savedAt}</td>
                <td><input type="checkbox" class="select-report" data-index="${index}"></td>
            </tr>
        `;
    });

    // إغلاق الجدول والعناصر
    html += `
                </tbody>
            </table>
        </div>

    `;

    // عرض المحتوى في الصفحة
    const bodyEl = document.getElementById("body");
    if (bodyEl) {
        bodyEl.innerHTML = html + ``;
    } else {
        console.warn("لم يتم العثور على العنصر الذي يحتوي id='body'");
    }
});

// دالة عرض التقرير المحدد 
function showReport(index) {
      // اخفاء div result المتكرر
    const resultDiv = document.getElementById("result");
    if (resultDiv) {  
        resultDiv.style.display = 'none';
    }
  
    const data = localStorage.getItem("reportList");
    if (!data) {
        alert("لا توجد تقارير محفوظة.");
        return;
    }
    const reports = JSON.parse(data);
    const report = reports[index];

    document.getElementById("body").innerHTML = `
        <header>
            <h3>تفاصيل التقرير رقم ${index + 1}</h3>
        </header>
        <div>${report.content}</div>
        <button id="to-bake"onclick="location.reload()">رجوع</button>
    `;

    // طباعة التقرير المعروض من خلال زر الطباعة الموجود في الصفحة id="print-report"
    const printButton = document.getElementById("print-report");
    if (printButton) {
      printButton.addEventListener("click", function () {
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        printWindow.document.open();
        printWindow.document.write(`
              <style>
        body {direction: rtl;}
    </style>
    <link rel="stylesheet" href="style.css">
    <header id="main-header">
        <h1><i class="fa-solid fa-table-list"></i> قراري </h1>
        <h3> تقرير</h3>
    </header>
              ${report.content}
    <footer id="main-footer">
        <p>جميع الحقوق محفوظة &copy; 2025 </p>
        <p>فكرة د. يوسف الجابري</p>
        <p> برمجة : يوسف محمد عبد الله</p>
    </footer>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.onload = function () {
          printWindow.print();
          printWindow.close();
        };
      });
    }

    // حذف التقرير المحدد من خلال زر الحذف الموجود في الصفحة id="delete-btn"
    const deleteButton = document.getElementById("delete-btn");
    if (deleteButton) {
        deleteButton.addEventListener("click", function () {
            if (confirm("هل أنت متأكد أنك تريد حذف هذا التقرير؟")) {
                let savedReports = JSON.parse(localStorage.getItem("reportList")) || [];
                savedReports.splice(index, 1);
                localStorage.setItem("reportList", JSON.stringify(savedReports));
                alert("تم حذف التقرير.");
                location.reload();
            }
        });
    }
    
}

// منع ضهور نافذة الترحيب  والتنبيها عند الرجوع
// document.getElementById("to-bake").addEventListener("click", function () {
//     const overlay = document.getElementById('alertOverlay');
//     overlay.style.display = 'none';
//     overlay.dataset.step = "1"; // إعادة تعيين الخطوة
// });


// دالة حذف جميع التقارير المحفوظة نسخة قديمة
// document.getElementById("delete-btn").addEventListener("click", function () {
//     if (confirm("هل أنت متأكد أنك تريد حذف جميع التقارير المحفوظة؟")) {
//         localStorage.removeItem("reportList");
//         alert("تم حذف جميع التقارير.");
//     }
// });


//  عند تحديد الكل او الحذف بشكل عام  او تحديد تقرير معين دالة حذف كل البيانات المخزنة في اللوكال ستوريج  
document.getElementById("delete-btn").addEventListener("click", function () {
    const checkboxes = document.querySelectorAll('.select-report');
    const selectedReports = Array.from(checkboxes).filter(cb => cb.checked);

    if (selectedReports.length === 0) {
        alert("يرجى تحديد تقرير واحد على الأقل للحذف.");
        return;
    }

    if (confirm("هل أنت متأكد أنك تريد حذف التقارير المحددة؟")) {
        let savedReports = JSON.parse(localStorage.getItem("reportList")) || [];

        // حذف من الأعلى للأسفل لمنع اضطراب المؤشرات
        selectedReports
            .map(cb => parseInt(cb.dataset.index))
            .sort((a, b) => b - a)
            .forEach(index => {
                savedReports.splice(index, 1);
            });

        localStorage.setItem("reportList", JSON.stringify(savedReports));
        alert("تم حذف التقارير المحددة.");
        location.reload();
    }
});


// تهيئة الجدول وربط الواجهة بعد التحميل
renderTable();
bindUIActions();
