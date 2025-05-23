export interface ICreateBlog {
  title: string;
  content: string;
  thumbnail: string;
  isPublished: boolean;
}
export interface IUpdateBlog {
  title?: string;
  content?: string;
  thumbnail?: string;
  isPublished?: boolean;
}

export interface IProjectFilterField {
  searchTerm?: string;
  isPublished?: string;
}