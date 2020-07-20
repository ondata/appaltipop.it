export default (theme) => ({
  root: {
    marginBottom: theme.spacing(2)
  },
  panel: {
    '& > .MuiAccordionSummary-content': {
      alignItems: 'center'
    }
  },
  icon: {},
  title: {},
  summary: {
    fontSize: '1rem'
  },
  details: {
    padding: theme.spacing(2, 4)
  },
  description: {}
})
