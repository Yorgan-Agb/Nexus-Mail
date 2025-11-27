import z from "zod";

export const getById = async (id: number | string) => {
  return z.coerce.number().parse(id);
};
