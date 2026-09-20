/* =========================================================
   JAPATATAS - Script principal
   Suporte a: desktop, tablet e celular (swipe + menu)
   ========================================================= */

/* ===== ELEMENTOS DO CARROSSEL ===== */
const prevButton = document.getElementById('prev')
const nextButton = document.getElementById('next')
const items = document.querySelectorAll('.item')
const dots = document.querySelectorAll('.dot')
const numberIndicator = document.querySelector('.numbers')
const list = document.querySelector('.list')

/* ===== ELEMENTOS DO MENU MOBILE ===== */
const menuToggle = document.getElementById('menuToggle')
const navMenu = document.getElementById('navMenu')

/* ===== ESTADO ===== */
let active = 0
const total = items.length
let timer = null
const AUTOPLAY_TIME = 6000 // 6 segundos

/* =========================================================
   FUNÇÃO PRINCIPAL — troca de slide
   direction > 0 → próximo
   direction < 0 → anterior
   ========================================================= */
function update(direction) {
    const currentItem = document.querySelector('.item.active')
    const currentDot = document.querySelector('.dot.active')

    if (currentItem) currentItem.classList.remove('active')
    if (currentDot) currentDot.classList.remove('active')

    if (direction > 0) {
        active = active + 1
        if (active >= total) active = 0
    } else if (direction < 0) {
        active = active - 1
        if (active < 0) active = total - 1
    }

    items[active].classList.add('active')
    dots[active].classList.add('active')

    numberIndicator.textContent = String(active + 1).padStart(2, '0')
}

/* =========================================================
   AUTOPLAY
   ========================================================= */
function startTimer() {
    clearInterval(timer)
    timer = setInterval(() => update(1), AUTOPLAY_TIME)
}

function stopTimer() {
    clearInterval(timer)
    timer = null
}

/* =========================================================
   BOTÕES DE NAVEGAÇÃO (setas)
   ========================================================= */
prevButton.addEventListener('click', () => {
    update(-1)
    startTimer()
})

nextButton.addEventListener('click', () => {
    update(1)
    startTimer()
})

/* =========================================================
   MENU HAMBÚRGUER (mobile)
   ========================================================= */
if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active')
        navMenu.classList.toggle('active')
    })

    /* Fecha o menu ao clicar em qualquer item */
    document.querySelectorAll('nav ul li').forEach(li => {
        li.addEventListener('click', () => {
            menuToggle.classList.remove('active')
            navMenu.classList.remove('active')
        })
    })

    /* Fecha o menu ao clicar fora dele */
    document.addEventListener('click', (e) => {
        const clickedInsideMenu = navMenu.contains(e.target)
        const clickedOnToggle = menuToggle.contains(e.target)

        if (!clickedInsideMenu && !clickedOnToggle && navMenu.classList.contains('active')) {
            menuToggle.classList.remove('active')
            navMenu.classList.remove('active')
        }
    })
}

/* =========================================================
   SWIPE (arrastar o dedo) — mobile/tablet
   ========================================================= */
let touchStartX = 0
let touchStartY = 0
let touchEndX = 0
let touchEndY = 0
const SWIPE_THRESHOLD = 50 // distância mínima em px

if (list) {
    list.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX
        touchStartY = e.changedTouches[0].screenY
    }, { passive: true })

    list.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX
        touchEndY = e.changedTouches[0].screenY
        handleSwipe()
    }, { passive: true })
}

function handleSwipe() {
    const diffX = touchStartX - touchEndX
    const diffY = touchStartY - touchEndY

    /* Ignora se o movimento vertical foi maior que o horizontal
       (evita conflito com scroll) */
    if (Math.abs(diffY) > Math.abs(diffX)) return

    if (Math.abs(diffX) > SWIPE_THRESHOLD) {
        if (diffX > 0) {
            update(1)   // arrastou para a esquerda → próximo
        } else {
            update(-1)  // arrastou para a direita → anterior
        }
        startTimer()
    }
}

/* =========================================================
   SUPORTE A TECLADO (desktop)
   Setas ← e → trocam de slide
   ========================================================= */
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        update(1)
        startTimer()
    } else if (e.key === 'ArrowLeft') {
        update(-1)
        startTimer()
    } else if (e.key === 'Escape') {
        /* Fecha menu mobile com ESC */
        if (menuToggle && navMenu) {
            menuToggle.classList.remove('active')
            navMenu.classList.remove('active')
        }
    }
})

/* =========================================================
   PAUSA O AUTOPLAY QUANDO A ABA NÃO ESTÁ VISÍVEL
   (economiza bateria no celular)
   ========================================================= */
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopTimer()
    } else {
        startTimer()
    }
})

/* =========================================================
   PAUSA O AUTOPLAY AO INTERAGIR (toque/clique no slide)
   Retoma depois de 8 segundos de inatividade
   ========================================================= */
let inactivityTimer = null

function resetInactivity() {
    stopTimer()
    clearTimeout(inactivityTimer)
    inactivityTimer = setTimeout(() => {
        startTimer()
    }, 8000)
}

if (list) {
    list.addEventListener('touchstart', resetInactivity, { passive: true })
    list.addEventListener('mousedown', resetInactivity)
}

/* =========================================================
   INICIA O AUTOPLAY
   ========================================================= */
startTimer()
