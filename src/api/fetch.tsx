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
