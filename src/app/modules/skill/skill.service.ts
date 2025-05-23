import prisma from "../../../shared/prisma";
import { ICreateSkill } from "./skill.interface";

const createSkill = async (payload: ICreateSkill) => {
  const result = await prisma.skill.create({
    data: payload,
  });
};

export const SkillService = {
  createSkill,
};
