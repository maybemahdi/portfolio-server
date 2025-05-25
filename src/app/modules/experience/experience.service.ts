import { start } from "repl";
import { dateHelpers } from "../../../helpers/dateHelpers";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { ICreateExperience } from "./experience.interface";
import httpStatus from "http-status";

const createExperience = async (payload: ICreateExperience) => {
  const startDate = dateHelpers.convertToISO(payload.startDate);
  let endDate;
  if (payload?.endDate) {
    endDate = dateHelpers.convertToISO(payload.endDate);
  }
  const result = await prisma.experience.create({
    data: {
      ...payload,
      startDate,
      ...(endDate && { endDate }),
    },
  });
  return result;
};

const updateExperience = async (
  id: string,
  payload: Partial<ICreateExperience>,
) => {
  const isExist = await prisma.experience.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  if (!isExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Experience you're trying to update is not found",
    );
  }

  let startDate, endDate;
  if (payload.startDate) {
    startDate = dateHelpers.convertToISO(payload.startDate);
  }
  if (payload.endDate) {
    endDate = dateHelpers.convertToISO(payload.endDate);
  }

  const result = await prisma.experience.update({
    where: {
      id,
    },
    data: {
      ...payload,
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    },
  });
  return result;
};

const deleteExperience = async (id: string) => {
  const isExist = await prisma.experience.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  if (!isExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Experience you're trying to delete is not found",
    );
  }

  const result = await prisma.experience.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });
  return result;
};

const getAllExperiences = async () => {
  const result = await prisma.experience.findMany({
    where: {
      isDeleted: false,
    },
  });
  return result;
};

export const ExperienceService = {
  createExperience,
  updateExperience,
  deleteExperience,
  getAllExperiences,
};
