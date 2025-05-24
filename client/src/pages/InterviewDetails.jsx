import { useParams, Link } from "react-router-dom"
import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft } from "lucide-react"
import LikeCount from "@/components/LikeCount"
import { useIsMobile } from "../hooks/use-mobile.js";
export default function InterviewDetails() {
  const { id } = useParams()
  const [interview, setInterview] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // For demonstration/debugging - can remove in production
 

  useEffect(() => {
    if (!id) return
    
    // Fix template literal syntax with proper backticks
    fetch(`${import.meta.env.VITE_API_BASE_URL}/interviews/${id}`, {
      credentials: "include"
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setInterview(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch interview:", err)
        // For demonstration purposes, use the demo data if API fails
        // Remove this in production
        setIsLoading(false);
      })
  }, [id])

  const getDifficultyColor = level => {
    switch (level?.toLowerCase()) {
      case "easy":
        return "bg-green-600 hover:bg-green-700"
      case "medium":
        return "bg-yellow-600 hover:bg-yellow-700"
      case "hard":
        return "bg-red-600 hover:bg-red-700"
      default:
        return "bg-secondary hover:bg-secondary/80"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <p className="text-muted-foreground">Loading interview details...</p>
      </div>
    )
  }

  if (!interview) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <h2 className="text-2xl font-bold">Interview not found</h2>
        <Button variant="outline" asChild>
          <Link to="/interviews">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to all interviews
          </Link>
        </Button>
      </div>
    )
  }

  // Format dates once for reuse
  const formattedInterviewDate = interview.interviewDate 
    ? new Date(interview.interviewDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    : null;
    
  const formattedCreatedDate = interview.createdAt ? new Date(interview.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }) : "Unknown";
  
  
  return (
  <div className="animate-fade-in max-w-4xl mx-auto px-2 sm:px-4">
    <div className="mb-4 sm:mb-6">
      <Button variant="ghost" asChild className="group">
        <Link to="/interview" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition" />
          Back to all interviews
        </Link>
      </Button>
    </div>

    <Card className="border-border shadow-lg bg-card">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
          {interview.difficultyLevel && (
            <Badge
              className={`${getDifficultyColor(interview.difficultyLevel)} px-3 py-1 capitalize text-xs sm:text-sm`}
            >
              {interview.difficultyLevel}
            </Badge>
          )}
          <LikeCount interviewid={interview._id} />
        </div>

        <CardTitle className="text-2xl sm:text-3xl">{interview.title}</CardTitle>
        <CardDescription className="text-base sm:text-xl mt-2 capitalize">
          {interview.companyId} • {interview.roleId}
        </CardDescription>

        <div className="flex items-center mt-3 sm:mt-4 space-x-2">
          <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
            <AvatarFallback className="bg-primary/20 text-primary">
              {interview.author?.[0]?.toUpperCase() || "A"}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs sm:text-sm text-muted-foreground">
            Author: {interview.author?.name}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 p-2 sm:p-4 bg-primary/5 rounded-lg">
          {/* <div>
            <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Interview ID</h3>
            <p className="text-xs sm:text-sm font-mono break-all">{interview._id || id}</p>
          </div> */}
          <div>
            <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Company</h3>
            <p className="capitalize text-xs sm:text-sm">{interview.companyId}</p>
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Role</h3>
            <p className="capitalize text-xs sm:text-sm">{interview.roleId}</p>
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Difficulty</h3>
            <p className="capitalize text-xs sm:text-sm">{interview.difficultyLevel}</p>
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Interview Date</h3>
            <p className="text-xs sm:text-sm">{formattedInterviewDate || "Not specified"}</p>
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Created</h3>
            <p className="text-xs sm:text-sm">{formattedCreatedDate}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <h3 className="text-xs sm:text-sm font-medium text-muted-foreground w-full mb-1">Tags</h3>
          {interview.tags?.length > 0 ? (
            interview.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))
          ) : (
            <span className="text-xs sm:text-sm text-muted-foreground">No tags</span>
          )}
        </div>

        <Separator className="my-3 sm:my-4" />

        <div className="prose prose-invert max-w-none prose-headings:text-primary prose-a:text-blue-400">
          <h3 className="text-base sm:text-lg font-medium mb-2">Experience</h3>
          <p className="whitespace-pre-wrap text-xs sm:text-base">{interview.experience}</p>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row justify-between pt-4 border-t border-border text-xs sm:text-sm text-muted-foreground gap-2 sm:gap-0">
        <div>
          Created: {formattedCreatedDate}
        </div>
        {interview.updatedAt && interview.updatedAt !== interview.createdAt && (
          <div>
            Updated: {new Date(interview.updatedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric"
            })}
          </div>
        )}
      </CardFooter>
    </Card>
  </div>
);

}