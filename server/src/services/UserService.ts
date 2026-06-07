import { IUser } from "../interfaces/IUser";
import UserRepository from "../repositories/UserRepository";

export default class UserService {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository
    }

    public async getAllUsers(): Promise<IUser[]> {
        return await this.userRepository.getAllMenuItems(); // hoặc findAll nếu bạn đổi tên
    }

    public async getUserById(id: string): Promise<IUser | null> {
        return await this.userRepository.findById(id);
    }

    public async deleteUser(userId: string): Promise<boolean> {
        return await this.userRepository.deleteUserById(userId);
      }
      
    public async updateUser(userId: string, data: Partial<IUser>): Promise<IUser | null> {
        return await this.userRepository.updateUserById(userId, data);
    }

    
}
