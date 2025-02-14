"use client";

import { useState } from "react";
import { MessageCircle, X, Send, Copy, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Badge } from "../ui/badge";

export default function ChatAssistant() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleChat = () => setIsExpanded((prev) => !prev);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const extractStructureFromSrc = (content) => {
    const srcMatch = content.match(/src\/[\s\S]*/);
    return srcMatch ? srcMatch[0] : '';
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    const newMessage = { content: userInput, isUser: true };
    setMessages((prev) => [...prev, newMessage]);
    setUserInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate-file-structure", {
        method: "POST",
        body: JSON.stringify({ request: userInput }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessage = {
        content: data.structure,
        packageJson: data.packageJson,
        copyCommand: data.copyCommand,
        isUser: false,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      const errorMessage = {
        content: error instanceof Error ? error.message : "An unexpected error occurred",
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast.error(errorMessage.content);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isExpanded ? (
        <Card className="w-80 h-[32rem] flex flex-col shadow-lg transition-all duration-300 ease-in-out">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-2">
              <CardTitle className="text-xl font-bold">
                Filegen AI Chat{" "}
              </CardTitle>
              <Badge className="rounded-full">Beta</Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleChat}
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden p-0">
            <ScrollArea className="h-full p-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 ${
                    message.isUser ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block rounded-lg px-4 py-2 ${
                      message.isUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {!message.isUser && message.content && (
                      <div className="relative">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold">File Structure</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(extractStructureFromSrc(message.content))}
                            title="Copy structure from src/ onwards"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <pre className="whitespace-pre-wrap font-mono text-sm">
                          {message.content}
                        </pre>
                      </div>
                    )}
                    {!message.isUser && message.packageJson && (
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold">package.json</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(message.packageJson)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <pre className="whitespace-pre-wrap font-mono text-xs bg-black/10 p-2 rounded">
                          {message.packageJson}
                        </pre>
                      </div>
                    )}
                    {!message.isUser && message.copyCommand && (
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold">Setup Command</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(message.copyCommand)}
                          >
                            <Terminal className="h-4 w-4" />
                          </Button>
                        </div>
                        <pre className="whitespace-pre-wrap font-mono text-xs bg-black/10 p-2 rounded">
                          {message.copyCommand}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-4 pt-2">
            <div className="flex w-full items-center space-x-2">
              <Input
                placeholder="Type @filegen/ProjectType..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={isLoading}
              />
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ) : (
        <Button
          className="rounded-full h-12 w-12"
          onClick={toggleChat}
          aria-label="Open chat"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
