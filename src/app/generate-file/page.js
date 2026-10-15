import Workspace from "@/components/workspace";
import ChatAssistantLazy from "@/components/chat/chat-assistant-lazy";
export default function GenerateFilePage() {
  return (
    <div className="fg-container inner-page">
      <div className="page-heading">
        <span className="eyebrow">A BLANK CANVAS FOR YOUR NEXT IDEA</span>
        <h1>Your project. Taking shape.</h1>
        <p>
          Write an outline, explore your files, and download your starting
          point.
        </p>
      </div>
      <Workspace />
      <div className="workspace-under">
        <span>Tip: press Tab in the editor to nest an item.</span>
        <span>Drafts are saved on this device.</span>
      </div>
      <ChatAssistantLazy />
    </div>
  );
}
