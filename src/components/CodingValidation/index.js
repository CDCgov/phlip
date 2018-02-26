export { default as Header } from './Header'
export { default as FooterNavigate } from './FooterNavigate'
export { default as QuestionCard } from './QuestionCard'
export { default as Navigator } from './Navigator'

export const bodyStyles = theme => ({
  mainContent: {
    height: '100vh',
    width: '100%',
    flex: '1 !important',
    overflow: 'auto',
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: -330
  },
  openNavShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  }
})