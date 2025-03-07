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

Create a `gfeat.config.js` file in the root of your project:

```js
export const templates = [
  {
    name: 'component',
    src: ['./templates/component/Basic/*'],
    target: ['./src/components/$PARAM'],
    filenameRules: [
      { find: 'BasicComp', replace: '$PascalCase' },
      { find: 'basic-comp', replace: '$KebabCase' },
      { find: 'basicComp', replace: '$CamelCase' }
    ],
    contentRules: [
      { find: /BasicComp/g, replace: '$PascalCase' },
      { find: /basic-comp/g, replace: 'b-$KebabCase' },
      { find: /basicComp/g, replace: 'b-$CamelCase' }
    ]
  }
];
```

### 📌 Configuration Explanation
- **`src`** → Location of template files
- **`target`** → Destination folder for generated files
- **`filenameRules`** → Rules for renaming files
- **`contentRules`** → Rules for modifying file content

## 📄 Example Usage
If you enter the feature name `UserProfile`, the following files will be generated:
```
./src/components/UserProfile/UserProfile.vue
./src/components/UserProfile/user-profile.scss
./src/components/UserProfile/userProfile.d.ts
```

## 🤝 Contributing
If you would like to contribute, please submit a Pull Request or report issues on [GitHub](https://github.com/adepranaya/gfeat).

## 📜 License
ISC License

