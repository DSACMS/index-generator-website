document.addEventListener('DOMContentLoaded', initializePage);

function initializePage() {
    initializeMobileMenu()
    initializeTokenToggle()
    initializeChipsInput()
    generateIndexJSON()
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
    function getChipText(chip) {
        return chip.firstChild ? chip.firstChild.textContent.trim() : ''
    }

    function updateHiddenInput() {
        const chipValues = [];
        document.querySelectorAll('.chip').forEach(chip => {
            chipValues.push(getChipText(chip));
        });

        const hiddenInput = document.getElementById('github-orgs');
        hiddenInput.value = chipValues.join(',');
    }

    function createChip(text) {
        if (!text || text.trim() === '') return;

        let isDuplicate = false;
        document.querySelectorAll('.chip').forEach(chip => {
            if (getChipText(chip).toLowerCase() === text.toLowerCase()) {
                isDuplicate = true;
            }
        });

        if (!isDuplicate) {
            const chipHTML = document.createElement('span');
            chipHTML.className = 'chip';
            chipHTML.appendChild(document.createTextNode(text));

            const removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.setAttribute('aria-label', `Remove ${text}`);
            removeButton.textContent = '×';
            chipHTML.appendChild(removeButton);

            const input = document.getElementById('github-orgs-input');
            input.parentNode.insertBefore(chipHTML, input);

            updateHiddenInput();
        }
    }

    // Turns any text left in the input into chips, so values typed without pressing Enter are not lost
    function commitPendingInput(input) {
        input.value.split(',').forEach(val => createChip(val.trim()));
        input.value = '';
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
        chipsContainer.addEventListener('click', function (e) {
            if (e.target === this) {
                this.querySelector('input[type="text"]').focus();
            }
        });

        const input = document.getElementById('github-orgs-input');
        if (input) {
            input.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault();
                    commitPendingInput(this);
                }
                else if (e.key === 'Backspace' && this.value === '') {
                    const chips = document.querySelectorAll('.chip');
                    if (chips.length > 0) {
                        chips[chips.length - 1].remove();
                        updateHiddenInput();
                    }
                }
            });

            input.addEventListener('blur', function () {
                commitPendingInput(this);
            });

            input.addEventListener('paste', function () {
                // let the paste land in the input first, then split it into chips
                setTimeout(() => {
                    if (this.value.includes(',')) commitPendingInput(this)
                }, 0);
            });
        }

        document.addEventListener('click', function (e) {
            if (e.target.closest('.chip > button')) {
                const chip = e.target.closest('.chip');
                if (chip) {
                    chip.remove();
                    updateHiddenInput();
                    if (input) input.focus();
                }
            }
        });

        initializeFromValue();
    }
}

function updateProgressBar(current, total) {
    const progressCount = document.getElementById('progress-count')
    const progressBar = document.getElementById('progress-bar')
    const progressIndicator = document.getElementById('progress-indicator')

    if (progressCount && progressIndicator) {
        progressCount.textContent = `${current}/${total}`
        const percentage = total > 0 ? (current / total) * 100 : 0
        progressIndicator.style.width = `${percentage}%`
    }

    if (progressBar) {
        progressBar.setAttribute('aria-valuemax', total)
        progressBar.setAttribute('aria-valuenow', current)
    }
}

function createRepoItem(className, icon, iconClass, owner, name, message, messageClass) {
    const repoItem = document.createElement('div')
    repoItem.className = className

    const iconElement = document.createElement('span')
    iconElement.className = iconClass
    iconElement.setAttribute('aria-hidden', 'true')
    iconElement.textContent = icon

    const ownerElement = document.createElement('span')
    ownerElement.className = 'repo-name'
    ownerElement.textContent = `${owner} / `

    const nameElement = document.createElement('span')
    nameElement.className = 'repo-name'
    nameElement.textContent = name

    const messageElement = document.createElement('p')
    messageElement.className = messageClass
    messageElement.textContent = message

    repoItem.append(iconElement, ownerElement, nameElement, messageElement)
    return repoItem
}

function clearResults() {
    document.querySelectorAll('.success-repo-item, .failed-repo-item').forEach(item => item.remove())

    document.querySelectorAll('.failed-orgs, .rate-limit-notice').forEach(element => {
        element.textContent = ''
        element.hidden = true
    })
}

function revealResults(resultsSection) {
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function showResults(successCount, totalCount, successRepos, failedRepos, failedOrgs = [], rateLimitNotice = '') {
    const resultsSection = document.getElementById('results-section')
    const successCountElement = document.getElementById('success-count')
    const totalCountElement = document.getElementById('total-count')
    const failedCountElement = document.getElementById('failed-count')
    const failedOrgsElement = document.querySelector('.failed-orgs')
    const rateLimitElement = document.querySelector('.rate-limit-notice')
    const failedReposContainer = document.querySelector('.failed-repos')
    const successReposContainer = document.querySelector('.success-repos')

    if (resultsSection && successCountElement && totalCountElement && failedCountElement && failedReposContainer && successReposContainer) {
        clearResults()

        successCountElement.textContent = successCount
        totalCountElement.textContent = totalCount
        failedCountElement.textContent = failedRepos.length

        successRepos.forEach(repo => {
            let owner = ""
            const name = repo.name || ""

            if (repo.repositoryURL) {
                const urlParts = repo.repositoryURL.replace(/\/+$/, '').split('/')
                if (urlParts.length >= 4) {
                    owner = urlParts[urlParts.length - 2]
                }
            }

            successReposContainer.appendChild(
                createRepoItem('success-repo-item', '✓', 'success-icon', owner, name, 'Successfully added', 'repo-status')
            )
        })

        failedRepos.forEach(repo => {
            failedReposContainer.appendChild(
                createRepoItem('failed-repo-item', '✕', 'error-icon', repo.owner, repo.name, repo.errorMessage, 'error-message')
            )
        })

        if (failedOrgsElement && failedOrgs.length > 0) {
            failedOrgsElement.textContent = `Some organizations couldn't be fully scanned: ${failedOrgs.map(org => `${org.name} (${org.error})`).join(', ')}`
            failedOrgsElement.hidden = false
        }

        if (rateLimitElement && rateLimitNotice) {
            rateLimitElement.textContent = rateLimitNotice
            rateLimitElement.hidden = false
        }

        resultsSection.style.display = 'block';

        const errorContainer = document.getElementById('general-error-container')
        if (errorContainer) {
            errorContainer.style.display = 'none'
        }

        const resultsContent = resultsSection.querySelector('.results-content')
        if (resultsContent) {
            resultsContent.style.display = 'block'
        }

        revealResults(resultsSection)
    }
}

function showGeneralError(errorMessage) {
    const resultsSection = document.getElementById('results-section')
    let errorContainer = document.getElementById('general-error-container')

    if (!errorContainer) {
        errorContainer = document.createElement('div')
        errorContainer.id = 'general-error-container'
        errorContainer.className = 'general-error'
        errorContainer.setAttribute('role', 'alert')

        if (resultsSection) {
            const heading = resultsSection.querySelector('.section-heading')
            if (heading) {
                heading.insertAdjacentElement('afterend', errorContainer)
            } else {
                resultsSection.prepend(errorContainer)
            }
        }
    }

    errorContainer.textContent = errorMessage;

    if (resultsSection) {
        resultsSection.style.display = 'block'
        const resultsContent = resultsSection.querySelector('.results-content')

        if (resultsContent) {
            resultsContent.style.display = 'none'
        }

        revealResults(resultsSection)
    }

    errorContainer.style.display = 'block';
}

function isRateLimited(response) {
    return (response.status === 403 || response.status === 429) &&
        response.headers.get('x-ratelimit-remaining') === '0'
}

// Records that the rate limit was hit and when GitHub says it resets
function recordRateLimit(rateLimit, response) {
    rateLimit.hit = true
    const reset = Number(response.headers.get('x-ratelimit-reset'))
    if (reset) rateLimit.resetAt = new Date(reset * 1000)
}

function rateLimitRetryText(rateLimit) {
    if (!rateLimit.resetAt) return 'Add a GitHub token or try again later'
    const time = rateLimit.resetAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    return `Add a GitHub token or try again after ${time}`
}

async function generateIndexJSON() {
    const form = document.getElementById('index-generator-form')
    const generateButton = document.getElementById('generate-btn')
    const agencyInput = document.getElementById('agency-name')
    const orgInput = document.getElementById('github-orgs')
    const orgTextInput = document.getElementById('github-orgs-input')
    const versionInput = document.getElementById('version')
    const tokenInput = document.getElementById('github-token')
    const resultsSection = document.getElementById('results-section')
    const resultsContent = resultsSection.querySelector('.results-content')

    if (form) {
        form.addEventListener('submit', (e) => e.preventDefault())
    }

    let index = {
        "version": "",
        "agency": "",
        "measurementType": {
            "method": "projects"
        },
        "releases": []
    }

    let repos = []
    let files = []

    let failedRepos = []
    let failedOrgs = []
    let totalRepos = 0
    let scannedRepos = 0
    let rateLimit = { hit: false, resetAt: null }

    function setLoading(isLoading) {
        generateButton.classList.toggle('loading', isLoading)
        generateButton.disabled = isLoading
        generateButton.setAttribute('aria-busy', isLoading)
    }

    generateButton.addEventListener('click', async function () {
        if (generateButton.classList.contains('loading')) return

        // commit any organization typed without pressing Enter
        if (orgTextInput && orgTextInput.value.trim() !== '') {
            orgTextInput.dispatchEvent(new Event('blur'))
        }

        setLoading(true)

        failedRepos = []
        failedOrgs = []
        totalRepos = 0
        scannedRepos = 0
        rateLimit = { hit: false, resetAt: null }

        clearResults()
        updateProgressBar(0, 0)

        if (resultsSection) {
            resultsSection.style.display = 'none'

            const errorContainer = document.getElementById('general-error-container')
            if (errorContainer) {
                errorContainer.style.display = 'none'
            }

            if (resultsContent) {
                resultsContent.style.display = 'block'
            }
        }

        if (!agencyInput.value.trim() || !orgInput.value || !versionInput.value) {
            showGeneralError("Please fill in all required fields: Agency Name, GitHub Organizations, and Version.")
            setLoading(false)
            return
        }

        try {
            try {
                const result = await fetchAllRepos(orgInput.value, tokenInput.value.trim(), rateLimit)
                repos = result.repos
                failedOrgs = result.failedOrgs
                totalRepos = repos.length

                if (totalRepos === 0) {
                    showGeneralError("No repositories found. Please check your GitHub Organizations and token.")
                    setLoading(false)
                    return
                }

                updateProgressBar(0, totalRepos)
            } catch (repoError) {
                showGeneralError(repoError.message)
                setLoading(false)
                return
            }

            try {
                const result = await fetchAllFiles(repos, tokenInput.value.trim(), rateLimit,
                    (current) => {
                        updateProgressBar(current, totalRepos)
                    },
                    (repo, errorMessage) => {
                        failedRepos.push({
                            owner: repo.owner.login,
                            name: repo.name,
                            errorMessage: errorMessage
                        })
                    }
                )
                files = result.files
                scannedRepos = result.scannedCount
            } catch (filesError) {
                showGeneralError("Error fetching repository files: " + filesError.message)
                setLoading(false)
                return
            }

            if (rateLimit.hit && scannedRepos === 0) {
                showGeneralError(`GitHub API rate limit reached before any repositories could be scanned. ${rateLimitRetryText(rateLimit)}.`)
                setLoading(false)
                return
            }

            if (repos && files) {
                index["agency"] = agencyInput.value.trim()
                index["version"] = versionInput.value
                index['releases'] = files

                try {
                    downloadIndex(index)
                } catch (downloadError) {
                    showGeneralError("Error downloading index file: " + downloadError.message)
                    setLoading(false)
                    return
                }
            }

            let rateLimitNotice = ''
            if (rateLimit.hit) {
                rateLimitNotice = `GitHub's API rate limit was reached after scanning ${scannedRepos} of ${totalRepos} repositories, so your index only includes the repositories that were scanned. ${rateLimitRetryText(rateLimit)} to scan them all.`
            }

            const successCount = scannedRepos - failedRepos.length
            showResults(successCount, totalRepos, files, failedRepos, failedOrgs, rateLimitNotice)

            setLoading(false)
        } catch (error) {
            console.error("Error generating index:", error)
            showGeneralError("An unexpected error occurred: " + error.message)

            setLoading(false)
        }
    })
}

async function fetchAllRepos(orgs, token, rateLimit) {
    let allRepositories = []
    const orgsArray = orgs.split(',').map(org => org.trim()).filter(org => org !== '')
    const failedOrgs = []

    const orgPromises = orgsArray.map(async (trimmedOrg) => {
        let page = 1
        let hasMore = true
        let orgRepos = []

        while (hasMore) {
            if (rateLimit.hit) {
                if (orgRepos.length > 0) {
                    failedOrgs.push({
                        name: trimmedOrg,
                        error: `rate limit reached, only the first ${orgRepos.length} repositories were listed`
                    })
                }
                return orgRepos
            }

            const url = new URL(`https://api.github.com/orgs/${encodeURIComponent(trimmedOrg)}/repos`)
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

                if (isRateLimited(response)) {
                    recordRateLimit(rateLimit, response)
                    if (orgRepos.length === 0) {
                        failedOrgs.push({
                            name: trimmedOrg,
                            error: "GitHub API rate limit reached"
                        })
                    }
                    // the check at the top of the loop records partially listed orgs
                    continue
                }

                if (!response.ok) {
                    const errorData = await response.json().catch(() => null)
                    let errorMessage = `GitHub API Error (${response.status})`

                    if (errorData && errorData.message) {
                        errorMessage += `: ${errorData.message}`
                    }

                    if (response.status === 401) {
                        errorMessage = "GitHub token is invalid or expired"
                    } else if (response.status === 404) {
                        errorMessage = "Organization not found"
                    }

                    failedOrgs.push({
                        name: trimmedOrg,
                        error: errorMessage
                    })

                    hasMore = false
                    return []
                }

                const repos = await response.json()
                orgRepos = [...orgRepos, ...repos]

                const linkHeader = response.headers.get('Link')
                hasMore = linkHeader && linkHeader.includes('rel="next"')
                page++
            } catch (error) {
                console.error(`Error fetching repositories for ${trimmedOrg}:`, error)
                failedOrgs.push({
                    name: trimmedOrg,
                    error: error.message
                })

                hasMore = false
                return []
            }
        }
        return orgRepos
    })

    const orgResults = await Promise.all(orgPromises)
    orgResults.forEach(repos => {
        allRepositories = [...allRepositories, ...repos]
    })

    if (allRepositories.length === 0 && failedOrgs.length > 0) {
        if (rateLimit.hit) {
            throw new Error(`GitHub API rate limit reached before any repositories could be listed. ${rateLimitRetryText(rateLimit)}.`)
        }
        throw new Error(`Could not fetch repositories: ${failedOrgs.map(org => `${org.name} (${org.error})`).join(', ')}`)
    }

    return { repos: allRepositories, failedOrgs }
}

async function fetchAllFiles(repositories, token, rateLimit, progressCallback, errorCallback) {
    let files = []
    let processedCount = 0

    for (const repo of repositories) {
        // once rate limited every remaining request would fail, so stop and keep what we have
        if (rateLimit.hit) break

        const url = new URL(`https://api.github.com/repos/${encodeURIComponent(repo.owner.login)}/${encodeURIComponent(repo.name)}/contents/code.json`)

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

            if (isRateLimited(response)) {
                recordRateLimit(rateLimit, response)
                break
            }

            if (response.ok) {
                const fileData = await response.json()

                if (fileData.content && fileData.encoding === 'base64') {
                    // decode as UTF-8 so non-ASCII characters in code.json are preserved
                    const bytes = Uint8Array.from(atob(fileData.content.replace(/\n/g, '')), c => c.charCodeAt(0))
                    const decodedData = new TextDecoder().decode(bytes)

                    try {
                        const finalContent = JSON.parse(decodedData);
                        // would be good to actually vaildate the recieved code.json schema to the actual one here

                        const orderedContent = {
                            organization: finalContent.organization,
                            ...Object.fromEntries(
                                Object.entries(finalContent).filter(([key]) => key !== 'organization')
                            )
                        }

                        files.push(orderedContent)
                    } catch (error) {
                        console.error(`Error parsing JSON for ${repo.name}:`, error)
                        if (errorCallback) errorCallback(repo, "This code.json file is not formatted correctly")
                    }
                } else {
                    if (errorCallback) errorCallback(repo, "Could not read the contents of code.json")
                }
            } else {
                console.log(`File not found or access denied for ${repo.name} / Status: ${response.status}`)

                if (response.status === 404) {
                    if (errorCallback) errorCallback(repo, "No code.json found")
                } else {
                    if (errorCallback) errorCallback(repo, `Access denied (${response.status})`)
                }
            }
        } catch (error) {
            console.error('Error fetching files', error)
            if (errorCallback) errorCallback(repo, "Error fetching code.json")
        } finally {
            if (!rateLimit.hit) {
                processedCount++
                if (progressCallback) progressCallback(processedCount)
            }
        }
    }
    return { files, scannedCount: processedCount }
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
