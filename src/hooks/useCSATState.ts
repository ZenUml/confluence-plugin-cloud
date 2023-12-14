import { ref } from "vue";
import ApWrapper2 from "@/model/ApWrapper2";
import AP from "@/model/AP";
import { getLocalState, setLocalState } from "@/utils/window";
import clone from "lodash/clone";
import { IUser } from "@/model/IUser";
export default function useCSATState() {
  const STORAGE_KEY = "csat_state";
  const DEFAULT_STATE = { users: {}, lastUpdated: new Date() };
  let account = ref<IUser | null>(null);

  const checkStateOfCSAT = async () => {
    account.value = await new ApWrapper2(AP)._getCurrentUser();
    const localState = getLocalState(STORAGE_KEY, DEFAULT_STATE);
    const userState = localState.users[account.value.atlassianAccountId];
    return (
      userState &&
      (!userState.expires || new Date() < new Date(userState.expires))
    );
  };

  const updateStateOfCSAT = async () => {
    account.value = await new ApWrapper2(AP)._getCurrentUser();
    const localState = getLocalState(STORAGE_KEY, DEFAULT_STATE);

    const lastUpdated = new Date();
    const expiresDate = clone(lastUpdated);
    expiresDate.setMonth(expiresDate.getMonth() + 3);

    localState.users[account.value.atlassianAccountId] = {
      lastUpdated: lastUpdated,
      expires: expiresDate,
    };

    setLocalState(STORAGE_KEY, localState);
  };

  return {
    checkStateOfCSAT,
    updateStateOfCSAT,
  };
}
