import { UserDTO } from "api/types";
import { apiUserTransformers } from "helpers/apiUserTransformers";
import { Store } from "core";
import { getChats } from "./chats";
import { getUserInfo } from "./auth";
import { getAvatar } from "./userData";

export async function initApp(store: Store<AppState>) {
  try {
    store.setState({ isLoading: true });

    const response = (await getUserInfo()) as UserDTO;

    if (response) {
      const avatar = await getAvatar(response);
      const modifiedUser = { ...response, avatar };
      const chats = await getChats(store);

      if (modifiedUser && chats) {
        store.setState({ user: apiUserTransformers(modifiedUser), chats });
      }

      return response;
    }
    return null;
  } catch (error) {
    store.setState({ loginFormError: (error as Error).message });
    return null;
  } finally {
    store.setState({ isLoading: false, isAppInited: true });
  }
}
