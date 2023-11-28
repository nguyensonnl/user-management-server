import roleService from "../service/roleService";
import db from "../models";

const roleController = {};

roleController.createNewRoleController = async (req, res) => {
  try {
    let data = await roleService.createNewRole(req.body);
    return res.status(201).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
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

roleController.getRoleV2 = async (req, res) => {
  try {
    let { page, limit, search } = req.query;

    page = +page || 1;
    limit = +limit || 5;
    search = search || null;

    //paginate
    const offset = (page - 1) * limit;

    //get data
    const data = await db.Role.findAndCountAll({
      attributes: ["id", "name", "description"],
      //  order: [[sortBy, sortOrder]],
      offset,
      limit,
    });

    let totalPages = Math.ceil(data.count / limit);

    if (search) {
      data.rows = data.rows.filter((item) =>
        item.name.toLowerCase().split(" ").includes(search.toLowerCase())
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

roleController.getRoleController = async (req, res) => {
  try {
    let data = await roleService.getRole();
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

export default roleController;
