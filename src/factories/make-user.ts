import { USER_LOGIC } from "../modules/user/logic";
import { USER_REPOSITORY } from "../modules/user/repository";

export async function makeUser() {
  const userRepository = new USER_REPOSITORY();
  const userLogic = new USER_LOGIC( userRepository );
  return userLogic;
}