import { useQuery, useMutation, useQueryClient } from "react-query";
import { getAllUsers, deleteUser as deleteUserApi, makeUserAdmin } from "../utils/api";
import { useAuth } from "../context/AuthContext";

const useAdminUsers = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: "allAdminUsers",
    queryFn: () => getAllUsers(token),
    enabled: !!token,
  });

  const deleteMutation = useMutation({
    mutationFn: (userId) => deleteUserApi(userId, token),
    onMutate: (userId) => {
      // Optimistically remove from list
      queryClient.setQueryData("allAdminUsers", (old) =>
        old.filter((user) => user.id !== userId)
      );
    },
    onSuccess: () => {
      // Refetch to ensure data is consistent
      refetch();
    },
    onError: () => {
      // Refetch to restore data on error
      refetch();
    },
  });

  const promoteToAdminMutation = useMutation({
    mutationFn: (userId) => makeUserAdmin(userId, token),
    onMutate: (userId) => {
      // Optimistically update user to admin
      queryClient.setQueryData("allAdminUsers", (old) =>
        old.map((user) =>
          user.id === userId ? { ...user, isAdmin: true } : user
        )
      );
    },
    onSuccess: () => {
      // Refetch to ensure data is consistent
      refetch();
    },
    onError: () => {
      // Refetch to restore data on error
      refetch();
    },
  });

  const deleteUser = (userId, options = {}) => {
    deleteMutation.mutate(userId, {
      onSuccess: options.onSuccess,
      onError: options.onError,
    });
  };

  const makeAdmin = (userId, options = {}) => {
    promoteToAdminMutation.mutate(userId, {
      onSuccess: options.onSuccess,
      onError: options.onError,
    });
  };

  return {
    users,
    isLoading,
    deleteUser,
    makeAdmin,
    isDeleting: deleteMutation.isLoading,
    isPromoting: promoteToAdminMutation.isLoading,
    refetch,
  };
};

export { useAdminUsers };
