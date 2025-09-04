import React, { useState, useEffect } from 'react';
import { Plus, User, Loader2, RefreshCw, AlertCircle, CheckCircle2, Edit3, UserX, UserCheck } from 'lucide-react';
import { addUser, getUser, editUser } from "@/services/userService";
import { getRoles } from "@/services/roleService";

interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role_id: string;
  location?: string;
  is_active: boolean;
}

interface Role {
  role_id: number;
  role_name: string;
}

interface ApiUser {
  id: number;
  name: string;
  phone: string;
  email: string;
  role_id: number;
  location?: string;
  is_active: boolean;
}

const UserForm: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [currentUser, setCurrentUser] = useState({
    name: '',
    phone: '',
    password: '',
    email: '',
    role_id: '',
    location: ''
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  const loadUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await getUser();
      if (response.success && response.data) {
        const convertedUsers: User[] = response.data.map((apiUser: ApiUser) => ({
          id: apiUser.id.toString(),
          name: apiUser.name.trim(),
          phone: apiUser.phone,
          email: apiUser.email,
          role_id: apiUser.role_id.toString(),
          location: apiUser.location || '',
        //   // is_active: apiUser.is_active
        //    phone: '', // Default empty since not provided by API
        // email: '', // Default empty since not provided by API
        // role_id: '', // Default empty since not provided by API
        // location: '', // Default empty since not provided by API
        // is_active: true // Default to true since not provided by API
        }));

        const sortedUsers = convertedUsers.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        setUsers(sortedUsers);
      }
    } catch (err: any) {
      console.log('Failed to load users');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const loadRoles = async () => {
    try {
      const response = await getRoles();
      if (response.success && response.data) {
        setRoles(response.data);
      }
    } catch (err: any) {
      console.log('Failed to load roles');
    }
  };

  const validateForm = () => {
    if (!currentUser.name.trim()) {
      setError('Name is required.');
      return false;
    }
    if (!currentUser.phone.trim()) {
      setError('Phone is required.');
      return false;
    }
    if (!currentUser.email.trim()) {
      setError('Email is required.');
      return false;
    }
    if (!editingUser && !currentUser.password.trim()) {
      setError('Password is required.');
      return false;
    }
    if (!currentUser.role_id) {
      setError('Role is required.');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(currentUser.email)) {
      setError('Please enter a valid email address.');
      return false;
    }

    // Phone validation (basic)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(currentUser.phone.replace(/\D/g, ''))) {
      setError('Please enter a valid 10-digit phone number.');
      return false;
    }

    return true;
  };

  const handleAddUser = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

   
    const emailExists = users.some(user =>
      user.email.toLowerCase() === currentUser.email.trim().toLowerCase()
    );

    if (emailExists) {
      setError('This email already exists.');
      return;
    }

    // Check if phone already exists
    const phoneExists = users.some(user =>
      user.phone === currentUser.phone.trim()
    );

    if (phoneExists) {
      setError('This phone number already exists.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const userData = {
        name: currentUser.name.trim(),
        phone: currentUser.phone.trim(),
        password: currentUser.password,
        email: currentUser.email.trim(),
        role_id: currentUser.role_id,
        location: currentUser.location.trim() || undefined
      };

      console.log('Sending user data:', userData);
      const response = await addUser(userData);
      console.log('API Response:', response);

      if (response.success && response.data) {
        const apiUser = response.data;
        let newUser: User | null = null;

        // Handle different possible response structures
        if (apiUser.id && apiUser.name) {
          newUser = {
            id: apiUser.id.toString(),
            name: apiUser.name.trim(),
            phone: apiUser.phone,
            email: apiUser.email,
            role_id: apiUser.role_id.toString(),
            location: apiUser.location || '',
            is_active: apiUser.is_active !== undefined ? apiUser.is_active : true
          };
        }

        if (newUser) {
          setUsers(prev => [newUser!, ...prev]);
          setCurrentUser({
            name: '',
            phone: '',
            password: '',
            email: '',
            role_id: '',
            location: ''
          });
          setSuccessMessage(`User "${newUser.name}" added successfully!`);
          setTimeout(() => setSuccessMessage(''), 3000);
        } else {
          // If we can't parse the response, refresh the list
          setCurrentUser({
            name: '',
            phone: '',
            password: '',
            email: '',
            role_id: '',
            location: ''
          });
          setSuccessMessage('User added successfully!');
          setTimeout(() => {
            setSuccessMessage('');
            loadUsers();
          }, 2000);
        }
      } else {
        const errorMessage = response.message || 'Failed to add user. Please try again.';
        setError(errorMessage);
        console.error('API Error:', response);
      }

    } catch (err: any) {
      console.error('Error adding user:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();

    if (!editingUser || !validateForm()) {
      return;
    }

    // Check if email already exists (excluding current user)
    const emailExists = users.some(user =>
      user.id !== editingUser.id && user.email.toLowerCase() === currentUser.email.trim().toLowerCase()
    );

    if (emailExists) {
      setError('This email already exists.');
      return;
    }

    // Check if phone already exists (excluding current user)
    const phoneExists = users.some(user =>
      user.id !== editingUser.id && user.phone === currentUser.phone.trim()
    );

    if (phoneExists) {
      setError('This phone number already exists.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const userData = {
        id: parseInt(editingUser.id),
        name: currentUser.name.trim(),
        phone: currentUser.phone.trim(),
        email: currentUser.email.trim(),
        role_id: currentUser.role_id,
        location: currentUser.location.trim() || undefined,
        ...(currentUser.password && { password: currentUser.password })
      };

      const response = await editUser(userData);

      if (response.success) {
        // Update local state
        setUsers(prev => prev.map(user =>
          user.id === editingUser.id
            ? {
              ...user,
              name: userData.name,
              phone: userData.phone,
              email: userData.email,
              role_id: userData.role_id,
              location: userData.location || ''
            }
            : user
        ));
        setSuccessMessage(`User "${userData.name}" updated successfully!`);
        handleCancelEdit();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        const errorMessage = response.message || 'Failed to update user. Please try again.';
        setError(errorMessage);
        console.error('API Error:', response);
      }

    } catch (err: any) {
      console.error('Error editing user:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivateUser = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const userData = {
        id: parseInt(userId),
        is_active: !user.is_active
      };

      const response = await editUser(userData);

      if (response.success) {
        // Update local state
        setUsers(prev => prev.map(u =>
          u.id === userId
            ? { ...u, is_active: !u.is_active }
            : u
        ));
        const action = user.is_active ? 'deactivated' : 'activated';
        setSuccessMessage(`User "${user.name}" ${action} successfully!`);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setTimeout(() => {
          loadUsers();
        }, 2000);
      }

    } catch (err: any) {
      console.log('Error updating user status:', err);
    } finally {
      setIsLoading(false);
      setShowDeactivateConfirm(null);
    }
  };

  const handleStartEdit = (user: User) => {
    setEditingUser(user);
    setCurrentUser({
      name: user.name,
      phone: user.phone,
      password: '',
      email: user.email,
      role_id: user.role_id,
      location: user.location || ''
    });
    setError('');
    setSuccessMessage('');
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setCurrentUser({
      name: '',
      phone: '',
      password: '',
      email: '',
      role_id: '',
      location: ''
    });
    setError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentUser(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
    if (successMessage) setSuccessMessage('');
  };

  const handleRefresh = () => {
    loadUsers();
    handleCancelEdit();
  };

  const getRoleName = (roleId: string) => {
    const role = roles.find(r => r.role_id.toString() === roleId);
    return role?.role_name || 'Unknown';
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - All Users (2/3 width) */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-500" />
              All Users ({users.length})
            </h3>
            <button
              onClick={handleRefresh}
              disabled={isLoadingUsers}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
              title="Refresh users"
            >
              <RefreshCw className={`h-3 w-3 ${isLoadingUsers ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {isLoadingUsers ? (
              <div className="text-center py-8 text-gray-500">
                <Loader2 className="h-6 w-6 mx-auto mb-2 animate-spin" />
                <p>Loading users...</p>
              </div>
            ) : users.length > 0 ? (
              users.map((user) => (
                <div key={user.id} className={`px-4 py-3 rounded-md border transition-colors ${user.is_active
                    ? 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100 opacity-75'
                  }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={`flex-shrink-0 mt-0.5 ${user.is_active ? 'text-blue-500' : 'text-gray-400'}`}>
                        <User className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-gray-800 font-medium truncate">{user.name}</span>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${user.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                            }`}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-0.5">
                          <div>{user.email}</div>
                          <div>{user.phone}</div>
                          <div className="flex items-center gap-4">
                            <span>Role: {getRoleName(user.role_id)}</span>
                            {user.location && <span>Location: {user.location}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                      <button
                        onClick={() => handleStartEdit(user)}
                        disabled={isLoading || editingUser !== null}
                        className="text-blue-500 hover:text-blue-700 transition-colors duration-200 p-1 rounded-full hover:bg-blue-50 disabled:opacity-50"
                        title="Edit user"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setShowDeactivateConfirm(user.id)}
                        disabled={isLoading}
                        className={`transition-colors duration-200 p-1 rounded-full disabled:opacity-50 ${user.is_active
                            ? 'text-red-500 hover:text-red-700 hover:bg-red-50'
                            : 'text-green-500 hover:text-green-700 hover:bg-green-50'
                          }`}
                        title={user.is_active ? "Deactivate user" : "Activate user"}
                      >
                        {user.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <User className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No users found</p>
                <p className="text-sm mt-1">Add your first user to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Add/Edit User Form (1/3 width) */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            {editingUser ? (
              <>
                <Edit3 className="h-5 w-5 text-blue-500" />
                Edit User
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 text-blue-500" />
                Add New User
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
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={currentUser.name}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${error && !currentUser.name.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  } ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={currentUser.phone}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${error && !currentUser.phone.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  } ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={currentUser.email}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${error && !currentUser.email.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  } ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                placeholder="Enter email address"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password {!editingUser && <span className="text-red-500">*</span>}
                {editingUser && <span className="text-xs text-gray-500">(leave blank to keep current)</span>}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={currentUser.password}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${error && !editingUser && !currentUser.password.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  } ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                placeholder={editingUser ? "Enter new password (optional)" : "Enter password"}
              />
            </div>

            <div>
              <label htmlFor="role_id" className="block text-sm font-medium text-gray-700 mb-1">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                id="role_id"
                name="role_id"
                value={currentUser.role_id}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${error && !currentUser.role_id ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  } ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              >
                <option value="">Select a role</option>
                {roles.map((role) => (
                  <option key={role.role_id} value={role.role_id.toString()}>
                    {role.role_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={currentUser.location}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors border-gray-300 ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                placeholder="Enter location (optional)"
              />
            </div>

            <div className="flex gap-2">
              {editingUser ? (
                <>
                  <button
                    onClick={handleEditUser}
                    disabled={isLoading}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isLoading
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
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
                        Update
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
                  onClick={handleAddUser}
                  disabled={isLoading}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isLoading
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                    }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Adding User...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Add User
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Deactivate/Activate Confirmation Modal */}
      {showDeactivateConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            {(() => {
              const user = users.find(u => u.id === showDeactivateConfirm);
              if (!user) return null;

              return (
                <>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Confirm {user.is_active ? 'Deactivation' : 'Activation'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to {user.is_active ? 'deactivate' : 'activate'} the user
                    <span className="font-medium"> {user.name}</span>?
                    {user.is_active && ' This will prevent them from accessing the system.'}
                  </p>
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setShowDeactivateConfirm(null)}
                      disabled={isLoading}
                      className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDeactivateUser(showDeactivateConfirm)}
                      disabled={isLoading}
                      className={`px-4 py-2 text-white rounded-md transition-colors disabled:opacity-50 flex items-center gap-2 ${user.is_active
                          ? 'bg-red-600 hover:bg-red-700'
                          : 'bg-green-600 hover:bg-green-700'
                        }`}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {user.is_active ? 'Deactivating...' : 'Activating...'}
                        </>
                      ) : (
                        <>
                          {user.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                          {user.is_active ? 'Deactivate' : 'Activate'}
                        </>
                      )}
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserForm;