const BASEURL = "http://localhost:8000/api/v1"

const apiUrlPath = {
  courses: "/courses",
  chapters: "/chapters",
  userMe: "/users/me",
  signUp: "/users/signup",
}

type ApiPath = keyof typeof apiUrlPath

export function getUrl(path: ApiPath): string {
  return BASEURL + apiUrlPath[path]
}
