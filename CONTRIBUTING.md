# Contribution Guide

## Versioning and Publishing packages

Package publishing has been configured using [Changesets](https://github.com/changesets/changesets) and
comes with automated npm releases setup in a [GitHub Action](https://github.com/changesets/action).
To get this working, you will need to create an `NPM_TOKEN` and `GITHUB_TOKEN` in your repository settings.
You should also install the [Changesets bot](https://github.com/apps/changeset-bot) on your GitHub repository as well.

For more information about this automation, refer to the official [changesets documentation](https://github.com/changesets/changesets/blob/main/docs/automating-changesets.md)

### npm

If you want to publish package to the public npm registry and make them publicly available, this is already setup.
To publish packages to a private npm organization scope, **remove** the following from each of the `package.json`

```diff
- "publishConfig": {
-  "access": "public"
- },
```
