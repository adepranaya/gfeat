// Helper functions for case conversions
export const toPascalCase = (str) => {
  if (str === str.toUpperCase()) {
    str = str.toLowerCase();
  }

  return str
    .replace(/(?:^|[-_\s])(\w)/g, (_, c) => c.toUpperCase()) // Kapitalisasi huruf setelah pemisah
    .replace(/\s+/g, ''); // Hapus spasi
};

export const toKebabCase = (str) => {
  return str
    .replace(/[_\s]+/g, '-') // Ganti underscore dan spasi dengan "-"
    .replace(/([a-z])([A-Z])/g, '$1-$2') // Pisahkan huruf kecil yang bertemu huruf besar
    .toLowerCase(); // Pastikan hasilnya lowercase
};

export const toCamelCase = (str) => {
  if (str === str.toUpperCase()) {
    str = str.toLowerCase();
  }

  return str
    .replace(/(?:^|[-_\s])(\w)/g, (_, c, index) =>
      index === 0 ? c.toLowerCase() : c.toUpperCase()
    )
    .replace(/\s+/g, ''); // Hapus spasi
};

export const toSnakeCase = (str) =>
  str
    .replace(/([a-z])([A-Z])/g, '$1_$2') // Pisahkan camelCase & PascalCase
    .replace(/[-\s]+/g, '_') // Ubah kebab-case dan spasi menjadi underscore
    .toLowerCase(); // Pastikan huruf kecil semua
