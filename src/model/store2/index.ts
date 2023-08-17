import vue from 'vue';
import vuex from 'vuex';
import { RootState} from "@/model/store2/types";
import extendedStore from "@/model/store2/ExtendedStore";
vue.use(vuex);

export default new vuex.Store<RootState>(extendedStore);
