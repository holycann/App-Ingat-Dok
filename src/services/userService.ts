import { User } from "@/types/User";
import { BaseApiService } from "./apiService";
import { ApiResponse } from "@/types/ApiResponse";

/**
 * Service for managing user-related operations
 */
export class UserService extends BaseApiService {
  /**
   * Fetch the current user's profile information
   */
  static async getUser(): Promise<ApiResponse<User>> {
    return this.get<User>({
      endpoint: "/users/me",
    });
  }

  /**
   * Update user profile information
   */
  static async updateUser(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.put<Partial<User>, User>(
      {
        endpoint: "/users/me",
      },
      userData
    );
  }

  /**
   * Delete the current user's account
   */
  static async deleteUser(): Promise<ApiResponse<void>> {
    return this.delete({
      endpoint: "/users/me",
    });
  }
}

export const userService = UserService;
