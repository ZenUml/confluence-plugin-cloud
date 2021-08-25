import SequenceDiagramLoader from './utils/SequenceDiagramLoader'
import ConfluenceWrapper from "@/utils/ConfluenceWrapper";
import MockApConfluence from "@/utils/MockApConfluence";
console.log('From sequence viewer dialog1');
// @ts-ignore
const localAp = AP || { confluence: new MockApConfluence()};
let confluenceWrapper = new ConfluenceWrapper(localAp);
let sequenceDiagramLoader = new SequenceDiagramLoader(confluenceWrapper);
async function main() {
  console.log(await sequenceDiagramLoader.load());
}

main();
