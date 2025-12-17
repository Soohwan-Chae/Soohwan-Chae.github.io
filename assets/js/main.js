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
// Related Links 전용: backdrop + (선택) 스크롤 잠금 모달
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

function openModalOverlay({ onOpen, onClose, lockScroll = true }) {
  // 다른 모달 열려 있으면 닫기
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
  lockBodyScroll(!!lockScroll);

  bd.addEventListener('click', onBackdropClick);
  document.addEventListener('keydown', onKeyDown);

  activeClose = close;
  onOpen(true, close);
}

// ==============================
// 2) 모바일 메뉴(햄버거): backdrop 없이 팝업 (✅ 멈춤 버그 제거)
//    - 바깥 클릭/터치 또는 ESC로 닫힘
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

  let menuOpen = false;

  const closeMenu = () => {
    if (!menuOpen) return;

    mobileMenu.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    menuOpen = false;

    document.removeEventListener('click', onDocPointer, true);
    document.removeEventListener('touchstart', onDocPointer, true);
    document.removeEventListener('keydown', onKeyDown);
  };

  const openMenu = () => {
    // 혹시 다른 모달이 열려 있으면 닫기(상태 꼬임 방지)
    if (typeof activeClose === 'function') activeClose();

    mobileMenu.classList.add('open');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    menuOpen = true;

    // 메뉴 안 링크 클릭하면 닫기
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeMenu, { once: true });
    });

    menuCloseBtn.onclick = closeMenu;

    document.addEventListener('click', onDocPointer, true);
    document.addEventListener('touchstart', onDocPointer, true);
    document.addEventListener('keydown', onKeyDown);
  };

  const onDocPointer = (e) => {
    // 메뉴/버튼 바깥을 누르면 닫기
    if (mobileMenu.contains(e.target) || hamburgerBtn.contains(e.target)) return;
    closeMenu();
  };

  const onKeyDown = (e) => {
    if (e.key === 'Escape') closeMenu();
  };

  hamburgerBtn.addEventListener('click', () => {
    if (menuOpen) closeMenu();
    else openMenu();
  });
}

// ==============================
// 3) 모바일 Related Link: 모달(backdrop+스크롤잠금)
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

    openModalOverlay({
      lockScroll: true,
      onOpen: (open, closeCb) => setOpen(open, closeCb),
      onClose: () => setOpen(false)
    });
  });
}
