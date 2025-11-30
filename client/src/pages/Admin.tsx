import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Users, Clock, MapPin, Briefcase, Code } from "lucide-react";

interface InterviewSession {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  experience: string | null;
  position: string | null;
  location: string | null;
  techStack: string[];
  responses: Array<{question: string, answer: string}>;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function Admin() {
  const { data: sessions, isLoading } = useQuery<InterviewSession[]>({
    queryKey: ["interview-sessions"],
    queryFn: async () => {
      const res = await fetch("/api/interview-sessions");
      if (!res.ok) throw new Error("Failed to fetch sessions");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading interview sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-header font-bold text-foreground mb-2" data-testid="text-admin-title">
            TalentScout Admin Dashboard
          </h1>
          <p className="text-muted-foreground">View and manage candidate interview sessions</p>
        </div>

        <div className="grid gap-4 mb-8 md:grid-cols-3">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Candidates</p>
                <p className="text-2xl font-bold" data-testid="text-total-candidates">{sessions?.length || 0}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold" data-testid="text-completed-count">
                  {sessions?.filter(s => s.status === "completed").length || 0}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold" data-testid="text-inprogress-count">
                  {sessions?.filter(s => s.status === "in_progress").length || 0}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          {sessions && sessions.length > 0 ? (
            sessions.map((session) => (
              <Card key={session.id} className="overflow-hidden" data-testid={`card-session-${session.id}`}>
                <Accordion type="single" collapsible>
                  <AccordionItem value={`session-${session.id}`} className="border-none">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between w-full pr-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Users className="h-6 w-6 text-primary" />
                          </div>
                          <div className="text-left">
                            <h3 className="font-semibold text-lg" data-testid={`text-candidate-name-${session.id}`}>{session.name}</h3>
                            <p className="text-sm text-muted-foreground" data-testid={`text-candidate-email-${session.id}`}>{session.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={session.status === "completed" ? "default" : "secondary"} data-testid={`badge-status-${session.id}`}>
                            {session.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Session #{session.id}
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Position:</span>
                            <span className="font-medium" data-testid={`text-position-${session.id}`}>{session.position || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Experience:</span>
                            <span className="font-medium" data-testid={`text-experience-${session.id}`}>{session.experience || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Location:</span>
                            <span className="font-medium" data-testid={`text-location-${session.id}`}>{session.location || "N/A"}</span>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Code className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Tech Stack:</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {session.techStack.map((tech, idx) => (
                              <Badge key={idx} variant="outline" data-testid={`badge-tech-${session.id}-${idx}`}>
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {session.responses && session.responses.length > 0 && (
                        <div className="border-t pt-4">
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            Technical Responses
                            <Badge variant="secondary">{session.responses.length}</Badge>
                          </h4>
                          <div className="space-y-4">
                            {session.responses.map((response, idx) => (
                              <div key={idx} className="bg-muted/50 rounded-lg p-4" data-testid={`response-${session.id}-${idx}`}>
                                <p className="font-medium text-sm mb-2 text-primary">Q: {response.question}</p>
                                <p className="text-sm text-muted-foreground">A: {response.answer}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Card>
            ))
          ) : (
            <Card className="p-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No interview sessions yet</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
