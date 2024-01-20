async function checkWhiteList(kv: any, key: string, subDomain: string) {
  const names = await kv.get(key);
  //whiteListNames:	subDomain1,subDomain2 #if contains * ,will effect all domain.
  const whiteListNames: string[] =  names? names.split(",").map(name => name.trim().toLowerCase()).filter(name => name !== ""): [];
  if(whiteListNames.includes("*"))return true;
  return whiteListNames.includes(subDomain.toLowerCase());
}

export {
  checkWhiteList
};