// This module provide an AP instance based on the context:
// 1. it returns window.AP if it is running on the confluence platform;
// 2. it returns a MockAp instance otherwise

import MockAp from "@/model/MockAp";

// @ts-ignore
const providedAp = window.AP;
let onConfluence = providedAp && providedAp.confluence;
export default onConfluence ? providedAp : new MockAp();

