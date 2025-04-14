document.addEventListener('DOMContentLoaded', initializePage);

function initializePage() {
    initializeBanner()
    initializeMobileMenu()
    initializeTokenToggle()
    initializeChipsInput()
    generateIndexJSON()
}

function initializeBanner() {
    const bannerButton = document.querySelector('.usa-banner__button')
    const bannerContent = document.getElementById('gov-banner')
    const cmsHeader = document.querySelector('.cms-header')
    let bannerExpanded = false

    if (!bannerButton || !bannerContent) return;

    bannerContent.style.display = 'none'

    bannerButton.addEventListener('click', function () {
        bannerExpanded = !bannerExpanded
        this.setAttribute('aria-expanded', bannerExpanded)

        toggleBannerVisibility(bannerExpanded, bannerContent, cmsHeader)
    });
}

function toggleBannerVisibility(isExpanded, bannerContent, cmsHeader) {
    if (isExpanded) {
        bannerContent.style.display = 'block'
        if (cmsHeader) {
            cmsHeader.style.top = bannerContent.offsetHeight + 24 + 'px'
        }
    } else {
        bannerContent.style.display = 'none'
        if (cmsHeader) {
            cmsHeader.style.top = '24px'
        }
    }
}

function initializeMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle')
    const mainMenu = document.getElementById('main-menu')

    if (!menuToggle || !mainMenu) return

    menuToggle.addEventListener('click', function () {
        const expanded = this.getAttribute('aria-expanded') === 'true' || false;
        this.setAttribute('aria-expanded', !expanded)
        mainMenu.classList.toggle('show')
    });
}

function initializeTokenToggle() {
    const tokenField = document.getElementById('github-token')
    const tokenToggle = document.getElementById('show-token')

    if (!tokenField || !tokenToggle) return

    tokenToggle.addEventListener('click', function () {
        if (tokenField.type === 'password') {
            tokenToggle.textContent = "Hide"
            tokenField.type = "text"
        } else {
            tokenToggle.textContent = "Show"
            tokenField.type = "password"
        }
    });
}

function initializeChipsInput() {
    const removeButtonHTML = '<button aria-label="remove this chip">×</button>';
    
    function updateHiddenInput() {
        const chipValues = [];
        document.querySelectorAll('.chip').forEach(chip => {
            const chipText = chip.textContent.replace('×', '').trim();
            chipValues.push(chipText);
        });
        
        const hiddenInput = document.getElementById('github-orgs');
        hiddenInput.value = chipValues.join(',');
    }
    
    function createChip(text) {
        if (!text || text.trim() === '') return;
        
        let isDuplicate = false;
        document.querySelectorAll('.chip').forEach(chip => {
            const chipText = chip.textContent.replace('×', '').trim();
            if (chipText.toLowerCase() === text.toLowerCase()) {
                isDuplicate = true;
            }
        });
        
        if (!isDuplicate) {
            const chipHTML = document.createElement('span');
            chipHTML.className = 'chip';
            chipHTML.innerHTML = escapeHTML(text) + removeButtonHTML;
            
            const input = document.getElementById('github-orgs-input');
            input.parentNode.insertBefore(chipHTML, input);
            
            updateHiddenInput();
        }
    }
    
    function escapeHTML(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    
    function initializeFromValue() {
        const hiddenInput = document.getElementById('github-orgs');
        const value = hiddenInput.value;
        
        if (value) {
            const values = value.split(',');
            values.forEach(val => {
                createChip(val.trim());
            });
        }
    }
    
    const chipsContainer = document.querySelector('.chips-input > .inner');
    if (chipsContainer) {
        chipsContainer.addEventListener('click', function(e) {
            if (e.target === this) {
                this.querySelector('input[type="text"]').focus();
            }
        });
        
        const input = document.getElementById('github-orgs-input');
        if (input) {
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === 'Tab' || e.key === ',') {
                    e.preventDefault();
                    let value = this.value;
                    
                    if (e.key === ',') {
                        value = value.substring(0, value.length - 1);
                    }
                    
                    createChip(value.trim());
                    this.value = '';
                }
                else if (e.key === 'Backspace' && this.value === '') {
                    const chips = document.querySelectorAll('.chip');
                    if (chips.length > 0) {
                        chips[chips.length - 1].remove();
                        updateHiddenInput();
                    }
                }
            });
        }
        
        document.addEventListener('click', function(e) {
            if (e.target.closest('.chip > button')) {
                const chip = e.target.closest('.chip');
                if (chip) {
                    chip.remove();
                    updateHiddenInput();
                }
            }
        });
        
        initializeFromValue();
    }
}

async function generateIndexJSON() {
    const generateButton = document.getElementById('generate-btn')
    const agencyInput = document.getElementById('agency-name')
    const orgInput = document.getElementById('github-orgs')
    const versionInput = document.getElementById('version')
    const tokenInput = document.getElementById('github-token')

    generateButton.addEventListener('click', function () {
        // probably should validate these fields
        if (agencyInput.value && orgInput.value && versionInput.value !== "") {
            try {
                let rawData = fetchCodeJSON(orgInput.value, tokenInput.value)

                if (rawData) {
                    formatIndexJSON(rawData)
                    // if this function returns valid data, then we call a create formatIndex function that format the return data of fetchCodejson. params would be the other inputs
                    // this function would the return a formated and proper index.json and downloads it to your machine
                }
            } catch (error) {
                console.log(error)
                throw error
            }
        }
    })
}

async function formatIndexJSON(jsonData) {

}

async function fetchCodeJSON(orgs, token) {
    // along with returning the unformatted data, this function should update the progress bar and update the results field
    // might be worth it breaking this functionality into a seperate function rather than having a global variable that updates 

    const orgsArray = orgs.split(',')
    let allRepositories = []

    for (const org of orgsArray) {
        let trimmedOrg = org.trim()
        let page = 1
        let hasMore = true

        while (hasMore) {
            const url = new URL(`https://api.github.com/orgs/${trimmedOrg}/repos`)
            url.searchParams.append('per_page', 100)
            url.searchParams.append('page', page)

            const headers = {
                'Accept': 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28'
            }

            if (token) {
                headers['Authorization'] = `Bearer ${token}`
            }

            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers
                })

                if (!response.ok) {
                    const errorData = await response.json().catch(() => null);
                    throw new Error(
                        `GitHub API Error (${response.status}): ${errorData?.message}`
                    );
                }

                const repos = await response.json()
                allRepositories = [...allRepositories, ...repos]

                const linkHeader = response.headers.get('Link')
                hasMore = linkHeader && linkHeader.includes('rel="next"')
                page++
            } catch (error) {
                throw error
            }
        }
    }

    allRepositories.forEach((repo, number) => {
        console.log(`${number + 1}. ${repo.name}`);
    });

    return allRepositories
}