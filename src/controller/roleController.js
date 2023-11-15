import roleService from "../service/roleService";

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
