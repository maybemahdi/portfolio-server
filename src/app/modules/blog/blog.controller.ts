import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import AppError from "../../errors/AppError";
import { blogFilterableFields } from "./blog.constant";
import { BlogService } from "./blog.service";
import httpStatus from "http-status";

const createBlog = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new AppError(httpStatus.BAD_REQUEST, "Image is required");
  }
  const imageUrl = (req.file as any)?.path;

  const result = await BlogService.createBlog(
    { ...req.body, thumbnail: imageUrl },
    req.user.id,
  );
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Blog created successfully!",
    data: result,
  });
});

const updateBlog = catchAsync(async (req, res) => {
  const imageUrl = (req.file as any)?.path || undefined;

  // Only add thumbnail if imageUrl exists
  const payload = { ...req.body };
  if (imageUrl) {
    payload.thumbnail = imageUrl;
  }

  const result = await BlogService.updateBlog(
    payload,
    req.params.id,
    req.user.id,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog updated successfully!",
    data: result,
  });
});

const getAllBlogs = catchAsync(async (req, res) => {
  const params = pick(req.query, blogFilterableFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  const result = await BlogService.getAllBlogs(params, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blogs retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleBlog = catchAsync(async (req, res) => {
  const result = await BlogService.getSingleBlog(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog retrieved successfully!",
    data: result,
  });
})

const deleteBlog = catchAsync(async (req, res) => {
  const result = await BlogService.deleteBlog(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog deleted successfully!",
    data: result,
  });
});

export const BlogController = {
  createBlog,
  updateBlog,
  getAllBlogs,
  getSingleBlog,
  deleteBlog,
};
