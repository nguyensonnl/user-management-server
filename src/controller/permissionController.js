import userApiService from "../service/userApiService";
import permissionService from "../service/permissionService";
import db from "../models";

const permissionController = {};

permissionController.getPermissionController = async (req, res) => {
  try {
    let data = await permissionService.getPermission();

    return res.status(200).json({
      EM: data.EM, // error message
      EC: data.EC, //error code
      DT: data.DT, //data
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "error from server", // error message
      EC: "-1", //error code
      DT: "", //date
    });
  }
};

permissionController.getPermissionV2 = async (req, res) => {
  try {
    let { page, limit, search, module } = req.query;

    page = +page || 1;
    limit = +limit || 5;
    search = search || null;
    module = module || null;

    //paginate
    const offset = (page - 1) * limit;

    //get data
    const data = await db.Permission.findAndCountAll({
      attributes: ["id", "url", "description", "module"],
      //  order: [[sortBy, sortOrder]],
      offset,
      limit,
    });

    //console.log(JSON.stringify(data, null, 2));

    let totalPages = Math.ceil(data.count / limit);

    // Xử lý bộ lọc chỉ trên trang hiện tại
    // if (filterField && filterValue) {
    //   data.rows = data.rows.filter((item) =>
    //     item[filterField].toLowerCase().includes(filterValue.toLowerCase())
    //   );
    // }

    if (module) {
      data.rows = data.rows.filter((item) => item.module === module);
    }

    if (search) {
      data.rows = data.rows.filter((item) =>
        item.description.toLowerCase().split(" ").includes(search.toLowerCase())
      );
    }

    res.status(200).json({
      paginate: {
        count: data.count,
        page: page,
        limit: limit,
        totalPages: totalPages,
      },
      data: data.rows,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed",
      status: 1,
    });
  }
};

permissionController.createNewPermissionController = async (req, res) => {
  try {
    //validate
    let data = await permissionService.createNewPermission(req.body);
    return res.status(200).json({
      EM: data.EM, // error message
      EC: data.EC, //error code
      DT: data.DT, //data
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "error from server", // error message
      EC: "-1", //error code
      DT: "", //date
    });
  }
};
//todo
permissionController.updateFunc = async (req, res) => {
  try {
    //validate
    let data = await userApiService.updateUser(req.body);
    return res.status(200).json({
      EM: data.EM, // error message
      EC: data.EC, //error code
      DT: data.DT, //data
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "error from server", // error message
      EC: "-1", //error code
      DT: "", //date
    });
  }
};

permissionController.deletePermissionController = async (req, res) => {
  try {
    let data = await permissionService.deletePermission(req.body.id);
    return res.status(200).json({
      EM: data.EM, // error message
      EC: data.EC, //error code
      DT: data.DT, //data
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "error from server", // error message
      EC: "-1", //error code
      DT: "", //date
    });
  }
};

permissionController.getPermissionByRoleController = async (req, res) => {
  try {
    let id = req.params.groupId;
    let data = await permissionService.getPermissionByRole(id);
    return res.status(200).json({
      EM: data.EM, // error message
      EC: data.EC, //error code
      DT: data.DT, //data
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "error from server", // error message
      EC: "-1", //error code
      DT: "", //date
    });
  }
};

permissionController.assignPermissionToRoleController = async (req, res) => {
  try {
    let data = await permissionService.assignPermissionToRole(req.body.data);
    return res.status(200).json({
      EM: data.EM, // error message
      EC: data.EC, //error code
      DT: data.DT, //data
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "error from server", // error message
      EC: "-1", //error code
      DT: "", //date
    });
  }
};

export default permissionController;
