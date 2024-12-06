const students = ["مصطفي رمضان", "اسلام خضر", "محمد علي", " كريم", " عمرو بركات", " اسلام القمني", "معاذ", "عمرو رشدي"];
const studentList = document.getElementById("student-list");
const dateElement = document.getElementById("date");
const saveButton = document.getElementById("save-button");
const historyElement = document.getElementById("history");
const toggleHistoryButton = document.getElementById("toggle-history-button");
const shareButton = document.getElementById("share-button");
const toggleStatsButton = document.getElementById("toggle-stats-button");
const statsElement = document.getElementById("stats");
const summaryElement = document.getElementById("summary");

const today = new Date().toLocaleDateString("ar-EG");
dateElement.textContent = today;

students.forEach((student, index) => {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${student}</td>
    <td><input type="radio" name="attendance-${index}" value="حضر"></td>
    <td><input type="radio" name="attendance-${index}" value="غاب"></td>
  `;
  studentList.appendChild(row);
});

saveButton.addEventListener("click", () => {
  const attendance = [];
  students.forEach((student, index) => {
    const attendanceValue = document.querySelector(`input[name="attendance-${index}"]:checked`);
    attendance.push({
      name: student,
      status: attendanceValue ? attendanceValue.value : "لم يسجل",
    });
  });

  const record = { date: today, attendance };
  const history = JSON.parse(localStorage.getItem("attendanceHistory")) || [];
  history.push(record);
  localStorage.setItem("attendanceHistory", JSON.stringify(history));
  alert("تم حفظ الحضور بنجاح!");
  loadHistory();
  calculateStats();
});

function loadHistory() {
  const history = JSON.parse(localStorage.getItem("attendanceHistory")) || [];
  historyElement.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>التاريخ</th>
          <th>الاسم</th>
          <th>الحالة</th>
        </tr>
      </thead>
      <tbody>
        ${history
      .map((record) =>
        record.attendance
          .map(
            (item) => `
          <tr>
            <td>${record.date}</td>
            <td>${item.name}</td>
            <td class="${item.status === "حضر" ? "present" : "absent"}">
              ${item.status === "حضر" ? "✅" : "❌"}
            </td>
          </tr>
        `
          )
          .join("")
      )
      .join("")}
      </tbody>
    </table>
  `;
}

function calculateStats() {
  const history = JSON.parse(localStorage.getItem("attendanceHistory")) || [];
  const stats = {};

  history.forEach((record) => {
    record.attendance.forEach(({ name, status }) => {
      if (!stats[name]) stats[name] = { present: 0, total: 0 };
      if (status === "حضر") stats[name].present++;
      stats[name].total++;
    });
  });

  statsElement.innerHTML = `
    <h2>الإحصائيات</h2>
    <ul>
      ${Object.entries(stats)
      .map(
        ([name, data]) =>
          `<li>${name}: ${((data.present / data.total) * 100).toFixed(2)}% حضور (${data.present}/${data.total})</li>`
      )
      .join("")}
    </ul>
  `;

  calculateTopAndLeast(stats);
}

function calculateTopAndLeast(stats) {
  let topStudent = { name: "", attendance: 0 };
  let leastStudent = { name: "", attendance: Infinity };

  Object.entries(stats).forEach(([name, data]) => {
    const attendanceRate = data.present / data.total;
    if (attendanceRate > topStudent.attendance) {
      topStudent = { name, attendance: attendanceRate };
    }
    if (attendanceRate < leastStudent.attendance) {
      leastStudent = { name, attendance: attendanceRate };
    }
  });

  summaryElement.innerHTML = `
    <h2>ملخص الحضور</h2>
    <p>الأكثر حضورًا: ${topStudent.name} بنسبة ${(topStudent.attendance * 100).toFixed(2)}%</p>
    <p>الأقل حضورًا: ${leastStudent.name} بنسبة ${(leastStudent.attendance * 100).toFixed(2)}%</p>
  `;
}

shareButton.addEventListener("click", () => {
  const history = JSON.parse(localStorage.getItem("attendanceHistory")) || [];
  const latestRecord = history[history.length - 1];
  if (!latestRecord) {
    alert("لا يوجد سجل لمشاركته.");
    return;
  }

  let message = `سجل الحضور ليوم ${latestRecord.date}:\n\n`;
  latestRecord.attendance.forEach(({ name, status }) => {
    message += `${name}: ${status === "حضر" ? "حضور" : "غياب"}\n`;
  });

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
  window.open(whatsappUrl, "_blank");
});

const clearHistoryButton = document.getElementById("clear-history-button");

clearHistoryButton.addEventListener("click", () => {
  localStorage.removeItem("attendanceHistory"); // إزالة السجل من localStorage
  alert("تم مسح السجل بنجاح!");
  loadHistory(); // تحديث واجهة المستخدم بعد مسح السجل
});


toggleStatsButton.addEventListener("click", () => {
  statsElement.classList.toggle("hidden");
  summaryElement.classList.toggle("hidden");
});

toggleHistoryButton.addEventListener("click", () => {
  historyElement.classList.toggle("hidden");
});

loadHistory();
