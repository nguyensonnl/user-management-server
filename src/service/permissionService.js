import db from "../models/index";

const permissionService = {};

permissionService.createNewPermission = async (permission) => {
  try {
    // let currentRoles = await db.Role.findAll({
    //   attributes: ["url", "description"],
    //   raw: true,
    // });

    // const persists = roles.filter(
    //   ({ url: url1 }) => !currentRoles.some(({ url: url2 }) => url1 === url2)
    // );
    // if (persists.length === 0) {
    //   return {
    //     EM: "Nothing to create ...",
    //     EC: 0,
    //     DT: [],
    //   };
    // }

    // await db.Role.bulkCreate(persists);

    const isExistPermission = await db.Permission.findOne({
      where: { url: permission.url },
    });
    if (isExistPermission) {
      return {
        EM: "Permission is exist",
        EC: 1,
      };
    }

    await db.Permission.create({
      url: permission.url,
      description: permission.description,
      module: permission.module,
    });
    return {
      //  EM: `Create roles succeeds:  ${persists.length} roles...`,
      EM: `Create roles succeed`,
      EC: 0,
      DT: [],
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

permissionService.getPermission = async () => {
  try {
    let data = await db.Permission.findAll({
      order: [["id", "DESC"]],
    });
    return {
      EM: `Get all Roles succeeds`,
      EC: 0,
      DT: data,
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

permissionService.deletePermission = async (id) => {
  try {
    let permission = await db.Permission.findOne({
      where: { id: id },
    });
    if (permission) {
      await permission.destroy();
    }

    return {
      EM: `Delete Roles succeeds`,
      EC: 0,
      DT: [],
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

permissionService.getPermissionByRole = async (id) => {
  try {
    if (!id) {
      return {
        EM: `Not found any roles`,
        EC: 0,
        DT: [],
      };
    }

    let roles = await db.Role.findOne({
      where: { id: id },
      attributes: ["id", "name", "description"],
      include: {
        model: db.Permission,
        attributes: ["id", "url", "description", "module"],
        through: { attributes: [] }, //bảng trung gian
      },
    });

    return {
      EM: `get Roles by group succeeds`,
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

permissionService.assignPermissionToRole = async (data) => {
  try {
    await db.Permission_Role.destroy({
      where: { roleId: +data.roleId },
    });

    await db.Permission_Role.bulkCreate(data.groupRoles);
    return {
      EM: `Assign Role to Group succeeds`,
      EC: 0,
      DT: [],
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

export default permissionService;
