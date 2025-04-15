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
                if (e.key === 'Enter' || e.key === ',') {
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

    let index = {
        "agency": "",
        "version": "",
        "measurementType": {
          "method": "projects"
        },
        "releases": []
    }

    generateButton.addEventListener('click', async function () {
        // probably should validate these fields
        if (agencyInput.value && orgInput.value && versionInput.value !== "") {
            try {
                // add loading state function here that updates progress bar
                let repos = await fetchAllRepos(orgInput.value, tokenInput.value)
                let files = await fetchAllFiles(repos, tokenInput.value)

                if (repos && files) {
                    index["agency"] = agencyInput.value
                    index["version"] = versionInput.value
                    index['releases'] = files

                    downloadIndex(index)
                }

                // add loading state function here that updates progress bar and shows results section
            } catch (error) {
                // add loading state function here that shows error, dont want to use alert tbh.
                // maybe copy notification system from formsite?
                console.error("Error with something?", error)
            }
        }
    })
}

async function fetchAllRepos(orgs, token) {
    let allRepositories = []
    const orgsArray = orgs.split(',')
    
    const orgPromises = orgsArray.map(async (org) => {
        let trimmedOrg = org.trim()
        let page = 1
        let hasMore = true
        let orgRepos = []
        
        while (hasMore) {
            const url = new URL(`https://api.github.com/orgs/${trimmedOrg}/repos`)
            url.searchParams.append('per_page', 100) // max github allows
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
                orgRepos = [...orgRepos, ...repos]

                const linkHeader = response.headers.get('Link')
                hasMore = linkHeader && linkHeader.includes('rel="next"')
                page++
            } catch (error) {
                console.error(`Error fetching repositories for ${trimmedOrg}`, error)
            }
        }
        
        return orgRepos
    })
    
    const orgResults = await Promise.all(orgPromises)
    orgResults.forEach(repos => {
        allRepositories = [...allRepositories, ...repos]
    })
    
    return allRepositories
}

// considering how many calls may go out using this function, we might need to include some request throttling so we can handle the rate limiting
async function fetchAllFiles(repositories, token) {
    let files = []

    for (const repo of repositories) {
        const url = new URL(`https://api.github.com/repos/${repo.owner.login}/${repo.name}/contents/code.json`)

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
            
            if (response.ok) {
                const fileData = await response.json()

                if (fileData.content && fileData.encoding === 'base64') {
                    const decodedData = atob(fileData.content.replace(/\n/g, ''))

                    try {
                        const finalContent = JSON.parse(decodedData)
                        const orderedContent = {
                            organization: finalContent.organization,
                            ...Object.fromEntries(
                                Object.entries(finalContent).filter(([key]) => key !== 'organization')
                            )
                        };
                        files.push(orderedContent)
                    } catch (error) {
                        console.error(`Error parsing JSON for ${repo.name}:`, error);
                    }
                }
            } else {
                console.log(`File not found or access denied for ${repo.name} / Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error fetching files', error)
        }
    }

    // console.log("All collected files:")
    // files.forEach((file, number) => {
    //     console.log(`${number + 1}. ${file.name} / ${file}`);
    // });

    return files
}

function downloadIndex(index) {
    const jsonString = JSON.stringify(index, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const temp = document.createElement('a')
    temp.href = url
    temp.download = "index.json"
    
    document.body.appendChild(temp)
    temp.click()

    document.body.removeChild(temp)
    URL.revokeObjectURL(url)
}