import AP from "@/model/AP";
import { getLocalState, setLocalState } from "@/utils/window";
let themePromptSelectFlag: any = null;
export default function themePrompt() {
    const STORAGE_KEY = `${location.hostname}-zenuml-theme-prompt`;
    const DEFAULT_STATE = "";
    const showPopup = async () => {
        if (themePromptSelectFlag) {
            themePromptSelectFlag.close();
        }
        const localState = getLocalState(STORAGE_KEY, DEFAULT_STATE);
        if (localState != DEFAULT_STATE) return;
        setLocalState(STORAGE_KEY, 1);
        themePromptSelectFlag = AP.flag.create({
            title: 'Update available',
            body: 'We added 4 new stylish themes for your diagrams!',
            type: 'success',
            actions: {
                'themePromptSelect.check': 'Check it out'
            }
        });
    };

    return {
        showPopup
    };
}

AP.events.on('flag.action', async function (e: any) {
    if (e.actionIdentifier === 'themePromptSelect.check') {
        if (themePromptSelectFlag) {
            themePromptSelectFlag.close();
        }
        window.open("https://docs.zenuml.com/new-features.html#theme", "_blank");
    }
});
