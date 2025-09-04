import React, { useState, useEffect } from 'react';
import { Plus, Shield,  Loader2, RefreshCw, AlertCircle, CheckCircle2, Edit3, Trash2 } from 'lucide-react';
import { addRoles, getRoles, editRoles, dltRoles } from "@/services/roleService";

interface Role {
  id: string;
  name: string;
}

// Updated ApiRole interface to match actual API response
interface ApiRole {
  role_id: number;
  role_name: string;
}

const RoleForm: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [currentRole, setCurrentRole] = useState<string>('');
 
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingRoles, setIsLoadingRoles] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    setIsLoadingRoles(true);
    try {
      const response = await getRoles();
      if (response.success && response.data) {
        const convertedRoles: Role[] = response.data.map((apiRole: ApiRole) => ({
          id: apiRole.role_id.toString(),
          name: apiRole.role_name.trim(),
        }));
        
        const sortedRoles = convertedRoles.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        setRoles(sortedRoles);
      }
    } catch (err: any) {
      console.log('Failed to load roles');
    } finally {
      setIsLoadingRoles(false);
    }
  };

  const handleAddRole = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    
    if (!currentRole.trim()) {
      return;
    }

    // Check if role already exists (case insensitive)
    const roleExists = roles.some(role => 
      role.name.toLowerCase() === currentRole.trim().toLowerCase()
    );

    if (roleExists) {
      setError('This role already exists.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const roleData = { 
        role_name: currentRole.trim(),
      };
      
      console.log('Sending role data:', roleData);
      const response = await addRoles(roleData);
      console.log('API Response:', response);
      
      if (response.success && response.data) {
        const apiRole = response.data;
        let newRole: Role | null = null;
        
        // Handle different possible response structures
        if (apiRole.role_id && apiRole.role_name) {
          newRole = {
            id: apiRole.role_id.toString(),
            name: apiRole.role_name.trim(),
          };
        } else if (apiRole.id && apiRole.name) {
          newRole = {
            id: apiRole.id.toString(),
            name: apiRole.name.trim(),
          };
        }
        
        if (newRole) {
          setRoles(prev => [newRole!, ...prev]);
          setCurrentRole('');
          setSuccessMessage(`Role "${newRole.name}" added successfully!`);
          setTimeout(() => setSuccessMessage(''), 3000);
        } else {
          // If we can't parse the response, refresh the list
          setCurrentRole('');
          setSuccessMessage('Role added successfully!');
          setTimeout(() => {
            setSuccessMessage('');
            loadRoles();
          }, 2000);
        }
      } else {
        // Handle API error response
        const errorMessage = response.message || 'Failed to add role. Please try again.';
        setError(errorMessage);
        console.error('API Error:', response);
      }
      
    } catch (err: any) {
      console.error('Error adding role:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditRole = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    
    if (!editingRole || !currentRole.trim()) {
      return;
    }


    const roleExists = roles.some(role => 
     
      role.name.toLowerCase() === currentRole.trim().toLowerCase()
    );

    if (roleExists) {
      setError('This role name already exists.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const roleData = { 
        id: parseInt(editingRole.id),
        role_name: currentRole.trim(),
      };
      const response = await editRoles(roleData);
      
      if (response.success) {
        // Update local state
        setRoles(prev => prev.map(role => 
          role.id === editingRole.id 
            ? { ...role, name: roleData.role_name }
            : role
        ));
        setSuccessMessage(`Role "${roleData.role_name}" updated successfully!`);
        handleCancelEdit();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        // Handle API error response
        const errorMessage = response.message || 'Failed to update role. Please try again.';
        setError(errorMessage);
        console.error('API Error:', response);
      }
      
    } catch (err: any) {
      console.error('Error editing role:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const roleData = { id: parseInt(roleId) };
      const response = await dltRoles(roleData);
      
      if (response.success) {
        // Remove from local state
        const deletedRole = roles.find(role => role.id === roleId);
        setRoles(prev => prev.filter(role => role.id !== roleId));
        setSuccessMessage(`Role "${deletedRole?.name}" deleted successfully!`);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setTimeout(() => {
          loadRoles();
        }, 2000);
      }
      
    } catch (err: any) {
      console.log('Error deleting role:', err);
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(null);
    }
  };

  const handleStartEdit = (role: Role) => {
    setEditingRole(role);
    setCurrentRole(role.name);
    setError('');
    setSuccessMessage('');
  };

  const handleCancelEdit = () => {
    setEditingRole(null);
    setCurrentRole('');
    setError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'roleName') {
      setCurrentRole(value);
    } 
    if (error) setError('');
    if (successMessage) setSuccessMessage('');
  };

  const handleRefresh = () => {
    loadRoles();
    handleCancelEdit();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - All Roles */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              All Roles ({roles.length})
            </h3>
            <button
              onClick={handleRefresh}
              disabled={isLoadingRoles}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
              title="Refresh roles"
            >
              <RefreshCw className={`h-3 w-3 ${isLoadingRoles ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {isLoadingRoles ? (
              <div className="text-center py-8 text-gray-500">
                <Loader2 className="h-6 w-6 mx-auto mb-2 animate-spin" />
                <p>Loading roles...</p>
              </div>
            ) : roles.length > 0 ? (
              roles.map((role) => (
                <div key={role.id} className="bg-blue-50 px-4 py-3 rounded-md border border-blue-200 hover:bg-blue-100 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <Shield className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-700 font-medium truncate">{role.name}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                      <button
                        onClick={() => handleStartEdit(role)}
                        disabled={isLoading || editingRole !== null}
                        className="text-blue-500 hover:text-blue-700 transition-colors duration-200 p-1 rounded-full hover:bg-blue-50 disabled:opacity-50"
                        title="Edit role"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(role.id)}
                        disabled={isLoading}
                        className="text-red-500 hover:text-red-700 transition-colors duration-200 p-1 rounded-full hover:bg-red-50 disabled:opacity-50"
                        title="Delete role"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Shield className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No roles found</p>
                <p className="text-sm mt-1">Add your first role to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Add/Edit Role Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            {editingRole ? (
              <>
                <Edit3 className="h-5 w-5 text-blue-500" />
                Edit Role
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 text-blue-500" />
                Add New Role
              </>
            )}
          </h3>
          
          <div className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md text-green-700">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">{successMessage}</span>
              </div>
            )}

            <div>
              <label htmlFor="roleName" className="block text-sm font-medium text-gray-700 mb-1">
                Role Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="roleName"
                name="roleName"
                value={currentRole}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  error ? 'border-red-300 bg-red-50' : 'border-gray-300'
                } ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                placeholder="Enter role name (e.g., Admin, Manager, User)"
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && (editingRole ? handleEditRole(e) : handleAddRole(e))}
              />
            </div>

            <div className="flex gap-2">
              {editingRole ? (
                <>
                  <button
                    onClick={handleEditRole}
                    disabled={isLoading || !currentRole.trim()}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      isLoading || !currentRole.trim()
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Edit3 className="h-4 w-4" />
                        Update Role
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={isLoading}
                    className="px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-md font-medium transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={handleAddRole}
                  disabled={isLoading || !currentRole.trim()}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isLoading || !currentRole.trim()
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Adding Role...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Add Role
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the role 
              <span className="font-medium">
                {roles.find(r => r.id === showDeleteConfirm)?.name}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                disabled={isLoading}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteRole(showDeleteConfirm)}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleForm;