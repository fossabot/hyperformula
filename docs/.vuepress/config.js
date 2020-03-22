module.exports = {
  title: 'HyperFormula',
  description: '⚡️ HyperFormula is an open-source, high-performance calculation engine for spreadsheets and web applications.',
  plugins: [
    ['@vuepress/search', {
      searchMaxSuggestions: 10
    }],
    ['@vuepress/active-header-links']
  ],
  themeConfig: {
    nextLinks: true,
    prevLinks: true,
    repo: 'handsontable/hyperformula',
    docsRepo: 'handsontable/hyperformula',
    docsDir: 'docs',
    docsBranch: 'develop',
    editLinks: false,
    lastUpdated: false,
    smoothScroll: true,
    searchPlaceholder: 'Search...',
    // algolia: {
    //   apiKey: '<API_KEY>',
    //   indexName: '<INDEX_NAME>'
    // },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      // { text: 'Functions', link: '/functions/' },
      { text: 'API Reference', link: '/api/' },
    ],
    displayAllHeaders: false, // collapse other pages
    activeHeaderLinks: true,
    sidebarDepth: 3,
    sidebar: {
      '/guide/': [
        {
          title: 'Introduction',
          path: '/guide/',
        },
        {
          title: 'Basic Guide',
          collapsable: false,
          children: [
            ['/guide/requirements', 'Requirements'],
            ['/guide/basic-usage', 'Basic Usage'],
            ['/guide/data-operations', 'Data Operations'],
            ['/guide/crud-operations', 'CRUD Operations Explained'],
            ['/guide/config-options', 'Config Options Explained'],
            ['/guide/helpers', 'Helpers'],
            ['/guide/working-with-events', 'Working with Events'],
            ['/guide/handling-errors', 'Handling Errors'],
            ['/guide/license-key', 'License Key'],
            ['/guide/release-notes', 'Release Notes'],
          ]
        },
        {
          title: 'Advanced Guide',
          collapsable: false,
          children: [
            ['/guide/custom-language', 'Custom Language'],
            ['/guide/custom-function', 'Custom Function'],
            ['/guide/multiple-sheets', 'Working with multiple sheets'],
            ['/guide/named-expressions', 'Named Expressions'],
            ['/guide/structured-references', 'Structured References'],
            ['/guide/clipboard', 'Clipboard'],
            ['/guide/batch-operations', 'Batch Operations'],
            ['/guide/data-types', 'Supported Data Types'],
            ['/guide/gpu-support', 'GPU Support'],
            ['/guide/integrations', 'Integrations'],
          ],
        },
        {
          title: 'Contributtor Guide',
          collapsable: false,
          children: [
            ['/guide/working-with-documentation', 'Working With Documentation'],
            ['https://github.com/handsontable/hyperformula/blob/develop/CONTRIBUTING.md', 'CONTRIBUTING.md'],
            ['https://github.com/handsontable/hyperformula/blob/develop/CODE_OF_CONDUCT.md', 'CODE_OF_CONDUCT.md'],

          ],
        },
      ],
      '/api/': [
        {
          title: 'HyperFormula',
          path: '/api/classes/_hyperformula_.hyperformula',
          collapsable: true,
        },
        {
          title: 'Events',
          path: '/api/interfaces/_emitter_.listeners',
          collapsable: true,
        },
        {
          title: 'Options',
          path: '/api/interfaces/_config_.configparams',
          collapsable: true,
        },
        {
          title: 'Errors',
          collapsable: false,
          sidebarDepth: 0,
          children: [
            ['/api/classes/_errors_.expectedoneofvalues', 'ExpectedOneOfValues'],
            ['/api/classes/_errors_.expectedvalueoftype', 'ExpectedValueOfType'],
            ['/api/classes/_errors_.invalidaddresserror', 'InvalidAddressError'],
            ['/api/classes/_errors_.invalidargumentserror', 'InvalidArgumentsError'],
            ['/api/classes/_errors_.namedexpressiondoesnotexist', 'NamedExpressionDoesNotExist'],
            ['/api/classes/_errors_.namedexpressionnameisalreadytaken', 'NamedExpressionNameIsAlreadyTaken'],
            ['/api/classes/_errors_.namedexpressionnameisinvalid', 'NamedExpressionNameIsInvalid'],
            ['/api/classes/_errors_.nooperationtoundo', 'NoOperationToUndo'],
            ['/api/classes/_errors_.nosheetwithiderror', 'NoSheetWithIdError'],
            ['/api/classes/_errors_.nosheetwithnameerror', 'NoSheetWithNameError'],
            ['/api/classes/_errors_.unabletoparse', 'UnableToParse'],
          ]
        },
        {
          title: 'Values',
          collapsable: false,
          sidebarDepth: 0,
          children: [
            ['/api/classes/_cellvalue_.detailedcellerror', 'DetailedCellError'],
            ['/api/classes/_hyperformula_.hyperformula', 'EmptyValue'],
            ['/api/classes/_cellvalue_.exportedcellchange', 'ExportedCellChange'],
            ['/api/classes/_cellvalue_.exportednamedexpressionchange', 'ExportedNamedExpressionChange'],
          ]
        },
      ],
    },
  }
};