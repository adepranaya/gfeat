export const templates = [
  {
    name: 'component',
    src: ['./gfeat-src/templates/component/BasicComp/*'],
    target: ['./src/components/$PASCAL_FEAT']
  },
  {
    name: 'docs',
    src: ['./gfeat-src/templates/docs/BasicComp/*'],
    target: ['./src/_docs/Components/$PASCAL_FEAT']
  },
];

// Replace String to Feature Name
export const replaceStr = 'BasicComp'