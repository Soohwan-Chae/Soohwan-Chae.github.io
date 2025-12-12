// 1) 스크롤 시 헤더 효과
window.addEventListener('scroll', function () {
  const header = document.querySelector('.top-nav');
  if (!header) return;

  if (window.scrollY > 0) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
});

// 2) 모바일 메뉴 토글
const hamburgerBtn = document.querySelector('.hamburger-btn');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburgerBtn && mobileMenu) {
  hamburgerBtn.addEventListener('click', () => {
    mobileMenu.style.display = (mobileMenu.style.display === 'flex') ? 'none' : 'flex';
  });
}

// 3) 모바일 Related Link 토글
const relatedLinksBtn = document.getElementById('relatedLinksBtn');
const profileInfoList = document.getElementById('profileInfoList');

if (relatedLinksBtn && profileInfoList) {
  relatedLinksBtn.addEventListener('click', () => {
    profileInfoList.classList.toggle('show');
  });
}
