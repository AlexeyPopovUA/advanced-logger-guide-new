---
title: Contribution
date: "2022-05-29T22:12:03.284Z"
template: regular-static-page
nav-menu-order: 7
---

## Development

### Build and debugging

In order to run full build of all bundles run:

```bash
npm run build
```

This script will create all types of build:

-   browser compressed
-   browser debugging
-   nodejs compressed (do we need it? :) )
-   nodejs debugging

Also, you can run a specific build for each platform separately:

```bash
npm run build-prod-browser
npm run build-prod-node
npm run build-dev-browser
npm run build-dev-node
```

For debugging purposes it should be convenient to use the watch mode:

```bash
npm run watch-prod-browser
npm run watch-prod-node
npm run watch-dev-browser
npm run watch-dev-node
```

### Running tests

In order to run unit tests run:

```bash
npm run test
```

In order to run unit tests with coverage run:

```bash
npm run coverage
```

It will build a beautiful code coverage report which you can check by running html file `coverage/lcov-report/index.html`.

### Releasing

There is a "feature branches" support implemented in Travis CI. Commit checks are visible in commits and pull requests in GitHub.

In order to release a new version you need to create a version tag and push it to master via next scripts:

```bash
npm run release # creates a new release commit
git push origin master --follow-tags # pushes a release commit to master branch including version tag
```

This command bumps up the library version, builds the changelog and makes a new commit with a "version" tag. Using this tag travis will prepare and publish the npm package.

**Please note**, that release happens only on master branch for a tagged commit.

### Git workflow

#### Commits

Commits should follow the "conventional commit" agreement. It will be validated by Husky plugin on pre-commit git hook.

#### Branches and pull requests

Feel free to do anything you want in branches. All final commits should be rebased and clean. Please, create pull request for delivering your changes to master. All PR checks should be green. All sonar suggestions should be resolved and/or discussed if not applicable.
