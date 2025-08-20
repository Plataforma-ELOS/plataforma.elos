
"use client";

import { useState, useContext } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AuthContext } from '../providers';


export type Author = {
  name: string;
  avatarUrl: string;
  hint: string;
};

export type Comment = {
  id: string;
  author: Author;
  time: string;
  content: string;
};

interface CommentSectionProps {
  comments: Comment[];
  onCommentSubmit: (commentContent: string) => void;
}

const CommentCard = ({ comment }: { comment: Comment }) => (
  <div className="flex gap-3 items-start">
    <Avatar className="h-9 w-9">
      <AvatarImage src={comment.author.avatarUrl} alt={comment.author.name} data-ai-hint={comment.author.hint} />
      <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
    </Avatar>
    <div className="bg-muted rounded-xl p-3 flex-1">
      <div className="flex items-center gap-2">
        <p className="font-semibold text-sm">{comment.author.name}</p>
        <span className="text-xs text-muted-foreground">· {comment.time}</span>
      </div>
      <p className="text-sm text-foreground/90 mt-1">{comment.content}</p>
    </div>
  </div>
);

export default function CommentSection({ comments, onCommentSubmit }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const { user } = useContext(AuthContext);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && user) {
      onCommentSubmit(newComment);
      setNewComment('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Formulário para adicionar novo comentário */}
      <form onSubmit={handleSubmit} className="flex gap-3 items-start">
        <Avatar className="h-9 w-9">
          <AvatarImage src="https://placehold.co/48x48.png" alt={user?.name} data-ai-hint="user avatar" />
          <AvatarFallback>{user?.name.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Escreva um comentário..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[40px] rounded-lg"
              rows={1}
              disabled={!user}
            />
            {newComment && (
                <div className="flex justify-end">
                    <Button type="submit" size="sm" disabled={!newComment.trim() || !user}>Publicar</Button>
                </div>
            )}
        </div>
      </form>

      {/* Lista de comentários existentes */}
      <div className="space-y-4">
        {comments.map(comment => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
