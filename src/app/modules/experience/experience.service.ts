import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { ICreateExperience } from "./experience.interface";
import httpStatus from "http-status";

const createExperience = async (payload: ICreateExperience) => {
  const result = await prisma.experience.create({
    data: payload,
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
    },
  });
  if (!isExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Experience you're trying to update is not found",
    );
  }

  const result = await prisma.experience.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteExperience = async (id: string) => {
  const isExist = await prisma.experience.findUnique({
    where: {
      id,
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

export const ExperienceService = {
  createExperience,
  updateExperience,
  deleteExperience,
};
