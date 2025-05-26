// // تعريف المتغيرات الأساسية والمصفوفات والثوابت المستخدمة في التطبيق
// const items = [];           // قائمة العناصر التي سيتم تقييمها
// const criteria = [];        // قائمة المعايير المستخدمة للمقارنة
// const MAX_SCORE = 10;       // الحد الأعلى للتقييم
// const MIN_SCORE = 1;        // الحد الأدنى للتقييم
// let chart = null;           // متغير للرسم البياني (ستتم تهيئته لاحقاً)

// // إخفاء زر الحذف افتراضياً إذا كان موجوداً
// const deleteButton = document.getElementById("delete-btn");
// if (deleteButton) deleteButton.style.display = "none";

// /**
//  * دالة لإضافة عنصر جديد.
//  * @param {string} name - اسم العنصر المضاف.
//  */
// function addItem(name) {
//   if (!name) return;
//   // إنشاء عنصر جديد مع قيم التقييم الابتدائية لكل معيار
//   const newItem = { name, scores: {} };
//   criteria.forEach(c => newItem.scores[c] = MIN_SCORE);
//   items.push(newItem);
//   renderTable(); // إعادة رسم الجدول بعد الإضافة
// }


// /**
//  * دالة لإضافة معيار جديد.
//  * @param {string} name - اسم المعيار المضاف.
//  */
// function addCriterion(name) {
//   if (!name) return;
//   criteria.push(name);
//   // تعيين التقييم الابتدائي للعنصر الحالي لكل معيار يتم إضافته
//   items.forEach(item => item.scores[name] = MIN_SCORE);
//   renderTable(); // إعادة رسم الجدول بعد التحديث
// }

// /**
//  * دالة لتحديث تقييم عنصر معين لمعيار محدد.
//  * @param {number} itemIndex - فهرس العنصر في القائمة.
//  * @param {string} criterion - اسم المعيار.
//  * @param {number|string} value - القيمة الجديدة للتقييم.
//  */
// function updateScore(itemIndex, criterion, value) {
//   const numeric = Number(value) || MIN_SCORE;
//   // التأكد من أن القيمة ضمن الحدود المسموح بها
//   items[itemIndex].scores[criterion] = Math.max(MIN_SCORE, Math.min(MAX_SCORE, numeric));
//   renderTable(); // إعادة رسم الجدول بعد التحديث
// }

// /**
//  * دالة لحساب النتائج النهائية لكل عنصر.
//  * @returns {Array<Object>} - قائمة بالنتائج تحتوي على اسم العنصر، مجموع النقاط والنسبة المئوية.
//  */
// function calculateResults() {
//   const maxTotal = criteria.length * MAX_SCORE; // الحساب الأقصى للمجموع لكل عنصر
//   return items.map(item => {
//     // حساب مجموع النقاط للعنصر عبر جميع المعايير
//     const total = criteria.reduce((s, c) => s + item.scores[c], 0);
//     const percent = maxTotal ? (total / maxTotal) * 100 : 0;
//     return { name: item.name, total, percent: +percent.toFixed(2) };
//   }).sort((a, b) => b.total - a.total); // ترتيب العناصر من الأعلى نحو الأدنى


// }

// /**
//  * دالة لإعادة رسم الجدول الذي يعرض العناصر ومعايير التقييم.
//  */
// function renderTable() {
//   const head = document.querySelector("#comparison-table thead tr");
//   const body = document.querySelector("#comparison-table tbody");
//   // إنشاء الرأس الديناميكي للجدول اعتماداً على قائمة المعايير
//   head.innerHTML = `<th>العنصر</th>${criteria.map(c => `<th>${c}</th>`).join("")}<th>المجموع</th>`;
  
//   // إنشاء جسم الجدول مع حقول الإدخال لتحديث القيم
//   body.innerHTML = items.map((item, idx) => {
//     const total = criteria.reduce((s, c) => s + item.scores[c], 0);
//     const cells = criteria.map(c => `<td>
//       <input type="number" min="${MIN_SCORE}" max="${MAX_SCORE}" value="${item.scores[c]}"
//         oninput="this.value = Math.max(${MIN_SCORE}, Math.min(${MAX_SCORE}, this.value))"
//         onchange="updateScore(${idx}, decodeURIComponent('${encodeURIComponent(c)}'), this.value)" />
//     </td>`).join("");
//     return `<tr><td>${item.name}</td>${cells}<td>${total}</td></tr>`;
//   }).join("");
// }

// /**
//  * دالة لعرض النتائج النهائية والتوصيات بناءً على أعلى تقييم.
//  */
// function showResults() {
//   const results = calculateResults();
//   if (!results.length) return;
//   // اختيار العنصر الذي حصل على أعلى مجموع
//   const best = results[0];
//   const summary = document.getElementById("summary-text");
//   if (summary) summary.textContent = `العنصر: ${best.name} هو الأعلى بمجموع ${best.total} ونسبة ${best.percent}%`;
  
//   // إنشاء قائمة التوصيات لتحسين المعايير غير المكتملة
//   const recList = document.getElementById("recommendations-list");
//   recList.innerHTML = "";
//   criteria.forEach(c => {
//     const score = items.find(i => i.name === best.name).scores[c];
//     if (score < MAX_SCORE) {
//       const improvement = Math.round(((MAX_SCORE - score) / MAX_SCORE) * 100);
//       const li = document.createElement("li");
//       li.textContent = `معيار "${c}" للعنصر "${best.name}" يساوي ${score} من ${MAX_SCORE}؛ يُنصح بتحسينه بنسبة ${improvement}%`;
//       recList.appendChild(li);
//     }
//   });
//   if (!recList.hasChildNodes()) recList.innerHTML = `<li>معايير العنصر "${best.name}" مكتملة، لا توجد توصيات.</li>`;
  
//   // رسم الرسم البياني للنتائج
//   drawChart(results);
// }

// /**
//  * دالة لرسم الرسم البياني باستخدام مكتبة Chart.js.
//  * @param {Array<Object>} data - بيانات النتائج التي سيتم استخدامها في الرسم.
//  */
// function drawChart(data) {
//   const ctx = document.getElementById("chart"),
//         labels = data.map(d => d.name),
//         values = data.map(d => d.total);
//   if (chart) chart.destroy();
//   chart = new Chart(ctx, {
//     type: "bar",
//     data: { labels, datasets: [{ label: "المجموع", data: values }] },
//     options: { indexAxis: "y", scales: { x: { beginAtZero: true } } }
//   });
// }

// /**
//  * دالة لربط إجراءات واجهة المستخدم (Event Listeners) بالعناصر المناسبة.
//  */
// function bindUIActions() {
//   // ربط زر إضافة عنصر
//   document.getElementById("add-item-btn")?.addEventListener("click", () => {
//     const input = document.getElementById("new-item-name");
//     addItem(input.value.trim());
//     input.value = "";
//   });
//   // ربط زر إضافة معيار
//   document.getElementById("add-criterion-btn")?.addEventListener("click", () => {
//     const input = document.getElementById("new-criterion-name");
//     addCriterion(input.value.trim());
//     input.value = "";
//   });
//   // ربط زر حساب النتائج والتوصيات
//   document.getElementById("calculate-btn")?.addEventListener("click", showResults);
//   // ربط زر إغلاق التنبيه في النافذة المنبثقة
//   document.getElementById("alertOverlay")?.querySelector("button")?.addEventListener("click", closeAlert);
// }

// /**
//  * عند تحميل المحتوى الكامل للمستند، يتم إنشاء النافذة المنبثقة لعرض التعليمات.
//  */
// document.addEventListener("DOMContentLoaded", () => {
//   // إنشاء عنصر التراكب (Overlay) للنافذة المنبثقة
//   const overlay = document.createElement("div");
//   overlay.id = "alertOverlay";
//   overlay.className = "overlay";
//   overlay.dataset.step = "1";
  
//   // إنشاء صندوق التنبيه وتضمينه داخل التراكب
//   const box = document.createElement("div");
//   box.className = "alert-box";
//   overlay.appendChild(box);
//   document.body.appendChild(overlay);
  
//   // قوالب التنبيه المختلفة (كل خطوة تحتوي على محتوى مختلف)
//   const templates = {
//     1: `<p>هل تواجه صعوبة في اتخاذ قرار مصيري؟</p>
//         <p>هل تحتار بين خيارات مثل التجارة، الوظيفة، الزواج أو السفر؟</p>
//         <p>تحليل واضح ومتوازن يزيل عنك التردد ويقودك إلى القرار الصحيح بثقة ويقين.
//         <br>"قراري" هي أداة ذكية تساعدك على تقييم الخيارات من 1 إلى 10.</p>
//         <p>ابدأ رحلتك نحو الوضوح - واتخذ قرارك الدقيق</p>
//         <button id="alertNext">التالي</button>`,
//     2: `<h2>تنبيه !!</h2>
//         <p>إقرأ التعليمات قبل البدء.</p>
//         <ul><li>أدخل العنصر الذي تريد مقارنته</li><li>أدخل معيار المفاضلة</li></ul>
//         <button id="alertNext">فهمت</button>`
//   };
  
//   /**
//    * دالة للتنقل بين خطوات التنبيه.
//    */
//   const handleAlert = () => {
//     const step = +overlay.dataset.step;
//     if (templates[step]) {
//       box.innerHTML = templates[step];
//       overlay.dataset.step = step + 1;
//       box.querySelector("#alertNext").onclick = handleAlert;
//     } else overlay.style.display = "none";
//   };
//   handleAlert();
// });

// // إجراءات متعلقة بطباعة التقرير عند النقر على زر "print-report"
// document.getElementById("print-report")?.addEventListener("click", () => {
//   // إعادة حساب النتائج واستخراج أفضل عنصر وتفاصيله
//   const results = calculateResults(),
//         best = results[0] || { name: "-", total: 0, percent: 0 },
//         c = criteria[0] || "-",
//         score = items.find(i => i.name === best.name)?.scores[c] || 0,
//         improvement = Math.round(((MAX_SCORE - score) / MAX_SCORE) * 100) || 0;
  
//   // إخفاء بعض العناصر أثناء عملية الطباعة
//   const resultDiv = document.getElementById("result");
//   if (resultDiv) resultDiv.style.display = "none";
//   const backButton = document.getElementById("to-bake");
//   if (backButton) backButton.style.display = "none";
  
//   // محتوى التقرير الذي سيظهر في نافذة الطباعة الجديدة
//   const printContent = document.getElementById("body").innerHTML,
//         printWindow = window.open("", "_blank", "width=800,height=600");
//   printWindow.document.open();
//   printWindow.document.write(`
//     <style>body { direction: rtl; }</style>
//     <link rel="stylesheet" href="style.css">
//     <header id="main-header">
//       <h1><i class="fa-solid fa-table-list"></i> قراري </h1>
//       <h3> تقرير</h3>
//     </header>
//     ${printContent}
//     <div id="result">
//       <div id="summary">
//         <h6>الخيار الأفضل لك هو: </h6>
//         <p id="summary-text">العنصر: ${best.name} هو الأعلى بمجموع ${best.total} ونسبة ${best.percent}%</p>
//       </div>
//       <div id="recommendations">
//         <h6>إن أردت تطوير بعض المعايير إليك التوصيات</h6>
//         <ul id="recommendations-list">
//           <li>معيار "${c}" للعنصر "${best.name}" يساوي ${score} من ${MAX_SCORE}؛ يُنصح بتحسينه بنسبة ${improvement}%</li>
//         </ul>
//       </div>
//       <div id="chart-container">
//         <canvas id="chart" width="429" height="214" style="display:block; box-sizing:border-box; height:130px; width:260px;"></canvas>
//       </div>
//       <hr>
//       <br>
//     </div>
//     <h1 style="color:red; text-align:center;">هذا التقرير تجريبي فقط</h1>
//     <footer id="main-footer">
//       <p>جميع الحقوق محفوظة &copy; 2025</p>
//       <p>فكرة د. يوسف الجابري</p>
//       <p>برمجة: يوسف محمد عبد الله</p>
//     </footer>
//   `);
//   printWindow.document.close();
//   printWindow.focus();
//   printWindow.onload = () => {
//     printWindow.print();
//     printWindow.close();
//   };
//   // إعادة إظهار الزر بعد عملية الطباعة
//   setTimeout(() => { if (backButton) backButton.style.display = "block"; }, 1000);
// });

// // إجراء حفظ التقرير عند النقر على زر "save-report"
// document.getElementById("save-report")?.addEventListener("click", () => {
//   const results = calculateResults(),
//         best = results[0] || { name: "-", total: 0, percent: 0 },
//         c = criteria[0] || "-",
//         score = items.find(i => i.name === best.name)?.scores[c] || 0,
//         improvement = Math.round(((MAX_SCORE - score) / MAX_SCORE) * 100) || 0;
//   const backButton = document.getElementById("to-bake");
//   if (backButton) backButton.style.display = "none";
  
//   // محتوى التقرير الذي سيتم حفظه في التخزين المحلي
//   const reportData = `
//     ${document.getElementById("body").innerHTML}
//     <div id="result">
//       <div id="summary">
//         <h6>الخيار الأفضل لك هو: </h6>
//         <p id="summary-text">العنصر: ${best.name} هو الأعلى بمجموع ${best.total} ونسبة ${best.percent}%</p>
//       </div>
//       <div id="recommendations">
//         <h6>إن أردت تطوير بعض المعايير إليك التوصيات</h6>
//         <ul id="recommendations-list">
//           <li>معيار "${c}" للعنصر "${best.name}" يساوي ${score} من ${MAX_SCORE}؛ يُنصح بتحسينه بنسبة ${improvement}%</li>
//         </ul>
//       </div>
//       <div id="chart-container">
//         <canvas id="chart" width="429" height="214" style="display:block; box-sizing:border-box; height:130px; width:260px;"></canvas>
//       </div>
//       <hr>
//       <br>
//     </div>
//   `;
//   const timeStamp = new Date().toLocaleString(),
//         savedReports = JSON.parse(localStorage.getItem("reportList")) || [];
//   savedReports.push({ content: reportData, savedAt: timeStamp });
//   localStorage.setItem("reportList", JSON.stringify(savedReports));
//   alert("تم حفظ التقرير بنجاح.");
// });

// // عرض قائمة التقارير المحفوظة عند النقر على زر "show-btn"
// document.getElementById("show-btn")?.addEventListener("click", () => {
//   if (deleteButton) deleteButton.style.display = "block";
//   // إخفاء بعض الأزرار عند عرض التقارير
//   document.querySelectorAll("#header, #show-btn, #save-report, #calculate-btn")
//     .forEach(el => { if (el) el.style.display = "none"; });
//   const data = localStorage.getItem("reportList");
//   if (!data) { alert("لا توجد تقارير محفوظة."); return; }
//   const reports = JSON.parse(data);
//   let html = `
//     <header id="main-header"><h3>التقارير المحفوظة</h3></header>
//     <div class="table-report">
//       <table class="table">
//         <thead>
//           <tr>
//             <th>م</th>
//             <th>عرض</th>
//             <th>العنوان</th>
//             <th>تاريخ الحفظ</th>
//             <th>تحديد</th>
//           </tr>
//         </thead>
//         <tbody>
//   `;
//   // إنشاء صف لكل تقرير محفوظ مع زر "عرض" وخانة اختيار
//   reports.forEach((r, i) => {
//     html += `
//       <tr>
//         <td>${i + 1}</td>
//         <td><a href="#" onclick="showReport(${i}); return false;">عرض</a></td>
//         <td>تقرير ${i + 1}</td>
//         <td>${r.savedAt}</td>
//         <td><input type="checkbox" class="select-report" data-index="${i}"></td>
//       </tr>
//     `;
//   });
//   html += `</tbody></table></div>`;
//   const bodyEl = document.getElementById("body");
//   if (bodyEl) bodyEl.innerHTML = html;
// });

// // طباعة التقارير المحددة عند النقر على زر "print-report" في شاشة التقارير
// document.getElementById("print-report")?.addEventListener("click", () => {
//   const checkboxes = document.querySelectorAll(".select-report"),
//         selected = Array.from(checkboxes).filter(cb => cb.checked);
//   if (selected.length === 0) { alert("يرجى تحديد تقرير واحد على الأقل للطباعة."); return; }
//   selected.forEach(cb => {
//     const i = parseInt(cb.dataset.index),
//           report = JSON.parse(localStorage.getItem("reportList"))[i],
//           win = window.open("", "_blank", "width=800,height=600");
//     win.document.open();
//     win.document.write(`
//       <style>body { direction: rtl; }</style>
//       <link rel="stylesheet" href="style.css">
//       ${report.content}
//     `);
//     win.document.close();
//     win.focus();
//     win.onload = () => { win.print(); win.close(); };
//   });
// });



// /**
//  * دالة لعرض تقرير مفصل عند اختيار أحد التقارير من القائمة.
//  * @param {number} index - فهرس التقرير في قائمة التقارير المخزنة.
//  */
// function showReport(index) {
//   const resultDiv = document.getElementById("result");
//   if(resultDiv) resultDiv.style.display = "none";
//   const data = localStorage.getItem("reportList");
//   if(!data){ alert("لا توجد تقارير محفوظة."); return; }
//   const reports = JSON.parse(data),
//         report = reports[index];
//   // عرض محتوى التقرير المفصل مع زر للعودة
//   document.getElementById("body").innerHTML = `
//     <header><h3>تفاصيل التقرير رقم ${index + 1}</h3></header>
//     <div>${report.content}</div>
//     <button id="to-bake" onclick="location.reload()">رجوع</button>
//   `;

// // استدعاء دالة انشاء الرسم البياني
//   // const ctx = document.getElementById("chart"),
//   //       labels = report.content.match(/<td>(.*?)<\/td>/g).map(e => e.replace(/<\/?td>/g, ""));
//   // const values = report.content.match(/<td>(\d+)<\/td>/g).map(e => parseInt(e.replace(/<\/?td>/g, "")));
//   // if (chart) chart.destroy();
//   // chart = new Chart(ctx, {
//   //   type: "bar",
//   //   data: { labels, datasets: [{ label: "المجموع", data: values }] },
//   //   options: { indexAxis: "y", scales: { x: { beginAtZero: true } } }
//   // });

//   // إعداد زر الطباعة داخل التقرير المفصل
//   const printButton = document.getElementById("print-report");
//   if(printButton) {
//     printButton.addEventListener("click", () => {
//       const win = window.open("", "_blank", "width=800,height=600");
//       win.document.open();
//       win.document.write(`
//         <style>body { direction: rtl; }</style>
//         <link rel="stylesheet" href="style.css">
//         <header id="main-header">
//           <h1><i class="fa-solid fa-table-list"></i> قراري </h1>
//           <h3> تقرير</h3>
//         </header>
//         ${report.content}
//         <footer id="main-footer">
//           <p>جميع الحقوق محفوظة &copy; 2025</p>
//           <p>فكرة د. يوسف الجابري</p>
//           <p>برمجة: يوسف محمد عبد الله</p>
//         </footer>
//       `);
//       win.document.close();
//       win.focus();
//       win.onload = () => { win.print(); win.close(); };
//     });
//   }
  
//   // ربط زر الحذف بالتقرير المفصل
//   const delBtn = document.getElementById("delete-btn");
//   if(delBtn) {
//     delBtn.addEventListener("click", () => {
//       if (confirm("هل أنت متأكد أنك تريد حذف هذا التقرير؟")) {
//         let saved = JSON.parse(localStorage.getItem("reportList")) || [];
//         saved.splice(index, 1);
//         localStorage.setItem("reportList", JSON.stringify(saved));
//         alert("تم حذف التقرير.");
//         location.reload();
//       }
//     });
//   }
// }

// // حذف التقارير المحددة عند النقر على زر "delete-btn" في شاشة التقارير
// document.getElementById("delete-btn")?.addEventListener("click", () => {
//   const boxes = document.querySelectorAll(".select-report"),
//         selected = Array.from(boxes).filter(cb => cb.checked);
//   if(selected.length === 0){ alert("يرجى تحديد تقرير واحد على الأقل للحذف."); return; }
//   if(confirm("هل أنت متأكد من إتمام عملية الحذف؟")){
//     let saved = JSON.parse(localStorage.getItem("reportList")) || [];
//     // حذف التقارير المحددة بالترتيب التنازلي لضمان صحة الفهارس
//     selected.map(cb => parseInt(cb.dataset.index))
//       .sort((a, b) => b - a)
//       .forEach(i => { saved.splice(i, 1); });
//     localStorage.setItem("reportList", JSON.stringify(saved));
//     alert("تم حذف التقارير المحددة.");
//     location.reload();
//   }
// });

// // إعادة رسم الجدول وربط إجراءات واجهة المستخدم عند تحميل الكود
// renderTable();
// bindUIActions();


// تعريف المتغيرات الأساسية والمصفوفات والثوابت المستخدمة في التطبيق
const items = [];           // قائمة العناصر التي سيتم تقييمها
const criteria = [];        // قائمة المعايير المستخدمة للمقارنة
const MAX_SCORE = 10;       // الحد الأعلى للتقييم
const MIN_SCORE = 1;        // الحد الأدنى للتقييم
let chart = null;           // متغير للرسم البياني (ستتم تهيئته لاحقاً)



    // عداد يستدعى عند الحاجة
let cowntr1 = 0;

// إخفاء زر الحذف افتراضياً إذا كان موجوداً
const deleteButton = document.getElementById("delete-btn");
if (deleteButton) deleteButton.style.display = "none";

/**
 * دالة لإضافة عنصر جديد.
 * @param {string} name - اسم العنصر المضاف.
 */
function addItem(name) {
  if (!name) return;
  // إنشاء عنصر جديد مع قيم التقييم الابتدائية لكل معيار
  const newItem = { name, scores: {} };
  criteria.forEach(c => newItem.scores[c] = MIN_SCORE);
  items.push(newItem);
  renderTable(); // إعادة رسم الجدول بعد الإضافة
}


/**
 * دالة لإضافة معيار جديد.
 * @param {string} name - اسم المعيار المضاف.
 */
function addCriterion(name) {
  if (!name) return;
  criteria.push(name);
  // تعيين التقييم الابتدائي للعنصر الحالي لكل معيار يتم إضافته
  items.forEach(item => item.scores[name] = MIN_SCORE);
  renderTable(); // إعادة رسم الجدول بعد التحديث
}

/**
 * دالة لتحديث تقييم عنصر معين لمعيار محدد.
 * @param {number} itemIndex - فهرس العنصر في القائمة.
 * @param {string} criterion - اسم المعيار.
 * @param {number|string} value - القيمة الجديدة للتقييم.
 */
function updateScore(itemIndex, criterion, value) {
  const numeric = Number(value) || MIN_SCORE;
  // التأكد من أن القيمة ضمن الحدود المسموح بها
  items[itemIndex].scores[criterion] = Math.max(MIN_SCORE, Math.min(MAX_SCORE, numeric));
  renderTable(); // إعادة رسم الجدول بعد التحديث
}

/**
 * دالة لحساب النتائج النهائية لكل عنصر.
 * @returns {Array<Object>} - قائمة بالنتائج تحتوي على اسم العنصر، مجموع النقاط والنسبة المئوية.
 */
function calculateResults() {
  const maxTotal = criteria.length * MAX_SCORE; // الحساب الأقصى للمجموع لكل عنصر
  return items.map(item => {
    // حساب مجموع النقاط للعنصر عبر جميع المعايير
    const total = criteria.reduce((s, c) => s + item.scores[c], 0);
    const percent = maxTotal ? (total / maxTotal) * 100 : 0;
    return { name: item.name, total, percent: +percent.toFixed(2) };
  }).sort((a, b) => b.total - a.total); // ترتيب العناصر من الأعلى نحو الأدنى


}

/**
 * دالة لإعادة رسم الجدول الذي يعرض العناصر ومعايير التقييم.
 */
// function renderTable() {
//   const head = document.querySelector("#comparison-table thead tr");
//   const body = document.querySelector("#comparison-table tbody");
//   // إنشاء الرأس الديناميكي للجدول اعتماداً على قائمة المعايير
//   head.innerHTML = `<th>العنصر</th>${criteria.map(c => `<th>${c}</th>`).join("")}<th>المجموع</th>`;

//   // إنشاء جسم الجدول مع حقول الإدخال لتحديث القيم
//   body.innerHTML = items.map((item, idx) => {
//     const total = criteria.reduce((s, c) => s + item.scores[c], 0);
//     const cells = criteria.map(c => `<td>
//       <div id="container">
//       <input id="input-number${cowntr1++}" type="number" min="${MIN_SCORE}" max="${MAX_SCORE}" value="${item.scores[c]}"
//         oninput="this.value = Math.max(${MIN_SCORE}, Math.min(${MAX_SCORE}, this.value))"
//         onchange="updateScore(${idx}, decodeURIComponent('${encodeURIComponent(c)}'), this.value)" />
//         <div id="buttons-container">
//             <button class="increment-btn${cowntr1++}">▲</button>
//             <button class="decrement-btn${cowntr1++}">▼</button>
//         </div>
//     </div>
//     </td>`).join("");
//     return `<tr><td>${item.name}</td>${cells}<td>${total}</td></tr>`;
//   }).join("");
// }


function renderTable() {
  const head = document.querySelector("#comparison-table thead tr");
  const body = document.querySelector("#comparison-table tbody");
  // إنشاء الرأس الديناميكي للجدول اعتماداً على قائمة المعايير
  head.innerHTML = `<th>العنصر</th>${criteria.map(c => `<th>${c}</th>`).join("")}<th>المجموع</th>`;

  // إنشاء جسم الجدول مع حقول الإدخال لتحديث القيم
  body.innerHTML = items.map((item, idx) => {
    const total = criteria.reduce((s, c) => s + item.scores[c], 0);
    const cells = criteria.map((c, _cidx) => `<td>
      <div class="input-btn-container">
      <input class="input-number" data-item="${idx}" data-criterion="${encodeURIComponent(c)}" type="number" min="${MIN_SCORE}" max="${MAX_SCORE}" value="${item.scores[c]}"
        oninput="this.value = Math.max(${MIN_SCORE}, Math.min(${MAX_SCORE}, this.value))"
        onchange="updateScore(${idx}, decodeURIComponent('${encodeURIComponent(c)}'), this.value)" />
        <div class="buttons-container">
            <button class="increment-btn" data-item="${idx}" data-criterion="${encodeURIComponent(c)}">▲</button>
            <button class="decrement-btn" data-item="${idx}" data-criterion="${encodeURIComponent(c)}">▼</button>
        </div>
    </div>
    </td>`).join("");
    return `<tr><td>${item.name}</td>${cells}<td>${total}</td></tr>`;
  }).join("");

  // بعد رسم الجدول، اربط الأحداث للأزرار الجديدة
  body.querySelectorAll('.increment-btn').forEach(btn => {
    btn.onclick = function() {
      const itemIdx = parseInt(this.getAttribute('data-item'));
      const criterion = decodeURIComponent(this.getAttribute('data-criterion'));
      const input = this.closest('td').querySelector('.input-number');
      let value = parseInt(input.value, 10) || MIN_SCORE;
      value = Math.min(MAX_SCORE, value + 1);
      input.value = value;
      updateScore(itemIdx, criterion, value);
    };
  });
  body.querySelectorAll('.decrement-btn').forEach(btn => {
    btn.onclick = function() {
      const itemIdx = parseInt(this.getAttribute('data-item'));
      const criterion = decodeURIComponent(this.getAttribute('data-criterion'));
      const input = this.closest('td').querySelector('.input-number');
      let value = parseInt(input.value, 10) || MIN_SCORE;
      value = Math.max(MIN_SCORE, value - 1);
      input.value = value;
      updateScore(itemIdx, criterion, value);
    };
  });
}
        
/**
 * دالة لعرض النتائج النهائية والتوصيات بناءً على أعلى تقييم.
 */
function showResults() {
  const results = calculateResults();
  if (!results.length) return;
  // اختيار العنصر الذي حصل على أعلى مجموع
  const best = results[0];
  const summary = document.getElementById("summary-text");
  if (summary) summary.textContent = `العنصر: ${best.name} هو الأعلى بمجموع ${best.total} ونسبة ${best.percent}%`;

  // إنشاء قائمة التوصيات لتحسين المعايير غير المكتملة
  const recList = document.getElementById("recommendations-list");
  recList.innerHTML = "";
  criteria.forEach(c => {
    const score = items.find(i => i.name === best.name).scores[c];
    if (score < MAX_SCORE) {
      const improvement = Math.round(((MAX_SCORE - score) / MAX_SCORE) * 100);
      const li = document.createElement("li");
      li.textContent = `معيار "${c}" للعنصر "${best.name}" يساوي ${score} من ${MAX_SCORE}؛ يُنصح بتحسينه بنسبة ${improvement}%`;
      recList.appendChild(li);
    }
  });
  if (!recList.hasChildNodes()) recList.innerHTML = `<li>معايير العنصر "${best.name}" مكتملة، لا توجد توصيات.</li>`;

  // رسم الرسم البياني للنتائج
  drawChart(results);
}

/**
 * دالة لرسم الرسم البياني باستخدام مكتبة Chart.js.
 * @param {Array<Object>} data - بيانات النتائج التي سيتم استخدامها في الرسم.
 */
function drawChart(data) {
  const ctx = document.getElementById("chart"),
    labels = data.map(d => d.name),
    values = data.map(d => d.total);
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "bar",
    data: { labels, datasets: [{ label: "المجموع", data: values }] },
    options: { indexAxis: "y", scales: { x: { beginAtZero: true } } }
  });

}

/**
 * دالة لربط إجراءات واجهة المستخدم (Event Listeners) بالعناصر المناسبة.
 */
function bindUIActions() {
  // ربط زر إضافة عنصر
  document.getElementById("add-item-btn")?.addEventListener("click", () => {
    const input = document.getElementById("new-item-name");
    addItem(input.value.trim());
    input.value = "";
  });
  // ربط زر إضافة معيار
  document.getElementById("add-criterion-btn")?.addEventListener("click", () => {
    const input = document.getElementById("new-criterion-name");
    addCriterion(input.value.trim());
    input.value = "";
  });
  // ربط زر حساب النتائج والتوصيات
  document.getElementById("calculate-btn")?.addEventListener("click", showResults);
  // ربط زر إغلاق التنبيه في النافذة المنبثقة
  document.getElementById("alertOverlay")?.querySelector("button")?.addEventListener("click", closeAlert);
}

/**
 * عند تحميل المحتوى الكامل للمستند، يتم إنشاء النافذة المنبثقة لعرض التعليمات.
 */
document.addEventListener("DOMContentLoaded", () => {
  // إنشاء عنصر التراكب (Overlay) للنافذة المنبثقة
  const overlay = document.createElement("div");
  overlay.id = "alertOverlay";
  overlay.className = "overlay";
  overlay.dataset.step = "1";

  // إنشاء صندوق التنبيه وتضمينه داخل التراكب
  const box = document.createElement("div");
  box.className = "alert-box";
  overlay.appendChild(box);
  document.body.appendChild(overlay);

  // قوالب التنبيه المختلفة (كل خطوة تحتوي على محتوى مختلف)
  const templates = {
    1: `<p>هل تواجه صعوبة في اتخاذ قرار مصيري؟</p>
        <p>هل تحتار بين خيارات مثل التجارة، الوظيفة، الزواج أو السفر؟</p>
        <p>تحليل واضح ومتوازن يزيل عنك التردد ويقودك إلى القرار الصحيح بثقة ويقين.
        <br>"قراري" هي أداة ذكية تساعدك على تقييم الخيارات من 1 إلى 10.</p>
        <p>ابدأ رحلتك نحو الوضوح - واتخذ قرارك الدقيق</p>
        <button id="alertNext">التالي</button>`,
    2: `<h2>تنبيه !!</h2>
        <p>إقرأ التعليمات قبل البدء.</p>
        <ul><li>أدخل العنصر الذي تريد مقارنته</li><li>أدخل معيار المفاضلة</li></ul>
        <button id="alertNext">فهمت</button>`
  };

  /**
   * دالة للتنقل بين خطوات التنبيه.
   */
  const handleAlert = () => {
    const step = +overlay.dataset.step;
    if (templates[step]) {
      box.innerHTML = templates[step];
      overlay.dataset.step = step + 1;
      box.querySelector("#alertNext").onclick = handleAlert;
    } else overlay.style.display = "none";
  };
  handleAlert();
});

// إجراءات متعلقة بطباعة التقرير عند النقر على زر "print-report"
document.getElementById("print-report")?.addEventListener("click", () => {
  // إعادة حساب النتائج واستخراج أفضل عنصر وتفاصيله
  const results = calculateResults(),
    best = results[0] || { name: "-", total: 0, percent: 0 },
    c = criteria[0] || "-",
    score = items.find(i => i.name === best.name)?.scores[c] || 0,
    improvement = Math.round(((MAX_SCORE - score) / MAX_SCORE) * 100) || 0;

  // إخفاء بعض العناصر أثناء عملية الطباعة
  const resultDiv = document.getElementById("result");
  if (resultDiv) resultDiv.style.display = "none";
  const backButton = document.getElementById("to-bake");
  if (backButton) backButton.style.display = "none";

  // محتوى التقرير الذي سيظهر في نافذة الطباعة الجديدة
  const printContent = document.getElementById("body").innerHTML,
    printWindow = window.open("", "_blank", "width=800,height=600");
  printWindow.document.open();
  printWindow.document.write(`
    <style>body { direction: rtl; }</style>
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
        <h6>إن أردت تطوير بعض المعايير إليك التوصيات</h6>
        <ul id="recommendations-list">
          <li>معيار "${c}" للعنصر "${best.name}" يساوي ${score} من ${MAX_SCORE}؛ يُنصح بتحسينه بنسبة ${improvement}%</li>
        </ul>
      </div>
      <div id="chart-container">
        <canvas id="chart" width="429" height="214" style="display:block; box-sizing:border-box; height:130px; width:260px;"></canvas>
      </div>
      <hr>
      <br>
    </div>
    <h1 style="color:red; text-align:center;">هذا التقرير تجريبي فقط</h1>
    <footer id="main-footer">
      <p>جميع الحقوق محفوظة &copy; 2025</p>
      <p>فكرة د. يوسف الجابري</p>
      <p>برمجة: يوسف محمد عبد الله</p>
    </footer>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.onload = () => {
    printWindow.print();
    printWindow.close();
  };
  // إعادة إظهار الزر بعد عملية الطباعة
  setTimeout(() => { if (backButton) backButton.style.display = "block"; }, 1000);
});

// إجراء حفظ التقرير عند النقر على زر "save-report"
document.getElementById("save-report")?.addEventListener("click", () => {
  const results = calculateResults(),
    best = results[0] || { name: "-", total: 0, percent: 0 },
    c = criteria[0] || "-",
    score = items.find(i => i.name === best.name)?.scores[c] || 0,
    improvement = Math.round(((MAX_SCORE - score) / MAX_SCORE) * 100) || 0;
  const backButton = document.getElementById("to-bake");
  if (backButton) backButton.style.display = "none";

  // محتوى التقرير الذي سيتم حفظه في التخزين المحلي
  const reportData = `
    ${document.getElementById("body").innerHTML}
    <div id="result">
      <div id="summary">
        <h6>الخيار الأفضل لك هو: </h6>
        <p id="summary-text">العنصر: ${best.name} هو الأعلى بمجموع ${best.total} ونسبة ${best.percent}%</p>
      </div>
      <div id="recommendations">
        <h6>إن أردت تطوير بعض المعايير إليك التوصيات</h6>
        <ul id="recommendations-list">
          <li>معيار "${c}" للعنصر "${best.name}" يساوي ${score} من ${MAX_SCORE}؛ يُنصح بتحسينه بنسبة ${improvement}%</li>
        </ul>
      </div>
      <div id="chart-container">
        <canvas id="chart" width="429" height="214" style="display:block; box-sizing:border-box; height:130px; width:260px;"></canvas>
      </div>
      <hr>
      <br>
    </div>
  `;
  const timeStamp = new Date().toLocaleString(),
    savedReports = JSON.parse(localStorage.getItem("reportList")) || [];
  savedReports.push({ content: reportData, savedAt: timeStamp });
  localStorage.setItem("reportList", JSON.stringify(savedReports));
  alert("تم حفظ التقرير بنجاح.");
});

// عرض قائمة التقارير المحفوظة عند النقر على زر "show-btn"
document.getElementById("show-btn")?.addEventListener("click", () => {
  if (deleteButton) deleteButton.style.display = "block";
  // إخفاء بعض الأزرار عند عرض التقارير
  document.querySelectorAll("#header, #show-btn, #save-report, #calculate-btn")
    .forEach(el => { if (el) el.style.display = "none"; });
  const data = localStorage.getItem("reportList");
  if (!data) { alert("لا توجد تقارير محفوظة."); return; }
  const reports = JSON.parse(data);
  let html = `
    <header id="main-header"><h3>التقارير المحفوظة</h3></header>
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
  // إنشاء صف لكل تقرير محفوظ مع زر "عرض" وخانة اختيار
  reports.forEach((r, i) => {
    html += `
      <tr>
        <td>${i + 1}</td>
        <td><a href="#" onclick="showReport(${i}); return false;">عرض</a></td>
        <td>تقرير ${i + 1}</td>
        <td>${r.savedAt}</td>
        <td><input type="checkbox" class="select-report" data-index="${i}"></td>
      </tr>
    `;
  });
  html += `</tbody></table></div>`;
  const bodyEl = document.getElementById("body");
  if (bodyEl) bodyEl.innerHTML = html;
});

// طباعة التقارير المحددة عند النقر على زر "print-report" في شاشة التقارير
document.getElementById("print-report")?.addEventListener("click", () => {
  const checkboxes = document.querySelectorAll(".select-report"),
    selected = Array.from(checkboxes).filter(cb => cb.checked);
  if (selected.length === 0) { alert("يرجى تحديد تقرير واحد على الأقل للطباعة."); return; }
  selected.forEach(cb => {
    const i = parseInt(cb.dataset.index),
      report = JSON.parse(localStorage.getItem("reportList"))[i],
      win = window.open("", "_blank", "width=800,height=600");
    win.document.open();
    win.document.write(`
      <style>body { direction: rtl; }</style>
      <link rel="stylesheet" href="style.css">
      ${report.content}
    `);
    win.document.close();
    win.focus();
    win.onload = () => { win.print(); win.close(); };
  });
});



/**
 * دالة لعرض تقرير مفصل عند اختيار أحد التقارير من القائمة.
 * @param {number} index - فهرس التقرير في قائمة التقارير المخزنة.
 */
function showReport(index) {
  const resultDiv = document.getElementById("result");
  if (resultDiv) resultDiv.style.display = "none";
  const data = localStorage.getItem("reportList");
  if (!data) { alert("لا توجد تقارير محفوظة."); return; }
  const reports = JSON.parse(data),
    report = reports[index];

  //   انشاء الرسم البياني



  // عرض محتوى التقرير المفصل مع زر للعودة
  document.getElementById("body").innerHTML = `
    <header><h3>تفاصيل التقرير رقم ${index + 1}</h3></header>
    <div>${report.content}</div>
    <button id="to-bake" onclick="location.reload()">رجوع</button>
  `;








  // إعداد زر الطباعة داخل التقرير المفصل
  const printButton = document.getElementById("print-report");
  if (printButton) {
    printButton.addEventListener("click", () => {
      const win = window.open("", "_blank", "width=800,height=600");
      win.document.open();
      win.document.write(`
        <style>body { direction: rtl; }</style>
        <link rel="stylesheet" href="style.css">
        <header id="main-header">
          <h1><i class="fa-solid fa-table-list"></i> قراري </h1>
          <h3> تقرير</h3>
        </header>
        ${report.content}
        <footer id="main-footer">
          <p>جميع الحقوق محفوظة &copy; 2025</p>
          <p>فكرة د. يوسف الجابري</p>
          <p>برمجة: يوسف محمد عبد الله</p>
        </footer>
      `);
      win.document.close();
      win.focus();
      win.onload = () => { win.print(); win.close(); };
    });
  }

  // ربط زر الحذف بالتقرير المفصل
  const delBtn = document.getElementById("delete-btn");
  if (delBtn) {
    delBtn.addEventListener("click", () => {
      if (confirm("هل أنت متأكد أنك تريد حذف هذا التقرير؟")) {
        let saved = JSON.parse(localStorage.getItem("reportList")) || [];
        saved.splice(index, 1);
        localStorage.setItem("reportList", JSON.stringify(saved));
        alert("تم حذف التقرير.");
        location.reload();
      }
    });
  }
}

// حذف التقارير المحددة عند النقر على زر "delete-btn" في شاشة التقارير
document.getElementById("delete-btn")?.addEventListener("click", () => {
  const boxes = document.querySelectorAll(".select-report"),
    selected = Array.from(boxes).filter(cb => cb.checked);
  if (selected.length === 0) { alert("يرجى تحديد تقرير واحد على الأقل للحذف."); return; }
  if (confirm("هل أنت متأكد من إتمام عملية الحذف؟")) {
    let saved = JSON.parse(localStorage.getItem("reportList")) || [];
    // حذف التقارير المحددة بالترتيب التنازلي لضمان صحة الفهارس
    selected.map(cb => parseInt(cb.dataset.index))
      .sort((a, b) => b - a)
      .forEach(i => { saved.splice(i, 1); });
    localStorage.setItem("reportList", JSON.stringify(saved));
    alert("تم حذف التقارير المحددة.");
    location.reload();
  }
});

// إعادة رسم الجدول وربط إجراءات واجهة المستخدم عند تحميل الكود
renderTable();
bindUIActions();

