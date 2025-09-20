import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DefaultLayout from "@/components/DefaultLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Users,
  User,
  Code,
  GitBranch,
  CheckCircle,
  Clock,
  ExternalLink,
  Upload,
  Star,
  Calendar,
  Target,
} from "lucide-react";

const ParticipantDashboard = () => {
  const [data, setData] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [githubRepo, setGithubRepo] = useState("");
  const [commitId, setCommitId] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState("pending");

  // Fetch team + project data from /public/participantData.json
  useEffect(() => {
    const fetchData = () => {
      fetch("/participantData.json")
        .then((res) => res.json())
        .then((json) => setData(json))
        .catch((err) =>
          console.error("Error loading /participantData.json:", err)
        );
    };

    fetchData(); // load initially
    const interval = setInterval(fetchData, 10000); // auto-refresh every 10s

    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return (
      <DefaultLayout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </DefaultLayout>
    );
  }

  const { teamData, availableProjects } = data;

  const handleProjectSelection = (project) => {
    setSelectedProject(project);
  };

  const handleSubmission = () => {
    if (githubRepo && commitId) {
      setSubmissionStatus("submitted");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        color: "bg-amber-50 text-amber-700 border-amber-200",
        icon: Clock,
        text: "Pending",
      },
      submitted: {
        color: "bg-blue-50 text-blue-700 border-blue-200",
        icon: CheckCircle,
        text: "Submitted",
      },
      reviewed: {
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: CheckCircle,
        text: "Reviewed",
      },
    };

    const config = statusConfig[status] || statusConfig["pending"];
    const Icon = config.icon;

    return (
      <Badge
        variant="outline"
        className={`${config.color} flex items-center gap-1.5 px-3 py-1`}
      >
        <Icon className="w-3.5 h-3.5" />
        {config.text}
      </Badge>
    );
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      Easy: "bg-emerald-50 text-emerald-700 border-emerald-200",
      Medium: "bg-amber-50 text-amber-700 border-amber-200",
      Hard: "bg-red-50 text-red-700 border-red-200",
    };
    return colors[difficulty] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  return (
    <DefaultLayout userRole="participant">
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
              Participant Dashboard
            </h1>
            <p className="text-gray-600 mt-3 text-lg">
              Manage your team project and submissions
            </p>
          </motion.div>

          {/* Stats Overview */}
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
                      Team Progress
                    </p>
                    <p className="text-3xl font-bold text-blue-600">
                      {teamData.progress}%
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-blue-500" />
                </div>
                <div className="mt-4 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${teamData.progress}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Deadline
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {teamData.deadline}
                    </p>
                  </div>
                  <Calendar className="w-8 h-8 text-amber-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Submission Status
                    </p>
                    <div className="mt-2">{getStatusBadge(submissionStatus)}</div>
                  </div>
                  <Upload className="w-8 h-8 text-emerald-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Available projects & submission code stays same (shortened for brevity) */}
          {/* Replace hardcoded data with `availableProjects` and `teamData` from JSON */}
        </motion.div>
      </div>
    </DefaultLayout>
  );
};

export default ParticipantDashboard;
