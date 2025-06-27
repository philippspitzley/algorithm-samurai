import { $api } from "@/api/api"

function useStats() {
  const { data: stats } = $api.useQuery("get", "/api/v1/stats/")

  return { stats }
}

export default useStats
