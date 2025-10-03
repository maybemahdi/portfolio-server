import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import AppError from "../../errors/AppError";
import { ProjectService } from "./project.service";
import httpStatus from "http-status";

const createProject = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new AppError(httpStatus.BAD_REQUEST, "Thumbnail is required");
  }
  const imageUrl = (req.file as any)?.path;
  const result = await ProjectService.createProject({
    ...req.body,
    thumbnail: imageUrl,
  });
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Project created successfully!",
    data: result,
  });
});

const updateProject = catchAsync(async (req, res) => {
  const imageUrl = (req.file as any)?.path || undefined;

  // Only add thumbnail if imageUrl exists
  const payload = { ...req.body };
  if (imageUrl) {
    payload.thumbnail = imageUrl;
  }

  const { id } = req.params;
  const result = await ProjectService.updateProject(id, payload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project updated successfully!",
    data: result,
  });
});

const getAllProject = catchAsync(async (req, res) => {
  const result = await ProjectService.getAllProject();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Projects retrieved successfully!",
    data: result,
  });
});

const deleteProject = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ProjectService.deleteProject(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project deleted successfully!",
    data: result,
  });
});

export const ProjectController = {
  createProject,
  updateProject,
  getAllProject,
  deleteProject,
};
