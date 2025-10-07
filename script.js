// Função para verificar se um elemento está visível na tela
function isElementInView(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Função para animar os elementos ao rolar
function handleScroll() {
    const reveals = document.querySelectorAll(".reveal");
    for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const revealTop = reveals[i].getBoundingClientRect().top;
        const revealPoint = 150;

        if (revealTop < windowHeight - revealPoint) {
            reveals[i].classList.add("active");
        } else {
            reveals[i].classList.remove("active");
        }
    }
}

// Adicionar evento de scroll
window.addEventListener("scroll", handleScroll);

// Executar a função uma vez no carregamento para elementos visíveis
handleScroll();

// ------- Animação por letra na Hero -------
function splitTextToChars(element) {
    const text = element.textContent;
    element.textContent = "";
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < text.length; i++) {
        const span = document.createElement("span");
        span.className = "char";
        if (text[i] === " ") {
            span.innerHTML = "&nbsp;"; // preserva espaço visível
        } else {
            span.textContent = text[i];
        }
        span.style.transitionDelay = `${i * 40}ms`;
        fragment.appendChild(span);
    }
    element.appendChild(fragment);
}

function initHeroCharAnimation() {
    const animated = document.querySelectorAll('.animate-chars');
    animated.forEach(el => splitTextToChars(el));
    // Pequeno delay para permitir layout antes de ativar a animação
    requestAnimationFrame(() => {
        animated.forEach(el => el.classList.add('play'));
    });
}

document.addEventListener('DOMContentLoaded', initHeroCharAnimation);

// ------- Efeito de digitação na tagline (h3.typing) -------
function typeWriter(element, text, speed = 55, startDelay = 400) {
    element.textContent = "";
    let index = 0;
    element.classList.add('typing-active');
    const start = () => {
        const interval = setInterval(() => {
            element.textContent += text.charAt(index);
            index += 1;
            if (index >= text.length) {
                clearInterval(interval);
            }
        }, speed);
    };
    setTimeout(start, startDelay);
}

function initTypingEffect() {
    const typingEl = document.querySelector('.typing');
    if (!typingEl) return;
    const text = typingEl.getAttribute('data-text') || typingEl.textContent;
    typeWriter(typingEl, text, 55, 500);
}

document.addEventListener('DOMContentLoaded', initTypingEffect);

// ------- Header compacto ao scroll e Scrollspy + Progress -------
function updateProgressBar() {
    const progress = document.querySelector('.progress-bar');
    if (!progress) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const width = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progress.style.width = `${width}%`;
}

function toggleHeaderCompact() {
    const header = document.querySelector('.header');
    if (!header) return;
    const scrolled = (window.scrollY || document.documentElement.scrollTop) > 10;
    header.classList.toggle('is-scrolled', scrolled);
}

function scrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let currentId = '';
    const fromTop = window.scrollY + 100;
    sections.forEach(sec => {
        const rect = sec.getBoundingClientRect();
        const top = window.scrollY + rect.top;
        if (fromTop >= top && fromTop < top + sec.offsetHeight) {
            currentId = sec.id;
        }
    });
    navLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        const id = href.startsWith('#') ? href.slice(1) : '';
        link.classList.toggle('active', id === currentId);
    });
}

function onScrollGlobal() {
    updateProgressBar();
    toggleHeaderCompact();
    scrollSpy();
}

window.addEventListener('scroll', onScrollGlobal);
document.addEventListener('DOMContentLoaded', () => {
    updateProgressBar();
    toggleHeaderCompact();
    scrollSpy();
});

// ------- Formulário de Contato -------
function handleContactForm(event) {
    event.preventDefault();
    
    const form = document.getElementById('contactForm');
    const formData = new FormData(form);
    
    // Coletar dados do formulário
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Criar link mailto com os dados
    const mailtoLink = `mailto:thiagonaoki2013@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        `Nome: ${name}\nE-mail: ${email}\n\nMensagem:\n${message}`
    )}`;
    
    // Abrir cliente de e-mail
    window.location.href = mailtoLink;
    
    // Feedback visual
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>E-mail Aberto!</span>
    `;
    submitBtn.style.background = 'var(--success)';
    
    setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
        form.reset();
    }, 3000);
}

// Adicionar evento ao formulário
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
});