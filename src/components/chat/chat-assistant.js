"use client";

import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
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

      const assistantMessage = {
        content: data.structure || "No structure generated",
        isUser: false,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      const errorMessage = {
        content:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
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
                Chat Assistant{" "}
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
                  <span
                    className={`inline-block rounded-lg px-4 py-2 ${
                      message.isUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {message.content}
                  </span>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
          <CardFooter className="pt-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex w-full items-center space-x-2"
            >
              <Input
                type="text"
                placeholder="Type your message..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="flex-grow"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                aria-label="Send message"
                disabled={isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      ) : (
        <Button
          onClick={toggleChat}
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Open chat assistant"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
