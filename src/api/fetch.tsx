export async function fetchData<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(
        `HTTP error! Status: ${response.status} - ${response.statusText}`,
      )
    }

    // Parse the JSON response
    const data: T = await response.json()
    return data
  } catch (error) {
    throw new Error(
      `Failed to fetch data from ${url}. ${
        error instanceof Error ? error.message : String(error)
      }. Please check the network connection or API status.`,
    )
  }
}

export async function postData<T, U>(url: string, body: U): Promise<T> {
  console.log("url:", url, "body:", body)
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    credentials: "include",
  })

  if (!response.ok) {
    let errorDetails = ""
    try {
      const errorData = await response.json()
      errorDetails = ` - ${JSON.stringify(errorData)}`
    } catch (e) {
      console.error(e)
    }

    throw new Error(
      `HTTP error! Status: ${response.status} - ${response.statusText}${errorDetails}`,
    )
  }

  if (response.status === 204) {
    return undefined as T
  }
  const data: T = await response.json()
  return data
}
