import express from "express";
import authController from "../controller/authController";
import userController from "../controller/userController";
import permissionController from "../controller/permissionController";
import roleController from "../controller/roleController";
import { checkUserJWT, checkUserPermission } from "../middleware/JWTAction";

const router = express.Router();

const initApiRoutes = (app) => {
  //path, handler
  //rest api
  //GET - R, POST- C, PUT - U, DELETE - D

  router.all("*", checkUserJWT, checkUserPermission);
  router.post("/register", authController.registerController);
  router.post("/login", authController.loginController);
  router.post("/logout", authController.logoutController);

  router.get("/account", userController.getUserAccount);

  //user routes
  router.get("/user", userController.readFunc);
  router.post("/user/create", userController.createFunc);
  router.put("/user/update", userController.updateFunc);
  router.delete("/user/delete", userController.deleteFunc);

  router.get("/user/get", userController.getUserQueries);
  router.get("/user/v2", userController.getUserQueriesV2);

  router.get("/user/:id", userController.getOneUser);

  // permission routes

  router.get("/permission/v2", permissionController.getPermissionV2);

  router.get("/permission", permissionController.getPermissionController);
  router.post(
    "/permission/create",
    permissionController.createNewPermissionController
  );
  router.put("/permission/update", permissionController.updateFunc);
  router.delete(
    "/permission/delete",
    permissionController.deletePermissionController
  );
  router.get(
    "/permission/by-group/:groupId",
    permissionController.getPermissionByRoleController
  );
  router.post(
    "/permission/assign-to-group",
    permissionController.assignPermissionToRoleController
  );

  //roles routes
  router.get("/role", roleController.getRoleController);
  router.post("/role/create", roleController.createNewRoleController);

  router.get("/role/v2", roleController.getRoleV2);

  return app.use("/api/v1/", router);
};

export default initApiRoutes;
