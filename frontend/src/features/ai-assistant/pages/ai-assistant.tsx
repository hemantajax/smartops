import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Send,
  Sparkles,
  User,
  Upload,
  FileText,
  Database,
  Lightbulb,
  RotateCcw,
  Copy,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const suggestedPrompts = [
  { icon: Database, text: 'Show me all orders from last week', category: 'Query' },
  { icon: Lightbulb, text: 'Summarize revenue trends this month', category: 'Insight' },
  { icon: FileText, text: 'What documents mention pricing?', category: 'RAG' },
  { icon: Sparkles, text: 'Generate a report for Q1 performance', category: 'Report' },
]

const mockResponses = [
  "Based on the data, here's what I found:\n\n**Orders from last week:**\n- Total: 47 orders\n- Revenue: $125,430\n- Average order value: $2,669\n\nWould you like me to break this down by customer or status?",
  "I've analyzed the revenue trends for this month:\n\n📈 **Key Insights:**\n1. Revenue is up 15% compared to last month\n2. Top performing category: Enterprise Solutions\n3. Highest growth day: Tuesday\n\nShall I create a detailed breakdown?",
  "I searched through the documents and found **3 documents** mentioning pricing:\n\n1. **Q1 Pricing Strategy.pdf** - Updated pricing tiers\n2. **Enterprise Contract Template.docx** - Pricing clauses\n3. **Sales Playbook.pdf** - Competitive pricing analysis\n\nWould you like me to summarize any of these?",
]

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: mockResponses[Math.floor(Math.random() * mockResponses.length)],
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handlePromptClick = (prompt: string) => {
    setInput(prompt)
    textareaRef.current?.focus()
  }

  const handleCopy = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleClearChat = () => {
    setMessages([])
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col p-6">
      <Tabs defaultValue="chat" className="flex flex-1 flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
            <p className="text-muted-foreground">
              Ask questions about your data, documents, or get AI-powered insights
            </p>
          </div>
          <TabsList>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="chat" className="flex-1 flex flex-col mt-0">
          <div className="grid flex-1 gap-4 md:grid-cols-4">
            {/* Chat Area */}
            <Card className="md:col-span-3 flex flex-col">
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-base">SmartOps AI</CardTitle>
                      <CardDescription className="text-xs">Powered by GPT-4</CardDescription>
                    </div>
                  </div>
                  {messages.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={handleClearChat}>
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Clear
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0 flex flex-col">
                <ScrollArea className="flex-1 p-4">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                        <Sparkles className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">How can I help you today?</h3>
                      <p className="text-muted-foreground max-w-sm">
                        Ask me anything about your business data, documents, or get AI-powered
                        insights and reports.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={cn(
                            'flex gap-3',
                            message.role === 'user' ? 'justify-end' : 'justify-start'
                          )}
                        >
                          {message.role === 'assistant' && (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                              <Sparkles className="h-4 w-4" />
                            </div>
                          )}
                          <div
                            className={cn(
                              'group relative max-w-[80%] rounded-lg px-4 py-3',
                              message.role === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            )}
                          >
                            <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                            {message.role === 'assistant' && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute -right-10 top-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleCopy(message.content, message.id)}
                              >
                                {copiedId === message.id ? (
                                  <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            )}
                          </div>
                          {message.role === 'user' && (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                              <User className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Sparkles className="h-4 w-4" />
                          </div>
                          <div className="bg-muted rounded-lg px-4 py-3">
                            <div className="flex gap-1">
                              <span className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                              <span className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                              <span className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce"></span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={scrollRef} />
                    </div>
                  )}
                </ScrollArea>

                {/* Input Area */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Textarea
                      ref={textareaRef}
                      placeholder="Ask anything about your data..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="min-h-[60px] resize-none"
                      rows={2}
                    />
                    <Button
                      onClick={handleSend}
                      disabled={!input.trim() || isTyping}
                      className="h-auto"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sidebar */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Suggested Prompts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {suggestedPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handlePromptClick(prompt.text)}
                      className="w-full flex items-start gap-2 p-2 rounded-lg text-left text-sm hover:bg-muted transition-colors"
                    >
                      <prompt.icon className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                      <div>
                        <p className="line-clamp-2">{prompt.text}</p>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {prompt.category}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Capabilities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    <span>Query your business data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Search documents (RAG)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    <span>Generate insights & reports</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="flex-1 mt-0">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Document Management</CardTitle>
              <CardDescription>Upload and manage documents for AI-powered Q&A</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-12 text-center">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Upload Documents</h3>
                <p className="text-muted-foreground mb-4">
                  Drag and drop files here, or click to browse
                </p>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Browse Files
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                  Supported: PDF, DOCX, TXT (Max 10MB)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
