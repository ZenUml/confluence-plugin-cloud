async function checkWhiteList(kv: any, key: string, subDomain: string) {
  try {
    const names = await kv.get(key);
    //whiteListNames:	subDomain1,subDomain2 #if contains * ,will effect all domain.
    const whiteListNames: string[] =  names? names.split(",").map(name => name.trim().toLowerCase()).filter(name => name !== ""): [];
    if(whiteListNames.includes("*"))return true;
    return whiteListNames.includes(subDomain.toLowerCase());
  } catch (error) {
    console.error("Failed to check white list: ", error);
  }
  return false;
}

export {
  checkWhiteList
};