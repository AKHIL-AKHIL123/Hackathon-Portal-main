import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import DefaultLayout from "@/components/DefaultLayout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Users, Plus } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { hackathonApi } from "@/api"
import { useToast } from "@/hooks/use-toast"

const AdminDashboard = () => {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState([])
  const [stats, setStats] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const hackathons = await hackathonApi.getHackathons()
        
        // Calculate stats from hackathon data
        const activeHackathons = hackathons.filter(h => new Date(h.endDate) > new Date())
        const completedHackathons = hackathons.filter(h => new Date(h.endDate) <= new Date())
        
        // Get all projects from hackathons
        const allProjects = hackathons.flatMap(h => h.projects || [])
        
        setProjects(allProjects)
        setStats({
          totalEvents: hackathons.length,
          activeEvents: activeHackathons.length,
          completedEvents: completedHackathons.length,
          totalTeams: hackathons.reduce((acc, h) => acc + (h.teams?.length || 0), 0),
          totalParticipants: hackathons.reduce((acc, h) => acc + (h.participants?.length || 0), 0),
          activeProjects: allProjects.length
        })
      } catch (error) {
        console.error("Error fetching hackathon data:", error)
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again later.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    // Refresh data every minute
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  const getDifficultyColor = (difficulty) => {
    const colors = {
      Easy: "bg-emerald-50 text-emerald-700 border-emerald-200",
      Medium: "bg-amber-50 text-amber-700 border-amber-200",
      Hard: "bg-red-50 text-red-700 border-red-200",
    }
    return colors[difficulty] || "bg-gray-50 text-gray-700 border-gray-200"
  }

  return (
    <DefaultLayout userRole="admin">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-3 text-lg">Create and manage hackathon events</p>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Events</p>
                    {loading ? (
                      <Skeleton className="h-10 w-20 mt-1" />
                    ) : (
                      <p className="text-3xl font-bold text-blue-600">{stats?.totalEvents || 0}</p>
                    )}
                  </div>
                  <Trophy className="w-8 h-8 text-blue-500" />
                </div>
                {loading ? (
                  <Skeleton className="h-5 w-32 mt-2" />
                ) : (
                  <p className="text-sm text-blue-600 mt-2">
                    {stats?.activeEvents || 0} active, {stats?.completedEvents || 0} completed
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Teams</p>
                    {loading ? (
                      <Skeleton className="h-10 w-20 mt-1" />
                    ) : (
                      <p className="text-3xl font-bold text-emerald-600">{stats?.totalTeams || 0}</p>
                    )}
                  </div>
                  <Users className="w-8 h-8 text-emerald-500" />
                </div>
                {loading ? (
                  <Skeleton className="h-5 w-32 mt-2" />
                ) : (
                  <p className="text-sm text-emerald-600 mt-2">{stats?.totalParticipants || 0} participants</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Projects</p>
                    {loading ? (
                      <Skeleton className="h-10 w-20 mt-1" />
                    ) : (
                      <p className="text-3xl font-bold text-purple-600">{stats?.activeProjects || 0}</p>
                    )}
                  </div>
                  <Plus className="w-8 h-8 text-purple-500" />
                </div>
                {loading ? (
                  <Skeleton className="h-5 w-32 mt-2" />
                ) : (
                  <p className="text-sm text-purple-600 mt-2">Available challenges</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Available Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Available Project Problems</CardTitle>
                <CardDescription className="text-base">
                  Predefined challenges for teams to choose from
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-[200px]">
                        <Skeleton className="w-full h-full rounded-xl" />
                      </div>
                    ))}
                  </div>
                ) : projects.length === 0 ? (
                  <p className="text-gray-500">No projects available</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className="group relative"
                      >
                        <div className="relative p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 h-full">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          <div className="relative z-10">
                            <h3 className="font-bold text-lg mb-3 group-hover:text-blue-700 transition-colors">
                              {project.title}
                            </h3>

                            <div className="flex items-center justify-between mb-4">
                              <Badge variant="outline" className="text-xs bg-white">
                                {project.category}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={`text-xs font-medium ${getDifficultyColor(
                                  project.difficulty
                                )}`}
                              >
                                {project.difficulty}
                              </Badge>
                            </div>

                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <div className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                {project.participants} participants
                              </div>
                              <div className="flex items-center">
                                <Trophy className="w-4 h-4 mr-1 text-yellow-500" />
                                {project.rating}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </DefaultLayout>
  )
}

export default AdminDashboard
