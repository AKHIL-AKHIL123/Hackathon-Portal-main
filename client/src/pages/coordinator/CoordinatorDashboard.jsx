import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DefaultLayout from "@/components/DefaultLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { teamApi } from "@/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  ClipboardList,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

const CoordinatorDashboard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);
  const [availableProjects, setAvailableProjects] = useState([]);
  const [myTeams, setMyTeams] = useState([]);

  // Fetch coordinator data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [coordinatorTeams, allTeams] = await Promise.all([
          teamApi.getCoordinatorTeams(),
          teamApi.getAllTeams()
        ]);
        
        setMyTeams(coordinatorTeams);
        setTeams(allTeams);
        // Extract unique projects from all teams
        const projects = [...new Set(allTeams
          .map(team => team.project)
          .filter(project => project)
        )];
        setAvailableProjects(projects);
      } catch (error) {
        console.error("Error fetching coordinator data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // auto-refresh every minute
    return () => clearInterval(interval);
  }, [toast]);

  const handleProjectAssignment = async (teamId, projectId) => {
    try {
      await teamApi.assignProject(teamId, projectId);
      // Refresh the teams data after successful assignment
      const [updatedCoordinatorTeams, updatedAllTeams] = await Promise.all([
        teamApi.getCoordinatorTeams(),
        teamApi.getAllTeams()
      ]);
      setMyTeams(updatedCoordinatorTeams);
      setTeams(updatedAllTeams);
      toast({
        title: "Success",
        description: "Project assigned successfully",
      });
    } catch (error) {
      console.error("Error assigning project:", error);
      toast({
        title: "Error",
        description: "Failed to assign project. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Active: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      Pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      Inactive: { color: "bg-red-100 text-red-800", icon: AlertCircle },
      Submitted: { color: "bg-blue-100 text-blue-800", icon: CheckCircle },
      "In Progress": { color: "bg-purple-100 text-purple-800", icon: Clock },
    };

    const config = statusConfig[status] || statusConfig["Pending"];
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    );
  };

  const allTeams = teams;

  const TeamTable = ({ teamList, showAssignButton = false }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Team Name</TableHead>
          <TableHead>Members</TableHead>
          <TableHead>Project</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Deadline</TableHead>
          {showAssignButton && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell><Skeleton className="h-6 w-32" /></TableCell>
              <TableCell><Skeleton className="h-6 w-40" /></TableCell>
              <TableCell><Skeleton className="h-6 w-24" /></TableCell>
              <TableCell><Skeleton className="h-6 w-20" /></TableCell>
              <TableCell><Skeleton className="h-6 w-24" /></TableCell>
              {showAssignButton && <TableCell><Skeleton className="h-8 w-24" /></TableCell>}
            </TableRow>
          ))
        ) : teamList.map((team) => (
          <TableRow key={team.id}>
            <TableCell className="font-medium">{team.name}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {team.members.slice(0, 2).map((member, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {member}
                  </Badge>
                ))}
                {team.members.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{team.members.length - 2} more
                  </Badge>
                )}
              </div>
            </TableCell>
            <TableCell>
              {team.project ? (
                <Badge variant="secondary">{team.project}</Badge>
              ) : (
                <span className="text-gray-500 italic">Not assigned</span>
              )}
            </TableCell>
            <TableCell>{getStatusBadge(team.status)}</TableCell>
            <TableCell>
              {team.deadline ? (
                <span className="text-sm text-gray-700">{team.deadline}</span>
              ) : (
                <span className="text-gray-400 italic">N/A</span>
              )}
            </TableCell>
            {showAssignButton && (
              <TableCell>
                {!team.project && team.isMyTeam && (
                  <Select
                    onValueChange={(value) =>
                      handleProjectAssignment(team.id, value)
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Assign Project" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableProjects.map((project) => (
                        <SelectItem key={project} value={project}>
                          {project}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {team.project && team.isMyTeam && (
                  <Button variant="outline" size="sm">
                    Reassign
                  </Button>
                )}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <DefaultLayout userRole="coordinator">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50/30">
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
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-emerald-600 bg-clip-text text-transparent">
              Coordinator Dashboard
            </h1>
            <p className="text-gray-600 mt-3 text-lg">
              Manage teams and assign projects
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      My Teams
                    </p>
                    {loading ? (
                      <Skeleton className="h-10 w-20 mt-1" />
                    ) : (
                      <p className="text-3xl font-bold text-blue-600">
                        {myTeams.length}
                      </p>
                    )}
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Projects Assigned
                    </p>
                    {loading ? (
                      <Skeleton className="h-10 w-20 mt-1" />
                    ) : (
                      <p className="text-3xl font-bold text-emerald-600">
                        {myTeams.filter((team) => team.project).length}
                      </p>
                    )}
                  </div>
                  <ClipboardList className="w-8 h-8 text-emerald-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Pending Assignments
                    </p>
                    {loading ? (
                      <Skeleton className="h-10 w-20 mt-1" />
                    ) : (
                      <p className="text-3xl font-bold text-amber-600">
                        {myTeams.filter((team) => !team.project).length}
                      </p>
                    )}
                  </div>
                  <Clock className="w-8 h-8 text-amber-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Teams Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Team Management</CardTitle>
                <CardDescription className="text-base">
                  View and manage team assignments and project allocations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="my-teams" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-100/50">
                    <TabsTrigger
                      value="my-teams"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      My Teams
                    </TabsTrigger>
                    <TabsTrigger
                      value="all-teams"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      All Teams
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="my-teams" className="mt-6">
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Teams Under Your Coordination
                      </h3>
                      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <TeamTable teamList={myTeams} showAssignButton={true} />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="all-teams" className="mt-6">
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        All Registered Teams
                      </h3>
                      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <TeamTable teamList={allTeams} />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>

          {/* Project Assignment Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Quick Project Assignment</CardTitle>
                <CardDescription className="text-base">
                  Assign projects to teams that haven't been assigned yet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {loading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="h-[140px]">
                        <Skeleton className="w-full h-full rounded-xl" />
                      </div>
                    ))
                  ) : availableProjects.map((project, index) => (
                    <motion.div
                      key={project}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                      whileHover={{ y: -3, scale: 1.02 }}
                      className="group"
                    >
                      <div className="relative p-6 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 h-full">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-blue-50/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative z-10">
                          <h4 className="font-bold text-lg mb-4 group-hover:text-emerald-700 transition-colors">
                            {project}
                          </h4>
                          <div className="flex items-center justify-between">
                            <Badge
                              variant="outline"
                              className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200"
                            >
                              Available
                            </Badge>
                            <span className="text-sm text-gray-600 font-medium">
                              {
                                teams.filter((team) => team.project === project)
                                  .length
                              }{" "}
                              assigned
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </DefaultLayout>
  );
};

export default CoordinatorDashboard;
