const items = [];
const criteria = [];
const MAX_SCORE = 10, MIN_SCORE = 1;
let chart;

function addItem(name) {
  if (!name) return;
  // إضافة عنصر جديد
  const newItem = { name, scores: {} };
  // تهيئة الدرجة الافتراضية لكل معيار
  criteria.forEach(c => {
    newItem.scores[c.name] = MIN_SCORE;
  });
  items.push(newItem);
  renderTable();
}

function addCriterion(name, weight) {
  if (!name || weight < 1) return;
  // إضافة معيار جديد
  criteria.push({ name, weight });
  // تهيئة الدرجة الافتراضية لهذا المعيار في كل العناصر
  items.forEach(item => {
    item.scores[name] = MIN_SCORE;
  });
  renderTable();
}

function updateScore(i, cName, value) {
  const v = Math.max(MIN_SCORE, Math.min(MAX_SCORE, +value || MIN_SCORE));
  items[i].scores[cName] = v;
  renderTable();
}

function calculateResults() {
  const maxTotal = criteria.reduce((sum, c) => sum + c.weight * MAX_SCORE, 0);
  return items.map(item => {
    const total = criteria.reduce((sum, c) => sum + item.scores[c.name] * c.weight, 0);
    // إذا لم يكن هناك معايير، اجعل النسبة 0 بدل قسمة على صفر
    const percent = maxTotal
      ? ((total / maxTotal) * 100).toFixed(2)
      : "0.00";
    return { name: item.name, total, percent: parseFloat(percent) };
  })
  .sort((a, b) => b.total - a.total);
}

function renderTable() {
  const thead = document.querySelector('#comparison-table thead tr');
  const tbody = document.querySelector('#comparison-table tbody');
  // بناء رأس الجدول
  thead.innerHTML =
    '<th>العنصر</th>' +
    criteria.map(c => `<th>${c.name}<br>(w=${c.weight})</th>`).join('') +
    '<th>المجموع</th>';
  // بناء جسم الجدول
  tbody.innerHTML = items.map((it, i) => {
    const total = criteria.reduce((sum, c) => sum + it.scores[c.name] * c.weight, 0);
    return `<tr>
      <td>${it.name}</td>
      ${criteria.map(c => {
        // نستخدم encodeURIComponent لتهريب أي أحرف خاصة في اسم المعيار
        const safeName = encodeURIComponent(c.name);
        return `<td>
          <input
            type="number"
            min="${MIN_SCORE}"
            max="${MAX_SCORE}"
            value="${it.scores[c.name]}"
            oninput="this.value=Math.max(${MIN_SCORE},Math.min(${MAX_SCORE},this.value))"
            onchange="updateScore(${i}, decodeURIComponent('${safeName}'), this.value)"
          >
        </td>`;
      }).join('')}
      <td>${total}</td>
    </tr>`;
  }).join('');
}

function showResults() {
  const res = calculateResults();
  if (!res.length) return;
  const best = res[0];
  // نص الملخص بصياغة محسّنة
  document.getElementById('summary-text').textContent =
    ` العنصر: ${best.name} هو الأعلى بمجموع  ${best.total}، ونسبة ${best.percent}%`;
  
  // بناء قائمة التوصيات بناءً على كل معيار لم يصل فيه أفضل عنصر إلى الدرجة القصوى
  const recList = document.getElementById('recommendations-list');
  recList.innerHTML = '';
  criteria.forEach(c => {
    const bestScore = items.find(it => it.name === best.name).scores[c.name];
    if (bestScore < MAX_SCORE) {
      const improvement = ((MAX_SCORE - bestScore) / MAX_SCORE * 100).toFixed(0);
      const li = document.createElement('li');
      li.textContent =
        `معيار "${c.name}" للعنصر "${best.name}" يساوي ${bestScore} من ${MAX_SCORE}؛ يُنصح بتحسينه بنسبة ${improvement}٪.`;
      recList.appendChild(li);
    }
  });
  if (!recList.childElementCount) {
    recList.innerHTML = `<li>جميع معايير العنصر "${best.name}"   مكتملة، لاتوجد توصيات  .</li>`;
  }
  drawChart(res);
}

function drawChart(data) {
  const ctx = document.getElementById('chart');
  const labels = data.map(d => d.name);
  const values = data.map(d => d.total);
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'المجموع المرجح',
        data: values,
        backgroundColor: 'rgba(0,123,255,0.5)'
      }]
    },
    options: {
      indexAxis: 'y',
      scales: { x: { beginAtZero: true } }
    }
  });
}

// ربط أزرار الإضافة والحساب
document.getElementById('add-item-btn').onclick = () => {
  addItem(document.getElementById('new-item-name').value.trim());
  document.getElementById('new-item-name').value = '';
};
document.getElementById('add-criterion-btn').onclick = () => {
  addCriterion(
    document.getElementById('new-criterion-name').value.trim(),
    parseInt(document.getElementById('new-criterion-weight').value, 10)
  );
  document.getElementById('new-criterion-name').value = '';
  document.getElementById('new-criterion-weight').value = 1;
};
document.getElementById('calculate-btn').onclick = showResults;

// عرض الجدول الابتدائي
renderTable();

// وظيفة إغلاق النافذة 
function closeAlert() {
  document.getElementById('alertOverlay').style.display = 'none';
}
// باقي لك  انك تعدل على الكود في حال تساوت المعايير 
