import { Client } from '@elastic/elasticsearch'
import { ES_URL, ES_AUTH_USERNAME, ES_AUTH_PASSWORD } from '../config/constants'

export default new Client({
  node: ES_URL,
  auth: {
    username: ES_AUTH_USERNAME,
    password: ES_AUTH_PASSWORD
  }
})
