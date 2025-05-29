# ThreeScatter Contributing Guide

Hi there!! If you are reading this guide, you are probably interested in contributing to ThreeScatter. You're awesome 🤩.

No contribution is too small, whether it is a typo in the docs, a bug report or refactoring a piece of code, every contribution is welcome, just make sure to follow the guidelines below ✌️.

Thanks from the heart 💚 for taking the time to help out. This guide will help you to get started with the project.


## Setup

I use pnpm, is a package manager that is faster than npm and yarn. It also uses symlinks to avoid code duplication.

In this repo, there is a `/playground` you need to install dependencies there too, in this folder you can create/test/add new examples of you new feature/fix

Make sure you are using [Node.js](https://nodejs.org/en/) version 16 or higher.

You can install pnpm using npm:

```bash
npm install -g pnpm
```

or using homebrew:

If you have the package manager installed, you can install pnpm using the following command:

```
brew install pnpm
```

## Development

To start developing, you can run `pnpm dev` in the root folder (not this is going to open the `/playground` folder).

This will start the dev server for the playground at `http://localhost:5173/` where you can test the changes you are making in the `src` folder.

Be aware of manually change the `index.html` inside the `/playground` and point the `<script>` tag to your example.

> **Warning**
> Make sure to check if there is already a demo for the feature you are working on. If so, feel free to add your changes to the existing demo.

## Pull Requests

Before opening a pull request, make sure to open an Issue first.

- Checkout a topic branch from the base branch `main` branch and merge back against that branch.
- Please follow the [commit message conventions](https://www.conventionalcommits.org/en/v1.0.0-beta.4/) when committing your changes. This is important because the release notes will be automatically generated from these messages. Small scoped commits are always preferred, as it is easier to review them.
- If adding new feature:
  - Provide convincing reason to add this feature. Ideally you should open a suggestion issue first and have it greenlighted before working on it. We would reject feature PRs that are not first opened as suggestions except for trivial changes.
  - Create a `feature/{issue-number}-add-test` branch for this feature. Make the name meaningful.
- If fixing a bug 🐛:

  - Provide detailed description of the bug in the PR. Live demo preferred.
  - Create a `fix/{issue-number}-fix-test` branch for this bug fix.
  - If you are resolving a special issue, add `(fix #xxx[,#xxx])` (#xxx is the issue id) in your PR title for a better release log, e.g. `update entities encoding/decoding (fix #3899)`.

