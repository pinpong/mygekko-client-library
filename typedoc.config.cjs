const config = {
  entryPoints: ['src/index.ts'],
  excludePrivate: false,
  excludeProtected: false,
  excludeInternal: false,
  out: 'docs',
  requiredToBeDocumented: [
    'Enum',
    'EnumMember',
    'Variable',
    'Function',
    'Class',
    'Interface',
    'Property',
    'Method',
    'GetSignature',
    'SetSignature',
    'TypeAlias',
  ],
  internalModule: 'systems',
};

module.exports = config;
