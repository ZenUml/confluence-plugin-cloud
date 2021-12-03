export function buildCustomContentResponse(containerId: string, code: string) {
  return {
    body: JSON.stringify({
      body: {
        raw: {
          value: JSON.stringify({
            "code": code
          })
        }
      },
      container: {
        id: containerId
      }
    })
  };
}

export function buildEnrichedCustomContent(containerId: string = "page-002", code: string = "A.method", isCopy: boolean = false) {
  return {
    body: {
      raw: {
        value: JSON.stringify({
          "code": code
        })
      }
    },
    container: {
      id: containerId
    },
    value: {
      "code": code,
      "isCopy": isCopy,
      "source": "custom-content"
    }
  };
}