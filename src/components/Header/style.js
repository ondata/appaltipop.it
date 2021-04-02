const style = (theme) => ({
  container: {
    padding: 0
  },
  logo: {
    flexGrow: 1,
    '& img': {
      maxHeight: '2rem',
      maxWidth: '100%'
    }
  },
  menuButton: {
    marginLeft: theme.spacing(4)
  },
  langButton: {
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: 'transparent'
    }
  },
  selected: {
    textDecoration: 'underline',
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightBold
  },
  mobileMenu: {
    '& .MuiListItemText-primary': {
      fontSize: '1rem'
    }
  },
  close: {
    marginLeft: 'auto'
  }
})

export default style
