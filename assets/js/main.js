document.addEventListener('DOMContentLoaded', function() {

    // Federal banner opening functionality
    const bannerButton = document.querySelector('.usa-banner__button');
    const bannerContent = document.getElementById('gov-banner');
    const cmsHeader = document.querySelector('.cms-header');
    let bannerExpanded = false;
    
    if (bannerButton && bannerContent) {
        bannerContent.style.display = 'none';
        
        bannerButton.addEventListener('click', function() {
            bannerExpanded = !bannerExpanded;
            this.setAttribute('aria-expanded', bannerExpanded);
            
            // hacky but only way i got this to expand and close with the custom banner
            if (bannerExpanded) {
                bannerContent.style.display = 'block';
                if (cmsHeader) {
                    cmsHeader.style.top = bannerContent.offsetHeight + 24 + 'px';
                }
            } else {
                bannerContent.style.display = 'none';
                if (cmsHeader) {
                    cmsHeader.style.top = '24px';
                }
            }
        });
    }
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mainMenu = document.getElementById('main-menu');
    
    if (menuToggle && mainMenu) {
        menuToggle.addEventListener('click', function() {
            const expanded = this.getAttribute('aria-expanded') === 'true' || false;
            this.setAttribute('aria-expanded', !expanded);
            mainMenu.classList.toggle('show');
        });
        
        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !mainMenu.contains(e.target) && mainMenu.classList.contains('show')) {
                mainMenu.classList.remove('show');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Show Github token
    const tokenField = document.getElementById('github-token')
    const tokenToggle = document.getElementById('show-token')

    if (tokenField && tokenToggle) {
        tokenToggle.addEventListener('click', function() {
            if (tokenField.type === 'password') {
                tokenToggle.textContent = "Hide"
                tokenField.type = "text"
            } else {
                tokenToggle.textContent = "Show"
                tokenField.type = "password"
            }
        })
    }

});