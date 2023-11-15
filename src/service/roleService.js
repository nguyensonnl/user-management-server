import db from "../models/index";

const roleService = {};

roleService.getRole = async () => {
  try {
    const roles = await db.Role.findAll({
      order: [["name", "ASC"]],
    });
    return {
      EM: "Get groups success",
      EC: 0,
      DT: roles,
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "error from service",
      EC: 1,
      DT: [],
    };
  }
};

roleService.createNewRole = async (data) => {
  try {
    const isExistRole = await db.Role.findOne({ where: { name: data.name } });
    if (isExistRole) {
      return {
        EM: "Role is exist",
        EC: 1,
      };
    }

    const roles = await db.Role.create({
      name: data.name,
      description: data.description,
    });

    return {
      EM: `Create roles succeed`,
      EC: 0,
      DT: roles,
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "something wrongs with servies",
      EC: 1,
      DT: [],
    };
  }
};

export default roleService;
