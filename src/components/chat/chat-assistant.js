"use client";

import { Chat, X } from "@mynaui/icons-react";
import React, { useState } from "react";

const ChatAssistant = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleChat = () => {
    setIsExpanded((prevState) => !prevState);
  };

  const toggleClose = () => {
    setIsExpanded(false);
  };

  return (
    <div>
      {isExpanded ? (
        <div className="bg-white dark:bg-zinc-900 border-2 w-72 h-96 rounded-xl">
          <div className="flex justify-between items-center p-2">
            <h1 className="text-xl font-medium">Chat Assistant</h1>
            <span className="" onClick={toggleClose}>
              <X size={24} className="cursor-pointer" />
            </span>
          </div>
          <div className="flex justify-center items-center px-4 h-64 bg-zinc-950">
            Soon
          </div>
        </div>
      ) : (
        <div
          onClick={toggleChat}
          className="bg-white dark:bg-zinc-900 border-2 w-12 h-12 rounded-t-full rounded-bl-full flex items-center justify-center cursor-pointer"
        >
          <Chat size={24} />
        </div>
      )}
    </div>
  );
};

export default ChatAssistant;
