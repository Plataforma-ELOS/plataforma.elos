
"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThumbsUp, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import FeatureInProgress from "../feature-in-progress";
import CommentSection from "./comment-section";

export type Author = {
  name: string;
  avatarUrl: string;
  hint: string;
};

export type Comment = {
  id: string;
  author: Author;
  content: string;
  time: string;
};

export type Post = {
  id: string;
  author: Author;
  time: string;
  content: string;
  likes: number;
  comments: Comment[];
};

type PostCardProps = {
  post: Post;
  onComment: (postId: string, commentContent: string) => void;
};

export default function PostCard({ post, onComment }: PostCardProps) {
  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };
  
  const handleCommentSubmit = (commentContent: string) => {
    onComment(post.id, commentContent);
  };

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
            
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
              </Button>
            
          </div>
          <p className="mt-2 text-foreground/90 whitespace-pre-wrap">{post.content}</p>
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center text-muted-foreground">
        <div className="flex gap-1 text-sm items-center">
            <ThumbsUp className="h-4 w-4" />
            <span>{likes}</span>
        </div>
         <div className="flex gap-1 text-sm items-center cursor-pointer hover:underline" onClick={() => setShowComments(!showComments)}>
            <span>{post.comments.length} comentários</span>
        </div>
      </div>
      <div className="mt-2 border-t pt-2 flex justify-around">
        <Button variant="ghost" className="w-full" onClick={handleLike}>
          <ThumbsUp className={`h-5 w-5 mr-2 ${isLiked ? 'text-primary fill-current' : ''}`} />
          Curtir
        </Button>
        <Button variant="ghost" className="w-full" onClick={() => setShowComments(!showComments)}>
          <MessageCircle className="h-5 w-5 mr-2" />
          Comentar
        </Button>
        
          <Button variant="ghost" className="w-full">
            <Share2 className="h-5 w-5 mr-2" />
            Compartilhar
          </Button>
        
      </div>
      {showComments && (
        <div className="mt-4 border-t pt-4">
           <CommentSection comments={post.comments} onCommentSubmit={handleCommentSubmit} />
        </div>
      )}
    </Card>
  );
}



    