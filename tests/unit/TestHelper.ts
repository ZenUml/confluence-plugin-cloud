export default {
    setUpUrlParam(searchString: string) {
        // @ts-ignore
        delete window.location;
        // @ts-ignore
        window.location = new URL(`https://zenuml.com/?${searchString}`);
    }
}