import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
  palette: {
    background: {
      default: '#0C152E'
    },
    primary: {
      main: '#4070F4',
      light: '#4070F4',
      dark: '#4070F4'
    },
    secondary: {
      main: '#254898',
      light: '#254898',
      dark: '#254898',
      contrastColor: '#fff'
    },
    text: {
      primary: '#fff',
    }
  },
});

let CardTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#000',
      light: '#000',
      dark: '#000'
    },
    secondary: {
      main: '#254898',
      light: '#254898',
      dark: '#254898',
      contrastColor: '#fff'
    },
    text: {
      primary: '#000'
    }
  }
})

let Colors = {
  "ordinary": "#ddd",
  "ordinaryBack": "#999",
  "rare": "#00C3FF",
  "super": "#00FF26",
  "epic": "#C800FF",
  "legendary": "#FFAE00",
  "mythic": "#AC1612"
}

export { CardTheme, Colors };