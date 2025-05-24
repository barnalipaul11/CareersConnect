
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { showToast } from "@/helpers/showToast";
import { getEnv } from "@/helpers/getEnv";
import { useSelector } from "react-redux";
import { RouteBlogAdd, RouteInternship, RouteOpportunity } from "@/helpers/RouteName";

// Mock data
const companyOptions = [
  { id: "tcs", name: "Tata Consultancy Services (TCS)" },
  { id: "infosys", name: "Infosys" },
  { id: "wipro", name: "Wipro" },
  { id: "hcl", name: "HCL Technologies" },
  { id: "techmahindra", name: "Tech Mahindra" },
  { id: "lti", name: "LTIMindtree" },
  { id: "persistent", name: "Persistent Systems" },
  { id: "mphasis", name: "Mphasis" },
  { id: "birlasoft", name: "Birlasoft" },
  { id: "hexaware", name: "Hexaware Technologies" },
  { id: "cognizant", name: "Cognizant" },
  { id: "capgemini", name: "Capgemini" },
  { id: "accenture", name: "Accenture" },
  { id: "ibm", name: "IBM" },
  { id: "oracle", name: "Oracle" },
  { id: "deloitte", name: "Deloitte" },
  { id: "sap", name: "SAP" },
  { id: "google", name: "Google" },
  { id: "microsoft", name: "Microsoft" },
  { id: "amazon", name: "Amazon" },
  { id: "apple", name: "Apple" },
  { id: "meta", name: "Meta" },
  { id: "zoho", name: "Zoho Corporation" },
  { id: "thoughtworks", name: "ThoughtWorks" },
  { id: "hitachi", name: "Hitachi Vantara" },
  { id: "atos", name: "Atos Syntel" },
  { id: "virtusa", name: "Virtusa" },
  { id: "infosys_bpm", name: "Infosys BPM" },
  { id: "valuelabs", name: "ValueLabs" },
  { id: "other", name: "Other" }
];

const roleOptions = [
  // Technical Roles
  { id: "software-engineer", name: "Software Engineer" },
  { id: "full-stack-developer", name: "Full Stack Developer" },
  { id: "frontend-developer", name: "Frontend Developer" },
  { id: "backend-developer", name: "Backend Developer" },
  { id: "mobile-developer", name: "Mobile App Developer" },
  { id: "android-developer", name: "Android Developer" },
  { id: "ios-developer", name: "iOS Developer" },
  { id: "data-scientist", name: "Data Scientist" },
  { id: "data-analyst", name: "Data Analyst" },
  { id: "machine-learning-engineer", name: "Machine Learning Engineer" },
  { id: "devops-engineer", name: "DevOps Engineer" },
  { id: "cloud-engineer", name: "Cloud Engineer" },
  { id: "qa-engineer", name: "QA Engineer" },
  { id: "test-automation-engineer", name: "Test Automation Engineer" },
  { id: "site-reliability-engineer", name: "Site Reliability Engineer (SRE)" },
  { id: "database-administrator", name: "Database Administrator (DBA)" },
  { id: "system-administrator", name: "System Administrator" },
  { id: "network-engineer", name: "Network Engineer" },
  { id: "it-support", name: "IT Support Engineer" },
  { id: "security-analyst", name: "Cybersecurity Analyst" },

  // Design & Product Roles
  { id: "ui-designer", name: "UI Designer" },
  { id: "ux-designer", name: "UX Designer" },
  { id: "technical-writer", name: "Technical Writer" },

  // Management & MBA-Specific Roles
  { id: "product-manager", name: "Product Manager" },
  { id: "project-manager", name: "Project Manager" },
  { id: "business-analyst", name: "Business Analyst" },
  { id: "marketing-manager", name: "Marketing Manager" },
  { id: "sales-manager", name: "Sales Manager" },
  { id: "strategy-consultant", name: "Strategy Consultant" },
  { id: "operations-manager", name: "Operations Manager" },
  { id: "hr-manager", name: "HR Manager" },
  { id: "finance-manager", name: "Finance Manager" },
  { id: "management-consultant", name: "Management Consultant" },
  { id: "investment-banker", name: "Investment Banker" },
  { id: "product-marketing-manager", name: "Product Marketing Manager" },
  { id: "supply-chain-manager", name: "Supply Chain Manager" },
  { id: "category-manager", name: "Category Manager" },
  { id: "brand-manager", name: "Brand Manager" },
  { id: "scrum-master", name: "Scrum Master" },

  // Other
  { id: "other", name: "Other" }
];

const tagOptions = [
  // Core Technical
  { id: "dsa", name: "DSA" },
  { id: "coding", name: "Coding" },
  { id: "system-design", name: "System Design" },
  { id: "low-level-design", name: "Low-Level Design (LLD)" },
  { id: "high-level-design", name: "High-Level Design (HLD)" },
  { id: "oops", name: "OOPs Concepts" },
  { id: "dbms", name: "DBMS" },
  { id: "os", name: "Operating Systems" },
  { id: "cn", name: "Computer Networks" },
  { id: "sql", name: "SQL" },
  { id: "api-design", name: "API Design" },

  // Web & Frontend Specific
  { id: "javascript", name: "JavaScript" },
  { id: "typescript", name: "TypeScript" },
  { id: "react", name: "React" },
  { id: "angular", name: "Angular" },
  { id: "html", name: "HTML" },
  { id: "css", name: "CSS" },
  { id: "web-performance", name: "Web Performance" },

  // Backend / DevOps
  { id: "nodejs", name: "Node.js" },
  { id: "java", name: "Java" },
  { id: "python", name: "Python" },
  { id: "spring", name: "Spring Framework" },
  { id: "microservices", name: "Microservices" },
  { id: "docker", name: "Docker" },
  { id: "kubernetes", name: "Kubernetes" },
  { id: "aws", name: "AWS" },

  // Data & ML Roles
  { id: "ml", name: "Machine Learning" },
  { id: "statistics", name: "Statistics" },
  { id: "deep-learning", name: "Deep Learning" },
  { id: "data-visualization", name: "Data Visualization" },
  { id: "pandas", name: "Pandas" },
  { id: "numpy", name: "NumPy" },

  // MBA / Non-Tech / Soft Skills
  { id: "aptitude", name: "Aptitude" },
  { id: "case-study", name: "Case Study" },
  { id: "guesstimate", name: "Guesstimates" },
  { id: "behavioral", name: "Behavioral" },
  { id: "hr-round", name: "HR Round" },
  { id: "leadership", name: "Leadership Questions" },
  { id: "communication", name: "Communication Skills" },

  // Misc
  { id: "resume", name: "Resume Screening" },
  { id: "group-discussion", name: "Group Discussion" },
  { id: "other", name: "Other" }
];


const locationOptions = [
  { id: "remote", name: "Remote" },
  { id: "bangalore", name: "Bangalore, India" },
  { id: "hyderabad", name: "Hyderabad, India" },
  { id: "delhi-ncr", name: "Delhi NCR, India" },
  { id: "mumbai", name: "Mumbai, India" },
  { id: "chennai", name: "Chennai, India" },
  { id: "pune", name: "Pune, India" },
  { id: "noida", name: "Noida, India" },
  { id: "gurgaon", name: "Gurgaon, India" },
  { id: "kolkata", name: "Kolkata, India" },
  { id: "ahmedabad", name: "Ahmedabad, India" },
  { id: "jaipur", name: "Jaipur, India" },
  { id: "kochi", name: "Kochi, India" },
  { id: "bhubaneswar", name: "Bhubaneswar, India" },
  { id: "trivandrum", name: "Trivandrum, India" },
  { id: "indore", name: "Indore, India" },
  { id: "lucknow", name: "Lucknow, India" },
  { id: "bhopal", name: "Bhopal, India" },
  { id: "nagpur", name: "Nagpur, India" },
  { id: "other", name: "Other" }
];

// Interview form schema
const interviewFormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  companyId: z.string({ required_error: "Please select a company." }),
  roleId: z.string({ required_error: "Please select a role." }),
  interviewDate: z.date({ required_error: "Please select a date." }),
  experience: z
    .string()
    .min(20, { message: "Experience must be at least 20 characters." }),
  difficultyLevel: z.enum(["easy", "medium", "hard"], {
    required_error: "Please select difficulty level.",
  }),
  tags: z
    .array(z.string())
    .min(1, { message: "Please select at least one tag." }),
});

// Opportunity form schema
const opportunityFormSchema = z.object({
  companyId: z.string({ required_error: "Please select a company." }),
  role: z.string().min(5, { message: "Role must be at least 5 characters." }),
  type: z.enum(["full-time", "internship"], {
    required_error: "Please select job type.",
  }),
  location: z.string({ required_error: "Please select a location." }),
  stipend: z.string().optional(),
  applicationDeadline: z.date({ required_error: "Please select a deadline." }),
  applyLink: z.string().url({ message: "Please enter a valid URL." }),
  eligibility: z
    .string()
    .min(10, { message: "Eligibility must be at least 10 characters." }),
  description: z
    .string()
    .min(20, { message: "Description must be at least 20 characters." }),
});


const SubmitForm = () => {
  const user = useSelector((state) => state.user);
  const [searchParams] = useSearchParams();
  const defaultTab =
    searchParams.get("type") === "opportunity" ? "opportunity" : "interview";
  const [activeTab, setActiveTab] = useState(defaultTab);
  const navigate = useNavigate();
  //const { toast } = useToast()

  // Interview form
  const interviewForm = useForm({
    resolver: zodResolver(interviewFormSchema),
    defaultValues: {
      title: "",
      companyId: "",
      roleId: "",
      experience: "",
      difficultyLevel: undefined,
      tags: [],
    },
  });

  //Interview Submit Function

  // Opportunity form
  const opportunityForm = useForm({
    resolver: zodResolver(opportunityFormSchema),
    defaultValues: {
      companyId: "",
      role: "",
      type: undefined,
      location: "",
      stipend: "",
      applyLink: "",
      eligibility: "",
      description: "",
    },
  });

  //Opportunity Submit Function
async function onOpportunitySubmit(values) {
  try {
    const userId = user.user._id 
    const username = user.user.name

    const payload = {
      ...values,
      userId,
      username 
    };

    console.log("Opportunity form data:", payload);

    const response = await fetch(
      `${getEnv("VITE_API_BASE_URL")}/opportunity/create`,
      {
        method: "post",
        headers: { "Content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return showToast("error", data.message);
    }

    opportunityForm.reset();
    navigate(RouteOpportunity);
    showToast("success", data.message);
  } catch (error) {
    showToast("error", error.message);
  }
}

async function onInterviewSubmit(values) {

  try {
    const userId = user.user._id 
    

    const payload = {
      ...values,
      userId: user.user._id, 
      interviewDate: new Date(values.interviewDate).toISOString(),
    };
    

    const response = await fetch(
      `${getEnv("VITE_API_BASE_URL")}/interviews/create/`,
      {
        method: "post",
        headers: { "Content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return showToast("error", data.message);
    }

    interviewForm.reset();
    navigate(RouteInternship);
    showToast("success", data.message);
  } catch (error) {
    showToast("error", error.message);
  }
}

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Submit Your Contribution</h1>
        <p className="text-muted-foreground">
          Share your interview experiences or job opportunities with the
          community
        </p>
      </div>

      <Tabs
        defaultValue={defaultTab}
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full flex justify-center items-center"
      >
        <TabsList className="flex justify-center items-center mb-8 w-full">
          <TabsTrigger value="interview">Interview Experience</TabsTrigger>
          <TabsTrigger value="opportunity">Job Opportunity</TabsTrigger>
        </TabsList>

        {/* Interview Experience Form */}
        <TabsContent value="interview" className='w-full'>
          <div className="px-4 md:px-8 ">
          <Form {...interviewForm}>
            <form
              onSubmit={interviewForm.handleSubmit(onInterviewSubmit)}
              className="space-y-6"
            >
              <FormField
                control={interviewForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="E.g., My Software Engineer Interview at Google"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={interviewForm.control}
                  name="companyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select company" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60 overflow-y-auto">
                          {companyOptions.map((company) => (
                            <SelectItem key={company.id} value={company.id}>
                              {company.name}
                            </SelectItem>
                          ))}
                        </SelectContent>

                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={interviewForm.control}
                  name="roleId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role/Position</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60 overflow-y-auto">
                          {roleOptions.map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={interviewForm.control}
                name="interviewDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Interview</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full justify-start text-left font-normal ${
                              !field.value ? "text-muted-foreground" : ""
                            }`}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("2000-01-01")
                          }
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={interviewForm.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interview Experience</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Share your detailed interview experience. Include preparation strategy, interview rounds, questions asked, and tips for others."
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={interviewForm.control}
                name="difficultyLevel"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Difficulty Level</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="easy" />
                          </FormControl>
                          <FormLabel className="font-normal">Easy</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="medium" />
                          </FormControl>
                          <FormLabel className="font-normal">Medium</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="hard" />
                          </FormControl>
                          <FormLabel className="font-normal">Hard</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={interviewForm.control}
                name="tags"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Tags</FormLabel>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {tagOptions.map((tag) => (
                        <FormField
                          key={tag.id}
                          control={interviewForm.control}
                          name="tags"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={tag.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(tag.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            tag.id,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== tag.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {tag.name}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full md:w-auto flex justify-center items-center"
              >
                Submit Interview Experience
              </Button>
            </form>
          </Form>
          </div>
        </TabsContent>

        {/* Job Opportunity Form */}
        <TabsContent value="opportunity" className='w-full'>
           <div className="px-4 md:px-8 ">
          <Form {...opportunityForm}>
            <form
              onSubmit={opportunityForm.handleSubmit(onOpportunitySubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={opportunityForm.control}
                  name="companyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select company" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60 overflow-y-auto">
                          {companyOptions.map((company) => (
                            <SelectItem key={company.id} value={company.id}>
                              {company.name}
                            </SelectItem>
                          ))}
                        </SelectContent >
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={opportunityForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role/Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="E.g., Software Engineer, New Grad"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={opportunityForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="full-time" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Full-time
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="internship" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Internship
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={opportunityForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60 overflow-y-auto">
                          {locationOptions.map((location) => (
                            <SelectItem key={location.id} value={location.id}>
                              {location.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={opportunityForm.control}
                  name="stipend"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stipend/Salary (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="E.g., ₹80,000/month or ₹15,00,000/year"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={opportunityForm.control}
                  name="applicationDeadline"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Application Deadline</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={`w-full justify-start text-left font-normal ${
                                !field.value ? "text-muted-foreground" : ""
                              }`}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={opportunityForm.control}
                name="applyLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Application Link</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/apply"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={opportunityForm.control}
                name="eligibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Eligibility</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Eligibility criteria for applicants"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={opportunityForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detailed information about the job opportunity"
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-center items-center">
                <Button type="submit" className="w-full md:w-auto ">
                  Submit Job Opportunity
                </Button>
              </div>
            </form>
          </Form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubmitForm;

