export default (theme) => ({
  root: {
    backgroundColor: theme.palette.text.primary,
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  list: {
    '& .MuiListItemText-primary': {
      fontWeight: 'inherit'
    }
  },
  logo: {
    '& img': {
      maxWidth: '50%',
      [theme.breakpoints.down('sm')]: {
        maxWidth: '75%'
      },
      [theme.breakpoints.down('xs')]: {
        maxWidth: '100%'
      }
    }
  },
  menuButton: {
    textDecoration: 'underline',
    '&:hover': {
      textDecoration: 'underline'
    },
    '& .MuiListItemText-primary': {
      fontSize: '1rem'
    }
  }
})
