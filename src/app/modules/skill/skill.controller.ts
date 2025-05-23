import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import AppError from "../../errors/AppError";
import { skillFilterableFields } from "./skill.constant";
import { SkillService } from "./skill.service";
import httpStatus from "http-status";

const createSkill = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new AppError(httpStatus.BAD_REQUEST, "Image is required");
  }
  const imageUrl = (req.file as any)?.path;
  const result = await SkillService.createSkill({
    ...req.body,
    logo: imageUrl,
  });
  return sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Skill created successfully",
    data: result,
  });
});

const updateSkill = catchAsync(async (req, res) => {
  const imageUrl = (req.file as any)?.path || undefined;

  // Only add logo if imageUrl exists
  const payload = { ...req.body };
  if (imageUrl) {
    payload.logo = imageUrl;
  }

  const result = await SkillService.updateSkill(payload, req.params.id);
  return sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Skill Updated Successfully",
    data: result,
  });
});

const getAllSkills = catchAsync(async (req, res) => {
  const params = pick(req.query, skillFilterableFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const result = await SkillService.getAllSkills(params, options);
  return sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All skills retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const deleteSkill = catchAsync(async (req, res) => {
  const result = await SkillService.deleteSkill(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Skill deleted successfully!",
    data: result,
  });
});

export const SkillController = {
  createSkill,
  updateSkill,
  getAllSkills,
  deleteSkill,
};
