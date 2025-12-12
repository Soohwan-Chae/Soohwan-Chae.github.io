  <script>
    // 1. 스크롤 시 헤더 그림자
    window.addEventListener('scroll', function () {
      const header = document.querySelector('.top-nav');
      if (window.scrollY > 0) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });

    // 2. 모바일 메뉴 (햄버거 버튼) 토글
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburgerBtn) {
      hamburgerBtn.addEventListener('click', () => {
        if (mobileMenu.style.display === 'flex') {
          mobileMenu.style.display = 'none';
        } else {
          mobileMenu.style.display = 'flex';
        }
      });
    }

    // 3. 모바일 프로필 링크 (Related Link) 토글
    const relatedLinksBtn = document.getElementById('relatedLinksBtn');
    const profileInfoList = document.getElementById('profileInfoList');

    if (relatedLinksBtn) {
      relatedLinksBtn.addEventListener('click', () => {
        profileInfoList.classList.toggle('show');
      });
    }
  </script>
