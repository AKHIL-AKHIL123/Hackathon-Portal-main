// client/src/pages/Register.jsx
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import axios from "axios"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus, ArrowLeft } from "lucide-react"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  college: z.string().min(2, "College name required"),
  phone: z.string().min(10, "Phone number required"),
  team: z.string().min(2, "Team name required"),
  teamMembers: z.string().optional(),
})

function RegisterPage() {
  const navigate = useNavigate()
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      college: "",
      phone: "",
      team: "",
      teamMembers: "",
    },
  })

  const onSubmit = async (data) => {
    try {
      const teamMembersArray = data.teamMembers
        ? data.teamMembers.split(",").map((m) => m.trim())
        : []

      await axios.post("http://localhost:5000/api/auth/register", {
        ...data,
        teamMembers: teamMembersArray,
      })

      alert("Account created! Please log in.")
      navigate("/login")
    } catch (err) {
      console.error(err)
      alert(err?.response?.data?.msg || "Registration failed")
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glowing circles */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-lg relative z-10"
      >
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-xl">
          <CardHeader className="space-y-1 text-center pb-8">
            <motion.div
              className="flex justify-center mb-6"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <UserPlus className="w-8 h-8 text-white" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur-xl opacity-50" />
              </div>
            </motion.div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
              Create Account
            </CardTitle>
            <p className="text-gray-600 mt-2">Register to join hackathon events</p>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {["name", "email", "password", "college", "phone", "team", "teamMembers"].map(
                  (field) => (
                    <FormField
                      key={field}
                      control={form.control}
                      name={field}
                      render={({ field: f }) => (
                        <FormItem>
                          <FormLabel className="font-medium capitalize">{field}</FormLabel>
                          <FormControl>
                            <Input
                              type={field === "password" ? "password" : "text"}
                              placeholder={`Enter ${field}`}
                              {...f}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )
                )}

                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    Register
                  </Button>
                </motion.div>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                onClick={() => navigate("/login")}
                className="text-sm text-gray-500"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default RegisterPage
