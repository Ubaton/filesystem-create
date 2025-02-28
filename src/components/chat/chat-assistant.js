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
import Logo from "../../public/assets/GrayFIleGen.png";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";

const MessageContent = ({ message, onCopy }) => {
  if (message.isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="flex items-end gap-2">
          <div className="max-w-[80%] bg-primary text-primary-foreground rounded-2xl rounded-br-sm px-4 py-3 shadow-sm">
            {message.content}
          </div>
          <Avatar className="flex justify-center items-center h-8 w-8 bg-primary/10">
            <div className="text-xs font-medium">You</div>
          </Avatar>
        </div>
      </div>
    );
  }

  return (
    <div className="flex mb-4">
      <div className="flex items-start gap-2">
        <Avatar className="flex justify-center items-center h-8 w-8 bg-muted">
          <Image src={Logo} alt="FileGen Logo" width={25} height={25} priority={true} quality={100} />
        </Avatar>
        <div className="max-w-[85%] bg-muted rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm space-y-4">
          {message.fileStructure && (
            <div className="relative">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold">File Structure</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 rounded-full hover:bg-muted-foreground/10"
                  onClick={() => onCopy(message.fileStructure, "structure")}
                  title="Copy file structure"
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
              <pre className="whitespace-pre-wrap font-mono text-sm overflow-x-auto bg-black/5 p-2 rounded-lg">
                {message.fileStructure}
              </pre>
            </div>
          )}
          {message.explanation && (
            <div className="relative mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold">Explanation</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 rounded-full hover:bg-muted-foreground/10"
                  onClick={() => onCopy(message.explanation, "explanation")}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="text-sm prose prose-sm max-w-none">
                {message.explanation}
              </div>
            </div>
          )}
          {message.packageJson && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold">package.json</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 rounded-full hover:bg-muted-foreground/10"
                  onClick={() => onCopy(message.packageJson, "package")}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
              <pre className="whitespace-pre-wrap font-mono text-xs bg-black/10 p-2 rounded-lg">
                {message.packageJson}
              </pre>
            </div>
          )}
          {message.copyCommand && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold">Setup Command</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 rounded-full hover:bg-muted-foreground/10"
                  onClick={() => onCopy(message.copyCommand, "command")}
                >
                  <Terminal className="h-3.5 w-3.5" />
                </Button>
              </div>
              <pre className="whitespace-pre-wrap font-mono text-xs bg-black/10 p-2 rounded-lg">
                {message.copyCommand}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ChatAssistant() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleChat = () => setIsExpanded((prev) => !prev);

  const handleCopy = async (text, type) => {
    try {
      let contentToCopy = text;
      if (type === "structure") {
        // Extract only the src/ directory structure
        const srcMatch = text.match(/src\/[\s\S]*/);
        contentToCopy = srcMatch ? srcMatch[0].replace(/\*\*.*?\*\*/g, "").trim() : text;
      }
      
      await navigator.clipboard.writeText(contentToCopy);
      toast.success(`Copied ${type} to clipboard!`, {
        position: "bottom-right",
      });
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const parseResponse = (response) => {
    // Split structure and explanation
    const parts = response.split(/\*\*Explanation of Choices:\*\*/);
    return {
      fileStructure: parts[0].trim(),
      explanation: parts[1] ? parts[1].trim() : null
    };
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

      const { fileStructure, explanation } = parseResponse(data.structure);
      
      const assistantMessage = {
        fileStructure,
        explanation,
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
      toast.error(errorMessage.content, {
        position: "bottom-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isExpanded ? (
        <Card className="w-full sm:w-96 h-[32rem] max-w-[calc(100vw-2rem)] flex flex-col shadow-xl rounded-3xl border-0 transition-all duration-300 ease-in-out overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
            <div className="flex items-center space-x-2">
            <Image src={Logo} alt="FileGen Logo" width={25} height={25} priority={true} quality={100} />
              <CardTitle className="text-lg font-medium">
                Filegen AI
              </CardTitle>
              <Badge variant="outline" className="rounded-full text-xs py-0 px-2 bg-primary/10 text-primary">Beta</Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleChat}
              aria-label="Close chat"
              className="hover:bg-muted rounded-full h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden p-0 pt-2">
            <ScrollArea className="h-full px-4">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center flex-col text-center p-6">
                  <div className="rounded-full bg-primary/10 p-2 mb-4">
                  <Image src={Logo} alt="FileGen Logo" width={40} height={40} priority={true} quality={100} />
                  </div>
                  <p className="text-muted-foreground">
                    Ask for a file structure using @filegen/ProjectType
                  </p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div key={index}>
                    <MessageContent message={message} onCopy={handleCopy} />
                  </div>
                ))
              )}
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-4 border-t bg-muted/20">
            <div className="flex w-full items-center space-x-2">
              <Input
                placeholder="Type @filegen/ProjectType..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={isLoading}
                className="flex-grow rounded-full border border-muted-foreground/20 bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
              />
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={isLoading}
                className="rounded-full h-10 w-10 bg-primary hover:bg-primary/90 shadow-sm flex-shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ) : (
        <Button
          className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all bg-primary hover:bg-primary/90"
          onClick={toggleChat}
          aria-label="Open chat"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}