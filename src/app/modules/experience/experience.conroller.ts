import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ExperienceService } from "./experience.service";
import httpStatus from "http-status";

const createExperience = catchAsync(async (req, res) => {
  const result = await ExperienceService.createExperience(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Experience created successfully!",
    data: result,
  });
});

const updateExperience = catchAsync(async (req, res) => {
  const result = await ExperienceService.updateExperience(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Experience updated successfully!",
    data: result,
  });
});

const deleteExperience = catchAsync(async (req, res) => {
  const result = await ExperienceService.deleteExperience(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Experience deleted successfully!",
    data: result,
  });
});

const getAllExperiences = catchAsync(async (req, res) => {
  const result = await ExperienceService.getAllExperiences();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Experience retrieved successfully!",
    data: result,
  });
});

export const ExperienceController = {
  createExperience,
  updateExperience,
  deleteExperience,
  getAllExperiences,
};
