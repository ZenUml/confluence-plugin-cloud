import SequenceDiagramLoader from './utils/SequenceDiagramLoader'
import ConfluenceWrapper from "@/utils/ConfluenceWrapper";
import MockAp from "@/utils/MockAp.ts"
console.log('From sequence viewer dialog');
// @ts-ignore
const localAp = AP || new MockAp();
let confluenceWrapper = new ConfluenceWrapper(localAp);
let sequenceDiagramLoader = new SequenceDiagramLoader(confluenceWrapper);
async function main() {
  console.log(await sequenceDiagramLoader.load());
}

main();
