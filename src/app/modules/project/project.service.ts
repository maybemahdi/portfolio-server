import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { ICreateProject } from "./project.interface";
import httpStatus from "http-status";

const createProject = async (payload: ICreateProject) => {
  const result = await prisma.project.create({
    data: payload,
  });
  return result;
};

const updateProject = async (id: string, payload: Partial<ICreateProject>) => {
  const isExist = await prisma.project.findUnique({
    where: {
      id,
    },
  });
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Project you're trying to update is not found");
  }
  const result = await prisma.project.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const getAllProject = async () => {
  const result = await prisma.project.findMany({
    where: {
      isDeleted: false,
    },
  });
  return result;
};

const deleteProject = async (id: string) => {
  const isExist = await prisma.project.findUnique({
    where: {
      id,
    },
  });
  if (!isExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Project you're trying to delete is not found",
    );
  }
  const result = await prisma.project.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });
  return result;
};

export const ProjectService = {
  createProject,
  updateProject,
  getAllProject,
  deleteProject,
};
