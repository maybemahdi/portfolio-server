import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import AppError from "../../errors/AppError";
import { BlogService } from "./blog.service";
import httpStatus from "http-status";

const createBlog = catchAsync(async (req, res, next) => {
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

const updateBlog = catchAsync(async (req, res, next) => {
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

export const BlogController = {
  createBlog,
  updateBlog,
};
