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

export interface IBlogFilterField {
  searchTerm?: string;
  isPublished?: string;
}