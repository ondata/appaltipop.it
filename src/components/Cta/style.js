export default (theme) => ({
  card: {
    margin: noMargins => noMargins ? 0 : theme.spacing(8, 0),
    padding: theme.spacing(2),
    maxWidth: noMargins => noMargins ? 'none' : 400,
    backgroundColor: theme.palette.common.white,
    '& > *': {
      height: '100%'
    }
  },
  button: {
    margin: noMargins => noMargins ? 0 : theme.spacing(8, 0),
    padding: theme.spacing(0, 2),
    maxWidth: noMargins => noMargins ? 'none' : 400,
    backgroundColor: theme.palette.common.white,
    cursor: 'pointer',
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
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
})
