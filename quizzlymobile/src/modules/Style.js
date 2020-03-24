var Style = {
  gray: '#838383',
  lightGray: '#E1E1E1',
  lightestGray: '#F8F8F8',
  lightBlue: '#E1FBFF',
  lightRed: '#FEEDED',
  lightGreen: '#D9FFF0',
  red: '#F05555',
  green: '#32F1A8',
  darkGreen: '#0ec981',
  white: '#FFF',

  fontSize1: 32,
  fontSizeP: 18,
  fontSizePSmall: 16,

  roboto: 'GillSans-Light',
  mont: 'Helvetica',
}

Style.inputClear = {
  color: Style.white,
  height: 60,
  fontSize: Style.fontSize1,
  textAlign: 'center',
  alignSelf: 'stretch',
  fontFamily: Style.roboto,
}

Style.p = {
  fontFamily: Style.roboto,
  fontWeight: '300',
  fontSize: Style.fontSizeP,
  color: Style.gray,
}

Style.pSmall = {
  fontFamily: Style.roboto,
  fontWeight: '300',
  fontSize: Style.fontSizePSmall,
  color: Style.gray,
}

Style.italic = {
  fontStyle: 'italic'
}

Style.underline = { textDecorationLine: 'underline' }

module.exports = Style;
