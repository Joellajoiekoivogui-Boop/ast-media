export type ArticleStatus = "draft" | "scheduled" | "published";
export type CommentStatus = "pending" | "approved" | "hidden" | "reported";
export type UserRole = "admin" | "editor" | "journalist";

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: Record<string, unknown>;
  cover_image_url: string | null;
  category_id: string;
  author_id: string;
  status: ArticleStatus;
  is_featured: boolean;
  view_count: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ArticleWithRelations extends Article {
  category: Category;
  author: Profile;
  tags: Tag[];
}

export interface Comment {
  id: string;
  article_id: string;
  parent_id: string | null;
  author_name: string;
  // Non exposé au public (lecture réservée à la rédaction) — voir migration 0004.
  author_email?: string | null;
  body: string;
  status: CommentStatus;
  report_count: number;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> };
      categories: { Row: Category; Insert: Partial<Category>; Update: Partial<Category> };
      tags: { Row: Tag; Insert: Partial<Tag>; Update: Partial<Tag> };
      articles: { Row: Article; Insert: Partial<Article>; Update: Partial<Article> };
      article_tags: {
        Row: { article_id: string; tag_id: string };
        Insert: { article_id: string; tag_id: string };
        Update: { article_id: string; tag_id: string };
      };
      comments: { Row: Comment; Insert: Partial<Comment>; Update: Partial<Comment> };
    };
  };
}
