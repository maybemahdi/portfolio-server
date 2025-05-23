import { Prisma } from "@prisma/client";
import httpStatus from "http-status";
import { paginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { IPaginationOptions } from "../../interfaces/pagination";
import { blogSearchAbleFields } from "./blog.constant";
import {
  IBlogFilterField,
  ICreateBlog,
  IUpdateBlog
} from "./blog.interface";

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
    where: { id: blogId, isDeleted: false },
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

const getAllBlogs = async (
  params: IBlogFilterField,
  options: IPaginationOptions,
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, isPublished, ...filterData } = params;

  const andConditions: Prisma.BlogWhereInput[] = [];

  if (params.searchTerm) {
    andConditions.push({
      OR: blogSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (params.isPublished === "yes") {
    andConditions.push({
      isPublished: true,
    });
  }
  if (params.isPublished === "no") {
    andConditions.push({
      isPublished: false,
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  andConditions.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.BlogWhereInput = { AND: andConditions };

  const total = await prisma.blog.count({
    where: whereConditions,
  });

  const blogs = await prisma.blog.findMany({
    where: whereConditions,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: blogs,
  };
};

const getSingleBlog = async (blogId: string) => {
  const blog = await prisma.blog.findUnique({
    where: { id: blogId, isDeleted: false },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!blog) {
    throw new AppError(httpStatus.NOT_FOUND, "Blog not found");
  }

  return blog;
};

const deleteBlog = async (blogId: string) => {
  const blog = await prisma.blog.findUnique({
    where: { id: blogId, isDeleted: false },
  });

  if (!blog) {
    throw new AppError(httpStatus.NOT_FOUND, "Blog not found");
  }

  const result = await prisma.blog.update({
    where: { id: blogId },
    data: {
      isDeleted: true,
    },
  });
  return result;
};


export const BlogService = {
  createBlog,
  updateBlog,
  getAllBlogs,
  getSingleBlog,
  deleteBlog,
};
