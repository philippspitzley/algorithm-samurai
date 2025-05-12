const BASEURL = "http://127.0.0.1:8000/api/v1"

const apiUrlPath = {
  courses: "/courses",
  user: "/users/me",
}

type ApiPath = keyof typeof apiUrlPath

export function getUrl(path: ApiPath): string {
  return BASEURL + apiUrlPath[path]
}
