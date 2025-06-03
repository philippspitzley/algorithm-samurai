import createFetchClient from "openapi-fetch"
import createClient from "openapi-react-query"

import type { paths } from "./openapi-schemas"

const BASE_URL = import.meta.env.VITE_API_BASE_URL
const FALLBACK_URL = "http://127.0.0.1:8000"

if (BASE_URL === undefined)
  console.info(`"VITE_API_BASE_URL" not found in .env! Fallback: "${FALLBACK_URL}"`)

const fetchClient = createFetchClient<paths>({
  baseUrl: BASE_URL,
})
export const $api = createClient(fetchClient)
