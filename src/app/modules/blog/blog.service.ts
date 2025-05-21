import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { ICreateBlog, IUpdateBlog } from "./blog.interface";
import httpStatus from "http-status";

const createBlog = async (payload: ICreateBlog, userId: string) => {
  const result = await prisma.blog.create({
    data: {
      title: payload.title,
      content: payload.content,
      thumbnail: payload.thumbnail,
      isPublished: payload.isPublished,
      authorId: userId,
    },
  });
  return result;
};

const updateBlog = async (
  payload: IUpdateBlog,
  blogId: string,
  userId: string,
) => {
  // Check if the blog exists
  const blog = await prisma.blog.findUnique({
    where: { id: blogId },
  });

  if (!blog) {
    throw new AppError(httpStatus.NOT_FOUND, "Blog not found");
  }

  const result = await prisma.blog.update({
    where: { id: blogId },
    data: {
      ...payload,
    },
  });
  return result;
};



export const BlogService = {
  createBlog,
  updateBlog,
};
