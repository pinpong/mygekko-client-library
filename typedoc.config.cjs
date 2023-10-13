/** @type {import("typedoc")} */
module.exports = {
  $schema: 'https://typedoc.org/schema.json',
  entryPoints: ['./src/index.ts'],
  excludePrivate: true,
  excludeProtected: false,
  excludeInternal: true,
  out: 'docs',
  treatWarningsAsErrors: true,
  githubPages: true,
  navigation: {
    includeCategories: false,
    includeGroups: true,
    fullTree: false,
  },
  navigationLinks: {
    GitHub: 'https://github.com/pinpong/mygekko-client-library',
    Donate: 'https://www.paypal.com/donate/?hosted_button_id=FR5DFYQA6GYCS',
  },
};
