// Landing Page CINNEFLIX - Script Principal

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('CINNEFLIX Landing Page carregada com sucesso!');
    
    // Inicializa animações suaves
    initSmoothAnimations();
    
    // Inicializa lazy loading para imagens
    initLazyLoading();
    
    // Adiciona efeitos de hover nos cards
    initCardEffects();
    
    // Inicializa carrossel das provas sociais
    initSocialProofCarousel();
    
    // Força autoplay para navegadores restritivos
    forceAutoplay();
});

// Função para inicializar animações suaves
function initSmoothAnimations() {
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });
}

// Função para inicializar lazy loading das imagens
function initLazyLoading() {
    // Apenas imagens que realmente precisam de lazy + críticas que devem ficar visíveis (logos e provas sociais)
    const images = document.querySelectorAll('img[loading="lazy"], .proof-image, img.streaming-logo');
    const supportsIO = 'IntersectionObserver' in window;

    const reveal = (img) => {
        img.style.opacity = '1';
    };

    if (supportsIO) {
        const imageObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    reveal(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { root: null, rootMargin: '200px 0px', threshold: 0 });

        images.forEach(img => {
            // Não esconda logos de streaming e provas sociais inicialmente no mobile
            if (img.classList.contains('proof-image') || img.classList.contains('streaming-logo')) {
                img.style.opacity = '1';
            } else {
                img.style.opacity = '0';
            }
            img.style.transition = 'opacity 0.5s ease';
            imageObserver.observe(img);
        });
    } else {
        // Fallback: se IO não existir, garanta visibilidade
        images.forEach(img => {
            reveal(img);
        });
    }

    // Fallback de segurança: após o load, qualquer imagem ainda oculta é exibida
    window.addEventListener('load', () => {
        document.querySelectorAll('img').forEach(img => {
            if (getComputedStyle(img).opacity === '0') {
                img.style.opacity = '1';
            }
        });
    });
}

// Função para inicializar efeitos do carrossel de provas sociais
function initSocialProofCarousel() {
    const carousel = document.querySelector('.carousel-track');
    if (!carousel) return;

    // Garante que a animação esteja sempre rodando (sem pausa no hover)
    carousel.style.animationPlayState = 'running';

    // Abre modal ao clicar em qualquer prova social
    const proofImages = document.querySelectorAll('.proof-image');
    proofImages.forEach(image => {
        image.addEventListener('click', () => openImageModal(image.src));
        // Remove listeners antigos de hover, caso existam
        image.onmouseenter = null;
        image.onmouseleave = null;
    });

    console.log('Carrossel de provas sociais inicializado (sem pausa no hover)');
}

// Função para adicionar efeitos nos cards
 function initCardEffects() {
     // Efeitos nos cards de benefícios
     const benefitCards = document.querySelectorAll('.benefit-card');
     benefitCards.forEach(card => {
         card.addEventListener('mouseenter', function() {
             this.style.transform = 'translateY(-10px) scale(1.02)';
         });
         
         card.addEventListener('mouseleave', function() {
             this.style.transform = 'translateY(0) scale(1)';
         });
     });
     
     // Removido: efeitos de hover nas logos de streaming (requisito: sem animações)
     const streamingLogos = document.querySelectorAll('.streaming-logo');
     streamingLogos.forEach(logo => {
         // Garante que nenhum estilo inline anterior fique ativo
         logo.style.transform = 'none';
         logo.style.filter = 'none';
         // Remove possíveis listeners legados
         logo.onmouseenter = null;
         logo.onmouseleave = null;
     });
     
     // Efeitos nos cards de depoimentos
     const testimonialCards = document.querySelectorAll('.testimonial-card');
     testimonialCards.forEach(card => {
         card.addEventListener('mouseenter', function() {
             this.style.transform = 'translateY(-8px) scale(1.02)';
         });
         
         card.addEventListener('mouseleave', function() {
             this.style.transform = 'translateY(0) scale(1)';
         });
     });
 }

// Função para scroll suave entre seções
function smoothScrollTo(targetId) {
    const target = document.getElementById(targetId);
    if (target) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Função para detectar se o elemento está visível na tela
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Função para adicionar classe de animação quando elemento entra na tela
function animateOnScroll() {
    const elements = document.querySelectorAll('.benefit-card, .streaming-logo, .testimonial-card');
    
    elements.forEach(element => {
        if (isElementInViewport(element)) {
            element.classList.add('animate-in');
        }
    });
}

// Event listener para scroll
window.addEventListener('scroll', animateOnScroll);

// Função para otimizar performance do scroll
let ticking = false;

function updateOnScroll() {
    animateOnScroll();
    ticking = false;
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateOnScroll);
        ticking = true;
    }
}

window.addEventListener('scroll', requestTick);

// Função para tratar erros de carregamento de imagens
function handleImageError(img) {
    img.style.display = 'none';
    console.warn('Erro ao carregar imagem:', img.src);
}

// Adiciona tratamento de erro para todas as imagens
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            handleImageError(this);
        });
    });
});

// Função para verificar se o vídeo do YouTube está carregando corretamente
function checkVideoLoad() {
    const iframe = document.querySelector('.video-container iframe');
    if (iframe) {
        iframe.addEventListener('load', function() {
            console.log('Vídeo do YouTube carregado com sucesso!');
            // Força autoplay após carregamento
            setTimeout(() => {
                try {
                    iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                } catch (e) {
                    console.log('Tentativa de autoplay via postMessage');
                }
            }, 1000);
        });
        
        iframe.addEventListener('error', function() {
            console.error('Erro ao carregar vídeo do YouTube');
        });
    }
}

// Função para forçar autoplay em navegadores restritivos
function forceAutoplay() {
    const iframe = document.querySelector('.video-container iframe');
    if (iframe) {
        // Adiciona atributos para melhor compatibilidade
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
        
        // Tenta interação do usuário para habilitar autoplay
        document.addEventListener('click', function enableAutoplay() {
            try {
                iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                document.removeEventListener('click', enableAutoplay);
            } catch (e) {
                console.log('Autoplay habilitado após interação do usuário');
            }
        }, { once: true });
    }
}

// Inicializa verificação do vídeo
checkVideoLoad();

// Função para adicionar efeito de parallax suave (opcional)
function initParallaxEffect() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Descomenta a linha abaixo se quiser ativar o efeito parallax
// initParallaxEffect();

// Função para debug - mostra informações no console
function debugInfo() {
    console.log('=== CINNEFLIX Landing Page Debug ===');
    console.log('Seções encontradas:', document.querySelectorAll('section').length);
    console.log('Cards de benefícios:', document.querySelectorAll('.benefit-card').length);
    console.log('Cards de streaming:', document.querySelectorAll('.streaming-card').length);
    console.log('Cards de depoimentos:', document.querySelectorAll('.testimonial-card').length);
    console.log('Imagens encontradas:', document.querySelectorAll('img').length);
}

// Executa debug em desenvolvimento
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    debugInfo();
}


// Cria o modal de imagem se não existir
function ensureImageModal() {
    if (document.querySelector('.image-modal')) return;
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `
        <button class="image-modal-close" aria-label="Fechar">×</button>
        <img class="image-modal-img" alt="Visualização da imagem" />
    `;
    document.body.appendChild(modal);

    // Eventos de fechar
    modal.addEventListener('click', (e) => {
        // Fecha ao clicar no overlay (fora da imagem) ou no botão X
        if (e.target.classList.contains('image-modal') || e.target.classList.contains('image-modal-close')) {
            closeImageModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeImageModal();
    });
}

function openImageModal(src) {
    ensureImageModal();
    const modal = document.querySelector('.image-modal');
    const img = modal.querySelector('.image-modal-img');
    img.src = src;
    modal.classList.add('open');
}

function closeImageModal() {
    const modal = document.querySelector('.image-modal');
    if (!modal) return;
    modal.classList.remove('open');
}

// Garante criação do modal após o DOM estar pronto
document.addEventListener('DOMContentLoaded', () => {
    ensureImageModal();
});