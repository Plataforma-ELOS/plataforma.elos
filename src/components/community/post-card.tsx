
"use client";

import { useState, useContext } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThumbsUp, MessageCircle, Share2, MoreHorizontal, Bookmark, Edit, Trash2 } from "lucide-react";
import FeatureInProgress from "../feature-in-progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthContext } from "../providers";
import type { User } from "../providers";
import CommentSection from "./comment-section";
import type { Comment } from "./comment-section";


export type Author = {
  name: string;
  avatarUrl: string;
  hint: string;
  email: string;
};

export type Post = {
  id: string;
  author: Author;
  time: string;
  content: string;
  likes: number;
  commentCount: number;
  isSaved: boolean;
  /** Se o usuário logado já curtiu este post. Vem do banco (tabela post_likes). */
  likedByMe?: boolean;
  comments: Comment[];
};

type PostCardProps = {
  post: Post;
  onToggleSave: (postId: string) => void;
  onDelete: (postId: string) => void;
  currentUser: User | null;
  /** Curtir/descurtir de verdade (Server Action). Se omitido, cai no comportamento antigo (só local). */
  onToggleLike?: (postId: string) => void;
  /** Comentar de verdade (Server Action). Se omitido, cai no comportamento antigo (só local). */
  onAddComment?: (postId: string, content: string) => void;
};

export default function PostCard({ post, onToggleSave, onDelete, currentUser, onToggleLike, onAddComment }: PostCardProps) {
  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(post.likedByMe ?? false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>(post.comments || []);
  const [commentCount, setCommentCount] = useState(post.commentCount);

  const isOwner = currentUser?.email === post.author.email;

  const handleLike = () => {
    // Atualização otimista na tela...
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
    // ...e persiste de verdade, se a action foi passada pela página pai.
    onToggleLike?.(post.id);
  };
  
  const handleCommentSubmit = (commentContent: string) => {
    if (!currentUser) return; // Não permite comentar se não estiver logado

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      author: {
        name: currentUser.name,
        avatarUrl: 'https://placehold.co/40x40.png',
        hint: 'user avatar'
      },
      time: 'Agora',
      content: commentContent,
    };
    setComments([...comments, newComment]);
    setCommentCount(commentCount + 1);
    onAddComment?.(post.id, commentContent);
  };
  
  return (
    <Card className="rounded-2xl shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-2 p-5 border animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
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
            
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onToggleSave(post.id)}>
                <Bookmark className={`h-5 w-5 text-muted-foreground ${post.isSaved ? 'fill-primary text-primary' : ''}`} />
              </Button>
              {isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <FeatureInProgress>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Editar Post</span>
                      </DropdownMenuItem>
                    </FeatureInProgress>
                    <DropdownMenuItem onClick={() => onDelete(post.id)} className="text-destructive focus:text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Excluir Post</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
          <p className="mt-2 text-foreground/90 whitespace-pre-wrap">{post.content}</p>
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center text-muted-foreground">
        <div className="flex gap-1 text-sm items-center">
            <ThumbsUp className="h-4 w-4" />
            <span>{likes}</span>
        </div>
         <button onClick={() => setShowComments(!showComments)} className="flex gap-1 text-sm items-center hover:underline">
            <span>{commentCount} comentários</span>
        </button>
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
        
        <FeatureInProgress>
          <Button variant="ghost" className="w-full">
            <Share2 className="h-5 w-5 mr-2" />
            Compartilhar
          </Button>
        </FeatureInProgress>
      </div>
      
      {showComments && (
        <div className="mt-4 border-t pt-4">
          <CommentSection comments={comments} onCommentSubmit={handleCommentSubmit} />
        </div>
      )}
    </Card>
  );
}
