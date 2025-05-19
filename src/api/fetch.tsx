export interface ApiError extends Error {
  status?: number
  statusText?: string
}

export async function getData<T>(url: string): Promise<T> {
  const response = await fetch(url)

  if (!response.ok) {
    let errorBody: any = null
    let errorMessage = `HTTP error! Status: ${response.status} - ${response.statusText}` // Default message

    try {
      // Get error from response body as json
      errorBody = await response.json()

      if (errorBody?.detail?.[0]?.msg) {
        errorMessage = errorBody.detail[0].msg
      } else if (errorBody?.detail) {
        errorMessage = errorBody.detail
      } else if (typeof errorBody === "object" && errorBody !== null) {
        // If detail.msg isn't there, but we got a JSON object, stringify it for more info
        errorMessage = `HTTP error! Status: ${response.status}. Response: ${JSON.stringify(errorBody)}`
      }
    } catch (e) {
      // Parsing JSON failed or body wasn't JSON.
      // The default errorMessage or a text fallback might be all we have.
      console.warn(
        "Could not parse error response body as JSON or access detail.msg. Falling back to status text or raw text if available.",
        e,
      )
      // Optionally, try to get raw text if JSON parsing failed
      try {
        const textBody = await response.text()
        if (textBody) {
          errorMessage = `HTTP error! Status: ${response.status}. Raw Response: ${textBody.substring(0, 200)}`
        }
      } catch (textEx) {
        // Failed to get text body either
      }
    }

    const error = new Error(errorMessage) as ApiError
    error.status = response.status
    error.statusText = response.statusText
    throw error
  }

  // If response.ok is true, parse and return data
  try {
    const data: T = await response.json()
    return data
  } catch (e) {
    // Handle cases where response.ok is true, but body is not valid JSON
    console.error("Successfully fetched but failed to parse response JSON:", e)
    const error: any = new Error("Failed to parse successful response as JSON.")
    error.status = response.status
    throw error
  }
}

export async function postData<T, U>(url: string, body: U): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    credentials: "include",
  })

  if (!response.ok) {
    let errorBody: any = null
    let errorMessage = `HTTP error! Status: ${response.status} - ${response.statusText}` // Default message

    try {
      errorBody = await response.json()
      if (errorBody?.detail?.[0]?.msg) {
        errorMessage = errorBody.detail[0].msg
      } else if (errorBody?.detail) {
        errorMessage = errorBody.detail
      } else if (typeof errorBody === "object" && errorBody !== null) {
        errorMessage = `HTTP error! Status: ${response.status}. Response: ${JSON.stringify(errorBody)}`
      }
    } catch (e) {
      console.warn(
        "POST: Could not parse error response body as JSON or access detail.msg.",
        e,
      )
      try {
        const textBody = await response.text()
        if (textBody) {
          errorMessage = `HTTP error! Status: ${response.status}. Raw Response: ${textBody.substring(0, 200)}`
        }
      } catch (textEx) {
        // Failed to get text body either
      }
    }
    const error = new Error(errorMessage) as ApiError
    error.status = response.status
    error.statusText = response.statusText
    throw error
  }

  // Handle 204 No Content for POST requests that don't return a body
  if (response.status === 204) {
    return undefined as T // Or handle as appropriate for your application
  }

  try {
    const data: T = await response.json()
    return data
  } catch (e) {
    console.error(
      "POST: Successfully sent but failed to parse response JSON:",
      e,
    )
    const error: any = new Error(
      "POST: Failed to parse successful response as JSON.",
    )
    error.status = response.status
    throw error
  }
}
