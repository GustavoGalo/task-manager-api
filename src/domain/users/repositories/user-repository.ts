import { CreateUser } from "../entities/create-user-entity";
import { User } from "../entities/user-entity";

export interface UserRepository {
  create(user: CreateUser): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  profile(id: string): Promise<User | null>;
  save(user: User): Promise<User>;
}
