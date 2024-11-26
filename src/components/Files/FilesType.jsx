"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Check, Copy, Folder, FileCode, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const structures = {
  ecommerce: `src/
  app/
    page
    layout
    products/
      page
      [category]/
        page
        [product]/
          page
    cart/
      page
    checkout/
      page
    api/
      products/
        route
      cart/
        route
      orders/
        route
  components/
    Header/
      Header
      Navigation
      SearchBar
      CartIcon
    Footer/
      Footer
      Newsletter
      PolicyLinks
    ProductCard
    ProductGallery
    AddToCartButton
  lib/
    formatCurrency
    calculateDiscount
  styles/`,

  blogPost: `src/
  app/
    page
    layout
    blog/
      page
      [slug]/
        page
    api/
      posts/
        route
  components/
    Header
    Footer
    BlogPost
    CommentSection
  lib/
    formatDate
    markdownToHtml
  styles/`,

  techWebsite: `src/
  app/
    page
    layout
    products/
      page
    solutions/
      page
    about/
      page
    contact/
      page
  components/
    Header
    Footer
    ProductShowcase
    TechSpecs
    ContactForm
  lib/
    api
  styles/`,

  portfolio: `src/
  app/
    page
    layout
    projects/
      page
      [project]/
        page
    about/
      page
    contact/
      page
  components/
    Header
    Footer
    ProjectCard
    SkillsSection
    ContactForm
  lib/
    projectData
  styles/`,

  saasApplication: `src/
  app/
    page
    layout
    dashboard/
      page
      settings/
        page
      billing/
        page
    api/
      auth/
        route
      subscriptions/
        route
      usage/
        route
  components/
    Dashboard/
      Sidebar
      TopBar
      Stats
      Charts
    Settings/
      Profile
      Preferences
    Billing/
      Plans
      Invoice
  lib/
    analytics
    subscription
  styles/`,

  communityPlatform: `src/
  app/
    page
    layout
    forums/
      page
      [category]/
        page
      [thread]/
        page
    members/
      page
      [id]/
        page
    events/
      page
    api/
      posts/
        route
      members/
        route
  components/
    Forums/
      ThreadList
      PostEditor
      CategoryNav
    Members/
      Profile
      ActivityFeed
    Events/
      Calendar
      EventCard
  lib/
    formatTime
    notifications
  styles/`,

  learningPlatform: `src/
  app/
    page
    layout
    courses/
      page
      [courseId]/
        page
        lessons/
          [lessonId]/
            page
    progress/
      page
    certificates/
      page
    api/
      courses/
        route
      progress/
        route
  components/
    Course/
      Curriculum
      VideoPlayer
      Quiz
    Progress/
      TrackingCard
      Achievements
    Certificate/
      Template
  lib/
    courseProgress
    certification
  styles/`,

  newsPortal: `src/
  app/
    page
    layout
    news/
      page
      [category]/
        page
      [article]/
        page
    topics/
      page
    archive/
      page
    api/
      articles/
        route
      topics/
        route
  components/
    Articles/
      Featured
      List
      Related
    Topics/
      Navigation
      Trending
    Search/
      Filter
      Results
  lib/
    newsApi
    categoryFilters
  styles/`,
};

export default function Component() {
  const [copyingStructure, setCopyingStructure] = useState(null);

  const handleCopy = (key, structure) => {
    setCopyingStructure(key);

    setTimeout(() => {
      navigator.clipboard
        .writeText(structure)
        .then(() => {
          toast.custom(
            (t) => (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.3 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="bg-zinc-100 border px-4 text-black py-2 rounded-md shadow-sm flex items-center space-x-2"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
                >
                  <Check className="w-5 h-5" />
                </motion.div>
                <span>Copied {key} structure!</span>
              </motion.div>
            ),
            { duration: 2000, position: "top-center" } // Changed position to top-center
          );
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
          toast.error(`Failed to copy ${key} structure`);
        })
        .finally(() => {
          setCopyingStructure(null);
        });
    }, 1000); // 1 second delay
  };

  const renderStructure = (structure) => {
    return structure.split("\n").map((line, index) => {
      const indent = line.search(/\S/);
      const isFolder = line.trim().endsWith("/");
      const Icon = isFolder ? Folder : FileCode;
      return (
        <div
          key={index}
          className={cn("flex items-center", indent > 0 && `ml-${indent * 4}`)}
        >
          <Icon
            className={`w-4 h-4 mr-2 ${
              isFolder ? "text-yellow-500" : "text-blue-500"
            }`}
          />
          <span>{line.trim()}</span>
        </div>
      );
    });
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {Object.entries(structures).map(([key, structure]) => (
          <div key={key} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold capitalize">{key} Structure</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(key, structure)}
                disabled={copyingStructure !== null}
                aria-label={
                  copyingStructure === key
                    ? `Copying ${key} structure`
                    : `Copy ${key} structure`
                }
              >
                {copyingStructure === key ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Copy className="w-4 h-4 mr-2" />
                )}
                {copyingStructure === key ? "Copying..." : "Copy"}
              </Button>
            </div>
            <div className="bg-secondary p-4 rounded-lg overflow-auto">
              {renderStructure(structure)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
