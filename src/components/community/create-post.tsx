"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UserCircle, Image as ImageIcon } from "lucide-react";
import FeatureInProgress from "../feature-in-progress";

export default function CreatePost() {
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
          />
          <div className="flex justify-between items-center">
            <FeatureInProgress>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <ImageIcon className="h-5 w-5" />
              </Button>
            </FeatureInProgress>
            <FeatureInProgress>
              <Button>Publicar</Button>
            </FeatureInProgress>
          </div>
        </div>
      </div>
    </div>
  );
}
