const styleguideTheme = {
  fontFamily: {
    base: [
      'Roboto',
      'sans-serif'
    ]
  },
  fontSize: {
    base: 15,
    text: 16,
    small: 13,
    h1: 38,
    h2: 24,
    h3: 20,
    h4: 18,
    h5: 16,
    h6: 16,
    sectionName: 32
  }
}

const stylguideStyles = {
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
    tabs: {
      backgroundColor: '#ebf1f3',
      padding: 10,
      overflow: 'auto'
    },
    tabButtons: {
      marginBottom: 10
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