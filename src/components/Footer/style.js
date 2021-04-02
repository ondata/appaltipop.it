const style = (theme) => ({
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
  thanks: {
    textAlign: 'center',
    '& .MuiTypography-body1': {
      fontSize: '0.85rem !important'
    },
    '& img': {
      width: '100%',
      maxWidth: '150px'
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

export default style
