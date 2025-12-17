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
// 공통: Backdrop(배경) + body 스크롤 잠금
// ==============================
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

function openWithBackdrop(openFn, closeFn) {
  const bd = ensureBackdrop();

  const onBackdropClick = (e) => {
    if (e.target === bd) closeFn();
  };
  const onKeyDown = (e) => {
    if (e.key === 'Escape') closeFn();
  };

  bd.style.display = 'block';
  requestAnimationFrame(() => bd.classList.add('show'));
  lockBodyScroll(true);

  bd.addEventListener('click', onBackdropClick);
  document.addEventListener('keydown', onKeyDown);

  // closeFn 안에서 이 핸들러들도 제거할 수 있게 래핑
  const wrappedClose = () => {
    openFn(false);

    bd.classList.remove('show');
    setTimeout(() => {
      bd.style.display = 'none';
    }, 160);

    lockBodyScroll(false);

    bd.removeEventListener('click', onBackdropClick);
    document.removeEventListener('keydown', onKeyDown);
  };

  openFn(true, wrappedClose);
}

// ==============================
// 2) 모바일 메뉴: "팝업" (페이지 밀지 않음)
// ==============================
const hamburgerBtn = document.querySelector('.hamburger-btn');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburgerBtn && mobileMenu) {
  // (선택) 접근성 속성
  hamburgerBtn.setAttribute('aria-expanded', 'false');
  hamburgerBtn.setAttribute('aria-controls', 'mobileMenu');

  // Close 버튼이 HTML에 없어도 JS로 주입
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

      // 메뉴 내 링크 클릭하면 자동 닫기
      const links = mobileMenu.querySelectorAll('a');
      links.forEach(a => {
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
      setMenuOpen(false);
      const bd = document.getElementById('uiBackdrop');
      if (bd) {
        bd.classList.remove('show');
        setTimeout(() => (bd.style.display = 'none'), 160);
      }
      lockBodyScroll(false);
      return;
    }

    openWithBackdrop(
      (open, closeCb) => setMenuOpen(open, closeCb),
      () => setMenuOpen(false)
    );
  });
}

// ==============================
// 3) 모바일 Related Link: "팝업" (페이지 밀지 않음)
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
        // 기존 리스트를 그대로 복제해서 팝업에 넣기
        body.innerHTML = '';
        const cloned = profileInfoList.cloneNode(true);
        cloned.id = ''; // 중복 id 방지
        cloned.classList.add('modal-list');
        cloned.style.display = 'flex'; // 강제로 보이게
        body.appendChild(cloned);

        // 링크 클릭 시 자동 닫기
        const links = body.querySelectorAll('a');
        links.forEach(a => {
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
      setOpen(false);
      const bd = document.getElementById('uiBackdrop');
      if (bd) {
        bd.classList.remove('show');
        setTimeout(() => (bd.style.display = 'none'), 160);
      }
      lockBodyScroll(false);
      return;
    }

    openWithBackdrop(
      (open, closeCb) => setOpen(open, closeCb),
      () => setOpen(false)
    );
  });
}
