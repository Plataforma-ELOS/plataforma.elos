
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThumbsUp, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import FeatureInProgress from "../feature-in-progress";

export type Post = {
  author: {
    name: string;
    avatarUrl: string;
    hint: string;
  };
  time: string;
  content: string;
  likes: number;
  comments: number;
};

type PostCardProps = {
  post: Post;
};

export default function PostCard({ post }: PostCardProps) {
  return (
    <Card className="rounded-2xl shadow-sm p-5 border">
      <div className="flex items-start gap-4">
        <Avatar className="h-11 w-11">
          <AvatarImage src={post.author.avatarUrl} alt={post.author.name} data-ai-hint={post.author.hint} />
          <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="font-semibold">{post.author.name}</p>
              <span className="text-xs text-muted-foreground">· {post.time}</span>
            </div>
            <FeatureInProgress>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
              </Button>
            </FeatureInProgress>
          </div>
          <p className="mt-2 text-foreground/90 whitespace-pre-wrap">{post.content}</p>
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center text-muted-foreground">
        <div className="flex gap-1 text-sm items-center">
            <ThumbsUp className="h-4 w-4" />
            <span>{post.likes}</span>
        </div>
         <div className="flex gap-1 text-sm items-center">
            <span>{post.comments} comentários</span>
        </div>
      </div>
      <div className="mt-2 border-t pt-2 flex justify-around">
        <FeatureInProgress>
          <Button variant="ghost" className="w-full">
            <ThumbsUp className="h-5 w-5 mr-2" />
            Curtir
          </Button>
        </FeatureInProgress>
        <FeatureInProgress>
          <Button variant="ghost" className="w-full">
            <MessageCircle className="h-5 w-5 mr-2" />
            Comentar
          </Button>
        </FeatureInProgress>
        <FeatureInProgress>
          <Button variant="ghost" className="w-full">
            <Share2 className="h-5 w-5 mr-2" />
            Compartilhar
          </Button>
        </FeatureInProgress>
      </div>
    </Card>
  );
}
