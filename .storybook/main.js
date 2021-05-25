const path = require('path')
const fs = require('fs')

module.exports = {
  stories: [
    '../stories/**/*.stories.mdx',
    '../stories/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials'
  ],
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  webpackFinal: async (config, { configType }) => {
    const packages = fs.readdirSync(path.resolve(__dirname, '../packages/'))
    const alias = packages.reduce((acc, packageName) => ({
      ...acc,
      [`@formula/${packageName}`]: path.resolve(__dirname, `../packages/${packageName}/src`)
    }), {})
    console.log('alias', alias)
    
    config.resolve.alias = alias
    return config;
  },
}