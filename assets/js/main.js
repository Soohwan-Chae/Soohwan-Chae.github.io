// ==============================
// 1) 스크롤 시 헤더 효과
// ==============================
window.addEventListener('scroll', function () {
  const header = document.querySelector('.top-nav');
  if (!header) return;

  if (window.scrollY > 0) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
});

// ==============================
// Overlay Manager (backdrop + close 관리)
// ==============================
let activeClose = null;

function ensureBackdrop() {
  let bd = document.getElementById('uiBackdrop');
  if (!bd) {
    bd = document.createElement('div');
    bd.id = 'uiBackdrop';
    bd.className = 'ui-backdrop';
    document.body.appendChild(bd);
  }
  return bd;
}

function lockBodyScroll(lock) {
  if (lock) document.body.classList.add('modal-open');
  else document.body.classList.remove('modal-open');
}

function openOverlay({ onOpen, onClose, lockScroll = false }) {
  // 다른 오버레이 열려 있으면 먼저 닫기
  if (typeof activeClose === 'function') activeClose();

  const bd = ensureBackdrop();

  const close = () => {
    try { onOpen(false); } catch (e) {}

    bd.classList.remove('show');
    setTimeout(() => { bd.style.display = 'none'; }, 160);

    lockBodyScroll(false);

    bd.removeEventListener('click', onBackdropClick);
    document.removeEventListener('keydown', onKeyDown);

    activeClose = null;
    if (typeof onClose === 'function') onClose();
  };

  const onBackdropClick = (e) => {
    if (e.target === bd) close();
  };
  const onKeyDown = (e) => {
    if (e.key === 'Escape') close();
  };

  bd.style.display = 'block';
  requestAnimationFrame(() => bd.classList.add('show'));

  // ✅ 햄버거 메뉴는 lockScroll=false로 사용 (멈춤 느낌 제거)
  lockBodyScroll(!!lockScroll);

  bd.addEventListener('click', onBackdropClick);
  document.addEventListener('keydown', onKeyDown);

  activeClose = close;
  onOpen(true, close);
}

// ==============================
// 2) 모바일 메뉴: "팝업" (스크롤 잠금 없음)
// ==============================
const hamburgerBtn = document.querySelector('.hamburger-btn');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburgerBtn && mobileMenu) {
  hamburgerBtn.setAttribute('aria-expanded', 'false');
  hamburgerBtn.setAttribute('aria-controls', 'mobileMenu');

  let menuCloseBtn = mobileMenu.querySelector('.ui-close-btn');
  if (!menuCloseBtn) {
    menuCloseBtn = document.createElement('button');
    menuCloseBtn.type = 'button';
    menuCloseBtn.className = 'ui-close-btn';
    menuCloseBtn.textContent = 'Close';
    mobileMenu.prepend(menuCloseBtn);
  }

  const setMenuOpen = (open, closeCb) => {
    if (open) {
      mobileMenu.classList.add('open');
      hamburgerBtn.setAttribute('aria-expanded', 'true');

      // 링크 누르면 닫기
      mobileMenu.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => closeCb && closeCb(), { once: true });
      });

      menuCloseBtn.onclick = () => closeCb && closeCb();
    } else {
      mobileMenu.classList.remove('open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
  };

  hamburgerBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    if (isOpen) {
      if (typeof activeClose === 'function') activeClose();
      else setMenuOpen(false);
      return;
    }

    openOverlay({
      lockScroll: false, // ✅ 여기 핵심
      onOpen: (open, closeCb) => setMenuOpen(open, closeCb),
      onClose: () => setMenuOpen(false)
    });
  });
}

// ==============================
// 3) 모바일 Related Link: "팝업" (스크롤 잠금 O)
// ==============================
const relatedLinksBtn = document.getElementById('relatedLinksBtn');
const profileInfoList = document.getElementById('profileInfoList');

function ensureRelatedModal() {
  let modal = document.getElementById('relatedLinksModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'relatedLinksModal';
    modal.className = 'ui-modal';
    modal.innerHTML = `
      <div class="ui-modal-header">
        <div class="ui-modal-title">Related Links</div>
        <button type="button" class="ui-close-btn">Close</button>
      </div>
      <div class="ui-modal-body" id="relatedLinksModalBody"></div>
    `;
    document.body.appendChild(modal);
  }
  return modal;
}

if (relatedLinksBtn && profileInfoList) {
  relatedLinksBtn.addEventListener('click', () => {
    const modal = ensureRelatedModal();
    const body = modal.querySelector('#relatedLinksModalBody');
    const closeBtn = modal.querySelector('.ui-close-btn');

    const setOpen = (open, closeCb) => {
      if (open) {
        body.innerHTML = '';
        const cloned = profileInfoList.cloneNode(true);
        cloned.id = '';
        cloned.classList.add('modal-list');
        cloned.style.display = 'flex';
        body.appendChild(cloned);

        body.querySelectorAll('a').forEach(a => {
          a.addEventListener('click', () => closeCb && closeCb(), { once: true });
        });

        modal.classList.add('open');
        closeBtn.onclick = () => closeCb && closeCb();
      } else {
        modal.classList.remove('open');
      }
    };

    const isOpen = modal.classList.contains('open');
    if (isOpen) {
      if (typeof activeClose === 'function') activeClose();
      else setOpen(false);
      return;
    }

    openOverlay({
      lockScroll: true, // ✅ 모달은 배경 스크롤 막는 게 자연스러움
      onOpen: (open, closeCb) => setOpen(open, closeCb),
      onClose: () => setOpen(false)
    });
  });
}
