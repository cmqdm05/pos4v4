import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Users, UserPlus, Shield, Plus, Edit2, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} from "../store/services/roleService";
import {
  useGetStaffQuery,
  useCreateStaffMutation,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
} from "../store/services/staffService";

interface RoleForm {
  name: string;
  description: string;
  permissions: {
    name: string;
    module: string;
    description: string;
  }[];
}

interface StaffForm {
  name: string;
  email: string;
  password: string;
  role: string;
}

const AVAILABLE_PERMISSIONS = [
  { name: "view_sales", module: "sales", description: "View sales data" },
  { name: "create_sale", module: "sales", description: "Create new sales" },
  {
    name: "manage_inventory",
    module: "inventory",
    description: "Manage inventory",
  },
  { name: "view_reports", module: "reports", description: "View reports" },
  { name: "manage_users", module: "users", description: "Manage users" },
  {
    name: "manage_settings",
    module: "settings",
    description: "Manage settings",
  },
];

const UserManagement = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const { data: roles } = useGetRolesQuery(storeId!);
  const { data: staff } = useGetStaffQuery(storeId!);
  const [createRole] = useCreateRoleMutation();
  const [updateRole] = useUpdateRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();
  const [createStaff] = useCreateStaffMutation();
  const [updateStaff] = useUpdateStaffMutation();
  const [deleteStaff] = useDeleteStaffMutation();

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const {
    register: registerRole,
    handleSubmit: handleSubmitRole,
    reset: resetRole,
  } = useForm<RoleForm>();
  const {
    register: registerStaff,
    handleSubmit: handleSubmitStaff,
    reset: resetStaff,
  } = useForm<StaffForm>();

  const onRoleSubmit = async (data: RoleForm) => {
    try {
      const roleData = {
        ...data,
        store: storeId!,
        permissions: AVAILABLE_PERMISSIONS.filter((p) =>
          selectedPermissions.includes(p.name)
        ),
      };

      if (editingRole) {
        await updateRole({ _id: editingRole._id, ...roleData }).unwrap();
        toast.success("Role updated successfully");
      } else {
        await createRole(roleData).unwrap();
        toast.success("Role created successfully");
      }
      setShowRoleModal(false);
      resetRole();
      setEditingRole(null);
      setSelectedPermissions([]);
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const onStaffSubmit = async (data: StaffForm) => {
    try {
      const staffData = {
        ...data,
        store: storeId!,
      };

      if (editingStaff) {
        await updateStaff({ _id: editingStaff._id, ...staffData }).unwrap();
        toast.success("Staff member updated successfully");
      } else {
        await createStaff(staffData).unwrap();
        toast.success("Staff member created successfully");
      }
      setShowStaffModal(false);
      resetStaff();
      setEditingStaff(null);
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const handleDeleteRole = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        await deleteRole(id).unwrap();
        toast.success("Role deleted successfully");
      } catch (error) {
        toast.error("Failed to delete role");
      }
    }
  };

  const handleDeleteStaff = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      try {
        await deleteStaff(id).unwrap();
        toast.success("Staff member deleted successfully");
      } catch (error) {
        toast.error("Failed to delete staff member");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          <Users className="h-6 w-6" />
          User Management
        </h1>
      </div>

      {/* Roles Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Roles & Permissions
          </h2>
          <button
            onClick={() => {
              setEditingRole(null);
              setSelectedPermissions([]);
              resetRole();
              setShowRoleModal(true);
            }}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Role
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {roles?.map((role) => (
            <div key={role._id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{role.name}</h3>
                  <p className="text-sm text-gray-500">{role.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {role.permissions.map((permission) => (
                      <span
                        key={permission.name}
                        className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800"
                      >
                        {permission.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingRole(role);
                      setSelectedPermissions(
                        role.permissions.map((p) => p.name)
                      );
                      resetRole({
                        name: role.name,
                        description: role.description,
                      });
                      setShowRoleModal(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteRole(role._id)}
                    className="text-red-600 hover:text-red-900"
                    disabled={role.isDefault}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Staff Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Staff Members
          </h2>
          <button
            onClick={() => {
              setEditingStaff(null);
              resetStaff();
              setShowStaffModal(true);
            }}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Staff
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {staff?.map((member) => (
            <div key={member._id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{member.name}</h3>
                  <p className="text-sm text-gray-500">{member.email}</p>
                  <div className="mt-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        member.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {member.status}
                    </span>
                    <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
                      {member.role.name}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingStaff(member);
                      resetStaff({
                        name: member.name,
                        email: member.email,
                        role: member.role._id,
                      });
                      setShowStaffModal(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteStaff(member._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">
              {editingRole ? "Edit Role" : "Add Role"}
            </h2>
            <form
              onSubmit={handleSubmitRole(onRoleSubmit)}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role Name
                </label>
                <input
                  type="text"
                  {...registerRole("name", { required: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  {...registerRole("description")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permissions
                </label>
                <div className="space-y-2">
                  {AVAILABLE_PERMISSIONS.map((permission) => (
                    <label key={permission.name} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(permission.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPermissions([
                              ...selectedPermissions,
                              permission.name,
                            ]);
                          } else {
                            setSelectedPermissions(
                              selectedPermissions.filter(
                                (p) => p !== permission.name
                              )
                            );
                          }
                        }}
                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-900">
                        {permission.description}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowRoleModal(false);
                    setEditingRole(null);
                    setSelectedPermissions([]);
                    resetRole();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  {editingRole ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Staff Modal */}
      {showStaffModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">
              {editingStaff ? "Edit Staff Member" : "Add Staff Member"}
            </h2>
            <form
              onSubmit={handleSubmitStaff(onStaffSubmit)}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  {...registerStaff("name", { required: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  {...registerStaff("email", { required: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              {!editingStaff && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    {...registerStaff("password", { required: !editingStaff })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  {...registerStaff("role", { required: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select role</option>
                  {roles?.map((role) => (
                    <option key={role._id} value={role._id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowStaffModal(false);
                    setEditingStaff(null);
                    resetStaff();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  {editingStaff ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
