import MockAp from "@/model/MockAp";
import ApWrapper2 from "@/model/ApWrapper2";

describe('ApWrapper', () => {

  it('tells whether it is a lite version or full version', () => {
    delete window.location;
    // @ts-ignore
    window.location = new URL("https://zenuml.com/?contentKey=zenuml-content-sequence");
    let mockAp = new MockAp();
    let apWrapper2 = new ApWrapper2(mockAp);
    expect(apWrapper2.isLite()).toBeFalsy();
  })

  it('tells whether it is a lite version or full version', () => {
    delete window.location;
    // @ts-ignore
    window.location = new URL("https://zenuml.com/?contentKey=zenuml-content-sequence&addonKey=com.zenuml.confluence-addon-lite");
    let mockAp = new MockAp();
    let apWrapper2 = new ApWrapper2(mockAp);
    expect(apWrapper2.isLite()).toBeTruthy();
  })

  it('tells us the page id', async () => {
    delete window.location;
    // @ts-ignore
    window.location = new URL("https://zenuml.com/?contentKey=zenuml-content-sequence");
    let mockAp = new MockAp();
    let apWrapper2 = new ApWrapper2(mockAp);
    const getLocationContext = jest.fn().mockImplementation(async () => {
      return {
        contentId: "page-001"
      }
    });
    apWrapper2.getLocationContext = getLocationContext.bind(apWrapper2);
    expect(await apWrapper2.getPageId()).toBe('page-001');
  })

  it('gets custom content by id', async () => {
    delete window.location;
    // @ts-ignore
    window.location = new URL("https://zenuml.com/?contentKey=zenuml-content-sequence");
    let mockAp = new MockAp();
    let apWrapper2 = new ApWrapper2(mockAp);
    const _requestFn = jest.fn().mockImplementation(async () => {
      return {
      body: JSON.stringify({
        body: {
          raw: {
            value: JSON.stringify({
              "code": "A.method"
            })
          }
        },
        container: {
          id: "page-002"
        }
      })
    }});
    apWrapper2._requestFn = _requestFn.bind(apWrapper2);

    const getPageId = jest.fn().mockImplementation(async () => {
      return "page-002"
    });
    apWrapper2.getPageId = getPageId.bind(apWrapper2);
    expect(await apWrapper2.getCustomContentById("custom-content-001")).toEqual({
      body: {
        raw: {
          value: JSON.stringify({
            "code": "A.method"
          })
        }
      },
      container: {
        id: "page-002"
      },
      value: {
        "code": "A.method",
        "isCopy": false,
        "source": "custom-content"
      }
    });
  })

})