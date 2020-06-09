import { Client } from "@elastic/elasticsearch"
import { ES_URL } from "../config/constants"

export default new Client({ node: ES_URL })

/* TODO: add support to basic auth */
