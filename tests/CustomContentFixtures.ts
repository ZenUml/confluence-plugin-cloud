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

export function buildEnrichedCustomContent(id: string = "todo", containerId: string = "page-002", code: string = "A.method", isCopy: boolean = false) {
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
      "id": id,
      "code": code,
      "isCopy": isCopy,
      "source": "custom-content"
    }
  };
}