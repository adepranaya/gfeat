# @adepranaya/gfeat

## 🚀 Generate Feature CLI for Your Project

`@adepranaya/gfeat` is a CLI tool that helps you quickly generate new features in your project using predefined templates.

## ✨ Features

- 📁 **Automatically generate files based on templates**
- 🔄 **Adjust filenames and content based on configuration rules**
- ⚙️ **Flexible configuration for different projects**

## 📦 Installation

```sh
npm install -g @adepranaya/gfeat
```

## 🛠️ Usage

1. Run the following command in your terminal:
   ```sh
   gfeat
   ```
2. Enter the **feature name** you want to create.
3. Select the **template** to use.
4. The files will be automatically generated according to the configuration rules.

## 📝 Configuration

Create a `gfeat.config.mjs` file in the root of your project:

```js
export const templates = [
  {
    name: 'component',
    src: ['./gfeat-src/templates/component/BaseFeat/*'],
    target: ['./src/components/$PASCAL_FEAT'],
  },
  {
    name: 'docs',
    src: ['./gfeat-src/templates/doc/BaseFeat/*'],
    target: ['./src/docs/$PASCAL_FEAT'],
  },
];
export const replaceStr = 'BaseFeat';
```

or `gfeat.config.js`

```js
module.exports = {
  templates: [
    {
      name: 'component',
      src: ['./gfeat-src/templates/component/BaseFeat/*'],
      target: ['./src/components/$PASCAL_FEAT'],
    },
    {
      name: 'docs',
      src: ['./gfeat-src/templates/doc/BaseFeat/*'],
      target: ['./src/docs/$PASCAL_FEAT'],
    },
  ],
  replaceStr: 'BaseFeat',
};
```

### 📌 Configuration Explanation

- **`src`** → Location of template files
- **`target`** → Destination folder for generated files
- **`replaceStr`** → Rules for renaming files and modifying file content
- **`$PASCAL_FEAT`** → One of Options for renaming target options to PascalCase of feature name, the options you can choose are:
  - `$PASCAL_FEAT` (ex: UserProfile),
  - `$KEBAB_FEAT` (ex: user-profile),
  - `$CAMEL_FEAT` (ex: userProfile)

## 📄 Example Templates

```bash
# ./gfeat-src/templates/component/BaseFeat/BaseFeat.vue
# ./gfeat-src/templates/component/BaseFeat/base-feat.scss
# ./gfeat-src/templates/component/BaseFeat/baseFeat.d.ts
# ./gfeat-src/templates/docs/BaseFeat/BaseFeat.stories

├── gfeat-src
│   ├── templates
│   │   ├── component
│   │   │   ├── BaseFeat
│   │   │   │   ├── BaseFeat.vue
│   │   │   │   ├── base-feat.scss
│   │   │   │   └── baseFeat.d.ts
│   │   │   doc
│   │   │   ├── BaseFeat
│   │   │   │   └── BaseFeat.stories

```

```ts
// ./gfeat-src/templates/component/BaseFeat/baseFeat.d.ts
export interface IBaseFeatProps {
}
```

## 📄 Example Usage

If you enter the feature name `UserProfile`, the following files will be generated:

```bash
# ./src/components/UserProfile/UserProfile.vue
# ./src/components/UserProfile/user-profile.scss
# ./src/components/UserProfile/userProfile.d.ts
# ./src/docs/UserProfile/UserProfile.d.ts

├── src
│   ├── components
│   │   ├── UserProfile
│   │   │   ├── UserProfile.vue
│   │   │   ├── user-profile.scss
│   │   │   └── userProfile.d.ts
│   ├── docs
│   │   ├── UserProfile
│   │   │   └── UserProfile.stories
```

```ts
// ./src/components/UserProfile/userProfile.d.ts
export interface IUserProfileProps {
}
```

## 🤝 Contributing

If you would like to contribute, please submit a Pull Request or report issues on [GitHub](https://github.com/adepranaya/gfeat).

## 📜 License

ISC License
