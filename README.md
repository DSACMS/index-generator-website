# Index Generator Website

A web application that helps federal agencies compile and maintain their code.json files for SHARE IT Act compliance.

## About the Project

The Index Generator is a tool designed to help federal agencies meet their SHARE IT Act compliance requirements by automatically scanning specified GitHub organizations, finding repositories containing code.json files, and combining them into a single index file.

### Project Vision

Our vision is to create a compliance path for all federal agencies to meet SHARE IT Act requirements while fostering an Open Source culture across government.

### Project Mission

To provide accessible, user-friendly tools and clear documentation that simplifies the process of implementing SHARE IT Act requirements.

### Agency Mission

The Centers for Medicare & Medicaid Services (CMS) is committed to strengthening and modernizing the nation's health care system to provide access to high-quality care and improved health at lower costs.

### Team Mission

The CMS Open Source Program Office aims to facilitate the development, use, and sharing of open source software across government.

## Core Team

A list of core team members responsible for the code and documentation in this repository can be found in [COMMUNITY.md](COMMUNITY.md).

## Documentation Index

- **[COMMUNITY.md](COMMUNITY.md)** - Information about the project team and community
- **[LICENSE](LICENSE)** - CC0 1.0 Universal public domain dedication
- **[README.md](README.md)** - Information about the project, vision and goals

## Repository Structure

```
├── .github/               # GitHub action workflows
├── assets/                # Static assets like images, CSS, and JavaScript
│   ├── css/               # Stylesheet files
│   ├── js/                # JavaScript files
│   └── images/            # Project images and icons
└── code.json              # Metadata file
└── index.html             # Main html file
```

## Local Development

### Prerequisites

- A web browser

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/DSACMS/index-generator-website.git
   ```

2. Navigate to the project directory:
   ```
   cd index-generator-website
   ```

3. Open `index.html` in your web browser.

## How It Works

1. The user enters their agency name, GitHub organizations to scan, version number, and optionally a GitHub token
2. The application connects to GitHub using the provided token (if any)
3. It scans each specified GitHub organization for repositories
4. It checks each repository for a code.json file
5. It combines all found code.json files into a single indexed file
6. It provides the combined file for download

## Policies

### Open Source Policy

We adhere to the [CMS Open Source Policy](https://github.com/CMSGov/cms-open-source-policy). If you have any questions, just [shoot us an email](mailto:opensource@cms.hhs.gov).

### Security and Responsible Disclosure Policy

_Submit a vulnerability:_ Vulnerability reports can be submitted through [Bugcrowd](https://bugcrowd.com/cms-vdp). Reports may be submitted anonymously. If you share contact information, we will acknowledge receipt of your report within 3 business days.

### Software Bill of Materials (SBOM)

A Software Bill of Materials (SBOM) is a formal record containing the details and supply chain relationships of various components used in building software.

In the spirit of [Executive Order 14028 - Improving the Nation's Cyber Security](https://www.gsa.gov/technology/it-contract-vehicles-and-purchasing-programs/information-technology-category/it-security/executive-order-14028), a SBOM for this repository is provided here: https://github.com/DSACMS/index-generator-website/network/dependencies.

For more information and resources about SBOMs, visit: https://www.cisa.gov/sbom.

## Public domain

This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/) as indicated in [LICENSE](LICENSE).

All contributions to this project will be released under the CC0 dedication. By submitting a pull request or issue, you are agreeing to comply with this waiver of copyright interest.