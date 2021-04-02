const style = (theme) => ({
  root: {
    position: 'relative',
    padding: theme.spacing(2, 4),
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.grey[100]
  },
  icon: {
    maxWidth: 75
  },
  number: {
    fontSize: '2.375rem',
    fontWeight: 'bold'
  },
  help: {
    fontWeight: theme.typography.fontWeightBold,
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1)
  }
})

export default style
