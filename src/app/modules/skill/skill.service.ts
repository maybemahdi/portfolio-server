import { Prisma } from "@prisma/client";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { IPaginationOptions } from "../../interfaces/pagination";
import { ICreateSkill, ISkillFilterField } from "./skill.interface";
import httpStatus from "http-status";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { skillSearchableFields } from "./skill.constant";

const createSkill = async (payload: ICreateSkill) => {
  const isExist = await prisma.skill.findFirst({
    where: {
      name: {
        equals: payload.name,
        mode: "insensitive",
      },
      isDeleted: false,
    },
  });

  if (isExist) {
    throw new AppError(httpStatus.CONFLICT, "Already Exist");
  }
  const result = await prisma.skill.create({
    data: payload,
  });
  return result;
};

const updateSkill = async (payload: ICreateSkill, skillId: string) => {
  const skill = await prisma.skill.findUnique({
    where: {
      id: skillId,
      isDeleted: false,
    },
  });
  if (!skill) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Skill your are trying to update is not found",
    );
  }
  const result = await prisma.skill.update({
    where: {
      id: skillId,
    },
    data: payload,
  });

  return result;
};

const getAllSkills = async (
  params: ISkillFilterField,
  options: IPaginationOptions,
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.SkillWhereInput[] = [];

  if (params.searchTerm) {
    andConditions.push({
      OR: skillSearchableFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
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

  const whereConditions: Prisma.SkillWhereInput = { AND: andConditions };

  const total = await prisma.skill.count({
    where: whereConditions,
  });

  const skills = await prisma.skill.findMany({
    where: whereConditions,
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
    data: skills,
  };
};

const deleteSkill = async (skillId: string) => {
  const skill = await prisma.skill.findUnique({
    where: { id: skillId, isDeleted: false },
  });

  if (!skill) {
    throw new AppError(httpStatus.NOT_FOUND, "Skill you are trying to delete is not found");
  }

  const result = await prisma.skill.update({
    where: { id: skillId },
    data: {
      isDeleted: true,
    },
  });
  return result;
};

export const SkillService = {
  createSkill,
  updateSkill,
  getAllSkills,
  deleteSkill,
};
