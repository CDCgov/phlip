const styleguideTheme = {
  fontFamily: {
    base: [
      'Roboto',
      'sans-serif'
    ],
    monospace: 'Consolas, "Liberation Mono", Menlo, monospace'
  },
  fontSize: {
    base: 15,
    text: 16,
    small: 13,
    h1: 38,
    h2: 22,
    h3: 20,
    h4: 18,
    h5: 16,
    h6: 16,
    sectionName: 32
  }
}

const stylguideStyles = {
  MarkdownHeading: {
    spacing: {
      marginBottom: 15,
      marginTop: 32
    }
  },
  Para: {
    para: {
      marginBottom: 0,
      marginTop: 10,
      fontSize: 14,
      '& > code': {
        fontSize: 13,
        fontFamily: styleguideTheme.fontFamily.monospace,
        color: 'inherit',
        background: 'transparent',
        whiteSpace: 'inherit',
      },
      '& + ul > li': {
        fontSize: 14,
        fontFamily: styleguideTheme.fontFamily.base,
        lineHeight: 1.5
      },
      '& + ul > li > code': {
        fontSize: 14,
        fontFamily: styleguideTheme.fontFamily.monospace,
        color: 'inherit',
        background: 'transparent',
        whiteSpace: 'inherit'
      }
    }
  },
  List: {
    li: {
      '& > code': {
        fontSize: 14
      },
      '& > strong': {
        fontSize: 14
      }
    }
  },
  Table: {
    cell: {
      color: 'black',
      paddingRight: 16,
      paddingTop: 8,
      paddingBottom: 8,
      verticalAlign: 'top',
      fontFamily: styleguideTheme.fontFamily.base,
      fontSize: styleguideTheme.fontSize.small,
      '&:last-child': {
        isolate: false,
        width: '99%',
        paddingRight: 0
      },
      '& p:first-child': {
        marginTop: 0
      },
      '& p:last-child': {
        isolate: false,
        marginBottom: 0
      }
    }
  },
  /**
   * This is for each parent section like Scenes, Utility, UI Component, and HOC
   */
  Section: {
    root: {
      marginBottom: 60
    }
  },
  ComponentsList: {
    heading: {
      fontWeight: '600 !important',
      fontSize: 16
    },
    isChild: {
      fontSize: 13,
      fontWeight: 'lighter'
    }
  },
  ReactComponent: {
    header: {
      marginBottom: 10
    },
    tabs: {
      backgroundColor: '#ebf1f3',
      marginTop: 20,
      padding: 10,
      overflow: 'auto'
    },
    tabButtons: {
      marginBottom: 0
    }
  },
  TabButton: {
    button: {
      width: '100%'
    },
    isActive: {
      border: 0
    }
  }
}

module.exports = {
  styleguideTheme,
  stylguideStyles
}