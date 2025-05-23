import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import AppError from "../../errors/AppError";
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

export const SkillController = {
  createSkill,
};
