// PASANG URL WEB APP DEPLOYMENT GOOGLE APPS SCRIPT KAMU DI SINI
//const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxFWy7KsY7asw3f7y2W63b8nzNuwBK6vHSeb6I4rUEL-w8zX1Z7anvMh5k0aiV2X01J/exec";
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzn-ipQXAsMJLt23oGjLMU17sJ1_HloaooTZwUhnGqTiE5iXxn-rpc0wYPvjC-Fz4NU/exec";
// ==========================================
// 1. MEMBACA NAMA TAMU DINAMIS DARI URL (?to=NamaTamu)
// ==========================================
window.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const guestParam = urlParams.get("to") || urlParams.get("n");

  if (guestParam) {
    // Merapikan tanda hubung / plus menjadi spasi
    const cleanGuestName = decodeURIComponent(guestParam.replace(/\+/g, " "));

    // Tampilkan di Halaman Cover
    const guestElement = document.getElementById("guestName");
    if (guestElement) {
      guestElement.innerText = cleanGuestName;
    }

    // Isikan otomatis ke form ucapan & doa
    const inputNama = document.getElementById("nama");
    if (inputNama) {
      inputNama.value = cleanGuestName;
    }
  }

  // Inisialisasi Tema dan Gaya Font
  initThemeAndFont();

  // Inisialisasi Fitur Informasi Rekening & Kado (Customizable)
  initRekeningFeature();
});

// ==========================================
// 2. FUNGSI NAVIGASI HALAMAN & SCROLL
// ==========================================
function openInvitation() {
  document.getElementById("cover").classList.add("hidden");
  document.getElementById("mainContent").classList.remove("hidden");
  toggleMusic(true);
}

function showCover() {
  document.getElementById("cover").classList.remove("hidden");
  document.getElementById("mainContent").classList.add("hidden");
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToSection(sectionId) {
  const targetElement = document.getElementById(sectionId);
  if (targetElement) {
    targetElement.scrollIntoView({ behavior: 'smooth' });
  }
}

// ==========================================
// 3. COUNTDOWN TIMER (6 Febuari 2026)
// ==========================================
const targetDate = new Date("Febuari 6, 2026 09:00:00").getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const difference = targetDate - now;

  if (difference > 0) {
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    if (document.getElementById("days")) {
      document.getElementById("days").innerText = days < 10 ? "0" + days : days;
      document.getElementById("hours").innerText = hours < 10 ? "0" + hours : hours;
      document.getElementById("minutes").innerText = minutes < 10 ? "0" + minutes : minutes;
      document.getElementById("seconds").innerText = seconds < 10 ? "0" + seconds : seconds;
    }
  }
}
setInterval(updateCountdown, 1000);
updateCountdown();

// ==========================================
// 4. CONTROLLER MUSIK
// ==========================================
const audio = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicToggle");
let isPlaying = false;

function toggleMusic(forcePlay = false) {
  if (forcePlay || !isPlaying) {
    if (audio) {
      audio.play().catch(err => console.log("Autoplay blocked:", err));
    }
    if (musicBtn) musicBtn.classList.add("rotating");
    isPlaying = true;
  } else {
    if (audio) audio.pause();
    if (musicBtn) musicBtn.classList.remove("rotating");
    isPlaying = false;
  }
}

// ==========================================
// 5. FORM SUBMIT UCAPAN & DOA KE GOOGLE SHEETS
// ==========================================
const rsvpForm = document.getElementById("rsvpForm");
if (rsvpForm) {
  rsvpForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const btn = e.target.querySelector("button[type='submit']");
    btn.disabled = true;
    btn.innerText = "Mengirim...";

    const formData = new FormData(this);
    const data = new URLSearchParams(formData);

    fetch(SCRIPT_URL, {
      method: 'POST',
      body: data,
      mode: 'no-cors'
    })
      .then(() => {
        alert("Terima kasih, ucapan & doa Anda berhasil terkirim!");
        rsvpForm.reset();
        btn.disabled = false;
        btn.innerText = "Kirim Ucapan & Doa";
      })
      .catch(error => {
        alert("Gagal mengirim data.");
        btn.disabled = false;
        btn.innerText = "Kirim Ucapan & Doa";
      });
  });
}

// ==========================================
// 6. CONTROLLER GANTI TEMA WARNA & GAYA FONT
// ==========================================
const THEME_KEY = "wedding_theme";
const FONT_KEY = "wedding_font";

// Buka Modal Pengaturan Tema & Font
function openThemeModal() {
  const modal = document.getElementById("themeModal");
  if (modal) {
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }
}

// Tutup Modal Pengaturan Tema & Font
function closeThemeModal() {
  const modal = document.getElementById("themeModal");
  if (modal) {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }
}

// Tutup modal jika klik area luar (backdrop)
function handleThemeBackdropClick(e) {
  if (e.target && e.target.id === "themeModal") {
    closeThemeModal();
  }
}

// Menutup modal dengan tombol Escape pada keyboard
window.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeThemeModal();
    closeRekeningModal();
    closeQrisModal();
  }
});

// Set Tema Warna
function setTheme(themeName) {
  if (!themeName || themeName === "default") {
    document.documentElement.removeAttribute("data-theme");
    localStorage.removeItem(THEME_KEY);
    updateThemeSelectionUI("default");
  } else {
    document.documentElement.setAttribute("data-theme", themeName);
    localStorage.setItem(THEME_KEY, themeName);
    updateThemeSelectionUI(themeName);
  }
}

// Set Gaya Font
function setFont(fontName) {
  if (!fontName || fontName === "default") {
    document.documentElement.removeAttribute("data-font");
    localStorage.removeItem(FONT_KEY);
    updateFontSelectionUI("default");
  } else {
    document.documentElement.setAttribute("data-font", fontName);
    localStorage.setItem(FONT_KEY, fontName);
    updateFontSelectionUI(fontName);
  }
}

// Reset Tema dan Font ke Setelan Awal
function resetThemeAndFont() {
  setTheme("default");
  setFont("default");
}

// Update Tampilan Kartu Tema yang Aktif
function updateThemeSelectionUI(activeTheme) {
  const theme = activeTheme || "default";
  const cards = document.querySelectorAll(".theme-card");
  cards.forEach(card => {
    if (card.dataset.theme === theme) {
      card.classList.add("active");
    } else {
      card.classList.remove("active");
    }
  });
}

// Update Tampilan Kartu Font yang Aktif
function updateFontSelectionUI(activeFont) {
  const font = activeFont || "default";
  const cards = document.querySelectorAll(".font-card");
  cards.forEach(card => {
    if (card.dataset.font === font) {
      card.classList.add("active");
    } else {
      card.classList.remove("active");
    }
  });
}

// Inisialisasi Tema & Font dari LocalStorage
function initThemeAndFont() {
  const savedTheme = localStorage.getItem(THEME_KEY) || "default";
  const savedFont = localStorage.getItem(FONT_KEY) || "default";

  setTheme(savedTheme);
  setFont(savedFont);
}

// ==========================================
// 7. FITUR INFORMASI REKENING & KADO (CUSTOMIZABLE)
// ==========================================

// Kunci penyimpanan LocalStorage
const REKENING_STORAGE_KEY = "wedding_rekening_list_v1";
const KADO_STORAGE_KEY = "wedding_kado_alamat_v1";

/**
 * PANDUAN KUSTOMISASI VIA KODE:
 * Jika Anda ingin mengubah nomor rekening langsung dari script.js,
 * Anda dapat mengedit daftar objek di dalam DEFAULT_REKENING_LIST berikut:
 */
const DEFAULT_REKENING_LIST = [
  {
    id: "rek-1",
    bank: "BCA",
    norek: "1234567890",
    nama: "Gina",
    catatan: "Kado Pernikahan untuk Mempelai Wanita",
    qrImage: ""
  },
  {
    id: "rek-2",
    bank: "Mandiri",
    norek: "0987654321012",
    nama: "Deni Zulfikar Handi",
    catatan: "Kado Pernikahan untuk Mempelai Pria",
    qrImage: ""
  },
  {
    id: "rek-3",
    bank: "DANA",
    norek: "081234567890",
    nama: "Gina",
    catatan: "Dompet Digital DANA",
    qrImage: ""
  }
];

// Data bawaan kado fisik / pengiriman paket
const DEFAULT_KADO_ALAMAT = {
  penerima: "Gina & Deni",
  telepon: "081234567890",
  alamat: "Jl. Duren Tiga, Kec. Pancoran Kel. Duren Tiga, Kota Jakarta Selatan, DKI Jakarta 12760",
  catatan: "Harap konfirmasi terlebih dahulu melalui WhatsApp sebelum mengirim paket."
};

// Preset Opsi Bank & E-Wallet Populer
const BANK_OPTIONS = [
  { value: "BCA", label: "Bank BCA", icon: "fa-solid fa-credit-card" },
  { value: "Mandiri", label: "Bank Mandiri", icon: "fa-solid fa-building-columns" },
  { value: "BRI", label: "Bank BRI", icon: "fa-solid fa-building-columns" },
  { value: "BNI", label: "Bank BNI", icon: "fa-solid fa-building-columns" },
  { value: "BSI", label: "Bank Syariah Indonesia (BSI)", icon: "fa-solid fa-building-columns" },
  { value: "CIMB", label: "CIMB Niaga", icon: "fa-solid fa-building-columns" },
  { value: "Permata", label: "Permata Bank", icon: "fa-solid fa-building-columns" },
  { value: "Jago", label: "Bank Jago", icon: "fa-solid fa-credit-card" },
  { value: "SeaBank", label: "SeaBank", icon: "fa-solid fa-credit-card" },
  { value: "DANA", label: "DANA (E-Wallet)", icon: "fa-solid fa-wallet" },
  { value: "GoPay", label: "GoPay (E-Wallet)", icon: "fa-solid fa-wallet" },
  { value: "OVO", label: "OVO (E-Wallet)", icon: "fa-solid fa-wallet" },
  { value: "ShopeePay", label: "ShopeePay (E-Wallet)", icon: "fa-solid fa-wallet" },
  { value: "QRIS", label: "QRIS (Semua Bank / E-Wallet)", icon: "fa-solid fa-qrcode" },
  { value: "Lainnya", label: "Bank / E-Wallet Lainnya", icon: "fa-solid fa-money-bill-wave" }
];

// Variabel buffer saat modal editor kustomisasi terbuka
let currentEditorRekeningList = [];
let toastTimeout = null;

// Fungsi sanitasi HTML untuk keamanan tampilan
function escapeHtml(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Membaca data rekening dari LocalStorage atau default
function getRekeningList() {
  try {
    const raw = localStorage.getItem(REKENING_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Gagal membaca rekening dari localStorage, memakai default:", err);
  }
  return JSON.parse(JSON.stringify(DEFAULT_REKENING_LIST));
}

// Membaca data alamat kado dari LocalStorage atau default
function getKadoAlamat() {
  try {
    const raw = localStorage.getItem(KADO_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Gagal membaca alamat kado dari localStorage, memakai default:", err);
  }
  return JSON.parse(JSON.stringify(DEFAULT_KADO_ALAMAT));
}

// Cari icon berdasarkan nama bank
function getBankIcon(bankName) {
  const found = BANK_OPTIONS.find(opt => opt.value.toLowerCase() === (bankName || "").toLowerCase());
  return found ? found.icon : "fa-solid fa-credit-card";
}

// Format tampilan angka nomor rekening agar lebih mudah dibaca (tiap 4 digit dipisah spasi)
function formatNorekDisplay(norek) {
  if (!norek) return "";
  const cleaned = norek.replace(/\s+/g, "");
  // Jika hanya angka dan panjangnya antara 9 - 16 digit, format rapi 4-digit
  if (/^\d{9,16}$/.test(cleaned)) {
    return cleaned.replace(/(\d{4})/g, "$1 ").trim();
  }
  return cleaned;
}

// Render kartu-kartu rekening ke tampilan utama
function renderRekeningCards() {
  const container = document.getElementById("rekeningCardsContainer");
  if (!container) return;

  const rekeningList = getRekeningList();

  if (rekeningList.length === 0) {
    container.innerHTML = `
      <div style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 0.8rem; border: 1px dashed var(--border-gold); border-radius: 12px;">
        <i class="fa-solid fa-circle-info" style="color: var(--gold-primary); margin-bottom: 6px; font-size: 1.2rem;"></i><br>
        Belum ada informasi rekening yang ditambahkan. Silakan klik tombol di bawah untuk menambahkan.
      </div>
    `;
    return;
  }

  container.innerHTML = rekeningList.map((item, index) => {
    const bankIcon = getBankIcon(item.bank);
    const displayBank = escapeHtml(item.bank || "BANK");
    const displayNama = escapeHtml(item.nama || "-");
    const displayCatatan = item.catatan ? `<div class="rekening-card-note"><i class="fa-solid fa-circle-info"></i> ${escapeHtml(item.catatan)}</div>` : "";
    const displayNorek = formatNorekDisplay(item.norek);
    const cleanNorek = escapeHtml((item.norek || "").replace(/\s+/g, ""));
    const qrBtn = item.qrImage ? `
      <button type="button" class="btn-view-qris" onclick="openQrisModal('${encodeURIComponent(item.qrImage)}', '${displayBank}', '${displayNama}')" title="Lihat QR Code">
        <i class="fa-solid fa-qrcode"></i> <span>QR</span>
      </button>
    ` : "";

    return `
      <div class="rekening-card">
        <div class="rekening-card-top">
          <div class="rekening-bank-info">
            <span class="bank-icon-badge"><i class="${bankIcon}"></i></span>
            <span class="rekening-bank-name">${displayBank}</span>
          </div>
          <span class="rekening-card-chip" title="Kartu Digital"><i class="fa-solid fa-microchip"></i></span>
        </div>

        <div class="rekening-card-body">
          <span class="rekening-label">Nomor Rekening / E-Wallet</span>
          <div class="rekening-number-row">
            <span class="rekening-number">${displayNorek}</span>
          </div>
          <div class="rekening-holder-row">
            <span class="rekening-label">Atas Nama</span>
            <span class="rekening-holder-name">${displayNama}</span>
          </div>
          ${displayCatatan}
        </div>

        <div class="rekening-card-footer">
          <button type="button" class="btn-copy-norek" onclick="copyToClipboard('${cleanNorek}', 'No. Rekening ${displayBank} berhasil disalin!', this)" title="Salin Nomor Rekening">
            <i class="fa-regular fa-copy"></i> <span>Salin No. Rekening</span>
          </button>
          ${qrBtn}
        </div>
      </div>
    `;
  }).join("");
}

// Render data kado fisik & konfirmasi WhatsApp
function renderPhysicalGift() {
  const container = document.getElementById("physicalGiftContent");
  if (!container) return;

  const kado = getKadoAlamat();
  const penerima = escapeHtml(kado.penerima || "Gina & Deni");
  const telepon = escapeHtml(kado.telepon || "");
  const alamat = escapeHtml(kado.alamat || "");
  const catatan = kado.catatan ? escapeHtml(kado.catatan) : "";

  // Konversi nomor telepon untuk link WhatsApp (mengubah 08xx jadi 628xx)
  let cleanPhone = telepon.replace(/[^0-9]/g, "");
  if (cleanPhone.startsWith("0")) {
    cleanPhone = "62" + cleanPhone.slice(1);
  }

  const waText = encodeURIComponent(`Halo ${penerima}, saya ingin konfirmasi pengiriman kado pernikahan untuk Anda.`);
  const waUrl = cleanPhone ? `https://wa.me/${cleanPhone}?text=${waText}` : "#";

  container.innerHTML = `
    <div class="physical-gift-item">
      <span class="gift-label"><i class="fa-solid fa-user"></i> Penerima</span>
      <p class="gift-val">${penerima}</p>
    </div>
    <div class="physical-gift-item">
      <span class="gift-label"><i class="fa-solid fa-phone"></i> Nomor Telepon / WA</span>
      <p class="gift-val">${telepon || "-"}</p>
    </div>
    <div class="physical-gift-item">
      <span class="gift-label"><i class="fa-solid fa-location-dot"></i> Alamat Lengkap</span>
      <p class="gift-val">${alamat || "-"}</p>
    </div>
    ${catatan ? `
      <div class="physical-gift-item">
        <span class="gift-label"><i class="fa-solid fa-note-sticky"></i> Catatan Pengiriman</span>
        <p class="gift-val" style="font-style: italic; color: var(--gold-light);">${catatan}</p>
      </div>
    ` : ""}

    <div class="physical-gift-actions">
      <button type="button" class="btn-copy-address" onclick="copyToClipboard('${alamat.replace(/'/g, "\\'")}', 'Alamat pengiriman berhasil disalin!', this)">
        <i class="fa-regular fa-copy"></i> Salin Alamat
      </button>
      ${cleanPhone ? `
        <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-confirm-wa">
          <i class="fa-brands fa-whatsapp"></i> Konfirmasi Kado
        </a>
      ` : ""}
    </div>
  `;
}

// Buka/Tutup seksi kado fisik
function togglePhysicalGift() {
  const content = document.getElementById("physicalGiftContent");
  const btn = document.querySelector(".btn-toggle-physical");
  if (!content) return;

  const isHidden = content.classList.contains("hidden");
  if (isHidden) {
    content.classList.remove("hidden");
    if (btn) btn.classList.add("active");
  } else {
    content.classList.add("hidden");
    if (btn) btn.classList.remove("active");
  }
}

// Fungsi salin teks ke clipboard dengan toast & feedback animasi tombol
function copyToClipboard(text, customMessage, btnElement) {
  if (!text) return;

  const successMessage = customMessage || "Berhasil disalin ke clipboard!";

  // Menggunakan Clipboard API modern dengan fallback
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showCopyToast(successMessage);
      markButtonAsCopied(btnElement);
    }).catch(() => {
      fallbackCopy(text, successMessage, btnElement);
    });
  } else {
    fallbackCopy(text, successMessage, btnElement);
  }
}

// Fallback jika navigator.clipboard tidak didukung / iframe tanpa izin
function fallbackCopy(text, successMessage, btnElement) {
  try {
    const tempInput = document.createElement("textarea");
    tempInput.value = text;
    tempInput.style.position = "fixed";
    tempInput.style.left = "-9999px";
    tempInput.style.top = "-9999px";
    document.body.appendChild(tempInput);
    tempInput.focus();
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    showCopyToast(successMessage);
    markButtonAsCopied(btnElement);
  } catch (err) {
    alert("Gagal menyalin otomatis. Silakan salin secara manual: " + text);
  }
}

// Efek visual tombol saat berhasil disalin
function markButtonAsCopied(btnElement) {
  if (!btnElement) return;
  const originalHtml = btnElement.innerHTML;
  btnElement.classList.add("copied");
  btnElement.innerHTML = `<i class="fa-solid fa-check"></i> <span>Tersalin!</span>`;

  setTimeout(() => {
    btnElement.classList.remove("copied");
    btnElement.innerHTML = originalHtml;
  }, 2200);
}

// Tampilkan Toast Notifikasi
function showCopyToast(message) {
  const toast = document.getElementById("copyToast");
  const textSpan = document.getElementById("copyToastText");
  if (!toast) return;

  if (textSpan) {
    textSpan.innerText = message;
  }

  toast.classList.add("show");

  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// ==========================================
// MODAL EDITOR KUSTOM REKENING (ADMIN / PENGGUNA)
// ==========================================

function openRekeningModal() {
  const modal = document.getElementById("rekeningModal");
  if (!modal) return;

  // Muat data saat ini ke buffer editor
  currentEditorRekeningList = JSON.parse(JSON.stringify(getRekeningList()));

  // Render form daftar rekening
  renderRekeningEditorList();

  // Muat data kado fisik
  const kado = getKadoAlamat();
  const inputPenerima = document.getElementById("editKadoPenerima");
  const inputTelepon = document.getElementById("editKadoTelepon");
  const inputAlamat = document.getElementById("editKadoAlamat");
  const inputCatatan = document.getElementById("editKadoCatatan");

  if (inputPenerima) inputPenerima.value = kado.penerima || "";
  if (inputTelepon) inputTelepon.value = kado.telepon || "";
  if (inputAlamat) inputAlamat.value = kado.alamat || "";
  if (inputCatatan) inputCatatan.value = kado.catatan || "";

  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeRekeningModal() {
  const modal = document.getElementById("rekeningModal");
  if (modal) {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }
}

function handleRekeningBackdropClick(e) {
  if (e.target && e.target.id === "rekeningModal") {
    closeRekeningModal();
  }
}

// Sinkronkan input yang sedang diketik di modal ke dalam array buffer memori
function syncEditorInputsToMemory() {
  const container = document.getElementById("rekeningEditorList");
  if (!container) return;

  const rows = container.querySelectorAll(".rekening-editor-card");
  rows.forEach((row, index) => {
    if (currentEditorRekeningList[index]) {
      const bankSelect = row.querySelector(".editor-input-bank");
      const bankCustom = row.querySelector(".editor-input-bank-custom");
      const norekInput = row.querySelector(".editor-input-norek");
      const namaInput = row.querySelector(".editor-input-nama");
      const catatanInput = row.querySelector(".editor-input-catatan");
      const qrInput = row.querySelector(".editor-input-qr");

      let selectedBank = bankSelect ? bankSelect.value : currentEditorRekeningList[index].bank;
      if (selectedBank === "Lainnya" && bankCustom && bankCustom.value.trim()) {
        selectedBank = bankCustom.value.trim();
      }

      currentEditorRekeningList[index].bank = selectedBank || "BCA";
      currentEditorRekeningList[index].norek = norekInput ? norekInput.value.trim() : "";
      currentEditorRekeningList[index].nama = namaInput ? namaInput.value.trim() : "";
      currentEditorRekeningList[index].catatan = catatanInput ? catatanInput.value.trim() : "";
      currentEditorRekeningList[index].qrImage = qrInput ? qrInput.value.trim() : "";
    }
  });
}

// Render form list rekening di dalam modal
function renderRekeningEditorList() {
  const container = document.getElementById("rekeningEditorList");
  if (!container) return;

  if (currentEditorRekeningList.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 15px; color: var(--text-muted); font-size: 0.75rem;">
        Belum ada rekening. Klik tombol "+ Tambah" di atas untuk menambahkan.
      </div>
    `;
    return;
  }

  container.innerHTML = currentEditorRekeningList.map((item, index) => {
    // Tentukan apakah bank saat ini ada dalam daftar BANK_OPTIONS
    const isKnownBank = BANK_OPTIONS.some(b => b.value.toLowerCase() === (item.bank || "").toLowerCase());
    const selectVal = isKnownBank ? item.bank : "Lainnya";
    const customBankVal = isKnownBank ? "" : (item.bank || "");

    const optionsHtml = BANK_OPTIONS.map(b => {
      const selected = b.value.toLowerCase() === selectVal.toLowerCase() ? "selected" : "";
      return `<option value="${b.value}" ${selected}>${b.label}</option>`;
    }).join("");

    return `
      <div class="rekening-editor-card" data-index="${index}">
        <div class="editor-card-header">
          <h5><i class="fa-solid fa-credit-card"></i> Rekening #${index + 1}</h5>
          <button type="button" class="btn-del-rekening" onclick="removeRekeningRow(${index})" title="Hapus rekening ini">
            <i class="fa-solid fa-trash-can"></i> Hapus
          </button>
        </div>

        <div class="rekening-form-group">
          <label>Bank / E-Wallet</label>
          <select class="editor-input-bank" onchange="handleBankSelectChange(this, ${index})">
            ${optionsHtml}
          </select>
        </div>

        <div class="rekening-form-group editor-custom-bank-group ${selectVal === "Lainnya" ? "" : "hidden"}">
          <label>Nama Bank Kustom</label>
          <input type="text" class="editor-input-bank-custom" value="${escapeHtml(customBankVal)}" placeholder="Contoh: Bank Danamon / Jenius">
        </div>

        <div class="rekening-form-group">
          <label>Nomor Rekening / No. HP E-Wallet</label>
          <input type="text" class="editor-input-norek" value="${escapeHtml(item.norek || "")}" placeholder="Contoh: 1234567890">
        </div>

        <div class="rekening-form-group">
          <label>Atas Nama (a.n)</label>
          <input type="text" class="editor-input-nama" value="${escapeHtml(item.nama || "")}" placeholder="Contoh: Gina">
        </div>

        <div class="rekening-form-group">
          <label>Catatan Tambahan (Opsional)</label>
          <input type="text" class="editor-input-catatan" value="${escapeHtml(item.catatan || "")}" placeholder="Contoh: Hadiah untuk mempelai wanita">
        </div>

        <div class="rekening-form-group">
          <label>URL Gambar QRIS (Opsional)</label>
          <input type="text" class="editor-input-qr" value="${escapeHtml(item.qrImage || "")}" placeholder="Contoh: https://.../qris.jpg">
        </div>
      </div>
    `;
  }).join("");
}

// Handler saat opsi bank diubah ke 'Lainnya'
function handleBankSelectChange(selectElem, index) {
  const parentCard = selectElem.closest(".rekening-editor-card");
  if (!parentCard) return;
  const customGroup = parentCard.querySelector(".editor-custom-bank-group");
  if (customGroup) {
    if (selectElem.value === "Lainnya") {
      customGroup.classList.remove("hidden");
    } else {
      customGroup.classList.add("hidden");
    }
  }
}

// Tambah baris rekening baru di editor
function addNewRekeningRow() {
  syncEditorInputsToMemory();
  currentEditorRekeningList.push({
    id: "rek-" + Date.now(),
    bank: "BCA",
    norek: "",
    nama: "",
    catatan: "",
    qrImage: ""
  });
  renderRekeningEditorList();
}

// Hapus baris rekening dari editor
function removeRekeningRow(index) {
  syncEditorInputsToMemory();
  currentEditorRekeningList.splice(index, 1);
  renderRekeningEditorList();
}

// Simpan kustomisasi rekening & alamat kado ke LocalStorage
function saveRekeningCustomization() {
  syncEditorInputsToMemory();

  // Validasi: saring rekening yang memiliki bank dan nomor rekening
  const validList = currentEditorRekeningList.filter(item => item.norek && item.norek.trim().length > 0);

  // Simpan daftar rekening
  localStorage.setItem(REKENING_STORAGE_KEY, JSON.stringify(validList));

  // Simpan data alamat kado fisik
  const inputPenerima = document.getElementById("editKadoPenerima");
  const inputTelepon = document.getElementById("editKadoTelepon");
  const inputAlamat = document.getElementById("editKadoAlamat");
  const inputCatatan = document.getElementById("editKadoCatatan");

  const kadoData = {
    penerima: inputPenerima ? inputPenerima.value.trim() : "Gina & Deni",
    telepon: inputTelepon ? inputTelepon.value.trim() : "",
    alamat: inputAlamat ? inputAlamat.value.trim() : "",
    catatan: inputCatatan ? inputCatatan.value.trim() : ""
  };

  localStorage.setItem(KADO_STORAGE_KEY, JSON.stringify(kadoData));

  // Render ulang komponen di tampilan utama
  renderRekeningCards();
  renderPhysicalGift();

  // Tutup modal dan beri notifikasi
  closeRekeningModal();
  showCopyToast("Informasi rekening & kado berhasil diperbarui!");
}

// Kembalikan ke setelan default
function resetRekeningToDefault() {
  if (confirm("Apakah Anda yakin ingin mengembalikan informasi rekening & kado ke setelan bawaan?")) {
    localStorage.removeItem(REKENING_STORAGE_KEY);
    localStorage.removeItem(KADO_STORAGE_KEY);

    currentEditorRekeningList = JSON.parse(JSON.stringify(DEFAULT_REKENING_LIST));
    renderRekeningEditorList();

    const inputPenerima = document.getElementById("editKadoPenerima");
    const inputTelepon = document.getElementById("editKadoTelepon");
    const inputAlamat = document.getElementById("editKadoAlamat");
    const inputCatatan = document.getElementById("editKadoCatatan");

    if (inputPenerima) inputPenerima.value = DEFAULT_KADO_ALAMAT.penerima;
    if (inputTelepon) inputTelepon.value = DEFAULT_KADO_ALAMAT.telepon;
    if (inputAlamat) inputAlamat.value = DEFAULT_KADO_ALAMAT.alamat;
    if (inputCatatan) inputCatatan.value = DEFAULT_KADO_ALAMAT.catatan;

    renderRekeningCards();
    renderPhysicalGift();

    showCopyToast("Informasi rekening dikembalikan ke default!");
  }
}

// ==========================================
// MODAL QRIS PREVIEW
// ==========================================

function openQrisModal(encodedUrl, bank, nama) {
  const modal = document.getElementById("qrisModal");
  const img = document.getElementById("qrisModalImage");
  const title = document.getElementById("qrisModalTitle");
  const nameElem = document.getElementById("qrisModalName");

  if (!modal || !img) return;

  const url = decodeURIComponent(encodedUrl);
  img.src = url;
  if (title) title.innerText = `QRIS ${bank || ""}`;
  if (nameElem) nameElem.innerText = `a.n ${nama || ""}`;

  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeQrisModal() {
  const modal = document.getElementById("qrisModal");
  if (modal) {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }
}

// Inisialisasi awal fitur rekening
function initRekeningFeature() {
  renderRekeningCards();
  renderPhysicalGift();
}

