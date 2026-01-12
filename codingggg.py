import json 

# Nama file untuk menyimpan data
NAMA_FILE = "data_proyek.json"

# ================= FUNGSI DATA (PERSISTENSI) =================
def simpan_data():
    """Menyimpan data projects dan tasks ke file JSON."""
    with open(NAMA_FILE, 'w') as f:
        json.dump({"projects": projects, "tasks": tasks}, f, indent=4)
    # print("Data berhasil disimpan.") # Opsional, untuk feedback

def muat_data():
    """Memuat data projects dan tasks dari file JSON."""
    global projects, tasks
    try:
        with open(NAMA_FILE, 'r') as f:
            data = json.load(f)
            projects = data.get("projects", {})
            tasks = data.get("tasks", {})
    except FileNotFoundError:
        # Jika file tidak ditemukan, biarkan dictionary kosong
        projects = {}
        tasks = {}

# ================= FUNGSI HELPER =================
def tampilkan_tasks(pid):
    """Menampilkan daftar task untuk proyek tertentu."""
    task_list = tasks.get(pid, [])
    if not task_list:
        print("Belum ada task untuk proyek ini.")
        return

    print(f"\n--- Daftar Task untuk Proyek {pid} ---")
    for i, t in enumerate(task_list):
        print(f"{i}: {t['judul']} (PIC: {t['pic']}, Status: {t['status']})")
    print("------------------------------------")

# ================= KODE UTAMA =================
# Panggil fungsi muat_data saat program pertama kali dijalankan
muat_data()

def menu():
    print("\n=== MENU UTAMA ===")
    print("1. CRUD Proyek")
    print("2. CRUD Task")
    print("3. Sorting")
    print("4. Searching")
    print("5. Laporan")
    print("0. Keluar")

# ================= PROYEK =================
def crud_proyek():
    while True: # PERBAIKAN: Tambahkan loop agar submenu kembali ke menu utama
        print("\n--- CRUD PROYEK ---")
        print("1. Tambah")
        print("2. Tampilkan")
        print("3. Update")
        print("4. Hapus")
        print("0. Kembali ke Menu Utama")
        choice = input("Pilih: ")

        if choice == "1":
            pid = input("ID Proyek: ")
            if pid in projects:
                print("ID Proyek sudah ada. Gunakan ID lain.")
                continue
            projects[pid] = {
                "nama proyek": input("Nama Proyek: "),
                "klien": input("Klien: "),
                "deadline": input("Deadline (DD-MM-YYYY): "),
                "status": input("Status: ")
            }
            simpan_data() 
            print("Proyek ditambahkan")

        elif choice == "2":
            if not projects:
                print("Belum ada proyek.")
            else:
                for pid, p in projects.items():
                    print(f"ID: {pid}, Detail: {p}")

        elif choice == "3":
            pid = input("ID Proyek yang akan diupdate: ")
            if pid in projects:
                print("Masukkan data baru (kosongkan jika tidak ingin mengubah):")
                new_nama = input(f"Nama Proyek baru ({projects[pid]['nama proyek']}): ")
                new_klien = input(f"Klien baru ({projects[pid]['klien']}): ")
                new_deadline = input(f"Deadline baru ({projects[pid]['deadline']}): ")
                new_status = input(f"Status baru ({projects[pid]['status']}): ")

                if new_nama: projects[pid]["nama proyek"] = new_nama
                if new_klien: projects[pid]["klien"] = new_klien
                if new_deadline: projects[pid]["deadline"] = new_deadline
                if new_status: projects[pid]["status"] = new_status
                
                simpan_data()
                print("Proyek diupdate")
            else:
                print("ID tidak ditemukan")

        elif choice == "4":
            pid = input("ID Proyek yang akan dihapus: ")
            if pid in projects:
                projects.pop(pid, None)
                tasks.pop(pid, None)
                simpan_data()
                print("Proyek & task terkait dihapus")
            else:
                print("ID tidak ditemukan")
        
        elif choice == "0":
            break # Kembali ke menu utama
        
        else:
            print("Pilihan tidak valid.")

# ================= TASK =================
def crud_task():
    pid = input("Masukkan ID Proyek: ")
    if pid not in projects:
        print("ID Proyek tidak valid.")
        return

    tasks.setdefault(pid, [])

    while True:
        print(f"\n--- CRUD TASK untuk Proyek {pid} ---")
        print("1. Tambah")
        print("2. Tampilkan")
        print("3. Update")
        print("4. Hapus")
        print("0. Kembali ke Menu Utama")
        choice = input("Pilih: ")

        if choice == "1":
            task = {
                "judul": input("Judul Task: "),
                "pic": input("PIC: "),
                "status": input("Status (Open/On Progress/Done): ")
            }
            tasks[pid].append(task)
            simpan_data()
            print("Task ditambahkan")

        elif choice == "2":
            tampilkan_tasks(pid)

        elif choice == "3":
            tampilkan_tasks(pid)
            if not tasks.get(pid): continue
            try:
                idx = int(input("Index task yang akan diupdate: "))
                if 0 <= idx < len(tasks[pid]):
                    tasks[pid][idx]["judul"] = input("Judul baru: ")
                    tasks[pid][idx]["pic"] = input("PIC baru: ")
                    tasks[pid][idx]["status"] = input("Status baru: ")
                    simpan_data()
                    print("Task diupdate")
                else:
                    print("Index tidak valid.")
            except ValueError:
                print("Input harus berupa angka.")

        elif choice == "4":
            tampilkan_tasks(pid)
            if not tasks.get(pid): continue
            try:
                idx = int(input("Index task yang akan dihapus: "))
                if 0 <= idx < len(tasks[pid]):
                    tasks[pid].pop(idx)
                    simpan_data()
                    print("Task dihapus")
                else:
                    print("Index tidak valid.")
            except ValueError:
                print("Input harus berupa angka.")
        
        elif choice == "0":
            break # Kembali ke menu utama
        
        else:
            print("Pilihan tidak valid.")

# ================= SORTING =================
def sorting():
    print("\n--- SORTING ---")
    print("1. Proyek berdasarkan deadline")
    print("2. Task berdasarkan status")
    choice = input("Pilih: ")

    if choice == "1":
        if not projects:
            print("Belum ada proyek untuk diurutkan.")
            return
        # Mengubah format deadline menjadi objek date untuk sorting yang benar
        # Namun untuk kesederhanaan, kita tetap gunakan sorting string
        sorted_projects = sorted(projects.items(), key=lambda item: item[1]["deadline"])
        for pid, p in sorted_projects:
            print(f"ID: {pid}, Detail: {p}")

    elif choice == "2":
        pid = input("ID Proyek: ")
        if pid not in tasks or not tasks[pid]:
            print("Tidak ada task untuk proyek ini.")
            return
        sorted_tasks = sorted(tasks[pid], key=lambda x: x["status"])
        tampilkan_tasks(pid) # Tampilkan header
        for t in sorted_tasks:
            print(f"- {t['judul']} (PIC: {t['pic']}, Status: {t['status']})")

# ================= SEARCH =================
def searching():
    print("\n--- SEARCH ---")
    print("1. Cari Proyek (nama proyek/klien)")
    print("2. Cari Task berdasarkan PIC")
    choice = input("Pilih: ")

    if choice == "1":
        key = input("Keyword: ").lower()
        found = False
        for pid, p in projects.items():
            if key in p["nama proyek"].lower() or key in p["klien"].lower():
                print(f"ID: {pid}, Detail: {p}")
                found = True
        if not found:
            print("Tidak ada proyek yang cocok dengan keyword tersebut.")

    elif choice == "2":
        pic = input("Nama PIC: ").lower()
        found = False
        for pid, tlist in tasks.items():
            for t in tlist:
                if pic in t["pic"].lower():
                    print(f"Proyek {pid}: {t}")
                    found = True
        if not found:
            print("Tidak ada task dengan PIC tersebut.")

# ================= LAPORAN =================
def laporan():
    print("\n--- LAPORAN PROGRES PROYEK ---")
    if not tasks:
        print("Belum ada task di proyek manapun.")
        return
        
    for pid, tlist in tasks.items():
        if not tlist:
            print(f"Proyek {pid}: Belum ada task.")
            continue
        done = sum(1 for t in tlist if t["status"].lower() == "done")
        persen = (done / len(tlist)) * 100
        print(f"Proyek {pid} ({projects[pid]['nama proyek']}): {persen:.2f}% task selesai ({done}/{len(tlist)})")

# ================= MAIN =================
while True:
    menu()
    pilih = input("Pilih menu: ")

    if pilih == "1":
        crud_proyek()
    elif pilih == "2":
        crud_task()
    elif pilih == "3":
        sorting()
    elif pilih == "4":
        searching()
    elif pilih == "5":
        laporan()
    elif pilih == "0":
        print("Keluar...")
        simpan_data()
        break
    else:
        print("Menu tidak valid")