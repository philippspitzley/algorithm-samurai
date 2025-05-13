const BASEURL = "http://localhost:8000/api/v1"

const apiUrlPath = {
  courses: "/courses",
  userMe: "/users/me",
}

type ApiPath = keyof typeof apiUrlPath

export function getUrl(path: ApiPath): string {
  return BASEURL + apiUrlPath[path]
}
