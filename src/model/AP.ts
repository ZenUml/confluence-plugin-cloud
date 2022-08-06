// This module provides an AP instance based on the context:
// 1. it returns window.AP if it is running on the confluence platform;
// 2. it returns a MockAp instance otherwise

import MockAp from "@/model/MockAp";

// @ts-ignore
const isEmbedded = window.location.search.includes('embedded=true');

// @ts-ignore
const providedAp = isEmbedded ? window.parent.AP : window.AP;

// eslint-disable-next-line
isEmbedded && console.log('embedded mode detected, using parent frame AP.');

let onConfluence = providedAp && providedAp.confluence;
!onConfluence && console.log('not on confluence platform, using MockAp');

export default onConfluence ? providedAp : new MockAp();

