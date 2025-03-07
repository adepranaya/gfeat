export const templates = [
  {
    name: 'component',
    src: ['./gfeat-src/templates/component/BasicComp/*'],
    target: ['./src/components/$PARAM']
  },
  {
    name: 'docs',
    src: ['./gfeat-src/templates/docs/BasicComp/*'],
    target: ['./src/_docs/Components/$PARAM']
  },
];

// Replace String to Feature Name
export const replaceStr = ''