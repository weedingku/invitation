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
// 3. COUNTDOWN TIMER (01 NOVEMBER 2026)
// ==========================================
const targetDate = new Date("November 1, 2026 09:00:00").getTime();

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
