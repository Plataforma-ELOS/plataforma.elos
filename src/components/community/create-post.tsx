
"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UserCircle, Image as ImageIcon } from "lucide-react";
import FeatureInProgress from "../feature-in-progress";

interface CreatePostProps {
  onCreatePost: (content: string) => void;
}

export default function CreatePost({ onCreatePost }: CreatePostProps) {
  const [postContent, setPostContent] = useState('');

  const handlePublish = () => {
    onCreatePost(postContent);
    setPostContent('');
  };

  return (
    <div className="bg-card p-4 rounded-2xl shadow-sm border">
      <div className="flex gap-4">
        <Avatar className="hidden md:inline-flex h-12 w-12 cursor-pointer">
          <AvatarImage src="https://placehold.co/48x48.png" alt="Avatar" data-ai-hint="user avatar" />
          <AvatarFallback>
            <UserCircle className="h-12 w-12 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <div className="w-full">
          <Textarea
            placeholder="No que você está pensando?"
            className="w-full bg-muted border-0 rounded-lg focus-visible:ring-1 focus-visible:ring-primary mb-2"
            rows={3}
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />
          <div className="flex justify-between items-center">
            <FeatureInProgress>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <ImageIcon className="h-5 w-5" />
              </Button>
            </FeatureInProgress>
            <Button onClick={handlePublish} disabled={!postContent.trim()}>
              Publicar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
