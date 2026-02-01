document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark')
    } else {
        document.documentElement.classList.remove('dark')
    }
})
const navbar = document.getElementById("navbar");
const navLink = document.getElementById("navLink");
const mobileMenu = document.getElementById("mobileMenu");

function openMenu() {
    mobileMenu.style.transform = 'translateX(-16rem)';
}

function closeMenu() {
    mobileMenu.style.transform = 'translateX(0)';
}

function toggleTheme() {
    document.documentElement.classList.toggle('dark');

    if (document.documentElement.classList.contains('dark')) {
        localStorage.theme = 'dark';
    } else {
        localStorage.theme = 'light';
    }
}

window.addEventListener('scroll', () => {
    if (scrollY > 50) {
        navbar.classList.add('bg-white', 'bg-opacity-50', 'backdrop-blur-lg', 'shadow-sm', 'dark:bg-darkTheme', 'dark:shadow-white/20');
        navLink.classList.remove('bg-white', 'shadow-sm', 'bg-opacity-50', 'dark:border', 'dark:border-white/30', "dark:bg-transparent");
    } else {
        navbar.classList.remove('bg-white', 'bg-opacity-50', 'backdrop-blur-lg', 'shadow-sm', 'dark:bg-darkTheme', 'dark:shadow-white/20');
        navLink.classList.add('bg-white', 'shadow-sm', 'bg-opacity-50', 'dark:border', 'dark:border-white/30', "dark:bg-transparent");
    }
})

// ----- Form Submission & Toast Handling -----
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const submitBtnText = submitBtn.querySelector('span');
const originalBtnContent = submitBtn.innerHTML;

contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Check access key
    const accessKey = contactForm.querySelector('input[name="access_key"]').value;
    if (accessKey === 'YOUR_ACCESS_KEY_HERE') {
        showToast('Cấu hình lỗi', 'Vui lòng điền Access Key vào index.html trước khi sử dụng!', 'error');
        return;
    }

    // Loading State
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
        <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Đang gửi...</span>
    `;

    const formData = new FormData(contactForm);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: json
    })
    .then(async (response) => {
        let res = await response.json();
        if (response.status == 200) {
            showToast('Thành công', 'Cảm ơn bạn! Tin nhắn của bạn đã được gửi đi.', 'success');
            contactForm.reset();
        } else {
            showToast('Thất bại', res.message || 'Đã có lỗi xảy ra khi gửi tin nhắn.', 'error');
        }
    })
    .catch(error => {
        showToast('Lỗi kết nối', 'Vui lòng kiểm tra kết nối mạng của bạn.', 'error');
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnContent;
    });
});

function showToast(title, message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    
    // Toast styling matching the portfolio's aesthetics
    const baseClasses = "pointer-events-auto flex items-start gap-4 p-4 rounded-xl shadow-2xl border transition-all duration-500 transform translate-x-full opacity-0 max-w-sm backdrop-blur-md";
    const typeClasses = type === 'success' 
        ? "bg-white/90 border-green-200 dark:bg-darkTheme/90 dark:border-green-800"
        : "bg-white/90 border-red-200 dark:bg-darkTheme/90 dark:border-red-800";
    
    toast.className = `${baseClasses} ${typeClasses}`;
    
    const iconColor = type === 'success' ? 'text-green-500' : 'text-red-500';
    const icon = type === 'success' 
        ? `<svg class="w-6 h-6 ${iconColor}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`
        : `<svg class="w-6 h-6 ${iconColor}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;

    toast.innerHTML = `
        <div class="shrink-0 pt-0.5">${icon}</div>
        <div class="flex-1">
            <h3 class="font-bold text-gray-900 dark:text-white">${title}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">${message}</p>
        </div>
        <button class="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" onclick="this.parentElement.remove()">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
    `;

    container.appendChild(toast);

    // Animate in
    setTimeout(() => {
        toast.classList.remove('translate-x-full', 'opacity-0');
        toast.classList.add('translate-x-0', 'opacity-100');
    }, 100);

    // Auto remove
    setTimeout(() => {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => toast.remove(), 500);
    }, 5000);
}

