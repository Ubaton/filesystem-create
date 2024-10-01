"use client";

import React from "react";
import { Button } from "../ui/button";
import { Copy, Folder, FileCode } from "lucide-react";
import { cn } from "@/lib/utils";

const FilesType = () => {
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
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const renderStructure = (structure) => {
    return structure.split("\n").map((line, index) => {
      const indent = line.search(/\S/);
      const isFolder = line.trim().endsWith("/");
      const isFile = !isFolder;
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-8">
      {Object.entries(structures).map(([key, structure]) => (
        <div key={key} className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold capitalize">{key} Structure</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(structure)}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
          </div>
          <div className="bg-secondary p-4 rounded-lg">
            {renderStructure(structure)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FilesType;
