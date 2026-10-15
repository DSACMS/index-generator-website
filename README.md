# Index Generator Website

A web application that helps federal agencies compile and maintain their code.json files for SHARE IT Act compliance.

https://gsa-share-it.github.io/index-generator-website/

## About the Project

The Index Generator is a tool designed to help federal agencies meet their SHARE IT Act compliance requirements by automatically scanning specified GitHub organizations, finding repositories containing code.json files, and combining them into a single index file.

### Project Vision

Our vision is to create a compliance path for all federal agencies to meet SHARE IT Act requirements while fostering an Open Source culture across government.

### Project Mission

To provide accessible, user-friendly tools and clear documentation that simplifies the process of implementing SHARE IT Act requirements.

### Agency Mission

The General Services Administration (GSA) is accelerating federal mission delivery for the American people.

### Team Mission

The GSA SHARE IT team aims to facilitate the development, use, and sharing of open source software across government.

## Core Team

A list of core team members responsible for the code and documentation in this repository can be found in [COMMUNITY.md](COMMUNITY.md).

## Documentation Index

- **[README.md](README.md)** - Information about the project, vision and goals
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - How to contribute, test, and submit changes
- **[COMMUNITY.md](COMMUNITY.md)** - Information about the project team, roles, and community guidelines
- **[GOVERNANCE.md](GOVERNANCE.md)** - How the project is governed
- **[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)** - Expected behavior for all community members
- **[SECURITY.md](SECURITY.md)** - Security and responsible disclosure policy
- **[CODEOWNERS.md](.github/CODEOWNERS.md)** - Who is responsible for each area of the repository
- **[LICENSE](LICENSE)** - CC0 1.0 Universal public domain dedication

## Repository Structure

```
├── .github/               # GitHub configuration
│   ├── workflows/         # GitHub Action workflows
│   ├── CODEOWNERS.md      # Code owners
│   └── dependabot.yml     # Dependabot configuration
├── assets/                # Static assets like CSS and JavaScript
│   ├── css/               # Stylesheet files
│   └── js/                # JavaScript files
├── code.json              # Metadata file
└── index.html             # Main html file
```

## How It Works

1. The user enters their agency name, GitHub organizations to scan, version number, and optionally a GitHub token
2. The application connects to GitHub using the provided token (if any)
3. It scans each specified GitHub organization for repositories
4. It checks each repository for a code.json file
5. It combines all found code.json files into a single indexed file
6. It provides the combined file for download

Everything runs in your browser. The only requests made are to the GitHub API (`api.github.com`).

## Using a GitHub Token

A GitHub token is optional, but strongly recommended. Without one, GitHub limits you to 60 API requests per hour, and the tool makes one request per repository, so larger organizations will hit the limit quickly. With a token, the limit is 5,000 requests per hour.

To create a token:

1. Go to GitHub **Settings → Developer settings → Personal access tokens → [Fine-grained tokens](https://github.com/settings/personal-access-tokens/new)**
2. Give the token a name and a short expiration date
3. Set **Resource owner** to your account (or the organization you are scanning, if it requires approval)
4. Under **Repository access**, choose **Public repositories (read-only)**. If you also need to include private or internal repositories, choose **All repositories** and grant the **Contents: Read-only** and **Metadata: Read-only** permissions
5. Click **Generate token** and paste it into the **GitHub Token** field

Your token is only sent to `api.github.com` to authenticate requests. It is never stored or sent anywhere else, and it is cleared when you close or reload the page.

# Development and Software Delivery Lifecycle

The following guide is for members of the project team who have access to the repository as well as code contributors. The main difference between internal and external contributions is that external contributors will need to fork the project and will not be able to merge their own pull requests. For more information on contributing, see: [CONTRIBUTING.md](./CONTRIBUTING.md).

## Local Development

### Prerequisites

- A web browser
- Python 3 (optional, for serving the site locally)

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/GSA-SHARE-IT/index-generator-website.git
   ```

2. Navigate to the project directory:
   ```
   cd index-generator-website
   ```

3. Start up a HTTP server using python: `python3 -m http.server 8000` and open http://localhost:8000. You can also open `index.html` directly in your web browser.

## Coding Style and Linters

This project is plain HTML, CSS, and JavaScript with no build step or package dependencies. Please match the style of the surrounding code. See [CONTRIBUTING.md](CONTRIBUTING.md#coding-style-and-linters) for more details.

## Branching Model

- Make small changes in [short-lived feature branches](https://trunkbaseddevelopment.com/short-lived-feature-branches/) and merge to `main` frequently.
- Be open to submitting multiple small pull requests for a single ticket (i.e. reference the same ticket across multiple pull requests).
- Treat each change you merge to `main` as immediately deployable to production. Do not merge changes that depend on subsequent changes you plan to make, even if you plan to make those changes shortly.
- Ticket any unfinished or partially finished work.

This project uses **continuous deployment** through [GitHub Pages](https://pages.github.com/). Pull requests are merged to `main` and the changes are immediately deployed to https://gsa-share-it.github.io/index-generator-website/. Repository automation is configured in the [.github/workflows](.github/workflows) directory.

## Contributing

Thank you for considering contributing to an Open Source project of the US Government! For more information about our contribution guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).

## Codeowners

The contents of this repository are managed by the GSA SHARE IT team. Those responsible for the code and documentation in this repository can be found in [CODEOWNERS.md](.github/CODEOWNERS.md).

## Community

The Index Generator Website team is taking a community-first and open source approach to the product development of this tool. We believe government software should be made in the open and be built and licensed such that anyone can download the code, run it themselves without paying money to third parties or using proprietary software, and use it as they will.

We know that we can learn from a wide variety of communities, including those who will use or will be impacted by the tool, who are experts in technology, or who have experience with similar technologies deployed in other spaces. We are dedicated to creating forums for continuous conversation and feedback to help shape the design and development of the tool.

We also recognize capacity building as a key part of involving a diverse open source community. We are doing our best to use accessible language, provide technical and process documents, and offer support to community members with a wide variety of backgrounds and skillsets.

### Community Guidelines

Principles and guidelines for participating in our open source community can be found in [COMMUNITY.md](COMMUNITY.md#index-generator-website-open-source-community-guidelines). Please read them before joining or starting a conversation in this repo. All community members and participants are expected to adhere to the community guidelines and [code of conduct](CODE_OF_CONDUCT.md) when participating in community spaces including: code repositories, communication channels and venues, and events.

## Governance

Information about how the Index Generator Website community is governed may be found in [GOVERNANCE.md](GOVERNANCE.md).

## Feedback

If you have ideas for how we can improve or add to our capacity building efforts and methods for welcoming people into our community, please let us know at opensource@cms.hhs.gov. If you would like to comment on the tool itself, please let us know by filing an [issue on our GitHub repository](https://github.com/GSA-SHARE-IT/index-generator-website/issues).

## Glossary

- **code.json** - A metadata file placed at the root of a repository that describes a federal software project (name, description, license, contact, and more). See [gov-codejson](https://github.com/GSA-SHARE-IT/gov-codejson) for the schema.
- **Index file (`index.json`)** - A single file that combines the code.json files from all of an agency's repositories. This is what this tool generates.
- **SHARE IT Act** - The Source code Harmonization And Reuse in Information Technology Act, which requires federal agencies to inventory and share their custom-developed code.
- **GitHub token / PAT** - A personal access token used to authenticate requests to the GitHub API and raise its rate limit. See [Using a GitHub Token](#using-a-github-token).
- **OSPO** - Open Source Program Office.

## Policies

### Open Source Policy

We adhere to the [CMS Open Source Policy](https://github.com/CMSGov/cms-open-source-policy). If you have any questions, just [shoot us an email](mailto:opensource@cms.hhs.gov).

### Security and Responsible Disclosure Policy

_Submit a vulnerability:_ Vulnerability reports can be submitted through [Bugcrowd](https://bugcrowd.com/cms-vdp). Reports may be submitted anonymously. If you share contact information, we will acknowledge receipt of your report within 3 business days.

For more information about our Security, Vulnerability, and Responsible Disclosure Policies, see [SECURITY.md](SECURITY.md).

### Software Bill of Materials (SBOM)

A Software Bill of Materials (SBOM) is a formal record containing the details and supply chain relationships of various components used in building software.

In the spirit of [Executive Order 14028 - Improving the Nation's Cyber Security](https://www.gsa.gov/technology/it-contract-vehicles-and-purchasing-programs/information-technology-category/it-security/executive-order-14028), a SBOM for this repository is provided here: https://github.com/GSA-SHARE-IT/index-generator-website/network/dependencies.

For more information and resources about SBOMs, visit: https://www.cisa.gov/sbom.

## Public domain

This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/) as indicated in [LICENSE](LICENSE).

All contributions to this project will be released under the CC0 dedication. By submitting a pull request or issue, you are agreeing to comply with this waiver of copyright interest.
