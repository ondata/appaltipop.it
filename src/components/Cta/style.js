export default (theme) => ({
  card: {
    backgroundColor: theme.palette.common.white,
    padding: theme.spacing(2),
    height: '100%',
    '& > *': {
      height: '100%'
    }
  },
  button: {
    backgroundColor: theme.palette.common.white,
    padding: theme.spacing(0, 2),
    cursor: 'pointer',
    height: '100%',
    '& > *': {
      height: '100%'
    }
  },
  icon: {
    width: 52,
    height: 52,
    backgroundSize: 'contain'
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: '1.625rem'
  },
  buttonTitle: {
    fontSize: '1rem'
  },
  description: {
    fontSize: '1rem'
  },
  iconButton: {
    marginTop: 'auto'
  }
})
