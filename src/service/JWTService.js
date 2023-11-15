import db from "../models/index";

const getGroupWithRoles = async (user) => {
  let roles = await db.Role.findOne({
    where: { id: user.roleId },
    attributes: ["id", "name", "description"],
    include: {
      model: db.Permission,
      attributes: ["id", "url", "description", "module"],
      through: { attributes: [] },
    },
  });
  return roles ? roles : {};
};

module.exports = {
  getGroupWithRoles,
};
