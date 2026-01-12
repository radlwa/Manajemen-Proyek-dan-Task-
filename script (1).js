// =================== DATA ===================
const proyek = {}; // key = pid, value = {nama, klien, deadline, status, tasks: []}

// =================== PROYEK ===================
function tambahProyek() {
    const pid = document.getElementById("pid").value.trim();
    const nama = document.getElementById("nama").value.trim();
    const klien = document.getElementById("klien").value.trim();
    const deadline = document.getElementById("deadline").value;
    const status = document.getElementById("status").value.trim();

    if (!pid || !nama || !klien || !deadline || !status) {
        alert("Semua field proyek wajib diisi!");
        return;
    }

    if (proyek[pid]) {
        alert("ID Proyek sudah digunakan!");
        return;
    }

    proyek[pid] = { nama, klien, deadline, status, tasks: [] };
    tampilkanProyek();
    bersihkanInputProyek();
}

function tampilkanProyek(filter = "") {
    const tbody = document.getElementById("listProyek");
    tbody.innerHTML = "";

    for (const pid in proyek) {
        const p = proyek[pid];
        if (filter && !p.nama.toLowerCase().includes(filter.toLowerCase()) &&
            !p.klien.toLowerCase().includes(filter.toLowerCase())) continue;

        tbody.innerHTML += `
            <tr>
                <td>${pid}</td>
                <td>${p.nama}</td>
                <td>${p.klien}</td>
                <td>${p.deadline}</td>
                <td>${p.status}</td>
                <td>
                    <button onclick="pilihProyek('${pid}')">Tambahkan ke Task</button>
                    <button onclick="editProyek('${pid}')">Edit</button>
                    <button onclick="hapusProyek('${pid}')">Hapus</button>
                </td>
            </tr>
        `;
    }
}

// Pilih proyek untuk lihat task
function pilihProyek(pid) {
    document.getElementById("task_pid").value = pid;
    tampilkanTask(pid);
}

// Edit proyek
function editProyek(pid) {
    const p = proyek[pid];
    document.getElementById("e_pid").value = pid;
    document.getElementById("e_nama").value = p.nama;
    document.getElementById("e_klien").value = p.klien;
    document.getElementById("e_deadline").value = p.deadline;
    document.getElementById("e_status").value = p.status;
    document.getElementById("modalProyek").style.display = "block";
}

function simpanEditProyek() {
    const pid = document.getElementById("e_pid").value;
    proyek[pid].nama = document.getElementById("e_nama").value;
    proyek[pid].klien = document.getElementById("e_klien").value;
    proyek[pid].deadline = document.getElementById("e_deadline").value;
    proyek[pid].status = document.getElementById("e_status").value;
    tampilkanProyek();
    tutupModal("modalProyek");
}

function hapusProyek(pid) {
    if (!proyek[pid]) return alert("ID Proyek tidak valid");
    delete proyek[pid];
    tampilkanProyek();
    document.getElementById("listTask").innerHTML = "";
}

function bersihkanInputProyek() {
    document.getElementById("pid").value = "";
    document.getElementById("nama").value = "";
    document.getElementById("klien").value = "";
    document.getElementById("deadline").value = "";
    document.getElementById("status").value = "";
}

// =================== TASK ===================
function tambahTask() {
    const pid = document.getElementById("task_pid").value.trim();
    const id_task = document.getElementById("task_id").value.trim();
    const judul = document.getElementById("judul").value.trim();
    const pic = document.getElementById("pic").value.trim();
    const status = document.getElementById("task_status").value;

    if (!pid || !id_task || !judul || !pic || !status) {
        alert("Semua field task wajib diisi!");
        return;
    }

    if (!proyek[pid]) return alert("ID Proyek tidak valid");

    const tExist = proyek[pid].tasks.find(t => t.id_task === id_task);
    if (tExist) return alert("ID Task sudah digunakan untuk proyek ini!");

    proyek[pid].tasks.push({id_task, judul, pic, status});
    tampilkanTask(pid);
    bersihkanInputTask();
}

function tampilkanTask(pid) {
    const tbody = document.getElementById("listTask");
    tbody.innerHTML = "";

    if (!proyek[pid]) return;

    proyek[pid].tasks.forEach((t, idx) => {
        tbody.innerHTML += `
            <tr>
                <td>${t.id_task}</td>
                <td>${t.judul}</td>
                <td>${t.pic}</td>
                <td>${t.status}</td>
                <td>
                    <button onclick="editTask('${pid}', ${idx})">Edit</button>
                    <button onclick="hapusTask('${pid}', ${idx})">Hapus</button>
                </td>
            </tr>
        `;
    });
}

function editTask(pid, idx) {
    const t = proyek[pid].tasks[idx];
    document.getElementById("e_tpid").value = pid;
    document.getElementById("e_tid").value = t.id_task;
    document.getElementById("e_judul").value = t.judul;
    document.getElementById("e_pic").value = t.pic;
    document.getElementById("e_tstatus").value = t.status;
    document.getElementById("modalTask").style.display = "block";
}

function simpanEditTask() {
    const pid = document.getElementById("e_tpid").value;
    const id_task = document.getElementById("e_tid").value;
    const t = proyek[pid].tasks.find(t => t.id_task === id_task);
    t.judul = document.getElementById("e_judul").value;
    t.pic = document.getElementById("e_pic").value;
    t.status = document.getElementById("e_tstatus").value;
    tampilkanTask(pid);
    tutupModal("modalTask");
}

function hapusTask(pid, idx) {
    if (!proyek[pid] || idx < 0 || idx >= proyek[pid].tasks.length)
        return alert("ID Task tidak valid");
    proyek[pid].tasks.splice(idx, 1);
    tampilkanTask(pid);
}

function bersihkanInputTask() {
    document.getElementById("task_pid").value = "";
    document.getElementById("task_id").value = "";
    document.getElementById("judul").value = "";
    document.getElementById("pic").value = "";
    document.getElementById("task_status").value = "";
}

// =================== MODAL ===================
function tutupModal(id) {
    document.getElementById(id).style.display = "none";
}

// =================== SEARCH ===================
function searchProyek(keyword) {
    tampilkanProyek(keyword);
}

function searchTask(pic) {
    const tbody = document.getElementById("listTask");
    tbody.innerHTML = "";
    for (const pid in proyek) {
        proyek[pid].tasks.forEach(t => {
            if (t.pic.toLowerCase().includes(pic.toLowerCase())) {
                tbody.innerHTML += `
                    <tr>
                        <td>${t.id_task}</td>
                        <td>${t.judul}</td>
                        <td>${t.pic}</td>
                        <td>${t.status}</td>
                        <td></td>
                    </tr>
                `;
            }
        });
    }
}

// =================== SORTING ===================
function sortProyek(by="deadline") {
    const entries = Object.entries(proyek);
    entries.sort((a,b) => {
        if(by === "deadline") return new Date(a[1].deadline) - new Date(b[1].deadline);
        if(by === "nama") return a[1].nama.localeCompare(b[1].nama);
        return 0;
    });
    const tbody = document.getElementById("listProyek");
    tbody.innerHTML = "";
    entries.forEach(([pid,p]) => {
        tbody.innerHTML += `
            <tr>
                <td>${pid}</td>
                <td>${p.nama}</td>
                <td>${p.klien}</td>
                <td>${p.deadline}</td>
                <td>${p.status}</td>
                <td>
                    <button onclick="pilihProyek('${pid}')">Lihat Task</button>
                    <button onclick="editProyek('${pid}')">Edit</button>
                    <button onclick="hapusProyek('${pid}')">Hapus</button>
                </td>
            </tr>
        `;
    });
}

// =================== LAPORAN ===================
function laporanDeadline() {
    const container = document.getElementById("laporanContainer");
    container.innerHTML = "<h3>Proyek Mendekati Deadline (< 3 hari)</h3>";
    const now = new Date();
    const ul = document.createElement("ul");

    for (const pid in proyek) {
        const p = proyek[pid];
        const diff = (new Date(p.deadline) - now)/(1000*3600*24);
        if(diff <=3 && diff >=0) {
            const li = document.createElement("li");
            li.textContent = `${pid} - ${p.nama} (Deadline: ${p.deadline})`;
            ul.appendChild(li);
        }
    }
    container.appendChild(ul);
}

function laporanPersentase() {
    const container = document.getElementById("laporanContainer");
    container.innerHTML = "<h3>Persentase Task Selesai per Proyek</h3>";
    const divSummary = document.createElement("div");
    divSummary.classList.add("laporan-summary");

    for (const pid in proyek) {
        const p = proyek[pid];
        const tasks = p.tasks;
        if(tasks.length===0) continue;
        const done = tasks.filter(t => t.status.toLowerCase()==="done").length;
        const persen = Math.round((done/tasks.length)*100);
        const box = document.createElement("div");
        box.innerHTML = `<strong>${persen}%</strong><span>${pid} - ${p.nama}</span>`;
        divSummary.appendChild(box);
    }
    container.appendChild(divSummary);
}

// =================== INIT ===================
tampilkanProyek();
